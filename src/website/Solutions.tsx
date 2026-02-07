import React from 'react';
import {ArrowRight, CandlestickChart, RefreshCcw, Landmark} from 'lucide-react';

const Solutions: React.FC = () => {
  return (
    <section className="bg-background-light relative py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-black md:text-4xl">
            Comprehensive Financial Solutions
          </h2>
          <p className="text-slate-body text-lg">
            Tailored to your needs. Whether you are an active trader, a
            long-term investor, or seeking exclusive banking services.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-card-tint group relative cursor-pointer rounded-2xl p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <CandlestickChart className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-black">Trading</h3>
            <p className="text-slate-body mb-6 leading-relaxed">
              Access competitive pricing on Stocks, ETFs, Options, and Futures.
              Execute trades with our award-winning platform.
            </p>
            <div className="inline-flex items-center text-sm font-bold text-primary transition-all hover:gap-2">
              Discover Trading <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card-tint group relative cursor-pointer rounded-2xl p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <RefreshCcw className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-black">Forex & CFDs</h3>
            <p className="text-slate-body mb-6 leading-relaxed">
              Trade over 80 currency pairs and CFDs with deep liquidity, tight
              spreads, and fast execution speeds.
            </p>
            <div className="inline-flex items-center text-sm font-bold text-primary transition-all hover:gap-2">
              Explore Forex <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card-tint group relative cursor-pointer rounded-2xl p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Landmark className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-black">
              Private Banking
            </h3>
            <p className="text-slate-body mb-6 leading-relaxed">
              Exclusive multi-currency accounts, wealth management advisory, and
              integrated crypto-asset services.
            </p>
            <div className="inline-flex items-center text-sm font-bold text-primary transition-all hover:gap-2">
              Private Banking <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
