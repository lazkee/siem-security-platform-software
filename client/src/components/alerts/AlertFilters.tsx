import React, { useState } from "react";
import { AlertSeverity } from "../../enums/AlertSeverity";
import { AlertStatus } from "../../enums/AlertStatus";
import { AlertQueryDTO } from "../../models/alerts/AlertQueryDTO";

interface AlertFiltersProps {
  onSearch: (query: AlertQueryDTO) => void;
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [severity, setSeverity] = useState<AlertSeverity | undefined>();
  const [status, setStatus] = useState<AlertStatus | undefined>();
  const [sortBy, setSortBy] = useState<'createdAt' | 'severity' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const handleSearch = () => {
    const query: AlertQueryDTO = {
      severity,
      status,
      source: searchText || undefined,
      sortBy,
      sortOrder,
      page: 1,
      limit: 10
    };
    onSearch(query);
  };

  const handleReset = () => {
    setSearchText("");
    setSeverity(undefined);
    setStatus(undefined);
    setSortBy('createdAt');
    setSortOrder('DESC');
    onSearch({ page: 1, limit: 10 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const inputClass = "flex-1 px-1 h-10 rounded-xl border border-white/20 bg-black/30 text-white text-[10px] outline-none";
  const selectClass = "w-full px-1 h-10 rounded-xl border border-white/20 bg-black/30 text-white text-[10px] outline-none";
  const buttonClass = "flex-1 px-2 h-10 bg-[#007a55] hover:opacity-90 text-white font-semibold rounded-xl flex items-center justify-center gap-0.5 transition-all";

  return (
    <div className="mb-6">
      <div className="grid grid-cols-12 gap-3 mb-3">
        {/* Severity */}
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Severity</label>
          <select value={severity || ""} onChange={(e) => setSeverity(e.target.value as AlertSeverity || undefined)} className={selectClass}>
            <option value="">All</option>
            <option value={AlertSeverity.LOW}>Low</option>
            <option value={AlertSeverity.MEDIUM}>Medium</option>
            <option value={AlertSeverity.HIGH}>High</option>
            <option value={AlertSeverity.CRITICAL}>Critical</option>
          </select>
        </div>

        {/* Status */}
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Status</label>
          <select value={status || ""} onChange={(e) => setStatus(e.target.value as AlertStatus || undefined)} className={selectClass}>
            <option value="">All</option>
            <option value={AlertStatus.ACTIVE}>Active</option>
            <option value={AlertStatus.INVESTIGATING}>Investigating</option>
            <option value={AlertStatus.RESOLVED}>Resolved</option>
            <option value={AlertStatus.DISMISSED}>Dismissed</option>
            <option value={AlertStatus.ESCALATED}>Escalated</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={selectClass}>
            <option value="createdAt">Date & Time</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="col-span-2">
          <label className="block text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Order</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className={selectClass}>
            <option value="DESC">Newest First ↓</option>
            <option value="ASC">Oldest First ↑</option>
          </select>
        </div>

        {/* Search Input + Buttons */}
        <div className="col-span-4">
          <label className="block text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-semibold">Search Source</label>
          <div className="flex gap-2 w-full">
            <input type="text" placeholder="Search by..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyPress={handleKeyPress} className={inputClass} />
            <button onClick={handleSearch} className={buttonClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
              </svg>
              Search
            </button>
            <button onClick={handleReset} className={buttonClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Prazan red za razmak ispod filtera */}
      <div className="h-4"></div>
    </div>
  );
};
