# REST APIs in JavaScript

This guide describes how to design, consume, and implement REST APIs in
JavaScript. The current project does not contain implemented API routes, so the
examples use a conventional `users` resource.

## What is a REST API?

REST (Representational State Transfer) is an architectural style for HTTP
services. A REST API:

- Exposes resources through URLs.
- Uses HTTP methods to describe the requested operation.
- Exchanges representations, commonly JSON.
- Is stateless: each request contains the information needed to process it.
- Uses HTTP status codes to communicate the result.

## HTTP methods

| Method | Purpose | Typical result |
| --- | --- | --- |
| `GET` | Read one or more resources | `200 OK` |
| `POST` | Create a resource | `201 Created` |
| `PUT` | Replace a resource completely | `200 OK` or `204 No Content` |
| `PATCH` | Update part of a resource | `200 OK` or `204 No Content` |
| `DELETE` | Remove a resource | `204 No Content` |         

## Example API

Base URL:

```text
https://api.example.com/v1
```

### Endpoint summary

| Operation | Method | Endpoint |
| --- | --- | --- |
| List users | `GET` | `/users` |
| Get a user | `GET` | `/users/:id` |
| Create a user | `POST` | `/users` |
| Replace a user | `PUT` | `/users/:id` |
| Update a user | `PATCH` | `/users/:id` |
| Delete a user | `DELETE` | `/users/:id` |

### List users

```http
GET /v1/users?page=1&limit=20&role=admin HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>
```

Successful response:

```json
{
  "data": [
    {
      "id": "usr_123",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "role": "admin"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

Common query parameters:

- `page`: page number, starting at `1`.
- `limit`: number of records per page.
- `sort`: field to sort by, for example `createdAt`.
- `order`: `asc` or `desc`.
- `search`: text search value.
- Resource-specific filters such as `role` or `status`.

### Get one user

```http
GET /v1/users/usr_123 HTTP/1.1
Accept: application/json
Authorization: Bearer <token>
```

Response:

```json
{
  "data": {
    "id": "usr_123",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "admin"
  }
}
```

### Create a user

```http
POST /v1/users HTTP/1.1
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>

{
  "name": "Grace Hopper",
  "email": "grace@example.com",
  "role": "user"
}
```

Successful response:

```http
HTTP/1.1 201 Created
Location: /v1/users/usr_456
Content-Type: application/json
```

```json
{
  "data": {
    "id": "usr_456",
    "name": "Grace Hopper",
    "email": "grace@example.com",
    "role": "user"
  }
}
```

### Replace a user

`PUT` normally requires the complete resource representation.

```http
PUT /v1/users/usr_456 HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Grace Hopper",
  "email": "grace.hopper@example.com",
  "role": "admin"
}
```

### Update part of a user

`PATCH` sends only the fields that should change.

```http
PATCH /v1/users/usr_456 HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "role": "user"
}
```

### Delete a user

```http
DELETE /v1/users/usr_456 HTTP/1.1
Authorization: Bearer <token>
```

Successful response:

```http
HTTP/1.1 204 No Content
```

## Status codes

| Code | Meaning | Use |
| --- | --- | --- |
| `200` | OK | Successful read or update with a response body |
| `201` | Created | Resource created successfully |
| `202` | Accepted | Request accepted for asynchronous processing |
| `204` | No Content | Successful operation with no response body |
| `400` | Bad Request | Malformed request or invalid parameters |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but not allowed |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate or state conflict |
| `422` | Unprocessable Content | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server failure |

Use a consistent error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address."
      }
    ],
    "requestId": "req_abc123"
  }
}
```

## Implementing an API with Express

Install Express:

```bash
npm install express
```

Example server:

```js
import crypto from "node:crypto";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const users = new Map([
  ["usr_123", {
    id: "usr_123",
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "admin"
  }]
]);

app.get("/v1/users", (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
    100
  );

  const allUsers = [...users.values()];
  const start = (page - 1) * limit;

  res.json({
    data: allUsers.slice(start, start + limit),
    pagination: { page, limit, total: allUsers.length }
  });
});

app.get("/v1/users/:id", (req, res) => {
  const user = users.get(req.params.id);

  if (!user) {
    return res.status(404).json({
      error: { code: "USER_NOT_FOUND", message: "User was not found." }
    });
  }

  return res.json({ data: user });
});

app.post("/v1/users", (req, res) => {
  const { name, email, role = "user" } = req.body;

  if (typeof name !== "string" || typeof email !== "string") {
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "name and email are required strings."
      }
    });
  }

  const id = `usr_${crypto.randomUUID()}`;
  const user = { id, name, email, role };
  users.set(id, user);

  return res
    .status(201)
    .location(`/v1/users/${id}`)
    .json({ data: user });
});

app.delete("/v1/users/:id", (req, res) => {
  if (!users.delete(req.params.id)) {
    return res.status(404).json({
      error: { code: "USER_NOT_FOUND", message: "User was not found." }
    });
  }

  return res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    error: { code: "ROUTE_NOT_FOUND", message: "Endpoint was not found." }
  });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
```

The example uses `crypto.randomUUID()`, which is available in modern Node.js
versions.

## Calling an API with JavaScript `fetch`

### GET request

```js
const response = await fetch("https://api.example.com/v1/users", {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${token}`
  }
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error?.message || "Request failed");
}

const result = await response.json();
console.log(result.data);
```

### POST request

```js
const response = await fetch("https://api.example.com/v1/users", {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    name: "Grace Hopper",
    email: "grace@example.com"
  })
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}

const createdUser = await response.json();
```

`fetch` does not reject its promise for HTTP errors such as `404` or `500`.
Always check `response.ok` or `response.status`.

## Authentication and security

- Use HTTPS in every non-local environment.
- Prefer short-lived bearer tokens or secure server-side sessions.
- Never put passwords, API keys, or tokens in source control.
- Validate request bodies, query parameters, and path parameters.
- Use parameterized database queries.
- Apply authorization checks to every protected resource.
- Limit request body size and apply rate limiting.
- Configure CORS for known origins instead of allowing every origin by default.
- Do not expose stack traces or database details in production responses.
- Log a request ID and security-relevant events without logging secrets.

## API design checklist

- [ ] Use nouns for resource paths, such as `/users`, not `/getUsers`.
- [ ] Version the public API, for example `/v1`.
- [ ] Use plural resource names consistently.
- [ ] Return a predictable JSON shape.
- [ ] Validate all external input.
- [ ] Return the correct HTTP status code.
- [ ] Document authentication requirements.
- [ ] Document pagination, filtering, and sorting.
- [ ] Add automated tests for success and error cases.
- [ ] Publish an OpenAPI specification for client generation and validation.


