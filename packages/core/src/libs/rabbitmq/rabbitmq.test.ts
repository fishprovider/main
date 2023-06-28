import { destroy, start } from './rabbitmq';

beforeAll((done) => {
  (async () => {
    try {
      await start();
    } finally {
      done();
    }
  })();
});

afterAll((done) => {
  (async () => {
    try {
      await destroy();
    } finally {
      done();
    }
  })();
});

test('RabbitMQ', async () => {
  if (!RabbitMQ.pub || !RabbitMQ.sub) {
    fail('RabbitMQ pubsub is undefined');
  }

  const queueName = 'RabbitMQTest';
  const data = { foo: 'bar' };

  RabbitMQ.pub.assertQueue(queueName, { durable: true });
  const buf = Buffer.from(JSON.stringify(data));
  RabbitMQ.pub.sendToQueue(queueName, buf, { persistent: true });

  RabbitMQ.sub.assertQueue(queueName, { durable: true });
  RabbitMQ.sub.prefetch(1);

  const dataFetched = await new Promise((resolve) => {
    if (!RabbitMQ.sub) {
      fail('RabbitMQ pubsub is undefined');
    }

    RabbitMQ.sub.consume(
      queueName,
      (message) => {
        if (message) {
          resolve(JSON.parse(`${message.content}`));
        }
      },
      {
        consumerTag: queueName,
      },
    );
  });

  expect(dataFetched).toEqual(data);
});
