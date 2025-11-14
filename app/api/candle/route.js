// app/api/candles/route.ts
import { NextResponse } from 'next/server';
import { connect, getCandles } from 'tradingview-ws';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get('code');
    const timeframe = searchParams.get('timeframe') || '1D';
    const amount = +searchParams.get('amount') || 6;

    const connection = await connect();
    const candles = await getCandles({
      connection,
      symbols: [code],
      amount,
      timeframe,
    });

    await connection.close();

    return NextResponse.json({
      code,
      candles: candles[0],
    });
  } catch (error) {
    console.log('Error fetching candles:', error, error.response);
    console.dir(error);

    console.error(error);
    return NextResponse.json({ errorMessage: 'Failed to fetch candles', error }, { status: 500 });
  }
}
