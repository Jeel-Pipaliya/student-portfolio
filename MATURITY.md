# Richardson Maturity Model Evaluation (Assignment 1)

**Course:** Advanced Web Development Frameworks (ITUE301)  
**Student Name:** Jeel Pipaliya  
**Student ID:** 24AIML051  
**Department:** B. Tech (AIML)  
**Application:** Student Portfolio Task Management API (Practical 4 & A1)

---

## 1. Overview of the Richardson Maturity Model (RMM)

The **Richardson Maturity Model**, conceived by Leonard Richardson, defines four progressive stages of maturity for RESTful architectures:

- **Level 0 (The Swamp of POX):** The protocol uses HTTP merely as a communication tunnel for Remote Procedure Calls (RPC). All interactions target a single URI and utilize only one HTTP method (conventionally `POST`).
- **Level 1 (Resources):** Introduces individual, addressable resource URIs (`/tasks`, `/tasks/:id`), dividing the application domain into discrete entities rather than funneling all requests to a single endpoint.
- **Level 2 (HTTP Verbs & Status Codes):** Employs standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) according to their formal semantics (safety and idempotence) and communicates outcomes using standard HTTP response status codes (`200`, `201`, `400`, `404`, `415`, `500`).
- **Level 3 (Hypermedia Controls / HATEOAS):** Implements **Hypermedia As The Engine Of Application State (HATEOAS)**. Representations return embedded hypermedia links (`_links`) describing available state transitions dynamically.

---

## 2. API Maturity Evaluation Table

| Level | Criterion | Does API Satisfy? | Evidence & Implementation Details |
|---|---|:---:|---|
| **Level 0: The Swamp of POX** | Single URI and single HTTP verb used as transport tunnel (RPC style). | **Surpassed** | The API does not route operations through a single RPC gateway (e.g. `/api` or `/rpc`). It has fully evolved beyond Level 0 by decomposing domain functionality into discrete resource endpoints. |
| **Level 1: Resources** | Distinct URIs for discrete individual and collection resources. | **YES** | Discrete resource addressing is strictly implemented:<br>• Collection URI: `/tasks`<br>• Individual Item URIs: `/tasks/1`, `/tasks/2`, `/tasks/:id` |
| **Level 2: HTTP Verbs & Status Codes** | Correct HTTP verbs matching CRUD semantics and meaningful HTTP status codes for all responses. | **YES** | Endpoints use standard HTTP verbs with matching status codes:<br>• `GET /tasks` → `200 OK` (Safe, idempotent)<br>• `GET /tasks/:id` → `200 OK` or `404 Not Found`<br>• `POST /tasks` → `201 Created` with resource in body (`400 Bad Request` if validation fails)<br>• `PUT /tasks/:id` → `200 OK` (Idempotent update; `400` for bad input, `404` if missing)<br>• `DELETE /tasks/:id` → `200 OK` (`404` if missing)<br>• Non-JSON request on POST/PUT → `415 Unsupported Media Type`<br>• Undefined routes → `404 Not Found`<br>• Server exceptions → `500 Internal Server Error` |
| **Level 3: Hypermedia Controls (HATEOAS)** | Responses provide hypermedia links (`_links`) guiding clients on next possible transitions. | **YES** | Every task resource returned by the API dynamically includes a `_links` object containing self, update, delete, and collection hypermedia references. |

---

## 3. Endpoint Compliance Summary

| Endpoint | Method | Intended Action | Status Codes | RMM Compliance |
|---|:---:|---|:---:|:---:|
| `/` | `GET` | API Information & Route Discovery | `200 OK` | Level 2 / 3 |
| `/tasks` | `GET` | Retrieve collection of all tasks | `200 OK` | Level 2 / 3 |
| `/tasks/:id` | `GET` | Retrieve a specific task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` | Level 2 / 3 |
| `/tasks` | `POST` | Create a new task resource | `201 Created`, `400 Bad Request`, `415 Unsupported Media Type` | Level 2 / 3 |
| `/tasks/:id` | `PUT` | Update an existing task | `200 OK`, `400 Bad Request`, `404 Not Found`, `415 Unsupported Media Type` | Level 2 / 3 |
| `/tasks/:id` | `DELETE` | Remove a task resource | `200 OK`, `400 Bad Request`, `404 Not Found` | Level 2 / 3 |

---

## 4. HATEOAS Awareness & Representation

In accordance with Level 3 HATEOAS principles, client applications do not need prior hardcoded knowledge of resource transitions. The API embeds a `_links` object in every returned representation.

### Sample Level 3 JSON Representation:

```json
{
  "id": 1,
  "title": "SignBridge AI: Train Indian Sign Language Gesture Classifier",
  "description": "Optimize MediaPipe hand landmarks and train a lightweight TensorFlow classification model.",
  "category": "AI/ML",
  "priority": "High",
  "completed": true,
  "createdAt": "2026-10-20T14:48:00.000Z",
  "_links": {
    "self": {
      "href": "http://localhost:5000/tasks/1",
      "method": "GET"
    },
    "update": {
      "href": "http://localhost:5000/tasks/1",
      "method": "PUT"
    },
    "delete": {
      "href": "http://localhost:5000/tasks/1",
      "method": "DELETE"
    },
    "collection": {
      "href": "http://localhost:5000/tasks",
      "method": "GET"
    }
  }
}
```

### Collection Level 3 JSON Representation:

```json
{
  "count": 4,
  "tasks": [ ... ],
  "_links": {
    "self": { "href": "http://localhost:5000/tasks", "method": "GET" },
    "create": { "href": "http://localhost:5000/tasks", "method": "POST" }
  }
}
```

---

## 5. Why Most Production APIs Stop at Level 2

While Level 3 (HATEOAS) represents the theoretical ideal of the REST architectural style defined by Roy Fielding, the overwhelming majority of production web APIs (e.g., Stripe, GitHub, Twitter/X, Twilio) deliberately stop at **Level 2**:

1. **Payload & Network Overhead:** Embedding extensive link graphs in every single resource representation significantly increases response size and serialisation overhead, especially in high-throughput enterprise environments and mobile networks.
2. **Standardization of Out-of-Band Documentation:** The industry has standardized on contract-first tooling such as **OpenAPI (Swagger)**, **Postman Collections**, and **TypeScript definitions**. Because modern development teams generate static client SDKs from machine-readable specifications, runtime link discovery is often unnecessary.
3. **Frontend Client Architecture:** Mainstream frontend libraries (React Query, RTK Query, Axios, Apollo) are designed around statically declared URLs or parameterized route templates. There is minimal native library support for hypermedia graph traversal on the client side.
4. **Complexity vs. Practical Value:** Level 2 (proper resource URIs, semantic HTTP verbs, and meaningful status codes) delivers approximately 95% of the practical benefits of REST—simplicity, cacheability, and separation of concerns—without the cognitive and engineering cost of building and maintaining a hypermedia engine.
