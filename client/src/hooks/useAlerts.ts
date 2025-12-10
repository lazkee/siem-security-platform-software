import { useState, useEffect } from "react";
import { AlertDTO } from "../models/alerts/AlertDTO";
import { AlertQueryDTO } from "../models/alerts/AlertQueryDTO";
import { IAlertAPI } from "../api/alerts/IAlertAPI";
import { useAuth } from "./useAuthHook";

export const useAlerts = (alertAPI: IAlertAPI) => {
  const { token } = useAuth();
  const [alerts, setAlerts] = useState<AlertDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch all alerts
  const fetchAlerts = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await alertAPI.getAllAlerts(token);
      setAlerts(data);
    } catch (err) {
      setError("Failed to fetch alerts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search with filters and pagination
  const searchAlerts = async (query: AlertQueryDTO) => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await alertAPI.searchAlerts(query, token);
      setAlerts(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError("Failed to search alerts");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Resolve alert
  const resolveAlert = async (id: number, resolvedBy: string, status: string) => {
    if (!token) return;
    
    try {
      await alertAPI.resolveAlert(id, resolvedBy, status, token);
      await fetchAlerts(); // Refresh list
    } catch (err) {
      setError("Failed to resolve alert");
      console.error(err);
    }
  };

  // Update status
  const updateStatus = async (id: number, status: string) => {
    if (!token) return;
    
    try {
      await alertAPI.updateAlertStatus(id, status, token);
      await fetchAlerts(); // Refresh list
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    }
  };

  // Load alerts on mount
  useEffect(() => {
    fetchAlerts();
  }, [token]);

  return {
    alerts,
    isLoading,
    error,
    pagination,
    fetchAlerts,
    searchAlerts,
    resolveAlert,
    updateStatus
  };
};