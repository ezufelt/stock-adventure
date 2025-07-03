export interface StockPosition {
  shares: number;
  purchasePrice: number;
}

export interface StockData {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  volume: number | null;
  lastTradingDate: string | null;
  shares: number;
}

export interface PortfolioStockData extends StockData {
  priceHistory: number[];
  totalValue: number;
  purchasePrice: number;
  costBasis: number;
  gainLoss: number | null;
  gainLossPercent: number | null;
  purchaseDate: string;
}

export interface PortfolioData {
  [symbol: string]: PortfolioStockData;
}

export interface PortfolioDataWithAltText {
  portfolioData: PortfolioData;
  chartAltText: string;
}

const PORTFOLIO_POSITIONS: Record<string, StockPosition> = {
  AAPL: { shares: 1, purchasePrice: 212.13 },
  RBLX: { shares: 2, purchasePrice: 102.4 },
  IBIT: { shares: 3, purchasePrice: 62.26 },
  ETSY: { shares: 4, purchasePrice: 53.29 },
  SNAP: { shares: 20, purchasePrice: 9.38 },
};

const PORTFOLIO_STOCKS = Object.keys(PORTFOLIO_POSITIONS).sort();
const PURCHASE_DATE = '2025-07-07';

export async function getStockData(symbol: string): Promise<StockData> {
  try {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const params = new URLSearchParams({
      period1: startTime.toString(),
      period2: endTime.toString(),
      interval: '1d',
      includePrePost: 'false',
      events: 'div,splits',
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return {
        symbol: symbol,
        price: null,
        change: null,
        changePercent: null,
        volume: null,
        lastTradingDate: null,
        shares: PORTFOLIO_POSITIONS[symbol]?.shares || 0,
      };
    }

    const result = data.chart.result[0];
    const quote = result.indicators?.quote?.[0];
    const meta = result.meta;

    if (!quote || !quote.close || quote.close.length === 0) {
      return {
        symbol: symbol,
        price: null,
        change: null,
        changePercent: null,
        volume: null,
        lastTradingDate: null,
        shares: PORTFOLIO_POSITIONS[symbol]?.shares || 0,
      };
    }

    const currentPrice = quote.close[quote.close.length - 1];
    const previousPrice =
      quote.close.length > 1
        ? quote.close[quote.close.length - 2]
        : currentPrice;
    const change = currentPrice - previousPrice;
    const changePercent =
      previousPrice !== 0 ? (change / previousPrice) * 100 : 0;
    const volume = quote.volume ? quote.volume[quote.volume.length - 1] : null;
    const lastTimestamp = result.timestamp
      ? result.timestamp[result.timestamp.length - 1]
      : null;
    const lastTradingDate = lastTimestamp
      ? new Date(lastTimestamp * 1000).toISOString().split('T')[0]!
      : null;

    return {
      symbol: meta.symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: volume,
      lastTradingDate: lastTradingDate,
      shares: PORTFOLIO_POSITIONS[symbol]?.shares || 0,
    };
  } catch (error) {
    return {
      symbol: symbol,
      price: null,
      change: null,
      changePercent: null,
      volume: null,
      lastTradingDate: null,
      shares: PORTFOLIO_POSITIONS[symbol]?.shares || 0,
    };
  }
}

export async function getHistoricalData(symbol: string): Promise<number[]> {
  try {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = Math.floor(
      (Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000
    );

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const params = new URLSearchParams({
      period1: startTime.toString(),
      period2: endTime.toString(),
      interval: '1d',
      includePrePost: 'false',
      events: 'div,splits',
    });

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return [];
    }

    const result = data.chart.result[0];
    const quote = result.indicators?.quote?.[0];

    if (!quote || !quote.close) {
      return [];
    }

    return quote.close.filter(
      (price: number | null) => price !== null
    ) as number[];
  } catch (error) {
    return [];
  }
}

export async function getAllPortfolioData(): Promise<PortfolioData> {
  const portfolioData: PortfolioData = {};

  for (const symbol of PORTFOLIO_STOCKS) {
    const [stockData, historicalData] = await Promise.all([
      getStockData(symbol),
      getHistoricalData(symbol),
    ]);

    const position = PORTFOLIO_POSITIONS[symbol];
    if (!position) {
      continue;
    }
    const purchasePrice = position.purchasePrice;
    const costBasis = purchasePrice * stockData.shares;
    const totalValue = stockData.price ? stockData.price * stockData.shares : 0;
    const gainLoss = stockData.price ? totalValue - costBasis : null;
    const gainLossPercent =
      gainLoss !== null ? (gainLoss / costBasis) * 100 : null;

    portfolioData[symbol] = {
      ...stockData,
      priceHistory: historicalData,
      totalValue,
      purchasePrice,
      costBasis,
      gainLoss,
      gainLossPercent,
      purchaseDate: PURCHASE_DATE,
    };
  }

  return portfolioData;
}

export async function getAllPortfolioDataWithAltText(): Promise<PortfolioDataWithAltText> {
  const { generateChartAltText } = await import('./chartAnalysis');
  const portfolioData = await getAllPortfolioData();
  const chartAltText = generateChartAltText(portfolioData);

  return {
    portfolioData,
    chartAltText,
  };
}
