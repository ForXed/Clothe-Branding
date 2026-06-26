export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return ` ${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

export function groupByDay(
  items: { timestamp: Date }[],
): Map<string, typeof items> {
  const groups = new Map<string, typeof items>();
  const now = new Date();

  for (const item of items) {
    const d = item.timestamp;
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear();

    const label = isToday ? "Today" : isYesterday ? "Yesterday" : "Earlier";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(item);
  }

  return groups;
}
