import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from '@nestjs/common';
import { Rabbitmq_rpcService } from "./rabbitmq_rpc.service";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'exchange',
          type: 'topic',
        },
      ],
      uri: `amqp://rabbitmq:rabbitmq@localhost:5672`
    }),
    RabbitMQRPCModule,
  ],
  providers: [Rabbitmq_rpcService],
})
export class RabbitMQRPCModule {}

