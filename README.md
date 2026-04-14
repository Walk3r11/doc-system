# GP Visits System API

Backend API for managing doctors, patients, and GP visit bookings.

## Stack
- NestJS
- PostgreSQL (Neon)
- Prisma ORM
- JWT authentication
- Jest (unit + e2e)
- Railway deployment

## Production Hosting

### Platform
- App hosting: Railway
- Database: Neon PostgreSQL

### Required environment variables
- `DATABASE_URL` (Neon pooled connection string)
- `DIRECT_DATABASE_URL` (Neon direct connection string, used for Prisma migrations)
- `JWT_SECRET`
- `PORT` (provided automatically by Railway)

## API Authentication
- Public routes:
  - `POST /auth/register/doctor`
  - `POST /auth/register/patient`
  - `POST /auth/login`
- Protected routes:
  - Require `Authorization: Bearer <token>`

## API Endpoints

### Doctor schedule management
- `PATCH /doctors/me/schedule`
- `POST /doctors/me/schedule/temporary-changes`
- `POST /doctors/me/schedule/permanent-changes`

### Visits
- `POST /visits`
- `POST /visits/:id/cancel`
- `GET /visits/me`

## Business Rules
- A visit can be created only with the patient's assigned personal doctor.
- A visit must be fully inside the doctor's active working schedule.
- A visit must be created at least 24 hours before start time.
- Visits must not overlap for the same doctor.
- A visit can be cancelled only by the visit doctor or patient.
- Cancellation is not allowed later than 12 hours before start time.
- Permanent schedule changes must start at least 7 days after creation.
- A doctor cannot have overlapping active temporary schedule changes.

## Error Responses
- `400` validation or business rule violation
- `401` unauthorized
- `403` forbidden
- `404` not found
- `409` conflict
- `422` semantic validation error

## Example Requests

### Register doctor
`POST /auth/register/doctor`
```json
{
  "name": "Dr. Ivan Petrov",
  "email": "doctor@example.com",
  "password": "Passw0rd!",
  "address": "Sofia, Bulgaria Blvd 1",
  "workingSchedule": {
    "schedule": [
      {
        "dayOfWeek": 1,
        "intervals": [
          { "start": "08:30", "end": "12:00" },
          { "start": "13:00", "end": "18:30" }
        ]
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

## Deployment Notes (Railway + Neon)
- Connect your GitHub repository in Railway.
- Add Neon connection strings as Railway environment variables.
- Run Prisma migrations against `DIRECT_DATABASE_URL`.
- Use `DATABASE_URL` for runtime app traffic.
