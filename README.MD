# Transações com TS, NoSQL, Knex

## Variáveis de ambiente

```sh
NODE_ENV=development

SERVICE_PORT=3333
SERVICE_HOST=0.0.0.0

DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
DATABASE_MIGRATIONS=./db/migrations
```

## Endpoints

**Autenticação**

Um Cookie é fornecido após o cadastro da primeira transação de crédito ou débito. Ele seve ser utilizado como identificação nas próximas operacções.

**Nova transação**

POST `/transactions`, informando o Cookie caso já tenha recebido

```json
{
    "title": "Test transaction",
    "amount": 5000,
    "type": "credit",
}
```

Resposta:

```json
{
    "id": 76,
    "uuid": "409624f5-60ac-4cd5-8164-24dd2b82a587",
    "title": "Test transaction",
    "amount": 5000,
    "created_at": "2026-03-29 21:15:54",
    "session_id": "c3468c0c-8a20-4b79-bd01-31338548e956"
}
```

**Listar transações**

GET `/transactions`, informando o Cookie obtido na primeira transação

Resposta:

```json
{
  "transactions": [
    {
      "id": 59,
      "uuid": "6b5b5ef3-dcf0-4525-9e14-b18d8abb52ca",
      "title": "Test transaction",
      "amount": 5000,
      "created_at": "2026-03-22 21:10:51",
      "session_id": "c3468c0c-8a20-4b79-bd01-31338548e956"
    },
    {
      "id": 76,
      "uuid": "409624f5-60ac-4cd5-8164-24dd2b82a587",
      "title": "Test transaction",
      "amount": 5000,
      "created_at": "2026-03-29 21:15:54",
      "session_id": "c3468c0c-8a20-4b79-bd01-31338548e956"
    }
  ]
}
```

**Mostrar uma transação**

GET `/transactions/{uuid}`, informando o Cookie obtido na primeira transação

Resposta:

```json
{
  "transaction": {
    "id": 59,
    "uuid": "6b5b5ef3-dcf0-4525-9e14-b18d8abb52ca",
    "title": "Test transaction",
    "amount": 5000,
    "created_at": "2026-03-22 21:10:51",
    "session_id": "c3468c0c-8a20-4b79-bd01-31338548e956"
  }
}
```

**Saldo da conta**

GET `/transactions/summary`, informando o Cookie obtido na primeira transação

Resposta:

```json
{
  "amount": 10000
}
```