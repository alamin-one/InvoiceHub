const generateInvoiceHTML = invoice => {
  const formatDate = date =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const statusColors = {
    paid: { bg: '#d1fae5', text: '#047857' },
    due: { bg: '#fef3c7', text: '#b45309' },
    default: { bg: '#00000010', text: '#000000' },
  };
  const statusStyle = statusColors[invoice?.status] || statusColors.default;

  const itemsRows = (invoice?.items || [])
    .map(
      item => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #00000010;">
          <p style="font-size: 14px; color: #000; margin: 0;">${item.name}</p>
        </td>
        <td style="padding: 8px 12px; text-align: center; font-size: 14px; color: #000; border-bottom: 1px solid #00000010;">
          ${item.qty}
        </td>
        <td style="padding: 8px 12px; text-align: right; font-size: 14px; color: #000; border-bottom: 1px solid #00000010;">
          ৳${item.price}
        </td>
        <td style="padding: 8px 12px; text-align: right; font-size: 14px; font-weight: 500; color: #000; border-bottom: 1px solid #00000010;">
          ৳${item.total}
        </td>
      </tr>
    `,
    )
    .join('');

  const logoHTML = invoice?.store?.logo?.url
    ? `<img src="${invoice.store.logo.url}" alt="${invoice?.store?.name || ''}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />`
    : `<div style="width: 40px; height: 40px; background: #15803d; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">
        ${invoice?.store?.name?.slice(0, 2).toUpperCase() || ''}
      </div>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }
      table { width: 100%; border-collapse: collapse; }
    </style>
  </head>
  <body>
    <div style="width: 210mm; min-height: 297mm; background: #fff; margin: 0 auto;">

      <!-- Header banner -->
      <div style="padding: 24px 40px 0 40px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 1px solid #e5e7eb; overflow: hidden; flex-shrink: 0;">
            ${logoHTML}
          </div>
          <div>
            <h4 style="color: #000; font-weight: bold; margin: 0; font-size: 16px;">${invoice?.store?.name || ''}</h4>
            <p style="font-size: 12px; color: #00000099; line-height: 1.2; margin: 2px 0 0 0;">
              ${invoice?.store?.tagline || ''}
            </p>
          </div>
        </div>

        <div style="text-align: right;">
          <p style="color: #00000099; font-size: 10px; letter-spacing: 0.5px; margin: 0;">INVOICE</p>
          <p style="color: #000; font-size: 18px; font-weight: bold; margin: 0 0 8px 0;">
            ${invoice?.invoiceNo || ''}
          </p>
        </div>
      </div>

      <div style="padding: 24px 40px;">

        <!-- From / Bill to -->
        <div style="display: flex; justify-content: space-between; gap: 24px; margin-bottom: 24px;">
          <div>
            <p style="font-size: 10px; color: #00000099; letter-spacing: 0.5px; margin: 0 0 4px 0;">FROM</p>
            <p style="font-size: 16px; font-weight: bold; color: #000; margin: 0;">${invoice?.store?.name || ''}</p>
            <p style="font-size: 12px; color: #000; line-height: 1.4; margin: 0;">${invoice?.store?.address || ''}</p>
            <p style="font-size: 12px; color: #000; line-height: 1.4; margin: 0;">${invoice?.store?.phone || ''}</p>
            <p style="font-size: 12px; color: #000; line-height: 1.4; margin: 0;">${invoice?.store?.email || ''}</p>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 10px; color: #00000099; letter-spacing: 0.5px; margin: 0 0 4px 0;">BILL TO</p>
            <p style="font-size: 14px; font-weight: bold; color: #000; margin: 0;">${invoice?.customer?.name || ''}</p>
            <p style="font-size: 11px; color: #000; margin: 2px 0 0 0;">${invoice?.customer?.phone || ''}</p>
            <p style="font-size: 11px; color: #000; margin: 2px 0 0 0;">${invoice?.customer?.address || ''}</p>
          </div>
        </div>

        <!-- Date strip -->
        <div style="display: flex; justify-content: space-between; gap: 12px; background: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
          <div>
            <p style="font-size: 9px; color: #00000099; letter-spacing: 0.5px; margin: 0 0 4px 0;">INVOICE DATE</p>
            <p style="font-size: 12px; font-weight: 600; color: #000; margin: 0;">${formatDate(invoice?.issueDate)}</p>
          </div>
          <div>
            <p style="font-size: 9px; color: #00000099; letter-spacing: 0.5px; margin: 0 0 4px 0;">DUE DATE</p>
            <p style="font-size: 12px; font-weight: 600; color: #000; margin: 0;">${formatDate(invoice?.dueDate)}</p>
          </div>
          <div>
            <p style="font-size: 9px; color: #00000099; letter-spacing: 0.5px; margin: 0 0 4px 0;">PAYMENT STATUS</p>
            <span style="text-transform: capitalize; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 9999px; background: ${statusStyle.bg}; color: ${statusStyle.text};">
              ${invoice?.status || 'Paid'}
            </span>
          </div>
        </div>

        <!-- Items table -->
        <table style="margin-bottom: 20px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="text-align: left; padding: 10px 12px; font-size: 10px; color: #00000099; letter-spacing: 0.5px; border-radius: 8px 0 0 8px;">ITEM</th>
              <th style="text-align: center; padding: 10px 12px; font-size: 10px; color: #00000099; letter-spacing: 0.5px;">QTY</th>
              <th style="text-align: right; padding: 10px 12px; font-size: 10px; color: #00000099; letter-spacing: 0.5px;">UNIT PRICE</th>
              <th style="text-align: right; padding: 10px 12px; font-size: 10px; color: #00000099; letter-spacing: 0.5px; border-radius: 0 8px 8px 0;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
          <div style="width: 256px;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="font-size: 12px; color: #00000099;">Subtotal</span>
              <span style="font-size: 12px; color: #000;">৳${invoice?.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="font-size: 12px; color: #00000099;">Discount</span>
              <span style="font-size: 12px; color: #ef4444;">− ৳${invoice?.discount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="font-size: 12px; color: #00000099;">Tax</span>
              <span style="font-size: 12px; color: #000;">৳${invoice?.tax}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #00000010; margin-top: 4px;">
              <span style="font-size: 14px; font-weight: 600; color: #000;">Grand Total</span>
              <span style="font-size: 14px; font-weight: 600; color: #000;">৳${invoice?.grandTotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
              <span style="font-size: 12px; color: #059669;">Paid</span>
              <span style="font-size: 12px; color: #059669;">৳${invoice?.paidAmount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; background: #fffbeb; border-radius: 8px; padding: 8px 12px; margin-top: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: #b45309;">Amount Due</span>
              <span style="font-size: 14px; font-weight: bold; color: #b45309;">৳${invoice?.dueAmount}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = generateInvoiceHTML;
