import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscriber {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    telegram_user_id: number;

    @Column({ length: 255 })
    telegram_username: string;

    @Column({ default: false })
    is_blocked: boolean;
}