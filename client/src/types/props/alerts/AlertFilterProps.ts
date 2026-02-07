import { IAlertAPI } from "../../../api/alerts/IAlertAPI";
import { AlertQueryDTO } from "../../../models/alerts/AlertQueryDTO";

export interface AlertFiltersProps {
  onSearch: (query: AlertQueryDTO) => void;
  severity?: string;
  status?: string;
  searchText?: string;
  alertsApi:IAlertAPI;
}
