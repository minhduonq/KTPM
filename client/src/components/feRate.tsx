

'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';

type Exrate = {
    $: {
        CurrencyCode: string;
        CurrencyName: string;
        Buy: string;
        Transfer: string;
        Sell: string;
    }
};

type FERateData = {
    DateTime: string[];
    Exrate: Exrate[];
    Source: string[];
};

function FERATE() {
    const [ferate_value, setFERate] = useState<FERateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFERate = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fe-rate');
                setFERate(response.data.ExrateList);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
                setError('Error fetching exchange rates: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFERate();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='mt-8'>
            <p className='font-bold border-b border-slate-400'>
                Cập nhật vào: {ferate_value?.DateTime[0]}
            </p>
            <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                <table className='min-w-full bg-white border border-gray-200 mt-4'>
                    <thead>
                        <tr className='bg-gray-200'>
                            <th className='py-2 px-4 border-b'>#</th>
                            <th className='py-2 px-4 border-b'>Currency Code</th>
                            <th className='py-2 px-4 border-b'>Currency Name</th>
                            <th className='py-2 px-4 border-b'>Buy</th>
                            <th className='py-2 px-4 border-b'>Transfer</th>
                            <th className='py-2 px-4 border-b'>Sell</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ferate_value?.Exrate.map((rate, index) => (
                            <tr key={index} className='text-center'>
                                <td className='py-2 px-4 border-b'>{index + 1}</td>
                                <td className='py-2 px-4 border-b'>{rate.$.CurrencyCode}</td>
                                <td className='py-2 px-4 border-b'>{rate.$.CurrencyName}</td>
                                <td className='py-2 px-4 border-b'>{rate.$.Buy}</td>
                                <td className='py-2 px-4 border-b'>{rate.$.Transfer}</td>
                                <td className='py-2 px-4 border-b'>{rate.$.Sell}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className='font-bold mt-4'>SOURCE: {ferate_value?.Source[0]}</p>
        </div>
    );
}

export default FERATE;
