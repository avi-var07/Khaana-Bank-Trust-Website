const NGO_NAME = 'Khaana Bank Trust';
const RECEIPT_PREFIX = 'KBT-';

function toNumber(value) {
  const num = Number.parseInt(value, 10);
  return Number.isNaN(num) ? 0 : num;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatAmount(amount) {
  return toNumber(amount).toLocaleString('en-IN');
}

function parseReceiptSequence(receiptNumber) {
  if (!receiptNumber || typeof receiptNumber !== 'string') return 0;
  if (!receiptNumber.startsWith(RECEIPT_PREFIX)) return 0;
  return toNumber(receiptNumber.slice(RECEIPT_PREFIX.length));
}

export function getNextReceiptNumber(donations) {
  const maxSequence = (Array.isArray(donations) ? donations : []).reduce((max, donation) => {
    const sequence = parseReceiptSequence(donation?.receiptNumber);
    return sequence > max ? sequence : max;
  }, 0);

  const nextSequence = maxSequence + 1;
  return `${RECEIPT_PREFIX}${String(nextSequence).padStart(4, '0')}`;
}

export function buildReceiptData(donation) {
  const createdAt = donation?.createdAt || new Date().toISOString();
  return {
    ngoName: NGO_NAME,
    receiptNumber: donation?.receiptNumber || '',
    date: formatDate(createdAt),
    donorName: donation?.name || 'Supporter',
    address: donation?.address || 'N/A',
    contact: donation?.phone || donation?.contact || 'N/A',
    amount: formatAmount(donation?.amount),
    description: donation?.description || 'Donation for social initiatives',
    paymentId: donation?.paymentId || 'N/A',
  };
}

export function findDonationByReceiptOrPayment(donations, { receiptNumber, paymentId }) {
  const records = Array.isArray(donations) ? donations : [];
  return records.find((donation) => {
    if (receiptNumber && donation?.receiptNumber === receiptNumber) return true;
    if (paymentId && donation?.paymentId === paymentId) return true;
    return false;
  });
}

function renderReceiptCopy(receiptData, copyLabel) {
  return `
    <section class="receipt-copy">
      <div class="receipt-header-row">
        <h1>${escapeHtml(receiptData.ngoName)}</h1>
        <span class="copy-badge">${escapeHtml(copyLabel)}</span>
      </div>
      <div class="receipt-meta">
        <div><strong>Receipt No:</strong> ${escapeHtml(receiptData.receiptNumber)}</div>
        <div><strong>Date:</strong> ${escapeHtml(receiptData.date)}</div>
      </div>

      <table class="receipt-table">
        <tr>
          <th>Donor Name</th>
          <td>${escapeHtml(receiptData.donorName)}</td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${escapeHtml(receiptData.address)}</td>
        </tr>
        <tr>
          <th>Contact Number</th>
          <td>${escapeHtml(receiptData.contact)}</td>
        </tr>
        <tr>
          <th>Amount Donated</th>
          <td>INR ${escapeHtml(receiptData.amount)}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>${escapeHtml(receiptData.description)}</td>
        </tr>
        <tr>
          <th>Payment ID</th>
          <td>${escapeHtml(receiptData.paymentId)}</td>
        </tr>
      </table>

      <div class="signature-row">
        <div class="signature-box">
          <div class="line"></div>
          <p>Authorized Signature</p>
        </div>
      </div>
    </section>
  `;
}

export function buildReceiptHtml(receiptData) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Donation Receipt ${escapeHtml(receiptData.receiptNumber)}</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #111;
            font-size: 12px;
          }

          .page {
            width: 100%;
            min-height: calc(297mm - 20mm);
            display: flex;
            flex-direction: column;
            gap: 12mm;
          }

          .receipt-copy {
            border: 1px solid #000;
            padding: 10mm;
            min-height: 128mm;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .receipt-header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6mm;
            border-bottom: 1px solid #000;
            padding-bottom: 3mm;
          }

          .receipt-header-row h1 {
            margin: 0;
            font-size: 22px;
            letter-spacing: 0.2px;
          }

          .copy-badge {
            border: 1px solid #000;
            padding: 1.5mm 3mm;
            font-size: 11px;
            font-weight: bold;
          }

          .receipt-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5mm;
            font-size: 12px;
          }

          .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 2mm;
          }

          .receipt-table th,
          .receipt-table td {
            border: 1px solid #444;
            padding: 3.5mm;
            text-align: left;
            vertical-align: top;
          }

          .receipt-table th {
            width: 30%;
            background: #f4f4f4;
            font-weight: 700;
          }

          .signature-row {
            margin-top: auto;
            display: flex;
            justify-content: flex-end;
            padding-top: 8mm;
          }

          .signature-box {
            width: 62mm;
            text-align: center;
          }

          .signature-box .line {
            border-top: 1px solid #000;
            margin-bottom: 2mm;
          }

          .signature-box p {
            margin: 0;
            font-size: 11px;
          }

          .cut-line {
            border-top: 1px dashed #777;
          }
        </style>
      </head>
      <body>
        <main class="page">
          ${renderReceiptCopy(receiptData, 'Donor Copy')}
          <div class="cut-line"></div>
          ${renderReceiptCopy(receiptData, 'Office Copy')}
        </main>
      </body>
    </html>
  `;
}
