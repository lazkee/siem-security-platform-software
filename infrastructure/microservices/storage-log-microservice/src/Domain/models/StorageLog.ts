import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("storage_log")
export class StorageLog {
    @PrimaryGeneratedColumn({name: "archive_id"})
    archiveId!: number;

    @Column({name: "file_name", type: "varchar", length: 255})
    fileName!: string;

    @Column({name: "num_events", type: "int", default: 0})
    numEvents!: number;

    @Column({name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;
}