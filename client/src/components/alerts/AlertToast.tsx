import { useEffect, useState } from "react";
import { PiWarningOctagonFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { getSeverityColor } from "../../helpers/alertColorHelpers";
import { AlertToastProps } from "../../types/props/alerts/AlertToastProps";

export default function AlertToast({ alert, onClose, onViewDetails }: AlertToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = (100 / duration) * interval;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - step;
        if (newProgress <= 0) {
          clearInterval(progressTimer);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [onClose]);

  const severityColor = getSeverityColor(alert.severity);

  const badgeClass = `inline-block px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wide`;
  
  return (
    <>
      <style>
        {`
          @keyframes slideInFromRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div
        className="fixed top-5 right-5 min-w-[350px] max-w-[450px] rounded-lg shadow-lg z-[9999] overflow-hidden animate-[slideInFromRight_0.3s_ease-out]"
        style={{ background: "#1f1f1f", border: `2px solid ${severityColor}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderBottomColor: `${severityColor}44` }}
        >
          <div className="flex items-center gap-3 flex-1">
            <PiWarningOctagonFill size={24} color={severityColor} />
            <h4 className="text-white text-base font-semibold m-0 flex-1">New Security Alert</h4>
            <span
              className={`${badgeClass}`}
              style={{
                background: `${severityColor}22`,
                color: severityColor,
                border: `1px solid ${severityColor}44`,
              }}
            >
              {alert.severity}
            </span>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
            className="bg-transparent border-none cursor-pointer text-white text-xl p-1 flex items-center opacity-70 transition-opacity"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="text-gray-300 text-sm mb-3">
            <strong>{alert.title}</strong>
          </div>

          <div className="flex gap-4 text-xs text-gray-400 mb-3">
            <div>
              <strong>Source:</strong> {alert.source}
            </div>
            <div>
              <strong>Time:</strong>{" "}
              {new Date(alert.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(alert.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${severityColor}33`;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${severityColor}22`;
                e.currentTarget.style.transform = "translateY(0)";
              }}
              className="w-full py-2 rounded-md text-sm font-semibold cursor-pointer transition-all"
              style={{
                border: `1px solid ${severityColor}`,
                background: `${severityColor}22`,
                color: severityColor,
              }}
            >
               View Details
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px]"
          style={{
            width: `${progress}%`,
            background: severityColor,
            transition: "width 0.05s linear",
          }}
        ></div>
      </div>
    </>
  );
}