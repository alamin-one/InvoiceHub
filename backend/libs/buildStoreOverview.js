const calculateChangePercent = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(2));
};

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const buildStoreOverview = (store, currentMonthStart) => {
  const monthlySales = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentMonthStart);
    d.setMonth(d.getMonth() - i);

    const match = store.monthlySales.find(
      m => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1,
    );

    monthlySales.push({
      month: monthNames[d.getMonth()],
      total: match ? match.total : 0,
    });
  }

  const monthlyOverview = store.monthlyOverview[0];

  const emptyStats = {
    invoiceCount: 0,
    grandTotal: 0,
    totalPaid: 0,
    totalDue: 0,
  };

  const current = monthlyOverview.current[0] || emptyStats;
  const previous = monthlyOverview.previous[0] || emptyStats;

  return {
    invoiceCount: store.invoiceCount,
    grandTotal: store.grandTotal,
    totalPaid: store.totalPaid,
    totalDue: store.totalDue,
    partialCount: store.partialCount,
    totalPaidCount: store.totalPaidCount,
    totalDueCount: store.totalDueCount,
    monthlySales,

    invoiceCountChange: calculateChangePercent(
      current.invoiceCount,
      previous.invoiceCount,
    ),
    grandTotalChange: calculateChangePercent(
      current.grandTotal,
      previous.grandTotal,
    ),
    totalPaidChange: calculateChangePercent(
      current.totalPaid,
      previous.totalPaid,
    ),
    totalDueChange: calculateChangePercent(current.totalDue, previous.totalDue),
  };
};

module.exports = buildStoreOverview;
