# CarpicK
물건은 더이상 ‘소유’의 개념이 아닌 서로 대여해 주고 차용해 쓰는 ‘공유’의 개념이 되고 있습니다. 
잘 사용하지 않는다면 기꺼이 대여하여 자신과 남 모두 win win 하며,
불필요한 재화의 재생산을 막아주는 공유경제 개념이 자동차에 접목 되었습니다.

**General**

1. 등록자 :  구매 하였지만 잘 사용하지 않거나 사정으로 인해 부가적인 경제적 수익 창출이 필요한 자동차 오너는 1인 대여사업자가 되어 임대수익을 기대할 수 있습니다.
2. 사용자 : 기존의 대형 렌트 회사가 운영하는 자동차 임대료 보다 저렴하게 서비스를 이용할 수 있습니다. 
3. 회   사 : 사용자의 대여 자동차에 필요한 보험 , 정비 등에 제휴 업체와 MOU를 맺어 사용자 및 등록자에게는 대여에 필요한 부가서비스를 간편하게 제공하며 , 업체는 매출증대를 기대할 수 있습니다.

## Tech Stack

![techstack](https://user-images.githubusercontent.com/101391296/182011988-8da190e4-1f7a-4f2b-8f6e-9a080babc444.jpg)

## ERD

![Screenshot from 2022-07-29 14-45-14](https://user-images.githubusercontent.com/101391296/181691012-5076ef02-70a6-4b24-a9ef-d05e51f31b1f.png)

## API Docs

![apidocs](https://user-images.githubusercontent.com/101391296/181732964-5daf99c9-d72f-4bd7-975c-a02b8af7deba.png)

## Directory Structure
 ``` 
  ├── backend
  │   ├── docker-compose.prod.yaml
  │   ├── docker-compose.yaml
  │   ├── Dockerfile
  │   ├── gcp-file-storage.json
  │   ├── nest-cli.json
  │   ├── package.json
  │   ├── README.md
  │   ├── src
  │   │   ├── apis
  │   │   │   ├── administrator
  │   │   │   │   ├── administrator.module.ts
  │   │   │   │   ├── administrator.resolver.ts
  │   │   │   │   ├── administrator.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   └── createAdministrator.input.ts
  │   │   │   │   └── entities
  │   │   │   │       └── administrator.entity.ts
  │   │   │   ├── auth
  │   │   │   │   ├── auth.module.ts
  │   │   │   │   ├── auth.resolver.ts
  │   │   │   │   └── auth.service.ts
  │   │   │   ├── cars
  │   │   │   │   ├── car.module.ts
  │   │   │   │   ├── car.resolver.ts
  │   │   │   │   ├── car.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   ├── createCar.input.ts
  │   │   │   │   │   └── popularCar.output.ts
  │   │   │   │   └── entities
  │   │   │   │       └── car.entity.ts
  │   │   │   ├── carsCategory
  │   │   │   │   ├── carCategory.module.ts
  │   │   │   │   ├── carCategory.resolver.ts
  │   │   │   │   ├── carCategory.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   └── createCarCategory.input.ts
  │   │   │   │   ├── entities
  │   │   │   │   │   └── carCategory.entity.ts
  │   │   │   │   └── __test__
  │   │   │   │       └── carCategory.service.spec.ts
  │   │   │   ├── carsLocation
  │   │   │   │   ├── carLocation.module.ts
  │   │   │   │   ├── carLocation.resolver.ts
  │   │   │   │   ├── carLocation.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   ├── carLocation.input.ts
  │   │   │   │   │   └── fetchCarLocation.input.ts
  │   │   │   │   └── entities
  │   │   │   │       └── carLocation.entity.ts
  │   │   │   ├── carsModel
  │   │   │   │   ├── carModel.module.ts
  │   │   │   │   ├── carModel.resolver.ts
  │   │   │   │   ├── carModel.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   └── createCarModel.input.ts
  │   │   │   │   └── entities
  │   │   │   │       └── carModel.entity.ts
  │   │   │   ├── carsRegistration
  │   │   │   │   ├── carRegistration.module.ts
  │   │   │   │   ├── carRegistration.resolver.ts
  │   │   │   │   ├── carRegistration.service.ts
  │   │   │   │   ├── dto
  │   │   │   │   │   └── createCarRegistration.input.ts
  │   │   │   │   └── entities
  │   │   │   │       └── carRegistration.entity.ts
  │   │   │   ├── file
  │   │   │   │   ├── file.module.ts
  │   │   │   │   ├── file.resolver.ts
  │   │   │   │   └── file.service.ts
  │   │   │   ├── iamport
  │   │   │   │   └── iamport.service.ts
  │   │   │   ├── imageEnd
  │   │   │   │   └── entities
  │   │   │   │       └── imageEnd.entity.ts
  │   │   │   ├── imagesCar
  │   │   │   │   └── entities
  │   │   │   │       └── imageCar.entity.ts
  │   │   │   ├── imagesRegistration
  │   │   │   │   └── entities
  │   │   │   │       └── imageRegistration.entity.ts
  │   │   │   ├── imagesStart
  │   │   │   │   └── entities
  │   │   │   │       └── imageStart.entity.ts
  │   │   │   ├── licenTruth
  │   │   │   │   ├── licenTruth.module.ts
  │   │   │   │   ├── licenTruth.resolver.ts
  │   │   │   │   └── licenTruth.service.ts
  │   │   │   ├── payments
  │   │   │   │   ├── dto
  │   │   │   │   │   └── payment.input.ts
  │   │   │   │   ├── entities
  │   │   │   │   │   └── payment.entity.ts
  │   │   │   │   ├── payment.module.ts
  │   │   │   │   ├── payment.resolver.ts
  │   │   │   │   └── payment.service.ts
  │   │   │   ├── reservations
  │   │   │   │   ├── dto
  │   │   │   │   │   └── createReservation.ts
  │   │   │   │   ├── entities
  │   │   │   │   │   └── reservation.entity.ts
  │   │   │   │   ├── reservation.module.ts
  │   │   │   │   ├── reservation.resolver.ts
  │   │   │   │   └── reservation.service.ts
  │   │   │   ├── review
  │   │   │   │   ├── entities
  │   │   │   │   │   └── review.entity.ts
  │   │   │   │   ├── review.module.ts
  │   │   │   │   ├── review.resolver.ts
  │   │   │   │   └── review.service.ts
  │   │   │   ├── tasks
  │   │   │   │   ├── tasks.module.ts
  │   │   │   │   └── tasks.service.ts
  │   │   │   └── users
  │   │   │       ├── dto
  │   │   │       │   ├── createUser.input.ts
  │   │   │       │   ├── endCar.input.ts
  │   │   │       │   ├── isValid.output.ts
  │   │   │       │   └── startCar.input.ts
  │   │   │       ├── entities
  │   │   │       │   └── user.entity.ts
  │   │   │       ├── user.module.ts
  │   │   │       ├── user.resolver.ts
  │   │   │       └── user.service.ts
  │   │   ├── app.controller.ts
  │   │   ├── appLocal.module.ts
  │   │   ├── app.module.ts
  │   │   ├── commons
  │   │   │   ├── auth
  │   │   │   │   ├── gql-auth.guard.ts
  │   │   │   │   ├── gql-user.param.ts
  │   │   │   │   ├── jwt-access.strategy.ts
  │   │   │   │   └── jwt-refresh.strategy.ts
  │   │   │   ├── filter
  │   │   │   │   └── http-exception.filter.ts
  │   │   │   └── graphql
  │   │   │       └── schema.gql
  │   │   └── main.ts
  │   ├── test
  │   │   ├── app.e2e-spec.ts
  │   │   └── jest-e2e.json
  │   ├── tsconfig.build.json
  │   ├── tsconfig.json
  │   └── yarn.lock
  └── cloudbuild.yaml
```
## Environment Variable
```
//JWT
ACCESS_TOKEN_KEY
REFRESH_TOKEN_KEY

//IAMPORT
IMP_API_KEY
IMP_API_SECRET

//COOLSMS
SMS_KEY
SMS_SECRET
SMS_SENDER

//MYSQL
MYSQL_HOST
MYSQL_USERNAME
MYSQL_PASSWORD
MYSQL_DATABASE

//REDIS
REDIS_URL

//LICEN TRUTH
LICENTRUTH_API_HOST
LICENTRUTH_API_KEY

//GOOGLE CLOUD STORAGE
STORAGE_BUCKET
STORAGE_KEY_FILENAME
STORAGE_PROJECT_ID

//DOMAIN
CORS_ORIGIN_DEV
CORS_ORIGIN_PROD
```
## Installation
```
git clone https://github.com/hseung578/f7b3_team07_server.git

yarn install
```
