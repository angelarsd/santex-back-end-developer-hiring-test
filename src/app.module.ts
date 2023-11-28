import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImportLeagueService } from './import-league.service';
import { ExternalApiService } from './external-api.service';
import {
  CoachSchema,
  CompetitionSchema,
  PlayerSchema,
  TeamSchema,
} from './schemas';

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
  providers: [AppService, ExternalApiService, ImportLeagueService],
})
export class AppModule { }
