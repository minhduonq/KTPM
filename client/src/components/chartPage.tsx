import MyCharts from "@/components/visitorChart"
import TotalVisitors from "@/components/totalVisitors"
import TotalVisitorsPerDay from "@/components/totalVisitPerDay"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {database} from '../config/db'
import { ref, onValue } from "firebase/database";

interface hourVisit {
    hour: string,
    visitors: number
}


export default function ChartPage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [dates, setDates] = useState<string[]>([]);
    const [chartData, setChartData] = useState<hourVisit[][]>([]); 
    const [countVisitPerDay, setVisitPerDay] = useState<number[]>([])
    const [totalVisit, setTotalVisit] = useState(0);
    useEffect(() => {
        const dataRef = ref( database, '/');
        const unsubscribe = onValue(dataRef, (snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.val();
                // đưa visitData về đúng dạng như lấy từ api
                const visitData = Object.keys(data).map(date => {
                    const hourlyData = Object.keys(data[date]).map(hour => ({
                      hour: hour,
                      visitors: data[date][hour].visitors
                    }));
                    return { date: date, hourlyData: hourlyData };
                });
                // set giá trị mới cho chartData
                const tmp_dates = visitData.map((visit: any) => visit.date);
                setDates(tmp_dates);

                let tmpChartData = [];
                let tmpCountVisitPerDay = []; 
                let tmp_totalVisit = 0;
                for(let i = 0 ; i < visitData.length; i++) {
                    let hourlyData = []
                    let tmp_countvisit = 0;
                    for(let y= 0; y< visitData[i].hourlyData.length; y++) {
                        hourlyData.push(visitData[i].hourlyData[y]);
                        tmp_countvisit += hourlyData[y].visitors;
                    }
                    tmpChartData.push(hourlyData);
                    tmpCountVisitPerDay.push(tmp_countvisit);
                    tmp_totalVisit += tmp_countvisit;
                }
                setChartData(tmpChartData)
                setVisitPerDay(tmpCountVisitPerDay);
                setTotalVisit(tmp_totalVisit);
            } 
        })
        // Cleanup listener khi component bị unmount
        return () => unsubscribe();
    }, [])
 
    const handleDateClick = (index:number) => {
        setCurrentIndex(index)
    }
   
    return(
        <div className="flex gap-x-10 p-10">
            <div className="h-[400px]">
                <ScrollArea>
                    <Card>
                        <CardHeader>
                            <CardTitle>DATES:</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dates.map((d, index) => (
                                <div key={index} className="mb-3">
                                    <Button disabled={dates[index] === dates[currentIndex]} onClick={() => handleDateClick(index)}>{d}</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </ScrollArea>
            </div>
            <div className="flex flex-col gap-y-2 w-full">
                <div className="flex gap-x-10">
                    <TotalVisitors visitors={totalVisit} />
                    <TotalVisitorsPerDay visitors={countVisitPerDay[currentIndex]} date={dates[currentIndex]} />
                </div>
                <MyCharts date = {dates[currentIndex]} chartData = {chartData[currentIndex]}></MyCharts>
            </div>
           
        </div>
    )    
}