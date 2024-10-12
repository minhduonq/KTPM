// components/GoldPrice.tsx
'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';

type goldprice = {
  buy: string;
  sell: string;
  type: String;
}

function GoldPrice() {
  const [goldPrice, setGoldPrice] = useState<goldprice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/gold-price');
        setGoldPrice(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gold price:', error);
        setError('Error fecthing gold price: ' + error.message);
        setLoading(false);
      }
    };

    fetchGoldPrice();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className='mt-8'>
      <div className=' w-96'>
        {goldPrice.map((price, index) => (
          <div className='mt-2 w-full'>
            <p className='border-b-2 border-slate-300 font-bold'>{index + 1}</p>
            <p>Type: {price.type}</p>
            <p>Buy: {price.buy}</p>
            <p>Sell: {price.sell}</p>
          </div>
        ))}
        </div> 
    </div>
  );
}

export default GoldPrice;