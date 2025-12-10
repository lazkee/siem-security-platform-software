import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("storage_log")
export class StorageLog {
    @PrimaryGeneratedColumn({name: "storage_log_id"})
    storageLogId!: number;

    @Column({name: "file_name", type: "varchar", length: 255})
    fileName!: string;

    @Column({name: "event_count", type: "int", default: 0})
    eventCount!: number;

    @Column({name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({name: "file_size", type: "int"})
    fileSize!: number;
}