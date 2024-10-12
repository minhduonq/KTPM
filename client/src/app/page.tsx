// pages/index.tsx
'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GoldPrice from "@/components/goldPrice";
import FERATE from "@/components/feRate";
import { log } from "console";

//const Abc = dynamic(() => import('../components/Abc'), { ssr: false });
export default function Home() {
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
    </div>
  )
}
