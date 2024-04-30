import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(telegramUserId: number, telegramUsername: string): Promise<User> {
        const newUser = this.userRepository.create({ telegramUserId, telegramUsername });
        return this.userRepository.save(newUser);
    }

    async findUserByTelegramId(telegramUserId: number): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { telegramUserId: telegramUserId }
        });
    }

    async toggleBlockUser(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: id } });
        if (user) {
            await this.userRepository.update(id, { isBlocked: !user.isBlocked });
        }
    }

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete({ id });
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}