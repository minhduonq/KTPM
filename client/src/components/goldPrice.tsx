

'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

type GoldPrice = {
  buy: string;
  sell: string;
  type: string;
}

function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/gold-price');
        setGoldPrices(response.data);
      } catch (error) {
        console.error('Error fetching gold price:', error);
        setError('Error fetching gold price: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    // <div className='mt-8 w-full'>
    <div style={{ overflowY: 'auto', maxHeight: 'full' }}>
      <h2 className='text-xl font-bold mb-4'>Giá Vàng hôm nay</h2>
      <table className='min-w-full bg-white border border-gray-200'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='py-2 px-4 border-b'>TT</th>
            <th className='py-2 px-4 border-b'>Loại</th>
            <th className='py-2 px-4 border-b'>Giá mua</th>
            <th className='py-2 px-4 border-b'>Giá bán</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((price, index) => (
            <tr key={index} className='text-center'>
              <td className='py-2 px-4 border-b'>{index + 1}</td>
              <td className='py-2 px-4 border-b'>{price.type}</td>
              <td className='py-2 px-4 border-b'>{price.buy}</td>
              <td className='py-2 px-4 border-b'>{price.sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    // </div>
  );
}

export default GoldPrice;
