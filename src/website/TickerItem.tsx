import React from 'react';

const TickerItem: React.FC<{
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}> = ({name, value, change, isPositive}) => (
  <div className="inline-flex items-center px-8 text-sm font-medium">
    <span className="text-gray-400 mr-2">{name}</span>
    <span className="font-bold text-white">{value}</span>
    <span
      className={`ml-2 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}
    >
      {isPositive ? '▲' : '▼'} {change}
    </span>
  </div>
);

const Ticker: React.FC = () => {
  const items = [
    {name: 'USD/CHF', value: '0.9200', change: '0.02%', isPositive: true},
    {name: 'EUR/USD', value: '1.0800', change: '-0.01%', isPositive: false},
    {name: 'SMI', value: '11,200.50', change: '1.2%', isPositive: true},
    {name: 'Gold', value: '1,950.00', change: '0.5%', isPositive: true},
    {name: 'S&P 500', value: '4,450.30', change: '0.45%', isPositive: true},
    {name: 'NASDAQ', value: '14,890.10', change: '0.88%', isPositive: true},
  ];

  // Duplicate items to ensure seamless loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="bg-navy w-full overflow-hidden border-b border-white/10">
      <div className="animate-ticker flex whitespace-nowrap py-2">
        {displayItems.map((item, index) => (
          <TickerItem key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Ticker;
