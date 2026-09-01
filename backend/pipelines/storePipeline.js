module.exports.StoreOverviewPipeline = ({
  storeId,
  currentMonthStart,
  previousMonthStart,
  sixMonthsAgoStart,
}) => {
  return [
    {
      $match: {
        _id: storeId,
      },
    },

    // All-time invoice
    {
      $lookup: {
        from: 'invoices',
        localField: '_id',
        foreignField: 'store',
        as: 'invoices',
      },
    },

    // Current + Previous month
    {
      $lookup: {
        from: 'invoices',
        let: { storeId: '$_id' },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$store', '$$storeId'],
              },
            },
          },

          {
            $facet: {
              current: [
                {
                  $match: {
                    createdAt: {
                      $gte: currentMonthStart,
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalPaid: { $sum: '$paidAmount' },
                    grandTotal: { $sum: '$grandTotal' },
                    totalDue: { $sum: '$dueAmount' },
                    invoiceCount: { $sum: 1 },
                  },
                },
              ],

              previous: [
                {
                  $match: {
                    createdAt: {
                      $gte: previousMonthStart,
                      $lt: currentMonthStart,
                    },
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalPaid: { $sum: '$paidAmount' },
                    grandTotal: { $sum: '$grandTotal' },
                    totalDue: { $sum: '$dueAmount' },
                    invoiceCount: { $sum: 1 },
                  },
                },
              ],
            },
          },
        ],

        as: 'monthlyOverview',
      },
    },
    {
      $lookup: {
        from: 'invoices',
        let: { storeId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$store', '$$storeId'] },
              createdAt: { $gte: sixMonthsAgoStart },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              total: { $sum: '$grandTotal' },
            },
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 },
          },
        ],
        as: 'monthlySales',
      },
    },
    // All-time calculation
    {
      $addFields: {
        invoiceCount: {
          $size: '$invoices',
        },

        totalPaid: {
          $sum: '$invoices.paidAmount',
        },

        grandTotal: {
          $sum: '$invoices.grandTotal',
        },

        totalDue: {
          $sum: '$invoices.dueAmount',
        },

        totalPaidCount: {
          $size: {
            $filter: {
              input: '$invoices',
              as: 'inv',
              cond: { $eq: ['$$inv.status', 'paid'] },
            },
          },
        },

        totalDueCount: {
          $size: {
            $filter: {
              input: '$invoices',
              as: 'inv',
              cond: { $eq: ['$$inv.status', 'due'] },
            },
          },
        },

        partialCount: {
          $size: {
            $filter: {
              input: '$invoices',
              as: 'inv',
              cond: { $eq: ['$$inv.status', 'partial'] },
            },
          },
        },
      },
    },

    {
      $project: {
        monthlyOverview: 1,
        invoiceCount: 1,
        totalPaid: 1,
        grandTotal: 1,
        totalDue: 1,
        monthlySales: 1,

        partialCount: 1,
        totalPaidCount: 1,
        totalDueCount: 1,
      },
    },
  ];
};
