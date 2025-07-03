import { PortfolioData } from './stockData';

export interface TrendAnalysis {
  trend: 'upward' | 'downward' | 'sideways' | 'insufficient data';
  change: number;
  changePercent: number;
}

export interface VolatilityAnalysis {
  volatility: 'high' | 'moderate' | 'low' | 'stable' | 'unknown';
  range: number;
  rangePercent: number;
  min?: number;
  max?: number;
}

export interface PerformanceRanking {
  symbol: string;
  trend: string;
  change: number;
  changePercent: number;
}

export function analyzeStockTrend(priceHistory: number[]): TrendAnalysis {
  if (!priceHistory || priceHistory.length < 2) {
    return { trend: 'insufficient data', change: 0, changePercent: 0 };
  }

  const startPrice = priceHistory[0];
  const endPrice = priceHistory[priceHistory.length - 1];

  if (startPrice === undefined || endPrice === undefined) {
    return { trend: 'insufficient data', change: 0, changePercent: 0 };
  }

  const change = endPrice - startPrice;
  const changePercent = (change / startPrice) * 100;

  let trend: TrendAnalysis['trend'] = 'sideways';
  if (changePercent > 2) trend = 'upward';
  else if (changePercent < -2) trend = 'downward';

  return { trend, change, changePercent };
}

export function analyzeVolatility(priceHistory: number[]): VolatilityAnalysis {
  if (!priceHistory || priceHistory.length < 2) {
    return { volatility: 'unknown', range: 0, rangePercent: 0 };
  }

  const min = Math.min(...priceHistory);
  const max = Math.max(...priceHistory);
  const range = max - min;
  const avg =
    priceHistory.reduce((sum, price) => sum + price, 0) / priceHistory.length;
  const rangePercent = (range / avg) * 100;

  let volatility: VolatilityAnalysis['volatility'] = 'stable';
  if (rangePercent > 15) volatility = 'high';
  else if (rangePercent > 8) volatility = 'moderate';
  else if (rangePercent > 3) volatility = 'low';

  return { volatility, range, rangePercent, min, max };
}

export function rankPerformance(
  portfolioData: PortfolioData
): PerformanceRanking[] {
  const performances = Object.entries(portfolioData)
    .filter(([_, stock]) => stock.priceHistory && stock.priceHistory.length > 0)
    .map(([symbol, stock]) => {
      const analysis = analyzeStockTrend(stock.priceHistory);
      return { symbol, ...analysis };
    })
    .sort((a, b) => b.changePercent - a.changePercent);

  return performances;
}

export function generateChartAltText(portfolioData: PortfolioData): string {
  const validStocks = Object.entries(portfolioData).filter(
    ([_, stock]) => stock.priceHistory && stock.priceHistory.length > 0
  );

  if (validStocks.length === 0) {
    return '30-day portfolio performance chart: No historical data available.';
  }

  const performances = rankPerformance(portfolioData);
  const stockCount = validStocks.length;
  const positiveStocks = performances.filter(p => p.changePercent > 0).length;

  let description = `30-day portfolio performance chart showing ${stockCount} stocks. `;

  // Best and worst performers
  if (performances.length > 0) {
    const best = performances[0];
    const worst = performances[performances.length - 1];

    if (best) {
      description += `Best performer: ${best.symbol} (${best.changePercent > 0 ? '+' : ''}${best.changePercent.toFixed(1)}%). `;
    }
    if (performances.length > 1 && worst) {
      description += `Worst performer: ${worst.symbol} (${worst.changePercent > 0 ? '+' : ''}${worst.changePercent.toFixed(1)}%). `;
    }
  }

  // Volatility analysis
  const volatilityAnalysis = validStocks.map(([symbol, stock]) => ({
    symbol,
    ...analyzeVolatility(stock.priceHistory),
  }));

  const mostVolatile = volatilityAnalysis.reduce((max, current) =>
    current.rangePercent > max.rangePercent ? current : max
  );

  const leastVolatile = volatilityAnalysis.reduce((min, current) =>
    current.rangePercent < min.rangePercent ? current : min
  );

  if (mostVolatile.volatility === 'high') {
    description += `Most volatile: ${mostVolatile.symbol} with ${mostVolatile.rangePercent.toFixed(1)}% price range. `;
  }

  if (leastVolatile.volatility === 'stable') {
    description += `Most stable: ${leastVolatile.symbol} with minimal fluctuation. `;
  }

  // Overall trend
  const overallTrend =
    positiveStocks > stockCount / 2
      ? 'positive'
      : positiveStocks === 0
        ? 'negative'
        : 'mixed';

  description += `Overall portfolio trend: ${overallTrend} with ${positiveStocks} of ${stockCount} stocks gaining value.`;

  return description;
}
