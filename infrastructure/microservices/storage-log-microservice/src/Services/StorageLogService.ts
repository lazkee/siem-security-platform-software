import path from "path";
import { Repository } from "typeorm";
import { StorageLog } from "../Domain/models/StorageLog";
import { mkdirSync } from "fs";
import { IStorageLogService } from "../Domain/services/IStorageLogService";

const ARCHIVE_DIR = process.env.ARCHIVE_PATH || path.join(__dirname, "../../archives");
const TEMP_DIR = path.join(ARCHIVE_DIR, "tmp");

export class StorageLogServices implements IStorageLogService{
    constructor(
        private readonly storageRepo: Repository<StorageLog>
    ){
        //radi proveru 
        mkdirSync(ARCHIVE_DIR, {recursive: true});
        mkdirSync(TEMP_DIR, {recursive: true});

        console.log("[StorageLogService] initialized");
    }

    
    public async getArchives(): Promise<StorageLog[]>{
        return this.storageRepo.find();
    }

    public async runArchiveProcess(): Promise<void> {
       
    }
}