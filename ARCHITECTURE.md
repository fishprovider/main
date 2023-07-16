# Intro
- This project follows the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Uncle Bob

# Structures

- A quick glance
  ```js
  // Level 1: business logics, objects, behaviors that are independent of any technology
  enterprise-rules
  ├── order
  │   ├── order.entity.ts
  │   ├── order.constants.ts
  │   ├── order.errors.ts
  │   ├── order.helpers.ts    // aggregate(orders), validate(order)
  ├── account
  │   ├── account.entity.ts
  ├── news
  │   ├── news.entity.ts

  // Level 2: use cases, interactions between entities, workflow that are independent of any UI, DB, external system
  application-rules
  ├── order
  │   ├── order.repository.ts  // e.g. getOrderById, createLiveOrder, createPendingOrder, updateLiveOrder, updatePendingOrder
  │   ├── order.usecases.ts
  │   ├── use-cases
  │   │   ├── create-live-order.usecase.ts
  │   │   ├── create-pending-order.usecase.ts
  │   │   ├── get-order.usecase.ts
  │   │   ├── get-live-orders.usecase.ts
  │   │   ├── get-pending-orders.usecase.ts
  │   │   ├── watch-order.usecase.ts      // input '0' => output 'order'

  // Level 3: controllers, presenters, gateways
  adapters-backend
  ├── controllers     // handle/parse user inputs and call use cases
  │   ├── live-orders.controller.ts          // e.g. getLiveOrders, createLiveOrder
  │   ├── account-info.controller.ts         // e.g. getAccount
  │   ├── price-info.controller.ts
  ├── api-models
  │   ├── order-input.entity.ts
  │   ├── order-output.entity.ts

  adapters-frontend
  ├── controllers     // handle/parse user inputs and call use cases
  │   ├── header.controller.ts               // e.g. getUser
  │   ├── live-orders.controller.ts          // e.g. getLiveOrders, createLiveOrder
  │   ├── account-info.controller.ts         // e.g. getAccount, getLiveOrders => profit, getProfit
  │   ├── price-info.controller.ts
  ├── view-models
  │   ├── order-input.entity.ts
  │   ├── order-output.entity.ts

  // Level 4: implement interfaces, e.g. access DB, cache, external services, persist data
  frameworks
  ├── mongo
  │   ├── order.repository.ts
  │   ├── account.repository.ts
  ├── redis
  │   ├── order-redis.entity.ts
  │   ├── order.repository.ts         // return + transform output
  │   ├── account.repository.ts
  ├── localstorage
  |   ├── order.repository.ts
  |   global-store
  |   ├── order.repository.ts
  ├── fish-api-rest
  |   ├── order.repository.ts         // send http req
  ├── fish-api-socket
  |   ├── order.repository.ts
  ├── ui
  |   ├── button.ts
  |   ├── label.ts
  ├── ctrader-api
  |   ├── order.repository.ts
  ├── meta-api
  |   ├── order.repository.ts

  apps                                // init controllers + repos + use-cases
  ├── fishserver-rest
  |   |   ├── /order/create           // handle http req
  |   |   ├── /order/get
  ├── fishserver-socket
  |   |   ├── /...
  ├── web
  │   ├── views
  |   │   ├── header.ts
  |   │   ├── live-orders.ts
  |   │   ├── account-info.ts         // e.g. controller => { balance, leverage, profit }
  ├── phone
  │   ├── views
  |   │   ├── header.ts
  |   │   ├── account-info.ts         // e.g. controller => { balance, leverage, profit }
  ├── copy
  ├── bot
  ├── watch-order
  ├── watch-price
  ├── cron
  ├── monitor
  ```

  => Dependency Rule: Inwards only (level X knows nothing about level X+1)

- A quick example
  ```js
  // live-orders-table.ts
  const backendRepo = new BackendOrderRepository()    // call axios
  const useCase = new GetOrdersUseCase(backendRepo)
  const useCase2 = new GetOrdersUseCase(backendRepo)
  new LiveOrdersTableController(useCase, useCase2)




  import CacheFirstOrderRepository from 'infrastructure/data-sources/order/cache-first-order-repository'
  import GetOrderUseCase from 'use-cases/order/actions/get-order'
  import GetOrderController from 'interfaces/order/controllers/get-order'

  // CacheFirstOrderRepository internally creates MongoOrderRepository and RedisOrderRepository, then implement get from Redis first, then get from Mongo if cache misses
  const cacheFirstOrderRepository = CacheFirstOrderRepository();
  const getOrderUseCase = GetOrderUseCase(cacheFirstOrderRepository);
  const orderController = OrderController(getOrderUseCase);

  const liveOrders = orderController.getLiveOrders(providerId);
  ```
