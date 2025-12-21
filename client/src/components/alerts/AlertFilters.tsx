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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filterRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "12px",
    marginBottom: "16px",
  };

  const searchRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(0, 0, 0, 0.3)",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(0, 0, 0, 0.3)",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
  };

  const searchButtonStyle: React.CSSProperties = {
    padding: "8px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#60cdff",
    color: "#000",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  };

  return (
    <>
      <div style={filterRowStyle}>
        {/* Severity Filter */}
        <select 
          value={severity || ""} 
          onChange={(e) => setSeverity(e.target.value as AlertSeverity || undefined)}
          style={selectStyle}
        >
          <option value="">All Severities</option>
          <option value={AlertSeverity.LOW}>Low</option>
          <option value={AlertSeverity.MEDIUM}>Medium</option>
          <option value={AlertSeverity.HIGH}>High</option>
          <option value={AlertSeverity.CRITICAL}>Critical</option>
        </select>

        {/* Status Filter */}
        <select 
          value={status || ""} 
          onChange={(e) => setStatus(e.target.value as AlertStatus || undefined)}
          style={selectStyle}
        >
          <option value="">All Statuses</option>
          <option value={AlertStatus.ACTIVE}>Active</option>
          <option value={AlertStatus.INVESTIGATING}>Investigating</option>
          <option value={AlertStatus.RESOLVED}>Resolved</option>
          <option value={AlertStatus.DISMISSED}>Dismissed</option>
          <option value={AlertStatus.ESCALATED}>Escalated</option>
        </select>

        {/* Sort By */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
          style={selectStyle}
        >
          <option value="createdAt">Date & Time</option>
          <option value="severity">Severity</option>
          <option value="status">Status</option>
        </select>

        {/* Sort Order */}
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value as any)}
          style={selectStyle}
        >
          <option value="DESC">Descending ⬇</option>
          <option value="ASC">Ascending ⬆</option>
        </select>
      </div>

      <div style={searchRowStyle}>
        <input
          type="text"
          placeholder="Search by source..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          style={searchInputStyle}
        />

        <button 
          onClick={handleSearch}
          style={searchButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#5db9ea";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#60cdff";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          🔍 Search
        </button>
      </div>
    </>
  );
};