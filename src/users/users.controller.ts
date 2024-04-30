import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Post('toggle-block/:id')
    async toggleBlockUser(@Param('id') id: number) {
        await this.userService.toggleBlockUser(id);
        return { message: 'User block status toggled successfully' };
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        await this.userService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }
}