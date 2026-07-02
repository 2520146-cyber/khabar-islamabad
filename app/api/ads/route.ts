import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slot = searchParams.get('slot');
    const device = searchParams.get('device') || 'ALL';

    if (!slot) {
      return NextResponse.json({ error: 'slot parameter is required' }, { status: 400 });
    }

    const now = new Date();

    const ads = await prisma.advertisement.findMany({
      where: {
        slotType: slot as any,
        isActive: true,
        isPaused: false,
        OR: [
          { startsAt: null },
          { startsAt: { lte: now } },
        ],
        AND: [
          { OR: [
            { expiresAt: null },
            { expiresAt: { gte: now } },
          ]},
        ],
        device: { in: ['ALL', device as any] },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Random selection if multiple ads for same slot
    if (ads.length === 0) {
      return NextResponse.json(null);
    }

    const ad = ads[Math.floor(Math.random() * ads.length)];
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (!['SUPER_ADMIN', 'AD_MANAGER'].includes(role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const ad = await prisma.advertisement.create({ data: body });
    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}
