'use client'

import {Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid  } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface hourVisit {
  hour: string,
  visitors: number
}


interface MyChartsProps {
  date: string;
  chartData: { hour: string; visitors: number }[];
}

// chartData là chosenChartData và setChartData là tổng các chartData từ db
export default function MyCharts({ date, chartData }: MyChartsProps) {
    const chartConfig = {
      visitors: {
        label: "Visitors",
        color: "#2563eb",
      },
    } satisfies ChartConfig
  
    interface TooltipProps {
      active?: boolean;
      payload?: Array<{ value: number; payload: { hour: string } }>;
    }
  
    const CustomTooltip = ({ active, payload }: TooltipProps) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-2 border rounded shadow">
            <p className="font-medium">Giờ: {payload[0].payload.hour}</p>
            <p className="text-blue-600">
              Lượt truy cập: {payload[0].value}
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="w-full m-auto">
          <Card>
              <CardHeader>
                <CardTitle> Biểu đồ lưu lượng truy cập ngày {date}</CardTitle>
              </CardHeader>
              <CardContent>
                  <ChartContainer config={chartConfig} className="min-h-[300px] h-[400px] w-full">
                      <BarChart 
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                          <XAxis 
                          dataKey="hour" 
                          className="text-sm" 
                          />
                          <YAxis 
                          className="text-sm"
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                          dataKey="visitors"
                          fill="var(--color-visitors)"
                          radius={[4, 4, 0, 0]}
                          className="hover:opacity-80"
                          />
                      </BarChart>
                  </ChartContainer>
              </CardContent>
          </Card>
      </div>
    )
}
