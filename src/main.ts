import 'dotenv/config';
console.log('Loaded BOT_TOKEN:', process.env.BOT_TOKEN);
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramBotService } from './telegram-bot.service';
import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import { ExpressAdapter } from '@nestjs/platform-express';


async function bootstrap() {
  const server = express();
  server.use(cookieParser());
  server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // true if using https
  }));


  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  const telegramBotService = app.get(TelegramBotService);

  server.use('/static', express.static(path.join(__dirname, 'public')));
  server.set('views', path.join(__dirname, 'views'));
  server.set('view engine', 'ejs');

  server.use('/webhuk', express.json());
  server.post('/webhuk', (req, res) => {
    telegramBotService.bot.handleUpdate(req.body);
    res.sendStatus(200);
  });

  await app.init();
  await server.listen(3000);
  console.log(`Server is listening on port 3000`);
}

bootstrap();