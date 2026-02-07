import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("anomaly_db")
export class Anomaly {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "json" })
  correlatedAlerts!: number[];

  @Column({ type: "varchar", length: 100, nullable: true })
  userId!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  userRole!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
