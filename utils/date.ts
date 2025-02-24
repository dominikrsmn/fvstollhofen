export function formatDate(dateStr: string): string {
  try {
    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return dateStr;

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return dateStr;

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Heute";
    if (diffDays === 1) return date > now ? "Morgen" : "Gestern";
    if (diffDays < 7) {
      return new Intl.DateTimeFormat("de-DE", { weekday: "long" }).format(date);
    }
    return formatDate(dateStr);
  } catch {
    return dateStr;
  }
}
