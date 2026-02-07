import { IAlertAPI } from "../../../api/alerts/IAlertAPI";

export interface SearchBarProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  severity?: string;
  status?: string;
  dateFrom?: string; 
  dateTo?: string;
  alertsApi?:IAlertAPI;
}