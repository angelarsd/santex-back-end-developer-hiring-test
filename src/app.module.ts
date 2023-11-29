import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import {
  PlayerService,
  ImportLeagueService,
  ExternalApiService,
  TeamService,
} from './services';
import {
  CoachSchema,
  CompetitionSchema,
  PlayerSchema,
  TeamSchema,
} from './schemas';
import { AppRateLimitMiddleware } from './app.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'Competition', schema: CompetitionSchema },
      { name: 'Team', schema: TeamSchema },
      { name: 'Player', schema: PlayerSchema },
      { name: 'Coach', schema: CoachSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    PlayerService,
    ExternalApiService,
    ImportLeagueService,
    TeamService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppRateLimitMiddleware).forRoutes('importLeague');
  }
}
