import puppeteer from 'puppeteer';
import { buildReceiptHtml } from '@/lib/donationReceipt';

export async function generateReceiptPdfBuffer(receiptData) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildReceiptHtml(receiptData), { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '8mm',
        right: '8mm',
        bottom: '8mm',
        left: '8mm',
      },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
