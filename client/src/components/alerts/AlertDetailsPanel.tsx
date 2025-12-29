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

  const handleResolve = () => {
    if (!resolvedBy.trim()) {
      alert("Please enter your name");
      return;
    }
    onResolve(alertData.id, resolvedBy);
  };

  const badgeClass = (color: string) =>
    `inline-block px-3 py-1 rounded-lg text-sm font-semibold text-[${color}] bg-[${color}22] border border-[${color}44]`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-[#1f1f1f] rounded-2xl w-[90%] max-w-[700px] max-h-[90vh] overflow-auto border border-[#333] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#2a2a2a] rounded-t-2xl">
          <h2 className="m-0 text-xl">Alert Details</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-white text-2xl p-0 flex items-center"
          >
            <IoClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1">Alert ID</label>
            <div className="text-[#60cdff] font-mono text-sm">#{alertData.id}</div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <div className="text-white text-lg font-semibold">{alertData.title}</div>
          </div>

          {/* Severity & Status */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Severity</label>
              <span className={badgeClass(getSeverityColor(alertData.severity))}>{alertData.severity}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status</label>
              <span className={badgeClass(getStatusColor(alertData.status))}>{alertData.status}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <div className="text-white leading-relaxed">{alertData.description}</div>
          </div>

          {/* Source */}
          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1">Source</label>
            <div className="text-white">{alertData.source}</div>
          </div>

          {/* Correlated Events */}
          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1">
              Correlated Events ({alertData.correlatedEvents.length})
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {alertData.correlatedEvents.map((eventId) => (
                <span
                  key={eventId}
                  className="px-2 py-1 bg-blue-100 border border-blue-200 rounded-md text-xs font-mono text-blue-400"
                >
                  #{eventId}
                </span>
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Created At</label>
              <div className="text-white">{new Date(alertData.createdAt).toLocaleString()}</div>
            </div>
            {alertData.resolvedAt && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resolved At</label>
                <div className="text-white">{new Date(alertData.resolvedAt).toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Resolved By */}
          {alertData.resolvedBy && (
            <div className="mb-5">
              <label className="block text-xs text-gray-400 mb-1">Resolved By</label>
              <div className="text-white">{alertData.resolvedBy}</div>
            </div>
          )}

          {/* Action Section */}
          {alertData.status !== AlertStatus.RESOLVED && alertData.status !== AlertStatus.DISMISSED && (
            <div className="mt-8 pt-5 border-t border-[#333]">
              <h3 className="text-base mb-4">Resolve Alert</h3>
              <input
                type="text"
                placeholder="Your name or email"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                className="w-full px-3 py-2 mb-3 rounded-lg border border-gray-700 bg-[#2a2a2a] text-white text-sm"
              />
              <button
                onClick={handleResolve}
                className="w-full py-3 rounded-lg bg-green-400 text-black font-semibold text-base"
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
