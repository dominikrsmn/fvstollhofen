import path from "path";
import { promises as fsPromises } from "fs";
import * as opentype from "opentype.js";

// Cache for font data to avoid repeated downloads
const fontCache = new Map<
  string,
  { cmap: Map<string, number>; timestamp: number }
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

async function ensureFontDir() {
  const fontDir = path.join(process.cwd(), "fonts");
  try {
    await fsPromises.access(fontDir);
  } catch {
    await fsPromises.mkdir(fontDir, { recursive: true });
  }
  return fontDir;
}

async function downloadFont(obfuscationId: string): Promise<string> {
  const fontDir = await ensureFontDir();
  const fontPath = path.join(fontDir, `${obfuscationId}.ttf`);

  try {
    // Check if font file exists and is recent
    const stats = await fsPromises.stat(fontPath);
    const age = Date.now() - stats.mtimeMs;
    if (age < CACHE_DURATION) {
      return fontPath;
    }
  } catch {
    // File doesn't exist or other error, continue to download
  }

  const url = `https://www.fussball.de/export.fontface/-/format/ttf/id/${obfuscationId}/type/font`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download font: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  await fsPromises.writeFile(fontPath, Buffer.from(buffer));
  return fontPath;
}

async function parseFontFile(fontPath: string): Promise<Map<string, number>> {
  const font = await opentype.load(fontPath);
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
    // Check cache first
    const cached = fontCache.get(obfuscationId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return parseScoreWithMap(scoreText, cached.cmap);
    }

    const fontPath = await downloadFont(obfuscationId);
    const cmap = await parseFontFile(fontPath);

    // Update cache
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
