import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceModule } from './device/device.module';
import { VariableModule } from './variable/variable.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import { MulterModule } from '@nestjs/platform-express';
import { ExternalModule } from './external/external.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import * as winston from 'winston';
import { Logtail } from '@logtail/node';
import { WinstonModule } from 'nest-winston';
import { LogtailTransport } from '@logtail/winston';

const logtail = new Logtail('H8oAoz3TQm3CFZLp6HbUD64j');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      imports: [DatabaseModule],
      useClass: DatabaseService,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new LogtailTransport(logtail)],
    }),
    DeviceModule,
    VariableModule,
    UserModule,
    AuthModule,
    CollectionModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ExternalModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
