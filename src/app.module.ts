import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramBotModule } from './telegram-bot.module';
import { AuthModule } from './auth.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { UserModule } from './users/users.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,

    TelegramBotModule,
    AuthModule,
    PassportModule.register({ session: true }),
  ],
  providers: [GoogleStrategy],
})
export class AppModule { }