import * as opentype from "opentype.js";

// Cache for font data and binary content
const fontCache = new Map<
  string,
  {
    cmap: Map<string, number>;
    timestamp: number;
  }
>();

const fontBinaryCache = new Map<
  string,
  {
    buffer: ArrayBuffer;
    timestamp: number;
  }
>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Number mappings from the Python script
const numberMappings = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  hyphen: -1,
};

async function downloadFont(obfuscationId: string): Promise<ArrayBuffer> {
  // Check binary cache first
  const cached = fontBinaryCache.get(obfuscationId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.buffer;
  }

  const url = `https://www.fussball.de/export.fontface/-/format/ttf/id/${obfuscationId}/type/font`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download font: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  // Update binary cache
  fontBinaryCache.set(obfuscationId, {
    buffer,
    timestamp: Date.now(),
  });

  return buffer;
}

async function parseFontBuffer(
  buffer: ArrayBuffer
): Promise<Map<string, number>> {
  const font = await opentype.parse(buffer);
  const cmap = new Map<string, number>();

  // Get the cmap table
  const cmapTable = font.tables.cmap;
  const glyphIndexMap = cmapTable.glyphIndexMap as { [key: string]: number };

  // Iterate through all Unicode code points in the font
  for (const [unicode, glyphId] of Object.entries(glyphIndexMap)) {
    const glyph = font.glyphs.get(glyphId);
    if (!glyph || !glyph.name) continue;

    // Check if this glyph represents a number
    if (glyph.name in numberMappings) {
      const char = String.fromCharCode(parseInt(unicode));
      cmap.set(char, numberMappings[glyph.name as keyof typeof numberMappings]);
    }
  }

  return cmap;
}

export async function deobfuscateScore(
  obfuscationId: string,
  scoreText: string
): Promise<number | null> {
  try {
    // Check mapping cache first
    const cached = fontCache.get(obfuscationId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return parseScoreWithMap(scoreText, cached.cmap);
    }

    // Download and parse font
    const buffer = await downloadFont(obfuscationId);
    const cmap = await parseFontBuffer(buffer);

    // Update mapping cache
    fontCache.set(obfuscationId, {
      cmap,
      timestamp: Date.now(),
    });

    return parseScoreWithMap(scoreText, cmap);
  } catch (error) {
    console.error("Error deobfuscating score:", error);
    return null;
  }
}

function parseScoreWithMap(
  scoreText: string,
  cmap: Map<string, number>
): number | null {
  try {
    let result = 0;
    for (const char of scoreText) {
      const digit = cmap.get(char);
      if (digit === undefined || digit === -1) {
        return null;
      }
      result = result * 10 + digit;
    }
    return result;
  } catch {
    return null;
  }
}
