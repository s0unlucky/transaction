/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { KAFKA_CLIENT } from './kafka.constant';
import { ClientProvider, ClientsModule } from '@nestjs/microservices';
import { kafkaOptionsFactory } from './kafka.config';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        inject: [],
        useFactory: async (): Promise<ClientProvider> => kafkaOptionsFactory(),
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
