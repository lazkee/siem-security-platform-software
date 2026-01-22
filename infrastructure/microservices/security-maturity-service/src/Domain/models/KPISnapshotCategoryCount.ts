// src/Domain/models/KpiSnapshotCategoryCount.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AlertCategory } from "../enums/AlertCategory";
import { KpiSnapshot } from "./KpiSnapshot";

@Entity("kpi_snapshot_category_counts")
@Index("idx_kpi_cat_snapshot", ["snapshotId"])
@Index("idx_kpi_cat_category", ["category"])
@Index("uq_kpi_cat_snapshot_category", ["snapshotId", "category"], { unique: true })
export class KpiSnapshotCategoryCount {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "snapshot_id", type: "int" })
  snapshotId!: number;

  @ManyToOne(() => KpiSnapshot, { onDelete: "CASCADE" })
  @JoinColumn({ name: "snapshot_id" })
  snapshot!: KpiSnapshot;

  @Column({ name: "category", type: "varchar", length: 64 })
    category!: AlertCategory;

  @Column({ name: "count", type: "int" })
  count!: number;
}
