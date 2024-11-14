// pages/index.tsx
'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GoldPrice from "@/components/goldPrice";
import FERATE from "@/components/feRate";
import axios from "axios";

//const Abc = dynamic(() => import('../components/Abc'), { ssr: false });
export default function Home() {
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

  const [showGoldPrice, setShow] = useState(false);
  const [showFERate, setShowFERate] = useState(false);
  let firstClick_gp = true;
  const handleCLick_GP = () => {
    if(!firstClick_gp) {
      return;
    }
    setShow(true);
    firstClick_gp = false;
  }

  let firstClick_fe = true;
  const handleCLick_FE = () => {
    if(!firstClick_fe) {
      return;
    }
    setShowFERate(true);
    firstClick_fe = false;
  }

  return (
    <div className="m-8 flex align-center justify-center gap-x-32">
      <div className="w-96">
        <Button onClick={handleCLick_GP}>Click to Get Gold Price Here</Button>
        {showGoldPrice && <GoldPrice/>}
      </div>
      <div>
        <Button onClick={handleCLick_FE}>Click to Get Foreign Currency Here</Button>
        {showFERate && <FERATE/>}
      </div>
      <div>
        <Button><a href="/monitor">Monitor</a></Button>
      </div>
    </div>
  )
}
