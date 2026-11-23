// recent7.js：照 rules.md 寫的版本
// 輸入：records＝一串紀錄，每筆像 { log_date: '2026-11-23', minutes: 30 }（minutes 可能是 null）
//       today＝今天的日期，例如 '2026-11-23'
// 輸出：{ minutes: 總共幾分鐘, count: 幾筆 }
// 格式說明在 README.md；要怎麼算看 rules.md。

function recent7(records, today) {
  if (!Array.isArray(records)) {
    return { minutes: 0, count: 0, days: 0 };
  }

  const [year, month, day] = today.split('-').map(Number);
  const startStr = new Date(Date.UTC(year, month - 1, day - 6))
    .toISOString()
    .slice(0, 10);

  let totalMinutes = 0;
  let count = 0;
  const activeDays = new Set();

  for (const record of records) {
    if (!record || typeof record !== 'object') {
      continue;
    }

    const logDate = record.log_date;
    if (typeof logDate !== 'string' || logDate < startStr || logDate > today) {
      continue;
    }

    const mins =
      record.minutes === null || record.minutes === undefined
        ? 0
        : Number(record.minutes);

    totalMinutes += Number.isFinite(mins) ? mins : 0;
    count += 1;
    activeDays.add(logDate);
  }

  return { minutes: totalMinutes, count, days: activeDays.size };
}
