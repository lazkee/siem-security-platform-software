import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SecurityMaturityTrendDTO } from "../../models/security-maturity/SecurityMaturityTrendDTO";

interface Props{
    data: SecurityMaturityTrendDTO[];
}

export default function SecurityMaturityTrend({data}: Props){
    return (
        <div className="w-full rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-6 mt-5">
            <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />

                        <XAxis dataKey="bucketStart" tickFormatter={(v) => v.slice(5, 7)} stroke="#9ca3af" />
                        <YAxis domain={[0, 100]} stroke="#9ca3af" tickFormatter={(v) => `${v}`} />

                        <Tooltip contentStyle={{
                            backgroundColor: "#1f2123",
                            border: "1px solid #292a28",
                            color: "#fff",
                        }}
                        labelFormatter={(label) => `Period: ${label}`}
                        formatter={(value) => [`Score: ${value}`, ""]} />

                        <Line 
                            type="monotone"
                            dataKey="value"
                            stroke="#007a55"
                            strokeWidth={3}
                            dot={{r: 4}}
                            activeDot={{r: 6}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}