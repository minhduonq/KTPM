import React from 'react';
import Link from 'next/link';

function HomePage() {
    return (
        <div>
            <h1>Welcome to the Financial Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/ferate">Foreign Exchange Rates</Link>
                    </li>
                    <li>
                        <Link href="/goldprice">Gold Price</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default HomePage;