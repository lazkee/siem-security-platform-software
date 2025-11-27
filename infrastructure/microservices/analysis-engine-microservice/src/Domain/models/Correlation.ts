import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("correlation")
export class Correlation{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    description!: string;

    @Column({ type: "timestamp" })
    timestamp!: Date;

    @Column({ type: "boolean"})
    isAlert!: boolean;
}