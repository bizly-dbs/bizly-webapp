import React from 'react';

const TopCard = () => {
  // Sample data for best-selling products with quantities
  const bestSellers = [
    {
      name: 'iPhone 14 Pro',
      quantity: '156 units',
      icon: '📱'
    },
    {
      name: 'MacBook Air M2',
      quantity: '89 units',
      icon: '💻'
    },
    {
      name: 'AirPods Pro',
      quantity: '234 units',
      icon: '🎧'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">Best Seller</h3>
        <div className="flex items-center">
          <button className="text-blue-500 text-xs">Januari</button>
          <span className="ml-1">▼</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {bestSellers.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg">{product.icon}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{product.name}</div>
                <div className="text-xs text-gray-500">Jumlah: {product.quantity}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-blue-500">#{index + 1}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Total Produk Terjual</div>
          <div className="text-sm font-medium text-gray-800">479 units</div>
        </div>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-xs text-blue-500">Top 3 produk bulan ini</span>
        </div>
      </div>
    </div>
  );
};

export default TopCard;
