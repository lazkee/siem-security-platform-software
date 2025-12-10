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

  const filterStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap"
  };

  return (
    <div style={filterStyle}>
      {/* Severity Filter */}
      <select 
        value={severity || ""} 
        onChange={(e) => setSeverity(e.target.value as AlertSeverity || undefined)}
        style={{ padding: "8px 12px", borderRadius: "8px" }}
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
        style={{ padding: "8px 12px", borderRadius: "8px" }}
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
        style={{ padding: "8px 12px", borderRadius: "8px" }}
      >
        <option value="createdAt">Date & Time</option>
        <option value="severity">Severity</option>
        <option value="status">Status</option>
      </select>

      {/* Sort Order */}
      <select 
        value={sortOrder} 
        onChange={(e) => setSortOrder(e.target.value as any)}
        style={{ padding: "8px 12px", borderRadius: "8px" }}
      >
        <option value="DESC">Descending ⬇</option>
        <option value="ASC">Ascending ⬆</option>
      </select>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by source..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ padding: "8px 12px", borderRadius: "8px", flex: 1, minWidth: "200px" }}
      />

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="btn-accent"
        style={{ padding: "8px 20px" }}
      >
        🔍 Search
      </button>
    </div>
  );
};