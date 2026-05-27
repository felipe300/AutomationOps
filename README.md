# AutomationOps

A modern, minimalist, and high-performance architecture designed for deploying automations, dashboards, APIs, and webhooks in real production environments.

## Documentation

Choose your preferred language:

- 🇺🇸 English → [docs/en.md](./docs/en.md)
- 🇨🇱 Español → [docs/es.md](./docs/es.md)

---

## Overview

AutomationOps is a self-hosted infrastructure stack focused on:

- Workflow automation
- Webhook processing
- MVP/SaaS deployment
- Real-time observability
- Lightweight fullstack development
- Low-resource VPS optimization

Built with a pragmatic philosophy:

- Avoid overengineering
- Reduce operational complexity
- Minimize RAM consumption
- Keep infrastructure portable and reproducible

## 🧱 Core Stack

| Layer             | Technology       |
| ----------------- | ---------------- |
| Edge & Security   | Cloudflare       |
| Reverse Proxy     | Traefik          |
| Containers        | Docker Compose   |
| Backend Runtime   | Bun              |
| Frontend          | HTMX + Alpine.js |
| Authentication    | PocketBase       |
| Database          | PostgreSQL       |
| Cache & Queues    | Valkey           |
| Infrastructure UI | Portainer        |
| Logs              | Dozzle           |
| Monitoring        | Uptime Kuma      |

## ⚡ Quick Start

```bash
bun up
```
