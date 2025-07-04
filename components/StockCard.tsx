'use client';

import { useState } from 'react';
import CompanyModal from './CompanyModal';
import { PortfolioStockData } from '../lib/stockData';

interface CompanyInfo {
  name: string;
  logo: string;
  description: string;
  funFacts: string[];
  whatTheyDo: string;
  whyInvest: string;
}

interface StockCardProps {
  symbol: string;
  stock: PortfolioStockData;
}

const COMPANY_INFO: Record<string, CompanyInfo> = {
  AAPL: {
    name: 'Apple Inc.',
    logo: '🍎',
    description:
      'Apple makes the iPhone, iPad, Mac computers, and other cool tech gadgets you probably use every day!',
    funFacts: [
      'Apple was started in a garage by Steve Jobs and Steve Wozniak in 1976',
      'The first iPhone was released in 2007 and changed everything!',
      'Apple is one of the most valuable companies in the world',
      'They have over 500 Apple Stores around the globe',
    ],
    whatTheyDo:
      "Apple designs and sells smartphones, computers, tablets, smartwatches, and software. They're famous for making products that are easy to use and look really cool!",
    whyInvest:
      'Apple has millions of loyal customers who love their products. When Apple releases new iPhones or other devices, lots of people want to buy them, which can help the company make more money.',
  },
  RBLX: {
    name: 'Roblox Corporation',
    logo: '🎮',
    description:
      'Roblox is the platform where millions of kids and teens create, play, and share games with friends online!',
    funFacts: [
      'Over 70 million people play Roblox every day!',
      'Players have created more than 40 million games on the platform',
      'You can earn real money by creating popular games on Roblox',
      'Roblox was founded in 2004 but became super popular during the pandemic',
    ],
    whatTheyDo:
      "Roblox provides a platform where users can create their own video games and play games made by others. It's like a giant playground for creativity and gaming!",
    whyInvest:
      'More and more kids are spending time online and playing games. Roblox is growing fast because it lets anyone become a game creator, not just play games.',
  },
  IBIT: {
    name: 'iShares Bitcoin Trust ETF',
    logo: '₿',
    description:
      "This is a special investment that tracks the price of Bitcoin, the world's most famous digital money!",
    funFacts: [
      "Bitcoin was created in 2009 by someone using the name 'Satoshi Nakamoto'",
      "There will only ever be 21 million bitcoins - that's it!",
      "Bitcoin transactions are recorded on something called a 'blockchain'",
      "Some people think Bitcoin is like 'digital gold'",
    ],
    whatTheyDo:
      "This ETF (Exchange Traded Fund) lets you invest in Bitcoin without actually buying Bitcoin directly. It's like a basket that holds Bitcoin for you.",
    whyInvest:
      "Some people believe Bitcoin and other digital currencies are the future of money. This investment gives you exposure to Bitcoin's price movements.",
  },
  ETSY: {
    name: 'Etsy, Inc.',
    logo: '🎨',
    description:
      'Etsy is like a giant online craft fair where creative people sell handmade, vintage, and unique items!',
    funFacts: [
      'Etsy was founded in 2005 in a Brooklyn apartment',
      'Over 90 million people shop on Etsy',
      'More than 5 million creative entrepreneurs sell on Etsy',
      "The name 'Etsy' doesn't mean anything - the founders just liked how it sounded!",
    ],
    whatTheyDo:
      'Etsy runs an online marketplace where artists, crafters, and vintage collectors can sell their unique items to people all over the world.',
    whyInvest:
      'People love buying unique, handmade items instead of mass-produced stuff. Etsy helps creative people turn their hobbies into businesses, and takes a small fee from each sale.',
  },
  SNAP: {
    name: 'Snap Inc.',
    logo: '👻',
    description:
      'Snap created Snapchat, the app where photos and videos disappear after you view them - plus all those fun filters!',
    funFacts: [
      'Snapchat was created by Stanford students in 2011',
      "The original idea was for photos to disappear so people wouldn't be embarrassed later",
      "Snapchat invented the 'Stories' feature that other apps copied",
      'Over 400 million people use Snapchat every day',
    ],
    whatTheyDo:
      "Snap makes Snapchat and other camera-focused apps. They're also working on cool AR (Augmented Reality) technology and even smart glasses!",
    whyInvest:
      'Snapchat is super popular with young people, and companies pay Snap lots of money to show ads to users. As more people use the app, Snap can make more money from advertising.',
  },
};

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

const COMPANY_THEMES: Record<
  string,
  { bg: string; border: string; accent: string }
> = {
  AAPL: {
    bg: 'bg-gradient-to-br from-dreamy-pink to-pink-100',
    border: 'border-dreamy-pink',
    accent: 'bg-dreamy-pink',
  },
  RBLX: {
    bg: 'bg-gradient-to-br from-dreamy-blue to-blue-100',
    border: 'border-dreamy-blue',
    accent: 'bg-dreamy-blue',
  },
  IBIT: {
    bg: 'bg-gradient-to-br from-dreamy-yellow to-yellow-100',
    border: 'border-dreamy-yellow',
    accent: 'bg-dreamy-yellow',
  },
  ETSY: {
    bg: 'bg-gradient-to-br from-magical-purple to-purple-100',
    border: 'border-magical-purple',
    accent: 'bg-magical-purple',
  },
  SNAP: {
    bg: 'bg-gradient-to-br from-sunset-orange to-orange-100',
    border: 'border-sunset-orange',
    accent: 'bg-sunset-orange',
  },
};

export default function StockCard({ symbol, stock }: StockCardProps) {
  const [showModal, setShowModal] = useState(false);
  const company = COMPANY_INFO[symbol];
  const theme = COMPANY_THEMES[symbol] || COMPANY_THEMES.AAPL!;

  if (!company || !stock) return null;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border-4 ${theme.border} ${theme.bg} magical-hover bounce-in p-5 shadow-lg transition-all duration-300`}
      >
        <div className="mb-5 flex flex-col items-center justify-center border-b-2 border-gray-100 pb-4 text-center">
          <div className="mb-2 text-4xl">{company.logo}</div>
          <div>
            <h3 className="mb-1 text-xl text-gray-800">{company.name}</h3>
            <span
              className={`${theme.accent} inline-block rounded-full px-3 py-1 text-sm font-bold text-white shadow-md`}
            >
              {symbol}
            </span>
          </div>
        </div>
        <div className="mb-5 text-center">
          <div className="mb-4 flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800">
              {stock.shares}
            </span>
            <span className="text-base text-gray-500">
              {stock.shares === 1 ? 'share' : 'shares'}
            </span>
          </div>
          <div className="mb-4">
            <span className="mb-1 block text-2xl font-bold text-gray-800">
              {formatCurrency(stock.price)}
            </span>
            <span
              className={`text-base font-bold ${(stock.change || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {stock.change !== null && (stock.change || 0) >= 0 ? '+' : ''}
              {formatCurrency(stock.change)} (
              {stock.change !== null && (stock.change || 0) >= 0 ? '+' : ''}
              {stock.changePercent !== null
                ? stock.changePercent.toFixed(2)
                : '—'}
              %)
            </span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="text-base text-gray-500">Total Value:</span>
            <span className="text-xl font-bold text-gray-800">
              {formatCurrency(stock.totalValue)}
            </span>
          </div>
        </div>
        <button
          className={`w-full cursor-pointer rounded-full border-none ${theme.accent} magical-hover px-6 py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          onClick={() => setShowModal(true)}
        >
          ✨ Learn More
        </button>
      </div>

      {showModal && (
        <CompanyModal
          symbol={symbol}
          company={company}
          stock={stock}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
