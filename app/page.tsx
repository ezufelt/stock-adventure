import { getAllPortfolioDataWithAltText } from '../lib/stockData';
import PortfolioOverview from '../components/PortfolioOverview';
import StockCard from '../components/StockCard';
import EducationSection from '../components/EducationSection';
import ChartSection from '../components/ChartSection';

export default async function Home() {
  const result = await getAllPortfolioDataWithAltText();
  const portfolioData = result.portfolioData;
  const chartSVG = result.chartSVG;
  const chartAltText = result.chartAltText;

  const portfolioTotal = Object.values(portfolioData).reduce(
    (sum, stock) => sum + stock.totalValue,
    0
  );
  const totalCostBasis = Object.values(portfolioData).reduce(
    (sum, stock) => sum + (stock.costBasis || 0),
    0
  );

  const bestPerformer = Object.entries(portfolioData).reduce(
    (best, [symbol, stock]) => {
      if (
        stock.gainLossPercent !== null &&
        stock.gainLossPercent > best.gainLossPercent
      ) {
        return { symbol, gainLossPercent: stock.gainLossPercent };
      }
      return best;
    },
    { symbol: '', gainLossPercent: -Infinity }
  );

  return (
    <div className="mx-auto my-3 max-w-6xl rounded-3xl bg-white p-3 shadow-lg md:my-5 md:p-5">
      <header className="from-dreamy-yellow via-dreamy-pink to-dreamy-blue rainbow-border sparkle floating relative mb-6 rounded-2xl bg-gradient-to-r p-4 text-center shadow-lg md:mb-8 md:p-5">
        <div className="absolute -top-2 -left-2 text-2xl">✨</div>
        <div className="absolute -top-2 -right-2 text-2xl">🌟</div>
        <div className="absolute -bottom-2 -left-2 text-2xl">💫</div>
        <div className="absolute -right-2 -bottom-2 text-2xl">⭐</div>
        <h1 className="text-gradient mb-2 text-3xl font-bold text-shadow-sm md:mb-3 md:text-4xl lg:text-5xl">
          My Stock Adventure
        </h1>
        <p className="text-lg font-bold text-gray-800 drop-shadow-sm md:text-xl">
          Learning to save and grow money! 🚀
        </p>
      </header>

      <div className="bounce-in">
        <PortfolioOverview
          total={portfolioTotal}
          bestPerformer={bestPerformer.symbol}
          stockCount={Object.keys(portfolioData).length}
          totalCostBasis={totalCostBasis}
        />
      </div>

      <div className="wave-divider"></div>

      <ChartSection chartSVG={chartSVG} chartAltText={chartAltText} />

      <div className="wave-divider"></div>

      <section className="slide-up my-10">
        <h2 className="text-gradient sparkle relative mb-6 text-center text-3xl font-bold drop-shadow-lg md:mb-8 md:text-4xl">
          My Stocks
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-3">
          {Object.entries(portfolioData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([symbol, stock]) => (
              <StockCard key={symbol} symbol={symbol} stock={stock} />
            ))}
        </div>
      </section>

      <div className="wave-divider"></div>

      <div className="slide-up">
        <EducationSection />
      </div>
    </div>
  );
}
