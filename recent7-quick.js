// recent7-quick.js：對照用。只用一句話請 AI 寫的版本放這裡。
// 函式名稱一樣叫 recent7，輸入、輸出的格式跟 recent7.js 一樣（見 README.md）。

function parseDateUTC(dateStr) {
  if (typeof dateStr !== 'string') return NaN;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return NaN;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const ms = Date.UTC(year, month - 1, day);
  const d = new Date(ms);
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return NaN;
  }
  return ms;
}

function recent7(records, today) {
  const todayMs = parseDateUTC(today);
  if (!Array.isArray(records) || Number.isNaN(todayMs)) {
    return { minutes: 0, count: 0 };
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  let totalMinutes = 0;
  let count = 0;

  for (const record of records) {
    if (!record || typeof record !== 'object') continue;
    const logMs = parseDateUTC(record.log_date);
    if (Number.isNaN(logMs)) continue;

    const diffDays = (todayMs - logMs) / MS_PER_DAY;
    if (diffDays >= 0 && diffDays < 7) {
      count += 1;
      if (typeof record.minutes === 'number' && Number.isFinite(record.minutes)) {
        totalMinutes += record.minutes;
      }
    }
  }

  return { minutes: totalMinutes, count };
}
