# AutomationOps

A modern, minimalist, and high-performance architecture designed for deploying automations, dashboards, APIs, and webhooks in real production environments.

```text
                [ Internet ]
                    │
                    ▼
                [ Cloudflare ] (DNS, CDN, WAF, Tunnel)
                    │
                    ▼
                [ Traefik ]   (Reverse Proxy & Internal SSL)
                    │
                    ▼
┌─────────────────── Docker Compose ───────────────────┐
│                                                      │
│  ┌─────────────────┐ ┌────────────────────────────┐  │
│  │    Frontend     │ │          Backend           │  │
│  │  (HTMX/Alpine)  │ │      (Bun API / Core)      │  │
│  └────────┬────────┘ └─────────────┬──────────────┘  │
│           │                        │                 │
│           ▼                        ▼                 │
│  ┌─────────────────┐ ┌────────────────────────────┐  │
│  │   PocketBase    │ │         PostgreSQL         │  │
│  │ (Auth & Admin)  │ │   (Data / Workflows)       │  │
│  └─────────────────┘ └────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │      Management, Ops & Monitoring Layer        │  │
│  │                                                │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │  │
│  │  │ Portainer  │ │   Dozzle   │ │Uptime Kuma │  │  │
│  │  │ (Orches.)  │ │   (Logs)   │ │(Monitoring)│  │  │
│  │  └────────────┘ └────────────┘ └────────────┘  │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │                  Valkey                  │  │  │
│  │  │            (Cache / Queues)              │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Architecture Goal

Build a robust and self-hosted platform focused on **operational simplicity and real-world production**, optimizing resource usage on low-cost VPS servers.

- **Use Cases**: Workflow automation, operational dashboards, webhook gateways, integrated observability, and MVP/SaaS development.

- **Philosophy**: Reduce cognitive overhead (overengineering) by eliminating the need to manually configure Nginx, manage complex SSL certificates, or compile heavy JavaScript frameworks (React/Vue).

| Component           | Technology     | Main Role                  | Key Advantage                                                   |
| ------------------- | -------------- | -------------------------- | --------------------------------------------------------------- |
| Edge & Security     | Cloudflare     | DNS, CDN, WAF and Tunnel   | Hides the server's real IP and manages global SSL effortlessly  |
| Ingress Controller  | Traefik        | Smart Reverse Proxy        | Automatic dynamic routing through Docker labels                 |
| Orchestration       | Docker Compose | Containers and Networks    | Absolute consistency between environments                       |
| Runtime Environment | Bun            | API and Backend Core       | Ultra-fast performance with minimal RAM usage                   |
| Interactive UI      | HTMX + Alpine  | Server-Driven Frontend     | Reactive and lightweight interactivity without leaving HTML/CSS |
| User Management     | PocketBase     | Auth & Admin Panel         | Accelerates MVP development with lightweight auth and admin UI  |
| Core Persistence    | PostgreSQL     | Relational Database        | Industry standard for logs, metrics, and transactional data     |
| Performance         | Valkey         | Cache and Queue Management | Open-source Redis-compatible alternative                        |
| DevOps Panel        | Portainer      | Infrastructure Management  | UI for containers, stacks, and volumes without using SSH        |
| Observability       | Dozzle         | Real-Time Logs             | Ultra-lightweight log streaming for fast debugging              |
| Monitoring          | Uptime Kuma    | Availability Status        | Real-time alerts and service health checks                      |

---

## Stack Details

### Infrastructure and Connectivity

**Cloudflare**

Perimeter security and optimization layer.

- **Usage**: Traffic proxying, DDoS mitigation, CDN acceleration, and connectivity through Cloudflare Tunnels (avoiding opening ports on the local router/firewall).
- **Impact**: Automated enterprise-grade security and seamless perimeter SSL renewal.

**Traefik**

The unified entry point for all Docker containers.

- **Usage**: Automatically detects newly deployed Docker services and assigns dedicated subdomains.
- Routing example:

```text
api.mydomain.com  ──► Bun API Container
app.mydomain.com  ──► HTMX Frontend Container
pb.mydomain.com   ──► PocketBase Container
```

**Docker & Docker Compose**

Infrastructure isolation and packaging.

- **Usage**: Declaratively defines isolated internal networks, persistent volumes, and environment variable management.

### Application Layer (Minimalist Fullstack)

**Bun (Backend)**

A JavaScript/TypeScript runtime focused on speed.

- **Usage**: High-concurrency webhook processing, internal REST APIs, and business logic orchestration.
- **Impact**: Ideal for low-resource VPS servers (e.g. 1GB - 2GB RAM).

**HTMX + Alpine.js (Frontend)**

The modern combo for agile development without the complexity of a SPA (Single Page Application).

- **HTMX**: Enables AJAX/WebSocket requests directly from HTML attributes, asynchronously updating page fragments.

- **Alpine.js**: Adds lightweight client-side interactivity (dropdowns, modals, animations, and local state).

### Data, Storage, and Message Queue Layer

**PocketBase**

Embedded Backend-as-a-Service.

- **Usage**: User authentication, session management, and a fast admin panel for initial operational management.

**PostgreSQL**

The system’s main relational engine.

- **Usage**: Structured storage for workflows, historical execution logs, system events, and persistent metrics.

**Valkey**

A fully open-source Redis fork.

- **Usage**: Caching frequent queries, rate limiting, and background task queue management.

### Real-Time Observability

**Portainer (CE)**

The infrastructure management command center.

- **Usage:** Deploy Docker Compose stacks via Git, update images with one click, inspect shared volumes, and quickly access container terminals.
- **Impact:** Eliminates the constant need to SSH into the server for daily administration tasks.

**Dozzle**

Fast and isolated log visualization.

- **Usage:** Instant Docker log streaming through a reactive and lightweight web interface.
- **Impact:** Ideal for live debugging of webhooks or background errors without slowing down the server.

**Uptime Kuma**

Autonomous uptime monitoring.

- **Usage:** Sends notifications (via Discord, Telegram, Slack, or Email) if a service or endpoint experiences degradation, high latency, or critical downtime.

## 🚀 Project Management with Bun (Task Runner)

To simplify the development experience and avoid writing long Docker Compose commands or duplicating `.env` files, this project uses **Bun** as the centralized task runner at the root level.

You do not need to initialize a complex JavaScript project or install libraries like `dotenv`, since Bun natively reads environment variables.

### Prerequisites

Make sure you have installed:

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Bun](https://bun.sh/)

### Available Commands

All commands must be executed from the **project root**:

| Command     | What it does                                | Does it delete your data? |
| ----------- | ------------------------------------------- | ------------------------- |
| bun up      | Starts the entire project in Docker.        | ❌ No                     |
| bun stop    | Stops the project (keeps your progress).    | ❌ No                     |
| bun destroy | Deletes everything to start from scratch.   | ⚠️ Yes                    |
| bun api:dev | Starts your API in the terminal for coding. | ❌ No                     |
| bun db:push | Updates the database tables.                | ❌ No                     |
| bun db      | Opens the internal Postgres console.        | ❌ No                     |
| bun logs    | Displays database logs and errors.          | ❌ No                     |

### Typical Development Workflow

1. **Start the environment from scratch:**

```bash
bun up                  # Starts Docker (Postgres, Valkey, Portainer)

# Wait about 3 to 5 seconds

bun db:migrate          # Pulls all database data
bun api:dev             # Starts your backend server

# Test endpoint
curl localhost:3000/users
```

For now, it will return a beautiful empty `[]`, which means your API successfully connected to Postgres, found the users table, confirmed it exists, and verified that no users are stored yet.

2. **Stop the environment at the end of the day (keeping your data):**

```bash
bun stop
```

3. **Deep cleanup (if something breaks or you changed `.env` passwords):**

```bash
bun destroy
```

Bun acts as a smart bridge. By using the `--cwd` flag in the root `package.json`, Bun automatically injects the main `.env` file into tools like `drizzle-kit` or `docker-compose`, eliminating the need to configure relative environment variables (`../../.env`) inside project subfolders.

## Configuring the Admin Password in Portainer

Portainer expects the `--admin-password` flag to receive a **bcrypt hash**, not a plain text password.

**Generate bcrypt hash**

```bash
bun -e "console.log(await Bun.password.hash('change-me', 'bcrypt'))"
```

Example output:

```bash
> $2y$05$qeY8gmRvMabc123456789abcdefghijklmnop
```

Copy only the hash portion and add it to your `.env` file:

```text
$2y$05$qeY8gmRvMabc123456789abcdefghijklmnop
```

**Important: escape `$` characters in `.env`**

Docker Compose interprets `$` as environment variables. All `$` characters inside the bcrypt hash must be escaped using `$$`.

```env
PORTAINER_PASSWORD_HASH=$$2y$$05$$qeY8gmRvMabc123456789abcdefghijklmnop
```

**Important: Portainer only initializes credentials once**

Portainer stores credentials in:

```text
/data/portainer.db
```

If the `admin` user password was already initialized previously, modifying the hash in `.env` will NOT automatically update the password.

You must recreate the volume:

```bash
bun run destroy
bun run up
```

The `destroy` script runs:

```bash
docker compose down -v
```

This removes persistent volumes and forces Portainer to recreate the administrator user.

## Quick Start (Basic Requirements)

**Prerequisites**

- Docker and Docker Compose installed.
- A domain pointing to Cloudflare.

**Deployment**

- Clone the repository and configure the `.env` file.
- Start the full infrastructure with a single command. In this case, **Bun** is used as the runtime:

```bash
bun up
```

## Structure (Tentative)

```bash
AutomationOps
├── app
│   ├── api
│   │   ├── bun.lock
│   │   ├── Dockerfile
│   │   ├── drizzle
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── src
│   │   │   ├── db
│   │   │   │   ├── client.ts
│   │   │   │   └── schema.ts
│   │   │   ├── index.ts
│   │   │   ├── lib
│   │   │   ├── middleware
│   │   │   ├── routes
│   │   │   │   ├── health.ts
│   │   │   │   └── users.ts
│   │   │   └── server.ts
│   │   └── tsconfig.json
│   ├── frontend
│   └── workers
├── compose
│   └── docker-compose.yml
├── infra
│   ├── monitoring
│   ├── postgres
│   │   └── data
│   ├── traefik
│   └── valkey
│       └── data
│           ├── appendonlydir
│           └── dump.rdb
├── package.json
└── README.md
```
