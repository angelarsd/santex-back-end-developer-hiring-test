import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternalApiService } from './external-api.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://mongo:${process.env.MONGO_PORT || '27017'}/${
        process.env.MONGO_DB_NAME || 'santex-db'
      }`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService, ExternalApiService],
})
export class AppModule {}
