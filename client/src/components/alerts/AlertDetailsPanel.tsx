import { useState } from "react";
import { AlertStatus } from "../../enums/AlertStatus";
import { IoClose } from "react-icons/io5";
import { getSeverityColor, getStatusColor } from "../../helpers/alertColorHelpers";
import { AlertDetailsPanelProps } from "../../types/props/alerts/AlertDetailsPanelProps";

export default function AlertDetailsPanel({
  alert: alertData,
  onClose,
  onResolve
}: AlertDetailsPanelProps) {
  const [resolvedBy, setResolvedBy] = useState("");
  const [markedFalse, setMarkedFalse] = useState(false);

  const handleResolve = () => {
    if (!resolvedBy.trim()) {
      alert("Please enter your name");
      return;
    }
    onResolve(alertData.id, resolvedBy, markedFalse);
  };

  const badgeClass = (color: string) =>
    `inline-block px-3 py-1 text-sm font-semibold text-[${color}] `;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-[#1f1f1f]  rounded-2xl w-[90%] max-w-[700px] max-h-[100vh]! overflow-auto border border-[#333] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#2a2a2a] rounded-t-2xl">
          <div></div>
          <h2 className="m-0 text-xl">Alert Details</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-white text-2xl p-0 flex items-center"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-3! gap-2!">
          <div className="mb-5">
            <label className="block text-base text-gray-400 mb-1">Alert ID</label>
            <div className="text-white font-mono text-m">#{alertData.id}</div>
          </div>

          <div className="mb-5">
            <label className="block text-base text-gray-400 mb-1">Title</label>
            <div className="text-white text-m font-semibold">{alertData.title}</div>
          </div>

          {/* Severity & Status */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-base text-gray-400 mb-1">Severity</label>
              <span className={badgeClass(getSeverityColor(alertData.severity))}>{alertData.severity}</span>
            </div>
            <div>
              <label className="block text-base text-gray-400 mb-1">Status</label>
              <span className={badgeClass(getStatusColor(alertData.status))}>{alertData.status}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-base text-gray-400 mb-1">Description</label>
            <div className="text-white text-m leading-relaxed">{alertData.description}</div>
          </div>

          {/* Source */}
          <div className="mb-5">
            <label className="block text-base text-gray-400 mb-1">Source</label>
            <div className="text-white text-m">{alertData.source}</div>
          </div>

          {/* Correlated Events */}
          <div className="mb-5">
            <label className="block text-base text-gray-400 mb-1">
              Correlated Events ({alertData.correlatedEvents.length})
            </label>
            <div className="flex flex-col gap-2 mt-2">
              {alertData.correlatedEvents.map((e) => (
                <span
                  key={e}
                  className="px-2 py-1 bg-transparent  text-m font-mono text-white"
                >
                  #{JSON.stringify(e)}
                </span>
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-base text-gray-400 mb-1">Created At</label>
              <div className="text-white text-m">{new Date(alertData.createdAt).toLocaleString()}</div>
            </div>
            {alertData.resolvedAt && (
              <div>
                <label className="block text-base text-gray-400 mb-1">Resolved At</label>
                <div className="text-white text-m">{new Date(alertData.resolvedAt).toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Resolved By */}
          {alertData.resolvedBy && (
            <div className="mb-5">
              <label className="block text-base text-gray-400 mb-1">Resolved By</label>
              <div className="text-white text-m">{alertData.resolvedBy}</div>
            </div>
          )}

          {/* Action Section */}
          {alertData.status !== AlertStatus.RESOLVED &&
            alertData.status !== AlertStatus.DISMISSED &&
            alertData.status !== AlertStatus.MARKED_FALSE && (
              <div className="mt-2! pt-5 border-t border-[#333]">
                <h3 className="mt-2! text-base text-center! mb-4">Resolve Alert</h3>
                <input
                  type="text"
                  placeholder="Your name or email"
                  value={resolvedBy}
                  onChange={(e) => setResolvedBy(e.target.value)}
                  className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-700 bg-[#2a2a2a] text-white text-sm"
                />

                <label className="flex items-center gap-3 text-sm text-gray-300 !my-3 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={markedFalse}
                    onChange={(e) => setMarkedFalse(e.target.checked)}
                    className="sr-only"
                  />

                  <span
                    className={[
                      "w-5 h-5 rounded-md border",
                      "bg-[#2a2a2a] border-gray-700",
                      "flex items-center justify-center",
                      "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]",
                      "transition-all duration-150",
                      markedFalse ? "bg-[#007a55] border-[#007a55]" : ""
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {markedFalse && (
                      <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-white">
                        <path
                          fill="currentColor"
                          d="M7.7 13.3 4.9 10.5l-1.1 1.1 3.9 3.9L16.2 7l-1.1-1.1z"
                        />
                      </svg>
                    )}
                  </span>

                  <span className="leading-none">Mark False</span>
                </label>

                <button
                  onClick={handleResolve}
                  className="w-full mt-2! py-3 rounded-lg bg-[#007a55] text-white font-semibold text-base"
                >
                  ✓ Resolve Alert
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
