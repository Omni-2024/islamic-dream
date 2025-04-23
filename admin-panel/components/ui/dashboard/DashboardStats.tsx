import {IRevenueData} from "@/components/ui/dashboard/useDashboardData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export const DashboardStats = ({ revenueData }:{revenueData:IRevenueData}) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
            { title: "Total Sessions", value: revenueData.totalMeetings, bg: "" },
            { title: "Completed Sessions", value: revenueData.completedMeetings, bg: "#C1E1C1" },
            { title: "Cancelled Sessions", value: revenueData.cancelledMeetings, bg: "#FF6961" },
            { title: "Total Revenue", value: `£${revenueData.revenue.toFixed(2)}`, bg: "#A1D6B2" }
        ].map(({ title, value, bg }) => (
            <Card key={title} style={{ border: `2px solid ${bg}` }}>
                <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">{value}</p></CardContent>
            </Card>
        ))}
    </div>
);