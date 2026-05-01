# DANKOS OS — Technical Architecture

*Version: 1.0*
*Date: May 1, 2026*
*Status: DRAFT*

---

## 1. Architecture Philosophy

### Bootstrapped ≠ Cheap
We build for operators, not investors. The architecture prioritizes:
1. **Simplicity** — every component chosen for its ability to do one thing well
2. **Resilience** — works when the internet dies, when the server reboots, when nothing goes according to plan
3. **Observability** — we know when things break before operators call
4. **Recoverability** — backups that actually restore, no guesswork
5. **Cost efficiency** — $20-40/month server, no surprise bills

### What We're NOT Building
- No Kubernetes, no microservices, no service mesh
- No distributed databases, no eventual consistency
- No serverless functions, no managed AI services
- No managed CI/CD platforms
- No CDN that costs more than our server
- No "innovate with AI" — we solve problems, not chase trends

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                     INTERNET                         │
│  ┌──────────┐    ┌───────────┐    ┌───────────────┐ │
│  │   POS    │    │   PWA     │    │  Admin Panel  │ │
│  │ (Browser)│    │(Browser)  │    │  (Browser)    │ │
│  └────┬─────┘    └─────┬─────┘    └───────┬───────┘ │
└───────┼────────────────┼────────────────────┼───────┘
        │                │                    │
        └────────────────┼────────────────────┘
                         │ HTTPS (TLS 1.3)
                         ▼
┌─────────────────────────────────────────────────────┐
│              ┌──────────────────────┐                │
│              │     Nginx Reverse    │                │
│              │    Proxy + TLS       │                │
│              │     (Port 443)       │                │
│              └──────────┬───────────┘                │
│                         │                            │
│              ┌──────────▼───────────┐                │
│              │   Static Assets       │                │
│              │   (PWA, CSS, Images)  │                │
│              └───────────────────────┘                │
└─────────────────────────────────────────────────────┘
                         │
                         │ localhost:3000
                         ▼
┌─────────────────────────────────────────────────────┐
│              Node.js Application Server              │
│                                                      │
│  ┌─────────────┐ ┌────────────┐ ┌───────────────┐   │
│  │ Express API │ │  Worker     │ │  Session Mgmt │   │
│  │ (REST)      │ │  Queue      │ │  (Redis)      │   │
│  └──────┬──────┘ └─────┬──────┘ └───────┬───────┘   │
│         │              │                 │           │
│  ┌──────▼──────────────▼─────────────────▼───────┐   │
│  │           Domain Services Layer                 │   │
│  │                                              │   │
│  │  POS  │  Inventory  │  Compliance  │  PWA    │   │
│  │  CRM  │  Analytics    │  Auth       │  Auth   │   │
│  └──────┬────────────────────────────────────────┘   │
│         │                                            │
└─────────┼────────────────────────────────────────────┘
          │
          │
          │ localhost:5432                    localhost:6379
          ▼                                   ▼
┌─────────────────────┐          ┌──────────────────────────┐
│   PostgreSQL 16     │          │       Redis 7            │
│                     │          │                          │
│  ├── tenants        │          │  ├── Sessions             │
│  ├── users          │          │  ├── Rate limits          │
│  ├── dispensaries   │          │  ├── POS offline queue    │
│  ├── products       │          │  ├── METRC sync buffer    │
│  ├── transactions   │          │  └── Cache (TTL)         │
│  ├── inventory      │          │                          │
│  ├── customers      │          └──────────────────────────┘
│  ├── compliance     │
│  ├── pwa_configs    │
│  └── audit_log      │
└─────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Why | Cost |
|---|---|---|---|
| **Runtime** | Node.js 22 LTS | Mature, huge ecosystem, single language across stack | Free |
| **Web Framework** | Express.js | Simple, proven, no bloat | Free |
| **ORM** | Prisma | Type-safe queries, migrations, great DX | Free |
| **Database** | PostgreSQL 16 | ACID, JSONB for flexible data, mature, battle-tested | Free |
| **Cache/Session** | Redis 7 | Sessions, rate limiting, offline transaction queue | Free |
| **HTTP Server** | Nginx | Reverse proxy, TLS termination, gzip, static files | Free |
| **PWA** | Next.js 14 (App Router) | React, SSR for SEO, service workers, route handlers | Free |
| **Styling** | Tailwind CSS | Fast UI development, consistent design system | Free |
| **TLS** | Let's Encrypt + Certbot | Automatic SSL certificates | Free |
| **Email** | Resend or Postmark | Reliable, cheap, deliverable | $15-30/mo |
| **SMS** | Twilio | Industry standard, reliable | $15-30/mo |
| **Monitoring** | Uptime Kuma | Self-hosted uptime monitoring, alerts | Free |
| **Error Tracking** | Sentry (self-hosted or free) | Error tracking, performance monitoring | Free-$25/mo |
| **Backups** | pg_dump + cron | Simple, reliable, restore-tested | Free |
| **CI/CD** | GitHub Actions | Free tier, SSH deployment | Free |
| **Domain** | Cloudflare (free) | DNS, free SSL, basic caching, DDoS protection | Free |

**Total monthly cost: $50-100/month** (including email, SMS, monitoring)

---

## 4. Database Schema

### Core Tables

```sql
-- Tenants (multi-tenant isolation)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,  -- e.g., "green-garden" for green-garden.dankos.io
    status TEXT DEFAULT 'active',  -- active, suspended, trial
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    password_hash TEXT,
    name TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'budtender', 'cashier', 'viewer')),
    two_factor_secret TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Dispensary (physical location)
CREATE TABLE dispensaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT NOT NULL,
    zip_code TEXT,
    license_number TEXT,
    license_expiry DATE,
    state_tracking_system TEXT NOT NULL CHECK (state_tracking_system IN ('metrc', 'biotrack')),
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    metrc_id TEXT,  -- State system ID
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    brand TEXT,
    category TEXT NOT NULL,  -- flower, vape, edible, beverage, topical, pre-roll
    strain_type TEXT CHECK (strain_type IN ('sativa', 'indica', 'hybrid')),
    thc_percentage NUMERIC(5,2),
    cbd_percentage NUMERIC(5,2),
    thcv_percentage NUMERIC(5,2),
    cbg_percentage NUMERIC(5,2),
    cbn_percentage NUMERIC(5,2),
    terpene_profile TEXT,
    effect_tags TEXT[],  -- e.g., ['relaxation', 'creativity', 'sleep']
    unit_of_measure TEXT NOT NULL DEFAULT 'gram',
    price NUMERIC(10,2) NOT NULL,
    cost NUMERIC(10,2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metrc_sync_status TEXT DEFAULT 'pending',  -- pending, synced, error
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT REFERENCES dispensaries(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    metrc_tag TEXT,  -- Unique identifier tag from METRC
    quantity NUMERIC(10,4) NOT NULL DEFAULT 0,
    unit_of_measure TEXT NOT NULL,
    unit_cost NUMERIC(10,2),
    lot_number TEXT,
    harvest_date DATE,
    expiration_date DATE,
    metrc_sync_status TEXT DEFAULT 'pending',
    metrc_last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dispensary_id, product_id, lot_number)
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    customer_id UUID REFERENCES customers(id),
    status TEXT NOT NULL DEFAULT 'completed',  -- completed, voided, refunded
    subtotal NUMERIC(10,2) NOT NULL,
    tax_total NUMERIC(10,2) NOT NULL,
    discount_total NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('debit', 'cash', 'mixed')),
    metrc_report_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Items
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity NUMERIC(10,4) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    metrc_line_item_id TEXT
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    date_of_birth DATE,
    id_verified BOOLEAN DEFAULT FALSE,
    id_verification_at TIMESTAMPTZ,
    id_verification_method TEXT,
    total_visits INTEGER DEFAULT 0,
    total_spent NUMERIC(10,2) DEFAULT 0,
    first_purchase_at TIMESTAMPTZ,
    loyalty_points INTEGER DEFAULT 0,
    tags TEXT[],  -- auto-tags based on purchase patterns
    preferred_category TEXT,  -- auto-determined from purchase history
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance: Purchase Limits per State
CREATE TABLE purchase_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    product_category TEXT NOT NULL,
    limit_type TEXT NOT NULL,  -- daily, weekly, per_transaction
    limit_value NUMERIC(10,4) NOT NULL,
    unit TEXT NOT NULL,  -- grams, pieces, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dispensary_id, state, product_category, limit_type)
);

-- Compliance: Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,  -- transaction, inventory, product, customer
    entity_id UUID NOT NULL,
    before_data JSONB,
    after_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PWA Configurations
CREATE TABLE pwa_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    template TEXT NOT NULL DEFAULT 'modern',  -- modern, botanical, luxury, minimal, bold
    brand_logo_url TEXT,
    brand_colors JSONB DEFAULT '{"primary": "#1B5E20", "secondary": "#10B981", "accent": "#D4AF37"}',
    brand_font TEXT DEFAULT 'inter',
    brand_tagline TEXT,
    about_text TEXT,
    hero_image_url TEXT,
    featured_product_ids UUID[],
    enabled_categories TEXT[],
    navigation_items JSONB DEFAULT '[{"label":"Products","path":"/products"},{"label":"About","path":"/about"},{"label":"Order","path":"/order"}]',
    custom_domain TEXT,
    cname_record TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POS Offline Transactions (queued when offline)
CREATE TABLE offline_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    payload JSONB NOT NULL,  -- Full transaction data as JSON
    status TEXT DEFAULT 'queued',  -- queued, syncing, synced, failed
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- METRC Sync Buffer
CREATE TABLE metrc_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispensary_id UUID NOT NULL REFERENCES dispensaries(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,  -- inventory, product, transaction
    entity_id UUID NOT NULL,
    operation TEXT NOT NULL,  -- create, update, delete
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending',  -- pending, syncing, synced, failed
    metrc_response TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
```

### Key Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_products_dispensary ON products(dispensary_id);
CREATE INDEX idx_products_active ON products(dispensary_id, is_active);
CREATE INDEX idx_inventory_dispensary_product ON inventory(dispensary_id, product_id);
CREATE INDEX idx_inventory_quantity ON inventory(dispensary_id, quantity) WHERE quantity > 0;
CREATE INDEX idx_transactions_dispensary_date ON transactions(dispensary_id, created_at DESC);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_customers_dispensary_phone ON customers(dispensary_id, phone);
CREATE INDEX idx_audit_log_user_date ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_offline_transactions_dispensary_status ON offline_transactions(dispensary_id, status);
CREATE INDEX idx_metrc_sync_queue_status ON metrc_sync_queue(status, created_at);
CREATE INDEX idx_pwa_configs_dispensary ON pwa_configs(dispensary_id);
```

---

## 5. Application Architecture

### 5.1 Monolithic Structure (No Microservices)

```
server/
├── src/
│   ├── app.ts              # Express app, middleware, error handling
│   ├── server.ts           # Server startup, port, graceful shutdown
│   ├── config/             # Environment config, database connections
│   ├── middleware/
│   │   ├── auth.ts         # JWT/session authentication
│   │   ├── tenant.ts       # Multi-tenant data isolation
│   │   ├── rate-limit.ts   # Rate limiting (Redis-backed)
│   │   └── audit.ts        # Audit logging middleware
│   ├── modules/
│   │   ├── auth/           # Login, signup, 2FA, password reset
│   │   ├── pos/            # Transaction processing, cart management
│   │   ├── inventory/      # Inventory CRUD, receive, adjust, transfer
│   │   ├── compliance/     # Purchase limits, DSR generation, audit
│   │   ├── pwa/            # PWA config, template engine, publishing
│   │   ├── analytics/      # Dashboard data, aggregations
│   │   ├── customer/       # Customer profiles, loyalty
│   │   ├── metrc/          # METRC API integration, sync engine
│   │   ├── payment/        # Payment processing, reconciliation
│   │   ├── notification/   # Email, SMS, push notifications
│   │   └── tenant/         # Tenant provisioning, multi-tenancy
│   ├── services/           # Shared services (email, SMS, file storage)
│   ├── workers/
│   │   ├── metrc-sync.ts   # Background worker for METRC sync
│   │   ├── email-queue.ts  # Background worker for email delivery
│   │   └── offline-sync.ts # Background worker for offline transaction sync
│   └── shared/
│       ├── types.ts        # TypeScript types/interfaces
│       ├── utils.ts        # Shared utility functions
│       └── constants.ts    # Business constants
├── prisma/
│   └── schema.prisma       # Database schema (Prisma)
└── package.json
```

### 5.2 Multi-Tenant Isolation Strategy

**Approach: Shared Database, Tenant ID on Every Row**

Simple, proven, works at any scale. Every query includes `WHERE tenant_id = ?`. Prisma makes this seamless.

```typescript
// Middleware: enforce tenant isolation
app.use(tenantMiddleware((req, res, next) => {
  const user = req.user;
  req.tenantId = user.tenant_id;
  next();
}));

// Prisma: automatically add tenant filter
const products = await prisma.products.findMany({
  where: {
    dispensary: { tenant: { id: req.tenantId } },  // implicit filter
    is_active: true
  }
});
```

### 5.3 Worker Queues

**What needs background processing:**
1. METRC sync (inventory changes, transaction reports)
2. Email delivery (receipts, notifications, reports)
3. Offline transaction sync (queue → process → clear)
4. PWA cache invalidation (when products/pricing change)

**Queue implementation:** Redis-based, simple job queue. No BullMQ needed for MVP — just Redis lists with `BRPOP`.

```typescript
// Simple Redis queue
async function enqueue(task: Task) {
  await redis.lpush('queue:metrc-sync', JSON.stringify(task));
}

async function processQueue() {
  while (true) {
    const raw = await redis.brpop('queue:metrc-sync', 0);
    if (raw) {
      const task = JSON.parse(raw[1]);
      await handleMetrcSync(task);
    }
  }
}
```

---

## 6. POS Offline Mode Architecture

**The critical reliability feature. The POS must work when the internet dies.**

### Flow:

```
[Budtender at POS]
       │
       ▼ (internet is down)
[Local Cart (React state)]
       │
       ▼ (checkout complete)
[POS saves transaction locally]
       │
       ├── 1. Create local transaction record (IndexedDB / localStorage)
       ├── 2. Deduct local inventory count
       ├── 3. Show receipt immediately
       └── 4. Queue transaction for sync
       │
       ▼ (internet comes back)
[Background sync worker detects connection]
       │
       ├── 1. Push transactions to server
       ├── 2. Push inventory changes to METRC
       ├── 3. Pull latest product catalog
       ├── 4. Run reconciliation check
       └── 5. Clear local queue
```

### Storage Strategy:
- **In-memory cart:** React state (fast, no serialization needed)
- **Offline transaction queue:** IndexedDB in browser (persistent, survives page reload)
- **Local inventory cache:** LocalStorage (product catalog + current stock levels)
- **Sync state:** Flag on each offline transaction (queued → syncing → synced/failed)

### Conflict Resolution:
When reconnecting, the server is the source of truth:
1. Server applies queued transactions in order
2. Server checks for conflicts (e.g., inventory changed between offline and online)
3. If conflict: flag for manual review, alert the operator
4. If no conflict: apply automatically

---

## 7. METRC Integration Architecture

### 7.1 Connection Model

Direct API integration to METRC — no middleware, no third-party connector. We build and maintain it.

```
DANKOS OS ──HTTPS──▶ METRC API (REST)
         │             │
         │             ├── Inventory sync (push/pull)
         │             ├── Daily Status Reports (push)
         │             ├── Product lookup (pull)
         │             └── Transaction reporting (push)
```

### 7.2 Sync Flow

```typescript
// Every inventory change triggers a METRC sync
async function onInventoryUpdate(dispensaryId, productId, newQuantity) {
  // 1. Update local DB
  await prisma.inventory.update(...);
  
  // 2. Push to METRC asynchronously
  await enqueueMetrcSync({
    dispensaryId,
    type: 'inventory.update',
    productId,
    quantity: newQuantity
  });
  
  // 3. Worker picks it up and pushes to METRC API
  // 4. On success: mark as synced
  // 5. On failure: retry with exponential backoff (1m, 5m, 15m, 1h)
  // 6. After 5 failures: flag for manual review
}

// Daily Status Report (DSR) generation
async function generateDSR(dispensaryId, date) {
  // 1. Pull all METRC changes for the day
  // 2. Pull all local transactions for the day
  // 3. Compare and reconcile
  // 4. Format for METRC DSR submission
  // 5. Return formatted report (one-click submit)
}
```

### 7.3 Retry Strategy

```
Retry 1: 1 minute
Retry 2: 5 minutes
Retry 3: 15 minutes
Retry 4: 1 hour
Retry 5: 4 hours → flag for manual review
```

After 5 failures, operator gets an alert: "METRC sync failed for X items. Review required."

---

## 8. PWA Architecture

### 8.1 PWA Generation Flow

```
┌─────────────────────────────────────────────────┐
│              Operator Dashboard                  │
│                                                  │
│  [PWA Builder]                                   │
│    ┌───────────────────┐  ┌──────────────────┐  │
│    │  Template Select   │  │  Customization    │  │
│    │  (5 templates)     │  │  Panel            │  │
│    │                   │  │  - Colors         │  │
│    │                   │  │  - Logo           │  │
│    │                   │  │  - Typography     │  │
│    │                   │  │  - Content        │  │
│    │                   │  │  - Layout         │  │
│    └─────────┬─────────┘  └────────┬─────────┘  │
│              │                     │              │
│              └─────────┬───────────┘              │
│                        ▼                          │
│              [Live Preview]                       │
│              (reacts to changes in real-time)     │
│                        ▼                          │
│              [Publish] [Save Draft]               │
└─────────────────────────────────────────────────┘
```

### 8.2 PWA Runtime (Next.js App)

```
pwa/                          # Separate Next.js app
├── app/
│   ├── [slug]/               # Dynamic route per dispensary
│   │   ├── page.tsx          # Home page
│   │   ├── products/
│   │   │   └── page.tsx      # Product catalog
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Product detail
│   │   ├── about/
│   │   │   └── page.tsx      # About page
│   │   └── order/
│   │       └── page.tsx      # Cart + checkout
│   ├── age-gate/
│   │   └── page.tsx          # Age verification gate
│   └── manifest.ts           # Web app manifest
├── lib/
│   ├── pwa-config.ts         # Fetch PWA config from API
│   └── products.ts           # Fetch products from OS API
├── public/                   # Shared assets
├── service-worker.ts         # Service worker (offline caching)
├── next.config.mjs           # Next.js config
└── package.json
```

### 8.3 Data Fetching for PWA

```typescript
// PWA fetches dispensary config + products from OS API
// No direct DB access — goes through OS API

export async function getDispensary(slug: string) {
  const res = await fetch(
    `${process.env.OS_API_URL}/api/pwa/${slug}/config`
  );
  return res.json();
}

export async function getProducts(slug: string) {
  const config = await getDispensary(slug);
  const res = await fetch(
    `${process.env.OS_API_URL}/api/pwa/${slug}/products?categories=${config.enabledCategories.join(',')}`
  );
  return res.json();
}
```

### 8.4 Service Worker Strategy

```typescript
// service-worker.ts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icons/icon-192.png',
        '/icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Cache successful responses for future offline use
        if (response.ok) {
          const clone = response.clone();
          caches.open('pwa-v1').then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
```

---

## 9. Deployment Architecture

### 9.1 Server Setup (DigitalOcean / Hetzner)

```
Server: 2 CPU, 4GB RAM, 80GB SSD
OS: Debian 12 / Ubuntu 24.04
```

**Software:**
```bash
# Install dependencies
sudo apt update && sudo apt install -y \
  nginx \
  postgresql-16 \
  redis-server \
  nodejs \
  npm \
  certbot \
  python3-certbot-nginx \
  fail2ban

# Enable services
sudo systemctl enable postgresql redis-server nginx
sudo systemctl start postgresql redis-server nginx
```

**Process management:** `pm2` (Node.js process manager)

```bash
# Start the application
pm2 start server/dist/server.js --name dankos-api --watch

# Start workers
pm2 start server/dist/workers/metrc-sync.js --name metrc-sync
pm2 start server/dist/workers/email-queue.js --name email-queue
pm2 start server/dist/workers/offline-sync.js --name offline-sync

# Save process list
pm2 save
pm2 startup
```

### 9.2 Nginx Configuration

```nginx
# /etc/nginx/sites-available/dankos
server {
    listen 80;
    server_name api.dankos.io pwa.dankos.io;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.dankos.io;

    ssl_certificate /etc/letsencrypt/live/api.dankos.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.dankos.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    # Rate limiting
    location /api/metrc/ {
        limit_req zone=metrc_sync burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
    }
}

server {
    listen 443 ssl http2;
    server_name pwa.dankos.io *.dankos.io;

    ssl_certificate /etc/letsencrypt/live/pwa.dankos.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pwa.dankos.io/privkey.pem;

    # PWA static files (served directly by Nginx for performance)
    location / {
        root /var/www/pwa/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API proxy for PWA data
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9.3 Backups

```bash
#!/bin/bash
# /usr/local/bin/dankos-backup.sh

BACKUP_DIR="/var/backups/dankos"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U postgres dankos | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# PWA static files backup
tar -czf $BACKUP_DIR/pwa_$DATE.tar.gz /var/www/pwa/dist/

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete
```

```bash
# Run daily at 2 AM
echo "0 2 * * * /usr/local/bin/dankos-backup.sh" | sudo tee -a /etc/crontab
```

### 9.4 Monitoring

**Uptime Kuma** (self-hosted):
```bash
# Docker compose for monitoring
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v /opt/uptime-kuma/data:/app/data \
  lukeed/uptime
```

Configure monitors:
- API endpoint (every 2 minutes)
- PWA endpoint (every 2 minutes)
- METRC sync worker (every 5 minutes)
- Disk space alert (daily)

---

## 10. CI/CD Pipeline

### GitHub Actions (`.github/workflows/deploy.yml`)

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      
      - name: Install
        run: npm ci
      
      - name: Prisma migrate
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Build
        run: npm run build
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/dankos
            git pull origin main
            npm ci --production
            npx prisma migrate deploy
            pm2 reload all
```

**Zero-downtime deploy:** PM2 reloads the process gracefully. No requests are dropped.

---

## 11. Security Checklist

- [x] TLS 1.3 everywhere (Let's Encrypt)
- [x] PostgreSQL: least-privilege user, SSL connections only
- [x] Redis: password-protected, not exposed to internet
- [x] Nginx: security headers, rate limiting
- [x] Prisma: parameterized queries (SQL injection prevention)
- [x] Express: helmet middleware, CORS configuration
- [x] Password hashing: bcrypt (cost 12)
- [x] JWT: short-lived access tokens (15 min), refresh tokens (7 days)
- [x] 2FA: TOTP or SMS
- [x] Multi-tenant isolation: every query includes tenant filter
- [x] Audit log: every user action logged
- [x] Rate limiting: per-user and per-IP (Redis-backed)
- [x] fail2ban: brute-force protection
- [x] Regular dependency updates (Dependabot)
- [x] Backups: daily, 30-day retention, tested restore

---

## 12. Cost Projection

| Item | Monthly | Notes |
|---|---|---|
| Server (2 CPU, 4GB RAM) | $20-40 | DigitalOcean / Hetzner |
| Domain | $10 | .io or .com |
| Email (Resend/Postmark) | $15-30 | Per transaction pricing |
| SMS (Twilio) | $15-30 | Per message pricing |
| SSL | Free | Let's Encrypt |
| Monitoring (Uptime Kuma) | Free | Self-hosted |
| Error Tracking (Sentry) | Free-25 | Free tier for MVP |
| CDN (Cloudflare) | Free | Free tier |
| **Total** | **$60-135/month** | |

**Per-operator margin at $499/month: $364-439/month profit per operator.**

---

## 13. Scaling Plan (When Revenue Justifies It)

| MRR | Action | Cost |
|---|---|---|
| $50K | Add read replica for PostgreSQL, separate app server | +$40/mo |
| $150K | Redis cluster, load balancer, S3 for files | +$80/mo |
| $300K | Multi-AZ deployment, managed backup, monitoring upgrade | +$200/mo |
| $500K | Second region, auto-scaling group, dedicated database | +$500/mo |

**We don't plan beyond what revenue supports.**

---

## 14. Development Environment

### Local Setup

```bash
# 1. Clone repo
git clone https://github.com/lpendeavors/dank-os-brand.git
cd dank-os-brand

# 2. Install dependencies
npm install

# 3. Set up local PostgreSQL
createdb dankos_dev

# 4. Set environment variables
cp .env.example .env
# Edit .env with local database URL

# 5. Run migrations
npx prisma migrate dev

# 6. Seed test data
npm run seed

# 7. Start dev server
npm run dev

# 8. Start PWA dev server
cd pwa && npm run dev
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/dankos_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<random-64-char-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
EMAIL_PROVIDER=resend
EMAIL_API_KEY=...

# SMS
SMS_PROVIDER=twilio
SMS_ACCOUNT_SID=...
SMS_AUTH_TOKEN=...
SMS_PHONE_NUMBER=...

# METRC
METRC_BASE_URL=...
METRC_API_KEY=...

# PWA
OS_API_URL=http://localhost:3000
PWA_URL=http://localhost:3001

# Server
PORT=3000
NODE_ENV=development
```

---

*This architecture document will evolve as we build. The philosophy stays the same: simple, reliable, bootstrapped.*
