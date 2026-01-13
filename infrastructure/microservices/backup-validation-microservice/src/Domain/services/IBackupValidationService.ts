export interface IBackupValidationService {
    runValidation(): Promise<boolean>;
}