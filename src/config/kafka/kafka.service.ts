/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { Inject, Injectable } from '@nestjs/common';
import { KAFKA_CLIENT } from './kafka.constant';
import { ClientKafka } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { KafkaEvent } from './kafka.interface';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) {}

  subscribeToResponseOf(pattern: string): void {
    return this.kafkaClient.subscribeToResponseOf(pattern);
  }

  connect(): Promise<Producer> {
    return this.kafkaClient.connect();
  }

  async send<Date, Result>(event: KafkaEvent<Date>): Promise<Result> {
    const req = this.kafkaClient.send(event.eventName, event.toString());
    const data = await firstValueFrom(req);

    return data;
  }

  async produce(event: KafkaEvent<unknown>): Promise<void> {
    const request = this.kafkaClient.emit(event.eventName, event.date);
    await lastValueFrom(request);
  }
}
