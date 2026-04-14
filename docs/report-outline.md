# PDF Документ - структура

## 1. Използване на API
- Базов URL, аутентикация, роли.
- Endpoint описание:
  - входни полета
  - примерни заявки
  - примерни отговори
  - HTTP кодове и съобщения за грешки

## 2. Архитектура
- Общо описание на модулите:
  - `AuthModule`
  - `DoctorsModule`
  - `PatientsModule`
  - `VisitsModule`
- Data access слой (Prisma).
- Бизнес слой (services) и аргументация за отделянето му от controllers.

## 3. UML диаграми
- Use Case Diagram:
  - актьори: Doctor, Patient
  - действия: create/cancel/list visits, update schedule
- Class Diagram:
  - User, Doctor, Patient, Visit, ScheduleRule, TemporaryChange, PermanentChange
- Sequence Diagram:
  - сценарий: създаване на посещение (валидиране -> запис)

## 4. Архитектурни решения
- Защо NestJS, Prisma и PostgreSQL.
- Как се гарантират валидиранията:
  - DTO validation
  - business guards in services
  - database constraints/indexes

## 5. Тестване
- Unit тестове:
  - `ScheduleResolverService`
  - `VisitsService`
- E2E сценарии:
  - регистрация/login
  - успешно/неуспешно създаване
  - успешно/неуспешно отменяне

## 6. Самоанализ
- Спазени SOLID принципи:
  - SRP (services по домейни)
  - DIP (инжектиране на зависимости)
- Компромиси и оставащи рискове:
  - опростен e2e skeleton
  - dependency on runtime timezone
- Какво бих подобрил:
  - пълни интеграционни тестове с test DB
  - OpenAPI/Swagger документация
  - background jobs за известия
