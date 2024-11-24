'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

type GoldPrice = {
  Id: number;
  TypeName: string;
  BranchName: string;
  Buy: string;
  BuyValue: number;
  Sell: string;
  SellValue: number;
  BuyDiffer: string | null;
  BuyDifferValue: number;
  SellDiffer: string | null;
  SellDifferValue: number;
  GroupDate: string;
}

function GoldPrice() {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [latestDate, setLatestDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/gold-price');
        setGoldPrices(response.data.data); // Cập nhật để lấy 'data' từ JSON
        setLatestDate(response.data.latestDate); // Lưu 'latestDate'
      } catch (error: any) {
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
    <div className='px-5' style={{ overflowY: 'auto', maxHeight: 'full' }}>
      <h2 className='text-xl font-bold mb-4'>Gold Price</h2>
      <p className='text-md mb-4 font-bold'>Latest Update: {latestDate}</p> {/* Hiển thị latestDate */}
      <hr className="border-t border-gray-300 mb-4" />
      <table className='min-w-full bg-white border border-gray-200'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='py-2 px-4 border-b'>#</th>
            <th className='py-2 px-4 border-b'>Type</th>
            <th className='py-2 px-4 border-b'>Branch</th>
            <th className='py-2 px-4 border-b'>Buy price</th>
            <th className='py-2 px-4 border-b'>Sell price</th>
          </tr>
        </thead>
        <tbody>
          {goldPrices.map((price, index) => (
            <tr key={price.Id} className='text-center'>
              <td className='py-2 px-4 border-b'>{index + 1}</td>
              <td className='py-2 px-4 border-b'>{price.TypeName}</td>
              <td className='py-2 px-4 border-b'>{price.BranchName}</td>
              <td className='py-2 px-4 border-b'>{price.Buy}</td>
              <td className='py-2 px-4 border-b'>{price.Sell}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GoldPrice;
