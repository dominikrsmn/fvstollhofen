interface SatzungItem {
  punkt: string;
  inhalt: string;
}

interface Content {
  vereinssatzung: SatzungItem[];
  // Add other content types as needed
}

let content: Content;

export function getContent(): Content {
  if (!content) {
    content = require('./content.json');
  }
  return content;
} 