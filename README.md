# AutomationOps 🚀

Una arquitectura moderna, minimalista y de alto rendimiento diseñada para el despliegue de automatizaciones, dashboards, APIs y webhooks en entornos de producción real.

```text
                [ Internet ]
                    │
                    ▼
                [ Cloudflare ] (DNS, CDN, WAF, Tunnel)
                    │
                    ▼
                [ Traefik ]   (Reverse Proxy & SSL interno)
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
│  │ (Auth & Admin)  │ │     (Datos / Workflows)    │  │
│  └─────────────────┘ └────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │       Capa de Gestión, Ops & Monitoreo         │  │
│  │                                                │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐  │  │
│  │  │ Portainer  │ │   Dozzle   │ │Uptime Kuma │  │  │
│  │  │ (Orquest.) │ │   (Logs)   │ │ (Monitoreo)│  │  │
│  │  └────────────┘ └────────────┘ └────────────┘  │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │                  Valkey                  │  │  │
│  │  │             (Cache / Colas)              │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Objetivo de la Arquitectura

Construir una plataforma robusta y auto-alojada (Self-Hosted) orientada a la **simplicidad operativa y producción real**, optimizando el uso de recursos en servidores VPS económicos.

- **Casos de Uso**: Automatización de flujos de trabajo, dashboards operativos, pasarelas de webhooks, observabilidad integrada y desarrollo de MVPs/SaaS.

- **Filosofía**: Reducir la sobrecarga cognitiva (Overengineering) eliminando la necesidad de configurar Nginx manualmente, administrar certificados SSL complejos o compilar frameworks pesados de JavaScript (React/Vue).

| Componente           | Tecnología     | Rol Principal              | Ventaja Clave                                                        |
| -------------------- | -------------- | -------------------------- | -------------------------------------------------------------------- |
| Edge & Seguridad     | Cloudflare     | DNS, CDN, WAF y Tunnel     | Oculta la IP real del servidor y gestiona SSL global sin esfuerzo    |
| Ingress Controller   | Traefik        | Proxy Inverso Inteligente  | Enrutamiento dinámico automático mediante etiquetas de Docker        |
| Orquestación         | Docker Compose | Contenedores y Redes       | Consistencia absoluta entre entornos                                 |
| Entorno de Ejecución | Bun            | API y Backend Core         | Rendimiento ultra rápido con consumo mínimo de RAM                   |
| UI Interactiva       | HTMX + Alpine  | Frontend Server-Driven     | Interactividad reactiva y ligera sin salir del ecosistema HTML/CSS   |
| Gestión de Usuarios  | PocketBase     | Auth & Panel Admin         | Acelera el MVP proveyendo Auth Base de datos ligera y UI             |
| Persistencia Core    | PostgreSQL     | Base de Datos Relacional   | Estándar de la industria para logs, métricas y datos transaccionales |
| Rendimiento          | Valkey         | Caché y Gestión de Colas   | Alternativa de código abierto compatible con Redis                   |
| Panel DevOps         | Portainer      | Gestión de Infraestructura | UI para contenedores, stacks y volúmenes sin usar SSH                |
| Observabilidad       | Dozzle         | Logs en Tiempo Real        | Streaming de logs ultra ligero y para depuración rápida              |
| Monitoreo            | Uptime Kuma    | Estado de Disponibilidad   | Alertas de caídas de servicios y healthchecks en tiempo real         |

---

## Detalles del Stack

### Infraestructura y Conectividad

**Cloudflare**

Capa de seguridad y optimización perimetral.

- **Uso**: Proxy de tráfico, mitigación de ataques DDoS, aceleración por CDN y conectividad mediante Cloudflare Tunnels (evitando abrir puertos en el router/firewall local).
- **Impacto**: Seguridad profesional automatizada y renovación de certificados perimetrales transparente.

**Traefik**

El punto de entrada unificado para todos los contenedores Docker.

- **Uso**: Detecta automáticamente nuevos servicios levantados en Docker y les asigna subdominios dedicados.
- Ejemplo de enrutamiento:

```text
api.midominio.com  ──► Contenedor Bun API
app.midominio.com  ──► Contenedor HTMX Frontend
pb.midominio.com   ──► Contenedor PocketBase
```

**Docker & Docker Compose**

Aislamiento y empaquetamiento de la infraestructura.

- **Uso**: Define redes internas aisladas, volúmenes persistentes y control de variables de entorno de forma declarativa.

### Capa de Aplicación (Fullstack Minimalista)

**Bun (Backend)**

Motor de ejecución de JavaScript/TypeScript enfocado en la velocidad.

- **Uso**: Procesamiento de Webhooks de alta concurrencia, APIs REST internas y orquestación de la lógica de negocio.
- **Impacto**: Ideal para servidores VPS de bajos recursos (ej. 1GB - 2GB RAM).

**HTMX + Alpine.js (Frontend)**

El combo moderno para desarrollo ágil sin la complejidad de un SPA (Single Page Application).

- **HTMX**: Permite realizar peticiones AJAX/Websockets directamente desde atributos HTML, actualizando fragmentos de la página de forma asíncrona.

- **Alpine.js**: Añade pequeñas capas de interactividad en el cliente (menús desplegables, modales, animaciones y estados locales).

### Datos, Almacenamiento y Cola de Mensajes

**PocketBase**

Backend-as-a-Service embebido.

- **Uso**: Autenticación de usuarios, control de sesiones y panel de administración rápido para la gestión operativa inicial.

**PostgreSQL**

El motor relacional principal del sistema.

- **Uso**: Almacenamiento estructurado de flujos de trabajo, logs históricos de ejecuciones, eventos del sistema y métricas persistentes.

**Valkey**

Fork completamente de código abierto de Redis.

- **Uso**: Almacenamiento en caché de consultas frecuentes, control de tasa de peticiones (Rate Limiting) y manejo de colas de tareas en segundo plano.

### Observabilidad en Tiempo Real

**Portainer (CE)**

El centro de mando para la gestión de infraestructura.

- **Uso:** Despliegue de stacks de Docker Compose mediante Git, actualización de imágenes con un clic, inspección de volúmenes compartidos y acceso rápido a terminales de contenedores.
- **Impacto:** Elimina la necesidad constante de acceder vía SSH al servidor para tareas cotidianas de administración.

**Dozzle**

Visualización aislada y ágil de logs.

- **Uso:** Streaming instantáneo de los logs de Docker a través de una interfaz web reactiva y veloz.
- **Impacto:** Ideal para depuración en vivo (_debugging_) de webhooks o errores en segundo plano sin ralentizar el servidor.

**Uptime Kuma**

Monitor de disponibilidad autónomo.

- **Uso:** Envía notificaciones (vía Discord, Telegram, Slack o Email) si algún servicio o endpoint experimenta degradación, latencias altas o caídas críticas.

## Inicio Rápido (Requisitos Básicos)

**Requisitos Previos**

- Docker y Docker Compose instalados.
- Un dominio apuntando a Cloudflare.

**Despliegue**

- Clonar el repositorio y configurar el archivo .env.
- Levantar la infraestructura completa con un solo comando:

```bash
docker compose up -d        # --> Levantar contenedores
docker ps                   # --> Verificar estado de los contenedores
docker compose down         # --> Detener contenedores
```

## Estructura (Tentativa)

```bash
AutomationOps/
│
├── infra/
│   ├── traefik/
│   ├── postgres/
│   ├── valkey/
│   └── monitoring/
│
├── app/
│   ├── api/
│   ├── frontend/
│   └── workers/
│
├── compose/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
│
├── .env
├── .env.example
└── README.md
```
