// app/api/candles/route.ts
import { calculateCandlesDiff, convertToTon, getCandlesSafe } from '@/shared/lib/tradingview';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');
    const timeframe = '1D';
    const amount = 6;

    const candles = await getCandlesSafe({ code, timeframe, amount });

    let futures = convertToTon(code, candles[0]);

    return NextResponse.json({
      code: code,
      futures: futures,
      ...calculateCandlesDiff(futures),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errorMessage: 'Failed to fetch candles', error }, { status: 500 });
  }
}
