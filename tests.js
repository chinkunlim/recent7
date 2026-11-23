// tests.js：照 rules.md 寫的測試（每條規則至少一個情況，名字開頭標「規則 N」）

addCase({
  name: '規則 1：今天當天的紀錄要算入最近 7 天',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 }
  ],
  expect: { minutes: 30, count: 1 }
});

addCase({
  name: '規則 1：剛好前第 6 天（邊界第 7 天）要算入',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-17', minutes: 20 }
  ],
  expect: { minutes: 20, count: 1 }
});

addCase({
  name: '規則 1：超過 7 天（前第 7 天）不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 99 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 1：跨月、跨年依真實日曆天數往前算 6 天',
  today: '2026-01-03',
  records: [
    { log_date: '2026-01-03', minutes: 10 },
    { log_date: '2025-12-28', minutes: 25 },
    { log_date: '2025-12-27', minutes: 60 }
  ],
  expect: { minutes: 35, count: 2 }
});

addCase({
  name: '規則 1：閏年二月底到三月初依真實日曆天數計算',
  today: '2024-03-01',
  records: [
    { log_date: '2024-02-29', minutes: 15 },
    { log_date: '2024-02-24', minutes: 20 },
    { log_date: '2024-02-23', minutes: 50 }
  ],
  expect: { minutes: 35, count: 2 }
});

addCase({
  name: '規則 2：未來日期（晚於 today）不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-24', minutes: 50 },
    { log_date: '2026-12-01', minutes: 40 }
  ],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 3：minutes 為 null 時分鐘數當作 0，仍算 1 筆',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 0, count: 1 }
});

addCase({
  name: '規則 3：minutes 為 0 或缺漏（undefined）時分鐘數當作 0，各自算 1 筆',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 0 },
    { log_date: '2026-11-22' }
  ],
  expect: { minutes: 0, count: 2 }
});

addCase({
  name: '規則 3：minutes 為小數或數字字串時轉數字直接累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 15.5 },
    { log_date: '2026-11-22', minutes: '20' }
  ],
  expect: { minutes: 35.5, count: 2 }
});

addCase({
  name: '規則 4：同一天有多筆紀錄不做合併，各自計入',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-23', minutes: null },
    { log_date: '2026-11-23', minutes: 15 }
  ],
  expect: { minutes: 45, count: 3 }
});

addCase({
  name: '規則 1～4 綜合：第 1 步五筆範例資料',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-17', minutes: 20 },
    { log_date: '2026-11-23', minutes: null },
    { log_date: '2026-11-16', minutes: 99 },
    { log_date: '2026-11-24', minutes: 50 }
  ],
  expect: { minutes: 50, count: 3 }
});

addCase({
  name: '規則 5：空陣列回傳 { minutes: 0, count: 0 }',
  today: '2026-11-23',
  records: [],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 5：records 非陣列（如 null）回傳 { minutes: 0, count: 0 }',
  today: '2026-11-23',
  records: null,
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 5：陣列內含 null 或無效元素時略過該元素',
  today: '2026-11-23',
  records: [
    null,
    { log_date: '2026-11-23', minutes: 25 },
    undefined
  ],
  expect: { minutes: 25, count: 1 }
});

addCase({
  name: '規則 6：不同日期的紀錄各自計入 days',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-20', minutes: 15 },
    { log_date: '2026-11-17', minutes: 20 }
  ],
  expect: { minutes: 65, count: 3, days: 3 }
});

addCase({
  name: '規則 6：同一天有多筆紀錄只算 1 天',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-23', minutes: 10 },
    { log_date: '2026-11-17', minutes: 20 }
  ],
  expect: { minutes: 60, count: 3, days: 2 }
});

addCase({
  name: '規則 6：minutes 為 null 的紀錄在 7 天內也算該天有紀錄',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 0, count: 1, days: 1 }
});

addCase({
  name: '規則 6：超出 7 天或未來日期不計入 days，無符合紀錄時 days 為 0',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 99 },
    { log_date: '2026-11-24', minutes: 50 }
  ],
  expect: { minutes: 0, count: 0, days: 0 }
});
