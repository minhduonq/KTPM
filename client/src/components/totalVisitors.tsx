'use client'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type TotalVisitorsProps = {
    visitors: number;
};

export default function TotalVisitors({ visitors }: TotalVisitorsProps) {
    return (
        <div className="w-1/2">
            <Card>
                <CardHeader>
                    <CardTitle><p className="font-semibold">Total amount of visitors: <span className="text-2xl text-emerald-500">{visitors}</span></p></CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}