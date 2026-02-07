import { IntegrityStatusDTO } from "../../../models/integrity/IntegrityStatusDTO";

export interface IntegrityStatusCardProps {
    status: IntegrityStatusDTO | null;
    onVerify: () => void;
    loading: boolean;
}