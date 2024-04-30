import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    telegramUserId: number;

    @Column({ length: 255 })
    telegramUsername: string;

    @Column({ default: false })
    isBlocked: boolean;
}