# Intro
- This project follows the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Uncle Bob

# Structures

- A quick glance
  ```js
  // Level 1: business logics, objects, behaviors that are independent of any technology
  entities
  ├── order
  │   ├── order.models.ts
  │   ├── order-constants.ts
  │   ├── order-errors.ts
  │   ├── order-helpers.ts

  // Level 2: use cases, interactions between entities, workflow that are independent of any UI, DB, external system
  use-cases
  ├── order
  │   ├── order-repository.models.ts  // e.g. getOrderById, createLiveOrder, createPendingOrder, updateLiveOrder, updatePendingOrder
  │   ├── order-use-cases.models.ts
  │   ├── actions
  │   │   ├── get-order.ts
  │   │   ├── create-live-order.ts
  │   │   ├── create-pending-order.ts

  // Level 3: controllers, presenters, gateways
  interfaces
  ├── order
  │   ├── controllers                   // handle/parse user inputs and call use cases
  │   │   ├── get-order.ts
  │   │   ├── create-live-order.ts
  │   │   ├── create-pending-order.ts
  │   ├── presenters                    // format/parse use case outputs to user UI

  // Level 4: implement interfaces, e.g. access DB, cache, external services, persist data
  infrastructure
  ├── data-sources
  │   ├── order
  |   │   ├── mongo-order-repository.ts
  |   │   ├── redis-order-repository.ts
  |   │   ├── cache-first-order-repository.ts
  ├── web
  │   ├── order
  |   │   ├── get-order.ts
  ├── phone
  │   ├── order
  |   │   ├── get-order.ts
  ```

  => Dependency Rule: Inwards only (level X knows nothing about level X+1)

- A quick example
  ```js
  import CacheFirstOrderRepository from 'infrastructure/data-sources/order/cache-first-order-repository'
  import GetOrderUseCase from 'use-cases/order/actions/get-order'
  import GetOrderController from 'interfaces/order/controllers/get-order'

  // CacheFirstOrderRepository internally creates MongoOrderRepository and RedisOrderRepository, then implement get from Redis first, then get from Mongo if cache misses
  const cacheFirstOrderRepository = CacheFirstOrderRepository();
  const getOrderUseCase = GetOrderUseCase(cacheFirstOrderRepository);
  const getOrderController = GetOrderController(getOrderUseCase);
  const order = getOrderController(orderId);
  ```
