// lib/tradingview.ts
import { connect, getCandles } from 'tradingview-ws';

let connectionPromise = null;

export async function getConnection() {
  if (!connectionPromise) {
    connectionPromise = connect()
      .then((conn) => {
        console.log('TradingView connected');

        return conn;
      })
      .catch((err) => {
        console.error('TradingView connect error:', err);
        connectionPromise = null;
        throw err;
      });
  }
  return connectionPromise;
}

export async function getCandlesSafe({ code, timeframe, amount }) {
  const connection = await getConnection();
  const candles = await getCandles({
    connection,
    symbols: [code],
    amount,
    timeframe,
  });
  return candles;
}

const futuresEnum = {
  copper: 'COMEX:HG1!',
  gold: 'COMEX:GC1!',
  oil: 'NYMEX:CL1!',
  gas: 'NYMEX:NG1!',
  cotton: 'ICEUS:CT1!',
  wheat: 'CBOT:ZW1!',
};

export const convertToTon = (code, futures) => {
  if (code === futuresEnum.copper) {
    return futures.map((item) => ({
      ...item,
      close: (item.close / 0.453592) * 1000,
    }));
  }

  if (code === futuresEnum.wheat) {
    return futures.map((item) => ({
      ...item,
      close: (item.close / 100 / 27.2155) * 1000,
    }));
  }

  if (code === futuresEnum.gas) {
    return futures.map((item) => ({
      ...item,
      close: item.close * 46.4,
    }));
  }

  if (code === futuresEnum.cotton) {
    return futures.map((item) => ({
      ...item,
      close: (item.close / 100 / 0.453592) * 1000,
    }));
  }
  return futures;
};

export const calculateCandlesDiff = (data) => {
  const closeTodayValue = data[5].close;
  const closeYestrdayValue = data[4].close;

  const diff = closeTodayValue - closeYestrdayValue;
  const percentDiff = (closeTodayValue / closeYestrdayValue) * 100 - 100;

  return {
    diff,
    percentDiff,
    closeTodayValue,
  };
};
