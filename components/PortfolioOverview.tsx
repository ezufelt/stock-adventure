interface PortfolioOverviewProps {
  total: number;
  bestPerformer: string;
  stockCount: number;
  totalCostBasis: number;
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PortfolioOverview({
  total,
  bestPerformer,
  stockCount,
  totalCostBasis,
}: PortfolioOverviewProps) {
  const loanAmount = totalCostBasis; // Loan amount equals the initial cost basis
  const netPosition = total - loanAmount;
  const netPositionPercent =
    netPosition !== null && loanAmount > 0
      ? (netPosition / loanAmount) * 100
      : 0;

  return (
    <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="border-dreamy-yellow from-dreamy-yellow to-dreamy-yellow magical-hover rounded-3xl border-4 bg-gradient-to-br via-yellow-100 p-8 text-center shadow-lg lg:col-span-2">
        <h2 className="mb-4 text-2xl text-gray-800">My Money Now</h2>
        <div className="my-3 text-5xl font-bold text-gray-800 drop-shadow-sm">
          {formatCurrency(total)}
        </div>
        <div
          className={`my-4 text-xl font-bold ${netPosition >= 0 ? 'text-green-600' : 'text-red-500'}`}
        >
          <span className="mr-2">
            {netPosition >= 0 ? '+' : ''}
            {formatCurrency(netPosition)}
          </span>
          <span>
            ({netPosition >= 0 ? '+' : ''}
            {netPositionPercent.toFixed(2)}%)
          </span>
        </div>
        <div className="mt-4 border-t-2 border-gray-200 pt-4">
          <p className="mb-2 text-base text-gray-500">
            Money I Started With:{' '}
            <span className="font-bold text-gray-800">
              {formatCurrency(loanAmount)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="from-dreamy-blue border-dreamy-blue magical-hover rounded-2xl border-3 bg-gradient-to-br to-blue-100 p-5 text-center shadow-md">
          <h3 className="mb-3 text-base text-gray-800">Best Stock</h3>
          <div className="my-2 text-3xl font-bold text-gray-800">
            {bestPerformer}
          </div>
          <div className="text-sm font-bold text-green-600">Winner!</div>
        </div>
        <div className="from-dreamy-yellow border-dreamy-yellow magical-hover rounded-2xl border-3 bg-gradient-to-br to-yellow-100 p-5 text-center shadow-md">
          <h3 className="mb-3 text-base text-gray-800">My Stocks</h3>
          <div className="my-2 text-3xl font-bold text-gray-800">
            {stockCount}
          </div>
          <div className="text-sm text-gray-500">Companies</div>
        </div>
      </div>
    </section>
  );
}
