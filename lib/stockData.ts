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
  chartSVG: string;
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

function generateChartDateLabels(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
  }
  return dates;
}

function generateChartSVG(portfolioData: PortfolioData): string {
  try {
    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 20, bottom: 100, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const CHART_COLORS: Record<string, string> = {
      AAPL: '#FFB3E6', // dreamy pink
      RBLX: '#B3E5FC', // dreamy blue
      IBIT: '#FFF9C4', // dreamy yellow
      ETSY: '#E1BEE7', // magical purple
      SNAP: '#FFB74D', // sunset orange
    };

    const dateLabels = generateChartDateLabels();

    // Get all price data
    const allPrices: number[] = [];
    Object.values(portfolioData).forEach(stock => {
      if (stock.priceHistory) {
        allPrices.push(...stock.priceHistory.filter(p => p !== null));
      }
    });

    if (allPrices.length === 0) {
      return '<svg></svg>';
    }

    const minPrice = Math.min(...allPrices) * 0.95;
    const maxPrice = Math.max(...allPrices) * 1.05;

    // Create scales
    const xScale = (index: number) =>
      (index / (dateLabels.length - 1)) * chartWidth;
    const yScale = (value: number) =>
      chartHeight - ((value - minPrice) / (maxPrice - minPrice)) * chartHeight;

    // Generate SVG
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: white; font-family: system-ui, -apple-system, sans-serif;" role="img" aria-labelledby="chart-title" aria-describedby="chart-desc">`;

    // Accessibility elements
    svg += `<title id="chart-title">Stock Price Performance - Last 30 Days</title>`;
    svg += `<desc id="chart-desc">A line chart showing how stock prices changed over the last 30 days. Each colored line represents a different stock: ${Object.keys(portfolioData).join(', ')}.</desc>`;

    // Title
    svg += `<text x="${width / 2}" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#333">Stock Price Performance - Last 30 Days</text>`;

    // Chart area background
    svg += `<rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="#ddd" stroke-width="1"/>`;

    // Y-axis labels and grid lines
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const value = minPrice + (maxPrice - minPrice) * (i / yTicks);
      const y = margin.top + chartHeight - (i / yTicks) * chartHeight;

      // Grid line
      svg += `<line x1="${margin.left}" y1="${y}" x2="${margin.left + chartWidth}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;

      // Y-axis label
      svg += `<text x="${margin.left - 10}" y="${y + 4}" text-anchor="end" font-size="14" fill="#666">$${value.toFixed(2)}</text>`;
    }

    // X-axis labels
    const xTickInterval = Math.floor(dateLabels.length / 6);
    dateLabels.forEach((label, index) => {
      if (index % xTickInterval === 0 || index === dateLabels.length - 1) {
        const x = margin.left + xScale(index);
        svg += `<text x="${x}" y="${margin.top + chartHeight + 20}" text-anchor="middle" font-size="13" fill="#666">${label}</text>`;
      }
    });

    // Y-axis title
    svg += `<text x="20" y="${margin.top + chartHeight / 2}" text-anchor="middle" font-size="14" fill="#333" transform="rotate(-90, 20, ${margin.top + chartHeight / 2})">Price ($)</text>`;

    // X-axis title
    svg += `<text x="${margin.left + chartWidth / 2}" y="${height - 20}" text-anchor="middle" font-size="14" fill="#333">Date</text>`;

    // Draw lines for each stock
    const stocks = Object.entries(portfolioData).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    stocks.forEach(([symbol, stock]) => {
      if (!stock.priceHistory || stock.priceHistory.length === 0) return;

      const color = CHART_COLORS[symbol] || '#999';
      let path = '';

      stock.priceHistory.forEach((price, index) => {
        if (price !== null) {
          const x = margin.left + xScale(index);
          const y = margin.top + yScale(price);

          if (path === '') {
            path = `M ${x} ${y}`;
          } else {
            path += ` L ${x} ${y}`;
          }
        }
      });

      if (path) {
        svg += `<path d="${path}" stroke="${color}" stroke-width="4" fill="none"/>`;

        // Add points
        stock.priceHistory.forEach((price, index) => {
          if (price !== null) {
            const x = margin.left + xScale(index);
            const y = margin.top + yScale(price);
            svg += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="white" stroke-width="2"/>`;
          }
        });
      }
    });

    // Legend
    let legendY = height - 80;
    const legendItemWidth = 120;
    const legendStartX = (width - stocks.length * legendItemWidth) / 2;

    stocks.forEach(([symbol], index) => {
      const color = CHART_COLORS[symbol] || '#999';
      const x = legendStartX + index * legendItemWidth;

      // Legend line
      svg += `<line x1="${x}" y1="${legendY}" x2="${x + 20}" y2="${legendY}" stroke="${color}" stroke-width="4"/>`;

      // Legend dot
      svg += `<circle cx="${x + 10}" cy="${legendY}" r="4" fill="${color}" stroke="white" stroke-width="2"/>`;

      // Legend text
      svg += `<text x="${x + 30}" y="${legendY + 4}" font-size="14" font-weight="bold" fill="#333">${symbol}</text>`;
    });

    svg += '</svg>';
    return svg;
  } catch (error) {
    console.error('Error generating SVG chart:', error);
    return '<svg width="800" height="400"><text x="400" y="200" text-anchor="middle" fill="#999">Chart unavailable</text></svg>';
  }
}

export async function getAllPortfolioDataWithAltText(): Promise<PortfolioDataWithAltText> {
  const { generateChartAltText } = await import('./chartAnalysis');
  const portfolioData = await getAllPortfolioData();
  const chartAltText = generateChartAltText(portfolioData);
  const chartSVG = generateChartSVG(portfolioData);

  return {
    portfolioData,
    chartAltText,
    chartSVG,
  };
}
