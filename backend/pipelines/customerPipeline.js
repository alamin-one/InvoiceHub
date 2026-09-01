module.exports.customerPipeline = ({ storeId, search = '' }) => {
  const pipeline = [
    {
      $match: {
        store: storeId,
      },
    },

    {
      $lookup: {
        from: 'invoices',
        localField: '_id',
        foreignField: 'customer',
        as: 'invoices',
      },
    },

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

        partialCount: {
          $size: {
            $filter: {
              input: '$invoices',
              as: 'invoice',
              cond: {
                $eq: ['$$invoice.status', 'partial'],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        invoices: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  if (search) {
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchText = escapeRegex(search.replace(/\s+/g, ''));

    pipeline.push({
      $match: {
        $expr: {
          $or: [
            {
              $regexMatch: {
                input: {
                  $replaceAll: { input: '$name', find: ' ', replacement: '' },
                },
                regex: searchText,
                options: 'i',
              },
            },
            {
              $regexMatch: {
                input: {
                  $replaceAll: { input: '$phone', find: ' ', replacement: '' },
                },
                regex: searchText,
                options: 'i',
              },
            },
          ],
        },
      },
    });
  }
  return pipeline;
};

module.exports.singleCustomerPipeline = ({ storeId, customerId }) => {
  const pipeline = [
    {
      $match: {
        store: storeId,
        _id: customerId,
      },
    },
    {
      $lookup: {
        from: 'invoices',
        localField: '_id',
        foreignField: 'customer',
        pipeline: [
          {
            $project: {
              _id: 1,
              invoiceNo: 1,
              status: 1,
              grandTotal: 1,

              paidAmount: 1,
              dueAmount: 1,

              issueDate: 1,
              createdAt: 1,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
        as: 'invoices',
      },
    },
    {
      $addFields: {
        invoiceCount: {
          $size: '$invoices',
        },

        totalPaid: {
          $sum: '$invoices.paidAmount',
        },

        totalDue: {
          $sum: '$invoices.dueAmount',
        },

        partialCount: {
          $size: {
            $filter: {
              input: '$invoices',
              as: 'invoice',
              cond: {
                $eq: ['$$invoice.status', 'partial'],
              },
            },
          },
        },
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ];

  return pipeline;
};
