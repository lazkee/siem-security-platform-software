import { useState } from "react";
import { BackupValidationButtonProps } from "../../types/props/backup/BackupValidationButtonProps";
import { useAuth } from "../../hooks/useAuthHook";


export default function BackupValidationButton({ backupApi, onSuccess }: BackupValidationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const handleRunBackup = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await backupApi.runValidation(token!);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Manual backup failed: ", err);
            setError("Manual backup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-3">
            <button
                onClick={handleRunBackup}
                disabled={isLoading}
                className={`m-2! px-4 py-2 rounded-[10px]! text-white font-semibold ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-[#007a55] hover:bg-[#059669]"}`}>
                {isLoading ? "Running..." : "Run Backup"}
            </button>

            {error && (
                <div className="mb-2! w-34! px-3 py-2 rounded-md bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#f87171] text-sm">
                    {error}
                </div>           
            )}
        </div>
    )
}