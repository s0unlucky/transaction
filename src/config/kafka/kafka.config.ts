/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as dotenv from 'dotenv';
import { KafkaOptions, Transport } from '@nestjs/microservices';

const ENV_FILE = '.env';

dotenv.config({ path: ENV_FILE });

export const kafkaOptionsFactory = (): KafkaOptions => {
  const brokers = process.env.KAFKA_CLIENT_BROKERS?.split(',') || [
    'localhost:9092',
  ];
  const options: KafkaOptions['options'] = {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID || 'nestjs-app',
      brokers,
    },
    consumer: {
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'nestjs-group',
    },
    subscribe: {
      fromBeginning: true,
    },
  };

  return { transport: Transport.KAFKA, options };
};
