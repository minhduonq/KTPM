// client/src/pages/index.tsx
'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GoldPrice from "@/components/goldPrice";
import FERATE from "@/components/feRate";
import Link from 'next/link';

export default function HomePage() {
    const [showGoldPrice, setShow] = useState(false);
    const [showFERate, setShowFERate] = useState(false);

    const handleCLick_GP = () => {
        setShow(true);
    }

    const handleCLick_FE = () => {
        setShowFERate(true);
    }

    return (
        <div className="m-8">
            <h1>Welcome to the Financial Dashboard</h1>
            <nav className="mb-8">
                <ul>
                    <li>
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </li>
                </ul>
            </nav>
            <div className="flex align-center justify-center gap-x-32">
                <div className="w-96">
                    <Button onClick={handleCLick_GP}>Click to Get Gold Price Here</Button>
                    {showGoldPrice && <GoldPrice />}
                </div>
                <div>
                    <Button onClick={handleCLick_FE}>Click to Get Foreign Currency Here</Button>
                    {showFERate && <FERATE />}
                </div>
            </div>
        </div>
    );
}
