export function formatLocalDate(utcString) {
  if (!utcString) return '—';
  const date = new Date(utcString);
  return date.toLocaleString('ru-RU');
}