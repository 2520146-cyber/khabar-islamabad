import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.advertisement.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 });
  }
}
