import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from './weather.service';
import { UserService } from './users/users.service';

@Injectable()
export class TelegramBotService {
    public bot: Telegraf<Context>;
    public subscribedUsers: Record<string, string[]> = {};

    constructor(
        private readonly weatherService: WeatherService,
        private readonly userService: UserService
    ) {
        this.bot = new Telegraf(process.env.BOT_TOKEN);
        this.bot.use(this.checkIfBlocked.bind(this)); // block check middleware
        this.setupCommands();
        this.startBot();
    }

    private async checkIfBlocked(ctx: Context, next: () => Promise<void>) {
        const telegramUserId = ctx.from?.id;
        if (!telegramUserId) return next(); // Continue if user ID is not found

        const user = await this.userService.findUserByTelegramId(telegramUserId);
        if (user?.isBlocked) {
            return ctx.reply('You are blocked from using this service.');
        }
        return next(); // Continue to the next middleware/command if not blocked
    }

    private setupCommands() {
        this.bot.command('start', (ctx) => ctx.reply('Welcome! Type /subscribe <city> to get daily weather updates.'));

        this.bot.command('subscribe', async (ctx) => {
            const commandArgs = ctx.message.text.split(' ').slice(1);
            const city = commandArgs.join(' ');
            if (!city) {
                return ctx.reply('Please provide a city. Example: /subscribe London');
            }
            this.subscribeUser(ctx.message.chat.id.toString(), city);
            return ctx.reply(`Subscribed for daily weather updates in ${city}.`);
        });

        this.bot.command('unsubscribe', async (ctx) => {
            const commandArgs = ctx.message.text.split(' ').slice(1);
            const city = commandArgs.join(' ');
            if (!city) {
                return ctx.reply('Please provide a city. Example: /unsubscribe London');
            }
            this.unsubscribeUser(ctx.message.chat.id.toString(), city);
            return ctx.reply(`Unsubscribed from daily weather updates in ${city}.`);
        });

        this.bot.command('update', async (ctx) => {
            const chatId = ctx.message.chat.id.toString();
            if (this.subscribedUsers[chatId] && this.subscribedUsers[chatId].length > 0) {
                const city = this.subscribedUsers[chatId][0]; // Use the first subscribed city by default
                await this.sendWeatherUpdateOnDemand(chatId, city);
            } else {
                ctx.reply('You are not subscribed to any city. Use /subscribe <city> to subscribe.');
            }
        });

        this.bot.command('reset', async (ctx) => {
            const chatId = ctx.message.chat.id.toString();
            if (this.subscribedUsers[chatId] && this.subscribedUsers[chatId].length > 0) {
                this.subscribedUsers[chatId] = []; // Clear all subscriptions for the user
                ctx.reply('All subscriptions cleared.');
            } else {
                ctx.reply('You are not subscribed to any city.');
            }
        });
    }

    public startBot() {
        const webhookUrl = 'https://dae0-49-47-135-77.ngrok-free.app/webhuk';
        this.bot.telegram.setWebhook(webhookUrl);
        console.log(`Telegram bot started with webhook at ${webhookUrl}`);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    public async sendDailyWeatherUpdates() {
        for (const chatId of Object.keys(this.subscribedUsers)) {
            for (const city of this.subscribedUsers[chatId]) {
                try {
                    const weatherUpdate = await this.weatherService.getWeather(city).toPromise();
                    await this.sendMessage(chatId, weatherUpdate);
                } catch (error) {
                    console.error(`Error sending weather update for ${city}:`, error);
                }
            }
        }
    }

    public async sendWeatherUpdateOnDemand(chatId: string, city: string) {
        try {
            const weatherUpdate = await this.weatherService.getWeather(city).toPromise();
            await this.sendMessage(chatId, weatherUpdate);
        } catch (error) {
            console.error(`Error sending immediate weather update for ${city}:`, error);
        }
    }

    public subscribeUser(chatId: string, city: string) {
        if (!this.subscribedUsers[chatId]) {
            this.subscribedUsers[chatId] = [];
        }
        this.subscribedUsers[chatId].push(city);
    }

    public unsubscribeUser(chatId: string, city: string) {
        if (this.subscribedUsers[chatId]) {
            this.subscribedUsers[chatId] = this.subscribedUsers[chatId].filter((c) => c !== city);
        }
    }

    public async sendMessage(chatId: string, text: string) {
        await this.bot.telegram.sendMessage(chatId, text);
    }
}