'use client'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type TotalVisitorsProps = {
    visitors: number;
    date: string,
};

export default function TotalVisitorsPerDay({ visitors, date }: TotalVisitorsProps) {
    return (
        <div className="w-1/2">
            <Card className="">
                <CardHeader>
                    <CardTitle><p className="font-semibold">Total amount of visitors in {date}: <span className="text-2xl text-emerald-500">{visitors}</span></p></CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}