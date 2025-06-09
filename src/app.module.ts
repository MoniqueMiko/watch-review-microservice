import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './schema/review.entity';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from './config/kafka.config';
import { HttpExceptionStrategy } from './strategy/http-exception.strategy';
import { CreateReviewDto } from './dto/review.dto';
import { User } from './schema/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: [User, Review],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Review]),
    ClientsModule.register([kafkaConfig]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, HttpExceptionStrategy, CreateReviewDto],
})
export class AppModule { }
