# AutomationOps

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

## 🚀 Gestión del Proyecto con Bun (Task Runner)

Para simplificar la experiencia de desarrollo y evitar escribir comandos largos de Docker Compose o duplicar archivos `.env`, este proyecto utiliza **Bun** como gestor de tareas (_Task Runner_) centralizado en la raíz.

No necesitas inicializar un proyecto de JavaScript complejo ni instalar librerías como `dotenv`, ya que Bun lee las variables de entorno de forma nativa.

### Prerrequisitos

Asegúrate de tener instalado:

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Bun](https://bun.sh/)

### Comandos Disponibles

Todos los comandos se deben ejecutar desde la **raíz del proyecto**:

| Comando     | Lo que hace                                     | ¿Borra tus datos? |
| ----------- | ----------------------------------------------- | ----------------- |
| bun up      | Enciende todo el proyecto en Docker.            | ❌ No             |
| bun stop    | Apaga el proyecto (guarda tu progreso).         | ❌ No             |
| bun destroy | Borra todo para empezar desde cero.             | ⚠️ Sí             |
| bun api:dev | Inicia tu API en la terminal para programar.    | ❌ No             |
| bun db:push | Actualiza las tablas de la base de datos.       | ❌ No             |
| bun db      | Entra a la consola interna de Postgres.         | ❌ No             |
| bun logs    | Muestra los errores y logs de la base de datos. | ❌ No             |

### Flujo de Trabajo Típico en Desarrollo

1. **Iniciar el entorno desde cero:**

```bash
bun up                  # Levanta Docker (Postgres, Valkey, Portainer)

# Espera unos 3 o 5 segundos

bun db:migrate          # Trae todos los datos de la BD
bun api:dev             # Enciende tu servidor backend

# Probar end point
curl localhost:3000/users
```

Por ahora, te devolverá un hermoso `[]` vacío, lo que significa que tu API se conectó a Postgres con éxito, buscó la tabla de usuarios, vio que existía y te confirmó que no hay nadie guardado aún.

2. **Detener el entorno al terminar el día (Guardando tus datos)**:

```bash
bun stop
```

3. **Limpieza profunda (Si algo se rompe o cambias contraseñas del `.env`)**:

```bash
bun destroy
```

Bun actúa como un puente inteligente. Mediante el uso del flag `--cwd` en el `package.json` de la raíz, Bun inyecta de forma automática el archivo `.env` principal a herramientas como `drizzle-kit` o `docker-compose`, eliminando la necesidad de configurar variables relativas (`../../.env`) en las subcarpetas del proyecto.

## Configuración de contraseña de administrador en Portainer

Portainer espera que el flag `--admin-password` reciba un **hash bcrypt**, no una contraseña en texto plano.

**Generar hash bcrypt**

```bash
bun -e "console.log(await Bun.password.hash('change-me', 'bcrypt'))"
```

Ejemplo de salida:

```bash
> $2y$05$qeY8gmRvMabc123456789abcdefghijklmnop
```

Copiar únicamente la parte del hash y agregala en tu archivo `.env`:

```text
$2y$05$qeY8gmRvMabc123456789abcdefghijklmnop
```

**Importante: escapar los caracteres `$` en `.env`**

Docker Compose interpreta `$` como variables de entorno. Todos los caracteres `$` dentro del hash bcrypt deben escaparse utilizando `$$`.

```env
PORTAINER_PASSWORD_HASH=$$2y$$05$$qeY8gmRvMabc123456789abcdefghijklmnop
```

**Importante: Portainer solo inicializa las credenciales una vez**

Portainer almacena las credenciales dentro de:

```text
/data/portainer.db
```

Si la contraseña del usuario `admin` ya fue inicializada anteriormente, modificar el hash en `.env` NO actualizará automáticamente la contraseña.

Es necesario recrear el volumen:

```bash
bun run destroy
bun run up
```

El script `destroy` ejecuta:

```bash
docker compose down -v
```

Lo que elimina los volúmenes persistentes y fuerza a Portainer a crear nuevamente el usuario administrador.

## Inicio Rápido (Requisitos Básicos)

**Requisitos Previos**

- Docker y Docker Compose instalados.
- Un dominio apuntando a Cloudflare.

**Despliegue**

- Clonar el repositorio y configurar el archivo .env.
- Levantar la infraestructura completa con un solo comando, en este caso se utiliza **bun** como _runtime_:

```bash
bun up
```

## Estructura (Tentativa)

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
