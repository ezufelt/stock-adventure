export default function EducationSection() {
  return (
    <section className="border-mint-green from-mint-green to-dreamy-blue magical-hover my-10 rounded-3xl border-4 bg-gradient-to-br p-8">
      <h2 className="text-gradient sparkle relative mb-8 text-center text-4xl font-bold drop-shadow-lg">
        Learn About Investing
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="border-dreamy-pink from-dreamy-pink magical-hover relative rounded-2xl border-4 bg-gradient-to-br to-pink-50 p-6 shadow-lg">
          <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 text-2xl shadow-md">
            📈
          </div>
          <h3 className="mb-4 text-xl font-bold text-white drop-shadow-sm">
            What is a Stock? 🏢
          </h3>
          <p className="leading-relaxed text-white drop-shadow-sm">
            A stock is like owning a tiny piece of a company! When you buy Apple
            stock, you own a small part of Apple.
          </p>
        </div>
        <div className="border-dreamy-blue from-dreamy-blue magical-hover relative rounded-2xl border-4 bg-gradient-to-br to-blue-50 p-6 shadow-lg">
          <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 text-2xl shadow-md">
            📊
          </div>
          <h3 className="mb-4 text-xl font-bold text-white drop-shadow-sm">
            Why Do Prices Go Up and Down? 🎢
          </h3>
          <p className="leading-relaxed text-white drop-shadow-sm">
            Stock prices change based on how many people want to buy vs sell.
            Good news makes prices go up, bad news makes them go down.
          </p>
        </div>
        <div className="border-dreamy-yellow from-dreamy-yellow magical-hover relative rounded-2xl border-4 bg-gradient-to-br to-yellow-50 p-6 shadow-lg">
          <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 text-2xl shadow-md">
            🧺
          </div>
          <h3 className="mb-4 text-xl font-bold text-gray-800 drop-shadow-sm">
            What is Diversification? 🌈
          </h3>
          <p className="leading-relaxed text-gray-800">
            Don&apos;t put all your eggs in one basket! We bought 5 different
            stocks so if one goes down, others might go up.
          </p>
        </div>
        <div className="border-magical-purple from-magical-purple magical-hover relative rounded-2xl border-4 bg-gradient-to-br to-purple-50 p-6 shadow-lg">
          <div className="absolute -top-3 -right-3 rounded-full bg-white p-1 text-2xl shadow-md">
            ⏰
          </div>
          <h3 className="mb-4 text-xl font-bold text-white drop-shadow-sm">
            Long-term Thinking 🌱
          </h3>
          <p className="leading-relaxed text-white drop-shadow-sm">
            Great investors think about years, not days. Your money has time to
            grow as these companies get bigger and better!
          </p>
        </div>
      </div>
    </section>
  );
}
