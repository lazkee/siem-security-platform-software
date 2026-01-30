import { SecuirtyMaturityCurrentDTO } from "../../models/security-maturity/SecurityMaturityCurrentDTO";

export default function MaturityKpiGrid({
    data,
}: {data: SecuirtyMaturityCurrentDTO;}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Kpi label="MTTD (min)" value={data.mttdMinutes} />
            <Kpi label="MTTR (min)" value={data.mttrMinutes} />
            <Kpi label="False Alarm Rate" value={`${(data.falseAlarmRate * 100).toFixed(1)}%`} />
            <Kpi label="Open Alerts" value={data.openAlerts} />
        </div>
    );
}

function Kpi({label, value} : {label: string; value: string | number}){
    return (
        <div className="rounded-lg border border-[#282A28] bg-[#1f2123] p-4">
            <div className="rounded-lg border border-[#282A28] bg-[#1f2123] p-4">{label}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    );
}