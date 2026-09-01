module.exports.invoicePipeline = ({
  storeId,
  search = '',
  status = 'all',
  limit,
}) => {
  const pipeline = [
    {
      $match: { store: storeId },
    },

    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
      },
    },

    {
      $addFields: {
        customerName: {
          $arrayElemAt: ['$customer.name', 0],
        },
      },
    },
  ];

  if (search) {
    const searchText = search.replace(/\s+/g, '');

    pipeline.push({
      $match: {
        $expr: {
          $or: [
            {
              $regexMatch: {
                input: {
                  $replaceAll: {
                    input: '$customerName',
                    find: ' ',
                    replacement: '',
                  },
                },
                regex: searchText,
                options: 'i',
              },
            },
            {
              $regexMatch: {
                input: {
                  $replaceAll: {
                    input: '$invoiceNo',
                    find: ' ',
                    replacement: '',
                  },
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

  if (status !== 'all') {
    pipeline.push({
      $match: { status },
    });
  }
  pipeline.push({
    $sort: { createdAt: -1 },
  });

  if (limit) {
    pipeline.push({
      $limit: Number(limit),
    });
  }
  pipeline.push({
    $project: {
      invoiceNo: 1,
      grandTotal: 1,
      paidAmount: 1,
      dueAmount: 1,
      status: 1,
      issueDate: 1,
      customerName: 1,
    },
  });

  return pipeline;
};

module.exports.SingleInvoicePipeline = ({ id }) => {
  const pipeline = [
    {
      $match: { _id: id },
    },

    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
      },
    },

    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'stores',
        localField: 'store',
        foreignField: '_id',
        as: 'store',
      },
    },

    {
      $unwind: {
        path: '$store',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  pipeline.push({
    $project: {
      invoiceNo: 1,
      items: 1,
      subtotal: 1,
      discount: 1,
      tax: 1,
      taxAmount: 1,
      grandTotal: 1,
      paidAmount: 1,
      dueAmount: 1,
      status: 1,
      issueDate: 1,
      dueDate: 1,
      createdAt: 1,

      'store._id': 1,
      'store.name': 1,
      'store.tagline': 1,
      'store.address': 1,
      'store.phone': 1,
      'store.email': 1,
      'store.logo': 1,

      'customer._id': 1,
      'customer.name': 1,
      'customer.phone': 1,
      'customer.address': 1,
    },
  });

  return pipeline;
};
