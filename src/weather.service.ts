// src/weather.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
    constructor(private readonly httpService: HttpService) { }

    getWeather(city: string): Observable<string> {
        const apiKey = process.env.WEATHER_API_KEY;

        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        return this.httpService.get(apiUrl).pipe(
            map((response: AxiosResponse) => {
                const weatherDescription = response.data.weather[0]?.description || 'Not available';
                return `Weather in ${city}: ${weatherDescription}`;
            }),
        );
    }
}
