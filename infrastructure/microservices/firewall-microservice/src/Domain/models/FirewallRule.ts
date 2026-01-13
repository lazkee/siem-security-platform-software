import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("firewall_rules")
export class FirewallRule {
    @PrimaryGeneratedColumn({ name: "rule_id" })
    ruleId!: number;

    @Column({ name: "ip_address", type: "varchar", length: 45 })
    ipAddress!: string;

    @Column({ name: "port", type: "int" })
    port!: number;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}