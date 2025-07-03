'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PortfolioData } from '../lib/stockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PortfolioChartProps {
  portfolioData: PortfolioData;
  altText: string;
}

const CHART_COLORS: Record<string, string> = {
  AAPL: '#FFB3E6', // dreamy pink
  RBLX: '#B3E5FC', // dreamy blue
  IBIT: '#FFB74D', // sunset orange
  ETSY: '#A5D6A7', // mint green
  SNAP: '#FFF9C4', // dreamy yellow
};

function generateDateLabels(): string[] {
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

export default function PortfolioChart({
  portfolioData,
  altText,
}: PortfolioChartProps) {
  if (!portfolioData || Object.keys(portfolioData).length === 0) {
    return <div>Loading chart...</div>;
  }

  const hasData = Object.values(portfolioData).some(
    stock => stock.priceHistory && stock.priceHistory.length > 0
  );

  if (!hasData) {
    return <div>Chart data unavailable</div>;
  }

  const dateLabels = generateDateLabels();

  const datasets = Object.entries(portfolioData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([symbol, stock]) => ({
      label: `${symbol}`,
      data: stock.priceHistory || [],
      borderColor: CHART_COLORS[symbol] || '#999',
      backgroundColor: (CHART_COLORS[symbol] || '#999') + '20',
      borderWidth: 4,
      fill: false,
      tension: 0.3,
      pointRadius: 2,
      pointHoverRadius: 8,
      pointBackgroundColor: CHART_COLORS[symbol] || '#999',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: CHART_COLORS[symbol] || '#999',
      pointHoverBorderWidth: 3,
    }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Stock Price Performance - Last 30 Days',
        font: {
          size: 16,
          family: 'Comic Sans MS, cursive, sans-serif',
        },
      },
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Comic Sans MS, cursive, sans-serif',
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2C3E50',
        bodyColor: '#2C3E50',
        borderColor: '#FFB3E6',
        borderWidth: 3,
        cornerRadius: 10,
        titleFont: {
          family: 'Comic Sans MS, cursive, sans-serif',
        },
        bodyFont: {
          family: 'Comic Sans MS, cursive, sans-serif',
        },
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            family: 'Comic Sans MS, cursive, sans-serif',
          },
        },
        ticks: {
          font: {
            family: 'Comic Sans MS, cursive, sans-serif',
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price ($)',
          font: {
            family: 'Comic Sans MS, cursive, sans-serif',
          },
        },
        ticks: {
          font: {
            family: 'Comic Sans MS, cursive, sans-serif',
          },
          callback: function (value: any) {
            return '$' + value.toFixed(2);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const data = {
    labels: dateLabels,
    datasets: datasets,
  };

  return <Line data={data} options={options} aria-label={altText} />;
}
