import React from 'react';

interface TickerItemProps {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const TickerItem: React.FC<TickerItemProps> = ({
  symbol,
  price,
  change,
  isPositive,
}) => (
  <div className="flex min-w-max items-center space-x-2 border-r border-white/10 px-6 last:border-0">
    <span className="text-gray-400 font-medium">{symbol}</span>
    <span className="font-bold text-white">{price}</span>
    <span
      className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
    >
      {isPositive ? '▲' : '▼'} {change}
    </span>
  </div>
);

const Ticker: React.FC = () => {
  const items = [
    {symbol: 'USD/CHF', price: '0.9200', change: '0.02%', isPositive: true},
    {symbol: 'EUR/USD', price: '1.0800', change: '-0.01%', isPositive: false},
    {symbol: 'SMI', price: '11,200.50', change: '1.2%', isPositive: true},
    {symbol: 'Gold', price: '1,950.00', change: '0.5%', isPositive: true},
    {symbol: 'S&P 500', price: '4,450.30', change: '0.45%', isPositive: true},
    {symbol: 'NASDAQ', price: '14,890.10', change: '0.88%', isPositive: true},
  ];

  return (
    <div className="overflow-hidden border-b border-white/10 bg-secondary py-2 text-white">
      <div className="animate-marquee flex whitespace-nowrap">
        <div className="flex items-center">
          {items.map((item, index) => (
            <TickerItem key={`a-${index}`} {...item} />
          ))}
        </div>
        <div className="flex items-center" aria-hidden="true">
          {items.map((item, index) => (
            <TickerItem key={`b-${index}`} {...item} />
          ))}
        </div>
        <div className="flex items-center" aria-hidden="true">
          {items.map((item, index) => (
            <TickerItem key={`c-${index}`} {...item} />
          ))}
        </div>
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Ticker;
