import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google', session: true }),
    ],
    controllers: [AuthController],
    providers: [GoogleStrategy],
})
export class AuthModule { }