import { SecuirtyMaturityCurrentDTO } from "../../models/security-maturity/SecurityMaturityCurrentDTO";

export default function MaturityKpiGrid({
    data,
}: {data: SecuirtyMaturityCurrentDTO;}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[220px]" style={{marginTop: "30px", marginBottom: "30px"}}>
            <h3 className="text-sm uppercase tracking-widest text-gray-400">
                Security Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4 w-full">
                <Kpi label="MTTD (min)" value={data.mttdMinutes.toFixed(2)} />
                <Kpi label="MTTR (min)" value={data.mttrMinutes.toFixed(2)} />
                <Kpi label="False Alarm Rate" value={`${(data.falseAlarmRate * 100).toFixed(1)}%`} />
                <Kpi label="Open Alerts" value={data.openAlerts} />
            </div>
        </div>
    );
}

function Kpi({label, value} : {label: string; value: string | number}){
    return (
        <div className="m-1! rounded-lg border border-[#282A28] bg-[#1f2123] p-2! min-h-[115px] flex items-center justify-center">
            <div className="text-center">
                <div className="text-xl uppercase tracking-widest text-gray-400 mb-3">
                    {label}
                </div>
                <div className="text-4xl font-bold">
                    {value}
                </div>
            </div>
        </div>
    );
}