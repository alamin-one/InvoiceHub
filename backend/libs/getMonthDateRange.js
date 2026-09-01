const now = new Date();

module.exports.currentMonthStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  1,
);
module.exports.previousMonthStart = new Date(
  now.getFullYear(),
  now.getMonth() - 1,
  1,
);
module.exports.sixMonthsAgoStart = new Date(
  now.getFullYear(),
  now.getMonth() - 5,
  1,
);
