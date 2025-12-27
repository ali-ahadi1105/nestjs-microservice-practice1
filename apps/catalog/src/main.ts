import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'Catalog';
  const logger = new Logger('CatalogService');

  const rmqlUrl = process.env.RABBITMQ_URL ?? "amqp://localhost:5672";
  const queue = process.env.CATALOG_QUEUE ?? "catalog_queue";

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqlUrl],
        queue,
        queueOptions: {
          durable: false
        }
      }
    }
  );

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Catalog microservice(RMQ) listening on queue ${queue} via ${rmqlUrl}`);
}

bootstrap();
