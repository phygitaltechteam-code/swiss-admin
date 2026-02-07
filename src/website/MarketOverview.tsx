import React from 'react';
import {ArrowRight, TrendingUp, Flag, LineChart} from 'lucide-react';

const MarketOverview: React.FC = () => {
  return (
    <section className="border-gray-200 border-y bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-black">Market Overview</h2>
            <p className="text-slate-body mt-1 text-sm">
              Real-time performance of key global indices
            </p>
          </div>
          <a
            href="#"
            className="hover:text-primary-dark group flex items-center gap-1 text-sm font-medium text-primary"
          >
            View all markets
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Cards Grid */}
        <div className="bg-orange-150 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* S&P 500 Card */}
          <div className="bg-card-tint rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-black">S&P 500</span>
                </div>
              </div>
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                +0.45%
              </span>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-black">
                4,450.30
              </span>
              <span className="text-gray-400 text-sm">USD</span>
            </div>
            <div className="h-16 w-full">
              <svg
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <defs>
                  <linearGradient id="gradient-sp" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F57F3D" />
                    <stop offset="100%" stopColor="#F57F3D" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 35 L 10 32 L 20 36 L 30 25 L 40 28 L 50 15 L 60 18 L 70 10 L 80 12 L 90 5 L 100 0"
                  fill="none"
                  stroke="#F57F3D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path
                  d="M0 35 L 10 32 L 20 36 L 30 25 L 40 28 L 50 15 L 60 18 L 70 10 L 80 12 L 90 5 L 100 0 V 40 H 0 Z"
                  fill="url(#gradient-sp)"
                  opacity="0.1"
                ></path>
              </svg>
            </div>
          </div>

          {/* SMI Card */}
          <div className="bg-card-tint rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Flag className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-black">SMI</span>
                </div>
              </div>
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                +1.12%
              </span>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-black">
                11,150.20
              </span>
              <span className="text-gray-400 text-sm">CHF</span>
            </div>
            <div className="h-16 w-full">
              <svg
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0 30 L 15 35 L 30 20 L 45 25 L 60 10 L 75 15 L 100 5"
                  fill="none"
                  stroke="#F57F3D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path
                  d="M0 30 L 15 35 L 30 20 L 45 25 L 60 10 L 75 15 L 100 5 V 40 H 0 Z"
                  fill="url(#gradient-sp)"
                  opacity="0.1"
                ></path>
              </svg>
            </div>
          </div>

          {/* NASDAQ Card */}
          <div className="bg-card-tint bshadow-sm rounded-xl p-6 transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <LineChart className="h-4 w-4" />
                  </span>
                  <span className="font-bold text-black">NASDAQ</span>
                </div>
              </div>
              <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                +0.88%
              </span>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-black">
                14,890.10
              </span>
              <span className="text-gray-400 text-sm">USD</span>
            </div>
            <div className="h-16 w-full">
              <svg
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0 38 L 12 30 L 25 32 L 38 20 L 50 24 L 62 15 L 75 18 L 88 8 L 100 2"
                  fill="none"
                  stroke="#F57F3D"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path
                  d="M0 38 L 12 30 L 25 32 L 38 20 L 50 24 L 62 15 L 75 18 L 88 8 L 100 2 V 40 H 0 Z"
                  fill="url(#gradient-sp)"
                  opacity="0.1"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
