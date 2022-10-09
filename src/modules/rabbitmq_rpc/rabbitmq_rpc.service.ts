import {
  AmqpConnection,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { IRabbitMQQueueDto } from './rabbitmb_rpc.dto';
import { getRndInteger, isPrime } from "../../utils/number";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class Rabbitmq_rpcService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  // for cron it would be better to create a separate service, but for a test task it is ok
  // Cron runs every 1 second
  @Cron('*/1 * * * * *')
  async handleCron() {
    const amount = getRndInteger(0, 100)
    // check if number is 1 or 0
    if ([0,1].includes(amount)) {
      console.error('[ERROR]',amount, 'is neither prime nor composite number.')
      return
    }
    // handle-request payload
    const messagePayload: IRabbitMQQueueDto = {
      amount: amount,
    }
    // publish handle-request synchronous queue
    const response = await this.amqpConnection.request({
      exchange: 'exchange',
      routingKey: 'handle-request',
      payload: messagePayload
    });
    console.log(response);
  }

  @RabbitRPC({
    exchange: 'exchange',
    routingKey: 'handle-request',
    queue: 'handle-request',
  })
  async handleRequest({ amount }: IRabbitMQQueueDto): Promise<string> {
    const messagePayload: IRabbitMQQueueDto = {
      amount,
    };
    // returns true if amount is a prime number
    if (isPrime(amount)) {
      // publish log-prime-numbers asynchronous queue if number is prime
      this.amqpConnection.publish<IRabbitMQQueueDto>(
        'exchange',
        'log-prime-numbers',
        messagePayload,
      );
    } else {
      // publish log-non-prime-number asynchronous queue if number is not prime
      this.amqpConnection.publish<IRabbitMQQueueDto>(
        'exchange',
        'log-non-prime-numbers',
        messagePayload,
      );
    }
    return `handle-request queue finished, the number is ${amount}`;
  }

  @RabbitSubscribe({
    exchange: 'exchange',
    routingKey: 'log-prime-numbers',
    queue: 'log-prime-numbers',
  })
  logPrimeNumbers({ amount }: IRabbitMQQueueDto) {
    console.log(amount, 'is a prime number');
  }

  @RabbitSubscribe({
    exchange: 'exchange',
    routingKey: 'log-non-prime-numbers',
    queue: 'log-non-prime-numbers',
  })
  logNonPrimeNumbers({ amount }: IRabbitMQQueueDto) {
    console.log(amount, 'is not a prime number');
  }
}
