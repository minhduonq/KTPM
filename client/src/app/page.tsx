// client/src/pages/index.tsx
'use client';
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  let isSent = false;
  useEffect(() => {
    const trackVisit = async () => {
      if(!isSent) {
        isSent = true;
        try {
          const response = await axios.get('http://localhost:3003/monitor/visit-tracking', {
            withCredentials: true, // Đảm bảo cookies được gửi và nhận với request
          });
          console.log('Response:', response.data);
          console.log('Cookies:', document.cookie);
        } catch (error) {
          console.error('Error tracking visit:', error);
        }
      }
    };

    trackVisit();
  }, []);
 
  return (
    <div className="m-8">
      <h1>Welcome to the Financial Dashboard</h1>
      <nav className="mb-8">
        <ul>
          <li>
            <Link href="/dashboard" className="underline text-emerald-500">Go to Dashboard</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
