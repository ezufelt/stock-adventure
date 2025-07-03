# 🚀 My Stock Adventure

An engaging, educational web application that teaches kids and teens about stock investing through a colorful, interactive portfolio tracker. Built with Next.js and designed with a playful, child-friendly interface.

![My Stock Adventure](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 Portfolio Tracking
- **Real-time Stock Data**: Live prices and daily changes
- **Portfolio Overview**: Total value, gain/loss tracking, and best performer highlights
- **Individual Stock Cards**: Detailed view of each holding with shares, prices, and performance
- **30-Day Performance Chart**: Interactive Chart.js visualization of price movements

### 🎓 Educational Content
- **Learn About Investing**: Built-in educational section covering basic investing concepts
- **Company Information**: Fun facts and simple explanations about each company
- **Investment Rationale**: Kid-friendly explanations of why each stock was chosen

### 🎨 Child-Friendly Design
- **Playful Color Scheme**: Dreamy pastels (yellows, pinks, blues) with gradient backgrounds
- **Engaging Animations**: Floating elements, sparkles, and magical hover effects
- **Interactive Elements**: Smooth transitions, bounce animations, and hover states
- **Readable Typography**: Comic Sans MS font for accessibility and friendliness

### 📱 Modern Experience
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Fast Loading**: Static site generation for optimal performance
- **Accessible Design**: High contrast and screen reader friendly

## 📈 Portfolio Holdings

The application tracks a diversified educational portfolio:

| Stock | Company | Shares | Purchase Price | Total Investment |
|-------|---------|--------|----------------|------------------|
| 🍎 AAPL | Apple Inc. | 1 | $212.13 | $212.13 |
| 🎮 RBLX | Roblox Corporation | 2 | $102.40 | $204.80 |
| ₿ IBIT | iShares Bitcoin Trust ETF | 3 | $62.26 | $186.78 |
| 🎨 ETSY | Etsy, Inc. | 4 | $53.29 | $213.16 |
| 👻 SNAP | Snap Inc. | 20 | $9.38 | $187.60 |

**Total Investment**: $1,004.47 • **Purchase Date**: July 7, 2025

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.3.4** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.6.0** - Type safety and developer experience

### Styling & UI
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Custom CSS Animations** - Floating, sparkle, and hover effects
- **Responsive Design** - Mobile-first approach

### Data & Visualization
- **Chart.js 4.5.0** - Interactive charts
- **react-chartjs-2 5.3.0** - React wrapper for Chart.js
- **Yahoo Finance API** - Real-time stock data

### Development Tools
- **ESLint 9.0.0** - Code linting with TypeScript support
- **Prettier 3.3.0** - Code formatting
- **Husky & lint-staged** - Git hooks for code quality

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stocks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build static site
npm run build

# The static files will be in the 'out/' directory
# Serve locally to test
npx serve out
```

## 📜 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production static site
- `npm run export` - Build static export (same as build)
- `npm run start` - Start production server (for testing)

### Code Quality
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run prettier` - Format all files with Prettier
- `npm run prettier:check` - Check if files are properly formatted
- `npm run type-check` - Run TypeScript type checking
- `npm run lint:all` - Run all quality checks (types + lint + format)

## 🌐 Deployment

This application is built as a **static site** and can be deployed to any static hosting service:

### Recommended Platforms
- **Vercel** - Optimal for Next.js applications
- **Netlify** - Great for static sites with CI/CD
- **GitHub Pages** - Free hosting for open source projects
- **AWS S3 + CloudFront** - Scalable enterprise solution

### Deployment Steps
1. Run `npm run build` to generate static files
2. Upload the `out/` directory contents to your hosting service
3. Configure your hosting to serve `index.html` for all routes

## 🎯 Target Audience

**Primary**: Children and teenagers (ages 8-16) learning about investing and financial literacy

**Secondary**: Parents and educators teaching financial concepts

### Educational Value
- Introduces stock market concepts in an age-appropriate way
- Teaches portfolio diversification with real companies kids know
- Explains investment rationale in simple, relatable terms
- Provides hands-on experience with financial data visualization

## 🔧 API Integration

The application uses the **Yahoo Finance API** to fetch:
- Current stock prices and daily changes
- 30-day historical price data
- Real-time market information

**Note**: Data is fetched at build time for static generation. If the API is unavailable during build, the application gracefully falls back to placeholder data.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`npm run lint:all`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Stock data provided by Yahoo Finance API
- Chart visualizations powered by Chart.js
- Icons and emojis for educational engagement
- Inspired by the need for better financial education for young people

---

**Built with ❤️ for the next generation of investors**