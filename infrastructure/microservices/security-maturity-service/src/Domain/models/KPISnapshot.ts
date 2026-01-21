// src/Domain/models/KpiSnapshot.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { MaturityLevel } from "../types/MaturityLevel";

@Entity("kpi_snapshots")
@Index("uq_kpi_window", ["windowFrom", "windowTo"], { unique: true })
export class KpiSnapshot {

  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  // -------------------------
  // Time window
  // -------------------------
  @Column({ name: "window_from", type: "timestamp" })
  windowFrom!: Date;

  @Column({ name: "window_to", type: "timestamp" })
  windowTo!: Date;

  // -------------------------
  // Duration KPIs (minutes)
  // -------------------------
  @Column({ name: "mttd_minutes", type: "float", nullable: true })
  mttdMinutes!: number | null;

  @Column({ name: "mttr_minutes", type: "float", nullable: true })
  mttrMinutes!: number | null;

  // -------------------------
  // Sample counts
  // -------------------------
  @Column({ name: "mttd_sample_count", type: "int" })
  mttdSampleCount!: number;

  @Column({ name: "mttr_sample_count", type: "int" })
  mttrSampleCount!: number;

  // -------------------------
  // Volume & quality
  // -------------------------
  @Column({ name: "total_alerts", type: "int" })
  totalAlerts!: number;

  @Column({ name: "resolved_alerts", type: "int" })
  resolvedAlerts!: number;

  @Column({ name: "open_alerts", type: "int" })
  openAlerts!: number;

  @Column({ name: "false_alarms", type: "int" })
  falseAlarms!: number;

  @Column({ name: "false_alarm_rate", type: "float" })
  falseAlarmRate!: number;

  // -------------------------
  // Security maturity
  // -------------------------
  @Column({ name: "score_value", type: "int" })
  scoreValue!: number;

  @Column({ name: "maturity_level", type: "varchar", length: 64 })
  maturityLevel!: MaturityLevel;
}
