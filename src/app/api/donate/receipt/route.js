import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import {
  buildReceiptData,
  findDonationByReceiptOrPayment,
  getNextReceiptNumber,
} from '@/lib/donationReceipt';
import { generateReceiptPdfBuffer } from '@/lib/receiptPdf';

export const runtime = 'nodejs';

function pdfResponse(pdfBuffer, receiptNumber) {
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${receiptNumber || 'donation-receipt'}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const receiptNumber = searchParams.get('receiptNumber') || '';
    const paymentId = searchParams.get('paymentId') || '';

    if (!receiptNumber && !paymentId) {
      return NextResponse.json(
        { error: 'Pass receiptNumber or paymentId to download receipt.' },
        { status: 400 }
      );
    }

    const donations = await readDB('donations.json');
    const donation = findDonationByReceiptOrPayment(donations, { receiptNumber, paymentId });

    if (!donation) {
      return NextResponse.json({ error: 'Receipt not found.' }, { status: 404 });
    }

    const receiptData = buildReceiptData(donation);
    const pdfBuffer = await generateReceiptPdfBuffer(receiptData);
    return pdfResponse(pdfBuffer, receiptData.receiptNumber);
  } catch (error) {
    console.error('Receipt download error:', error);
    return NextResponse.json({ error: 'Failed to generate receipt PDF.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const donations = await readDB('donations.json');

    const receiptNumber = payload.receiptNumber || getNextReceiptNumber(donations);
    const receiptData = buildReceiptData({
      name: payload.name,
      address: payload.address,
      phone: payload.phone || payload.contact,
      amount: payload.amount,
      description: payload.description,
      paymentId: payload.paymentId,
      receiptNumber,
      createdAt: payload.date || new Date().toISOString(),
    });

    const pdfBuffer = await generateReceiptPdfBuffer(receiptData);
    return pdfResponse(pdfBuffer, receiptData.receiptNumber);
  } catch (error) {
    console.error('Receipt create error:', error);
    return NextResponse.json({ error: 'Failed to create receipt PDF.' }, { status: 500 });
  }
}
