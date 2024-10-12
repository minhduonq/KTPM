'use client'
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
    const [loading, setloading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFERate = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fe-rate');
                setFERate(response.data.ExrateList);
                setloading(false)
            } catch (error) {
                console.error('Error fetching gold price:', error);
                setError('Error fecthing gold price: ' + error.message);
                setloading(false);
            }
        }

        fetchFERate();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='mt-8'>
            <p className='font-bold border-b border-slate-400'>Cập nhật vào: {ferate_value.DateTime[0]}</p>
            {ferate_value.Exrate.map((rate, index) => (
                <div className='mt-4 border-b-2 border-slate-700'>
                    <p className='font-semibold'>Currency: {index + 1}</p> 
                    <p>Currency Code: {rate.$.CurrencyCode}</p>
                    <p>Currency Name:{rate.$.CurrencyName}</p>
                    <p>Currency Buy:{rate.$.Buy}</p>
                    <p>Currency Transfer {rate.$.Transfer}</p>
                    <p>Currency Sell{rate.$.Sell}</p>
                </div>
            ))}
            <p className='font-bold mt-4'>SOURCE: {ferate_value.Source}</p>
        </div>
    )
}

export default FERATE;