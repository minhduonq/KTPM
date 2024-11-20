'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PageVisit {
  visits: number;
  timestamp: string;
}

const FERateVisitsChart = () => {
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/fe-rate-visits');
        setVisits(response.data);
      } catch (error) {
        setError('Error fetching page visits');
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>FE Rate Page Visits</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={visits}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FERateVisitsChart;