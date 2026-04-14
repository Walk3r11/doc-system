# GP Visits System

REST API система за управление на лекари, пациенти и посещения при лични лекари.

## Tech stack
- Node.js + NestJS
- PostgreSQL + Prisma ORM
- JWT authentication
- Jest (unit + e2e)

## Setup
1. Копирай `.env.example` в `.env`.
2. Стартирай базата:
   - `docker compose up -d`
3. Инсталирай зависимости:
   - `npm install`
4. Генерирай Prisma client и миграции:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
5. По избор seed:
   - `npm run seed`

## Run
- Dev: `npm run start:dev`
- Prod build: `npm run build`
- Prod run: `npm run start:prod`

## Tests
- Unit: `npm run test`
- Coverage: `npm run test:cov`
- E2E: `npm run test:e2e`

## Authentication
- Public endpoints:
  - `POST /auth/register/doctor`
  - `POST /auth/register/patient`
  - `POST /auth/login`
- All other endpoints require `Authorization: Bearer <token>`.

## API summary
### Doctor schedule management
- `PATCH /doctors/me/schedule`
- `POST /doctors/me/schedule/temporary-changes`
- `POST /doctors/me/schedule/permanent-changes`

### Visits
- `POST /visits`
- `POST /visits/:id/cancel`
- `GET /visits/me`

## Core business rules
- Посещение може да се създаде само при личния лекар на пациента.
- Посещението трябва да е изцяло в работно време.
- Посещението се създава поне 24 часа предварително.
- Не се допуска припокриване на посещения за един лекар.
- Отмяна е позволена само от лекаря или пациента по посещението.
- Отмяна е забранена по-късно от 12 часа преди началото.
- Постоянна промяна в график влиза в сила не по-рано от 7 дни от създаването.

## Error format
NestJS стандартен формат с HTTP кодове:
- `400` bad request / бизнес правило
- `401` unauthorized
- `403` forbidden
- `404` not found

## Example payloads
### Register doctor
`POST /auth/register/doctor`
```json
{
  "name": "Dr. Ivan Petrov",
  "email": "doctor@example.com",
  "password": "Passw0rd!",
  "address": "Sofia, bul. Bulgaria 1",
  "workingSchedule": {
    "schedule": [
      {
        "dayOfWeek": 1,
        "intervals": [{ "start": "08:30", "end": "12:00" }, { "start": "13:00", "end": "18:30" }]
      }
    ]
  }
}
```

### Create visit
`POST /visits`
```json
{
  "startAt": "2026-06-01T08:30:00.000Z",
  "endAt": "2026-06-01T09:00:00.000Z"
}
```
