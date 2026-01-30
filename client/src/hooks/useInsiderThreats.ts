import { useState, useEffect } from "react";
import { IInsiderThreatAPI } from "../api/insider-threat/IInsiderThreatAPI";
import { InsiderThreatDTO } from "../models/insider-threat/InsiderThreatDTO";
import { UserRiskProfileDTO } from "../models/insider-threat/UserRiskProfileDTO";
import { ThreatQueryDTO } from "../models/insider-threat/ThreatQueryDTO";
import { useAuth } from "./useAuthHook";

export const useInsiderThreats = (insiderThreatAPI: IInsiderThreatAPI) => {
  const { token } = useAuth(); 
  
  const [threats, setThreats] = useState<InsiderThreatDTO[]>([]);
  const [userRiskProfiles, setUserRiskProfiles] = useState<UserRiskProfileDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  // Initial load
  useEffect(() => {
    if (token) {
      loadThreats();
      loadUserRiskProfiles();
    }
  }, [token]);

  const loadThreats = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await insiderThreatAPI.getAllThreats(token);
      setThreats(data);
    } catch (err) {
      setError("Failed to load insider threats");
      console.error("Error loading threats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRiskProfiles = async () => {
    if (!token) return;
    try {
      const data = await insiderThreatAPI.getAllUserRiskProfiles(token);
      setUserRiskProfiles(data);
    } catch (err) {
      console.error("Error loading user risk profiles:", err);
    }
  };

  const searchThreats = async (query: ThreatQueryDTO) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await insiderThreatAPI.searchThreats(query, token);
      setThreats(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError("Failed to search threats");
      console.error("Error searching threats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveThreat = async (id: number, resolvedBy: string, resolutionNotes?: string) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    try {
      const updatedThreat = await insiderThreatAPI.resolveThreat(id, resolvedBy, resolutionNotes, token);
      
      setThreats(prev =>
        prev.map(threat => threat.id === id ? updatedThreat : threat)
      );
    } catch (err) {
      setError("Failed to resolve threat");
      console.error("Error resolving threat:", err);
      throw err;
    }
  };

  const getHighRiskUsers = async (): Promise<UserRiskProfileDTO[]> => {
    if (!token) return [];
    try {
      return await insiderThreatAPI.getHighRiskUsers(token);
    } catch (err) {
      console.error("Error fetching high-risk users:", err);
      return [];
    }
  };

  const getUserRiskAnalysis = async (userId: string) => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    try {
      return await insiderThreatAPI.getUserRiskAnalysis(userId, token);
    } catch (err) {
      console.error("Error fetching user risk analysis:", err);
      throw err;
    }
  };

  return {
    threats,
    userRiskProfiles,
    isLoading,
    error,
    pagination,
    searchThreats,
    resolveThreat,
    loadThreats,
    loadUserRiskProfiles,
    getHighRiskUsers,
    getUserRiskAnalysis
  };
};