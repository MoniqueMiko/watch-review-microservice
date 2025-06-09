import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: ClientProviderOptions = {
  name: 'CONSUMER-API',
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'review-client',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'review-consumer',
    },
  },
};
