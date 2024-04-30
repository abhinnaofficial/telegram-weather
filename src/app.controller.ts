import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('update-api-key')
  updateApiKey(@Body() body: { apiKey: string }) {
    // Logic to update the API key in your database or configuration
    console.log('API Key Updated:', body.apiKey);
    return { message: 'API Key updated successfully!' };
  }

  @Post('block-user/:userId')
  blockUser(@Param('userId') userId: string) {
    // Logic to block the user
    console.log('User Blocked:', userId);
    return { message: `User ${userId} blocked successfully!` };
  }

  @Delete('delete-user/:userId')
  deleteUser(@Param('userId') userId: string) {
    // Logic to delete the user
    console.log('User Deleted:', userId);
    return { message: `User ${userId} deleted successfully!` };
  }
}