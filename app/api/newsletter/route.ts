import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check for existing subscription
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: true, message: 'You are already subscribed!' },
          { status: 200 }
        );
      }
      // Reactivate
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return NextResponse.json({
        success: true,
        message: 'Welcome back! Subscription reactivated.',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully! Welcome to Khabar Islamabad.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
