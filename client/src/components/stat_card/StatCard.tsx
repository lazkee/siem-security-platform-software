type StatCardProps = {
    title: string;
    value?: number | string;
    valueDescription?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    subtitle?: string;
};

export default function StatCard({ title, value, valueDescription, icon, iconColor, subtitle }: StatCardProps) {

    if (subtitle) {
        return (
            <div className="flex flex-col items-start bg-[#313338] w-[40%] gap-4 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-white p-3!">
                <h3 className="text-[14px] text-[#c5c5c5] m-0">
                    {title}
                </h3>

                <p className="text-[18px] -mt-2 text-white">
                    {subtitle}
                </p>

                <p className="text-[28px] font-bold text-white">
                    {value}
                    {valueDescription && (
                        <span className="text-[18px] font-normal text-[#c5c5c5] ml-1.5!">
                            {valueDescription}
                        </span>
                    )}
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 rounded-[10px] bg-[#313338] flex-1 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] p-4!">
            {icon && (
                <div style={{ color: iconColor }} className="text-[38px]">
                    {icon}
                </div>
            )}

            <div className="flex flex-col">
                <h3 className="m-0 text-[14px] text-[#c5c5c5]">{title}</h3>
                <p className="text-[28px] font-bold text-white">
                    {value}
                    {valueDescription && (
                        <span className="text-[18px] font-normal text-[#c5c5c5] ml-1.5!">
                            {valueDescription}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}
