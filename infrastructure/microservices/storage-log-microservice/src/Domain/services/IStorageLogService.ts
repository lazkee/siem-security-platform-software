export interface IStorageLogService {
    runArchiveProcess(): Promise<Boolean>;
    getArchives(): Promise<any[]>;
}