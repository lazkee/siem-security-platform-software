type StatCardProps = {
    title: string;
    value?: number;
    valueDescription?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    subtitle?: string;
};

// Inline styles for now, will be in CSS later

const cardBaseStyle: React.CSSProperties = {
    display: "flex",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)",
    color: "#ffffff"
};

const standardCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    alignItems: "center",
    background: "#313338",
    width: "30%"
};

const secondaryCardStyle: React.CSSProperties = {
    ...cardBaseStyle,
    flexDirection: "column",
    alignItems: "flex-start",
    background: "#313338",
    width: "40%"
};

const iconStyle: React.CSSProperties = {
    fontSize: "38px"
};

const textContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column"
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "14px",
    color: "#c5c5c5"
};

const valueStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#ffffff"
};

export default function StatCard({ title, value, valueDescription, icon, iconColor, subtitle }: StatCardProps) {

    if (subtitle) {
        return (
            <div style={secondaryCardStyle}>
                <h3 style={{ fontSize: 14, color: "#c5c5c5", margin: 0 }}>
                    {title}
                </h3>

                <p style={{ fontSize: 20, margin: "-10px 0 0 0", color: "#ffffff" }}>
                    {subtitle}
                </p>

                <p style={{ fontSize: 28, fontWeight: 700, margin: 0, color: "#ffffff" }}>
                    {value}
                    {valueDescription && (
                        <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 6, color: "#c5c5c5" }}>
                            {valueDescription}
                        </span>
                    )}
                </p>
            </div>
        );
    }

    return (
        <div style={standardCardStyle}>
            {icon && (
                <div style={{ ...iconStyle, color: iconColor }}>
                    {icon}
                </div>
            )}

            <div style={textContainerStyle}>
                <h3 style={titleStyle}>{title}</h3>
                <p style={valueStyle}>{value}</p>
            </div>
        </div>
    );
}
