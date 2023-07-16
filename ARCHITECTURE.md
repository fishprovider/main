# Intro
- This project follows the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Uncle Bob

# Structures

- A quick glance
  ```js
  enterprise                              // business
  ├── order
  │   ├── order.models.ts
  │   ├── order-constants.ts
  │   ├── order-errors.ts
  │   ├── order-helpers.ts

  application                             // use cases
  ├── order
  │   ├── order-repositories.models.ts
  │   ├── order-use-cases.models.ts
  │   ├── use-cases
  │   │   ├── create-order.ts
  │   │   ├── get-order.ts

  data                                    // data access
  ├── order
  │   ├── order-data-sources.models.ts
  │   ├── repositories
  │   │   ├── get-order.ts
  │   ├── data-sources
  │   │   ├── mongo
  │   │   │   ├── order.models.ts
  │   │   │   ├── get-order.ts
  │   │   ├── redis
  │   │   │   ├── order.models.ts
  │   │   │   ├── get-order.ts

  presentation                            // bridge for external => internal
  ├── controllers
  │   ├── get-order.ts
  ```

- E.g. `controllers/get-order.ts`
  ```js
  import getOrder from 'application/order/use-cases/get-order'
  import getOrderRepo from 'data/order/repositories/get-order'
  import getOrderMongo from 'data/order/data-sources/mongo/get-order'
  import getOrderRedis from 'data/order/data-sources/redis/get-order'

  const cacheOrder = getOrder(
    getOrderRepo(
      getOrderRedis()
    )
  )
  if (cacheOrder) return cacheOrder

  const order = getOrder(
    getOrderRepo(
      getOrderMongo()
    )
  )
  return order
  ```
