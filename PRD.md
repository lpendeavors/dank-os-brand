# DANKOS OS — Product Requirements Document (PRD)

*Version: 1.0*
*Date: May 1, 2026*
*Status: DRAFT*

---

## 1. Introduction

### 1.1 Purpose
This PRD translates the BRD into actionable product specifications. It defines what we're building, why, who for, and how we'll measure success. Every feature listed here maps back to a BRD requirement.

### 1.2 Guiding Principles
- **Bootstrapped-first:** Self-hosted, no expensive cloud dependencies. Use a single VPS ($20-40/mo) with PostgreSQL + Redis.
- **Ship fast, iterate:** Phase 1 MVP in 6 months, not 18. Cut scope ruthlessly.
- **Operators talk to operators:** Every feature validated with real dispensary staff before building.
- **Reliability over features:** One POS that never crashes beats ten POS features that sometimes crash.
- **Brand ownership is non-negotiable:** The PWA must feel like it was built for each dispensary by their design team.

### 1.3 Success Criteria (MVP)
- 10 pilot operators onboarded within 90 days of public launch
- POS processes 1,000+ transactions without a single crash
- Branded PWA generated and live in <48 hours from signup
- METRC sync error rate: 0%
- NPS ≥ 60 from pilot operators

---

## 2. User Personas

### 2.1 Primary: Operator (Admin)

**Name:** Mike Chen
**Age:** 38
**Role:** Owner/Operator of a single-location dispensary in Colorado
**Revenue:** ~$800K/month
**Employees:** 22
**Current stack:** Flowhub POS ($600/mo) + Dutchie Marketplace ($299/mo) + GreenCheck compliance ($150/mo)
**Tech comfort:** Moderate — uses Shopify for his side business, comfortable with dashboards but hates code
**Pain:** "I'm paying $1,000+/month for three separate tools that don't talk to each other. My online menu shows out-of-stock items. My loyalty points don't show at the register. And I have zero control over my brand because Dutchie buries us on their marketplace."
**Goals:** Simplify ops, reduce costs, own his brand, keep compliance airtight

**Key Jobs:**
- Make it through 4/20 without anything breaking
- Know exactly how much money the store made today
- Keep METRC in perfect sync
- Get customers to come back this week
- Have a website customers love that looks like *his* brand

### 2.2 Secondary: Budtender

**Name:** Sarah Lopez
**Age:** 24
**Role:** Senior Budtender
**Tenure:** 2 years
**Tech comfort:** Low — doesn't code, uses Instagram daily, comfortable with intuitive touch UI
**Pain:** "I have to switch between the POS and the loyalty app to look up a customer's points. The inventory app shows something's in stock but it's not on the shelf. I spend 30 seconds extra per customer because the checkout is slow."
**Goals:** Process customers fast, look like a hero, make accurate recommendations, not get in compliance trouble

**Key Jobs:**
- Checkout in <10 seconds
- Look up customer history and loyalty points in one screen
- Get product recommendations based on what the customer usually buys
- Never sell an out-of-stock item
- Not mess up purchase limits

### 2.3 Tertiary: Consumer (PWA End User)

**Name:** Alex Rivera
**Age:** 31
**Role:** Regular at Mike's dispensary
**Tech comfort:** High — uses every app on their phone, expects things to "just work"
**Pain:** "I love Mike's dispensary but their online menu is buried on Dutchie. I can't tell if stuff is in stock until I drive there. I want to order and pick up without talking to anyone if I don't want to. Their loyalty app is confusing."
**Goals:** Know what's in stock, order ahead, pick up fast, earn rewards without thinking about it, feel like they're shopping from a real brand

**Key Jobs:**
- Check inventory before leaving the house
- Order pickup or delivery
- See rewards balance clearly
- Reorder their usual products easily
- Not feel like they're on a third-party app

---

## 3. Feature Specifications

### 3.1 PHASE 1 (MVP) — Ship in 6 Months

#### F1: Core Platform & Authentication

**Description:** Foundation layer — user accounts, roles, authentication, multi-tenant isolation.

**Features:**
- Email/password signup with magic link option
- Role-based access: Owner, Manager, Budtender, Cashier, Viewer
- Multi-tenant isolation — each dispensary (tenant) has isolated data
- Session management with device tracking
- Password reset, 2FA (SMS or TOTP)
- Tenant provisioning — new dispensary gets onboarded in <5 minutes

**Acceptance Criteria:**
- [ ] New user can sign up and create a dispensary account
- [ ] Each user sees only their dispensary's data
- [ ] Role permissions are enforced at every API level
- [ ] 2FA works with SMS and TOTP
- [ ] User can log out of all devices

**Priority:** P0 (Must have)

---

#### F2: POS — Point of Sale

**Description:** Transaction processing system for dispensary checkout. Optimized for speed, reliability, and compliance.

**Features:**
- Touch-optimized checkout UI (iPad-first, desktop secondary)
- Product search by name, strain, SKU, effect
- Product cards with image, price, THC/CBD %, terpene info
- Add to cart with quantity selection
- Customer lookup (phone, email, or ID scan)
- ID scanning via device camera or hardware scanner
- Age verification with verification timestamp
- Automatic purchase limit checking (state-configurable)
- Split payments (debit + cash)
- Discounts and promotions
- Receipt generation (email/SMS/paper)
- Void/return/exchange workflows
- Offline mode: queue transactions locally, sync when reconnected
- Multi-tax calculation (state + local + special taxes)
- End-of-day cash count reconciliation

**UI Specs:**
- Main POS screen: left sidebar (product categories), center grid (products), right panel (cart)
- Checkout flow: 3 steps max — select customer → confirm cart → payment
- Product cards: image, name, price, potency badge, stock indicator (green/yellow/red)
- Cart: product list, quantity controls, discount input, tax breakdown, total
- Customer lookup: search bar + recent customers + ID scan button

**Acceptance Criteria:**
- [ ] Checkout transaction completes in <10 seconds
- [ ] POS processes 500+ transactions without error
- [ ] Offline mode queues transactions locally with automatic sync
- [ ] Purchase limits are enforced automatically at cart level
- [ ] ID scanning verifies age and stores verification record
- [ ] Tax calculation is accurate to the penny
- [ ] End-of-day reconciliation matches expected totals
- [ ] Every transaction is logged with user, timestamp, and IP

**Priority:** P0 (Must have)

---

#### F3: Inventory Management

**Description:** Real-time inventory tracking with automatic state system (METRC/BioTrack) synchronization.

**Features:**
- Product catalog management (add/edit/delete/listings)
- SKU-level inventory tracking
- Unit conversions (grams, ounces, cartridges, etc.)
- Receive inventory from supplier with lot tracking
- Adjust inventory (waste, damage, returns)
- Low stock alerts (configurable per product)
- Inventory status dashboard (in-stock, low, out-of-stock)
- Batch/lot management with expiration tracking
- Transfer requests between locations
- Import/export via CSV

**METRC Integration:**
- Native API connection to METRC state system
- Automatic push: every inventory change syncs to METRC within 60 seconds
- Automatic pull: METRC status report syncs to local system every hour
- Reconciliation report: daily comparison of local inventory vs. METRC inventory
- Discrepancy flagging: highlight mismatches for manual review
- State change notification: alert when METRC updates their system

**Acceptance Criteria:**
- [ ] Inventory changes in POS sync to METRC within 60 seconds
- [ ] METRC DSR auto-generates and can be submitted in <2 clicks
- [ ] Reconciliation report identifies all discrepancies between local and METRC
- [ ] Low stock alerts notify owner via email and in-app notification
- [ ] Product catalog can be managed via UI (no SQL required)
- [ ] CSV import works for 1,000+ products in <5 minutes

**Priority:** P0 (Must have)

---

#### F4: Compliance Engine

**Description:** Automated compliance monitoring and reporting. The system works so the operator doesn't have to.

**Features:**
- Purchase limit tracking (per customer, per day/week)
- Purchase limit enforcement at POS level (can't add to cart)
- Product restriction enforcement (e.g., no delivery of certain products in some states)
- ID verification logging (date, time, method, result)
- Audit trail: every user action logged with timestamp, user, and details
- Daily Status Report (DSR) auto-generation for METRC
- License tracking with expiry alerts (60/30/7 days)
- Compliance checklist (daily opening/closing tasks)
- Incident reporting (compliance breach documentation)
- Regulatory update feed (state-specific rule changes)
- State-specific compliance rules engine

**Acceptance Criteria:**
- [ ] POS prevents transactions that would exceed purchase limits
- [ ] DSR is generated and ready for submission in <30 seconds
- [ ] Audit trail captures every action with user, timestamp, and before/after values
- [ ] License expiry triggers email + in-app alerts at 60, 30, and 7 days
- [ ] Compliance checklist is viewable and markable from any screen
- [ ] State-specific rules are configurable per tenant (no code changes)

**Priority:** P0 (Must have)

---

#### F5: Branded PWA Builder

**Description:** The killer feature. A visual builder that lets dispensary operators create a fully customized, branded consumer web app from the OS dashboard. No code, no dev work, no third-party marketplace.

**Features:**
- **Template selection:** 5 starter templates (Modern, Botanical, Luxury, Minimal, Bold)
- **Brand customization:**
  - Upload logo (PNG/SVG, auto-generates favicon)
  - Pick brand colors (primary, secondary, accent — color picker)
  - Choose typography (3 options: Inter, Playfair Display, Source Sans Pro)
  - Set brand tagline and "About Us" text
- **Content customization:**
  - Homepage hero image (upload or choose from library)
  - Product category selection (which categories to display)
  - Featured products (select 4-8 products to highlight)
  - Promo banners (create and manage promotional banners)
  - "About Us" page editor (rich text)
  - Blog page (enabled/disabled, auto-pull from OS content)
- **Layout customization:**
  - Homepage section order (hero, featured, categories, about, testimonials)
  - Product grid style (grid view vs. list view)
  - Navigation structure (menu items)
  - Footer content (contact info, social links, legal)
- **Live preview:** Real-time preview panel showing exact PWA appearance
- **Test mode:** Visit PWA as a test user to experience the flow end-to-end
- **Publish:** One-click publish. Changes go live instantly.
- **Version history:** Save snapshots, rollback to previous version
- **Domain management:** Use DANKOS subdomain (dispensary.dankos.io) or custom domain (CNAME support)
- **SEO management:** Auto-generated meta tags, Open Graph, sitemap.xml, robots.txt
- **Age verification gate:** Built-in — users must verify age before viewing products
- **Push notification support:** Service worker handles push notifications

**UI Specs — PWA Builder:**
- Left sidebar: customization categories (Brand, Content, Layout, Domain)
- Center: live preview panel (resizable, mobile/tablet/desktop toggle)
- Right panel: controls for selected customization category
- Bottom: action bar (Test, Save Draft, Publish, Version History)

**Acceptance Criteria:**
- [ ] User can create a fully branded PWA in <30 minutes
- [ ] Live preview matches final output 1:1
- [ ] PWA is installable to iOS/Android home screens
- [ ] PWA loads in <2 seconds on 4G
- [ ] PWA works offline for previously viewed pages
- [ ] Inventory and pricing sync to PWA within 5 seconds of change
- [ ] Published PWA is indexed by Google within 48 hours
- [ ] Custom domain works with HTTPS via automatic Let's Encrypt

**Priority:** P0 (Must have) — this is the differentiator

---

#### F6: Basic Analytics

**Description:** Real-time dashboards showing the health of the dispensary. Simple, visual, actionable.

**Features:**
- Today's dashboard: revenue, units sold, number of transactions, average ticket size
- Product performance: top 10 products by revenue and by units
- Category performance: revenue by category (flower, vape, edible, etc.)
- Staff performance: transactions and revenue per budtender today
- Sales by hour graph (bar chart for today)
- Inventory value report (current inventory value by category)
- Export to CSV

**Acceptance Criteria:**
- [ ] Dashboard loads in <2 seconds
- [ ] Revenue numbers match POS transaction data to the penny
- [ ] Staff performance shows accurate per-budtender breakdown
- [ ] Sales-by-hour graph updates in real-time (refresh every 60 seconds)
- [ ] Export produces a valid CSV file with all displayed data

**Priority:** P1 (Should have)

---

#### F7: Customer Profiles (Basic CRM)

**Description:** Customer records that budtenders can access at checkout. Purchase history, preferences, contact info.

**Features:**
- Customer search (phone number, email, name)
- Customer profile view: name, contact info, ID verification status, total visits, total spent, first purchase date
- Purchase history: list of all past transactions with date, products, amount
- Preferences tagging: auto-tag based on purchase patterns (e.g., "Indica buyer", "Edible fan", "High-THC seeker")
- Manual notes: owner/manager can add notes
- Age verification record display

**Acceptance Criteria:**
- [ ] Customer search returns results in <1 second
- [ ] Profile loads all historical data in <2 seconds
- [ ] Auto-tags update within 1 hour of purchase
- [ ] Notes are visible to all roles (Owner, Manager, Budtender)
- [ ] Customer data is isolated to tenant (no cross-dispensary visibility)

**Priority:** P1 (Should have)

---

### 3.2 PHASE 2 — Months 7-12

#### F8: E-Commerce (Online Ordering)

**Description:** Full online ordering with pickup and delivery, integrated with the branded PWA.

**Features:**
- Online product catalog (synced from POS inventory)
- Shopping cart with quantity controls
- Age verification before checkout
- Pickup scheduling (select date/time slot)
- Delivery scheduling (select date/time slot, address with geofencing for delivery zones)
- Cart subtotal, tax calculation, delivery fee, tip option
- Order confirmation via email/SMS
- Order status tracking (pending → preparing → ready → picked up)
- Cart abandonment recovery (automatic email after 2 hours)
- Promo codes

**Acceptance Criteria:**
- [ ] Online catalog always matches in-store inventory within 5 seconds
- [ ] Customer can complete pickup order in <2 minutes
- [ ] Delivery geofencing prevents orders outside licensed zones
- [ ] Order status notifications are sent automatically
- [ ] Abandoned cart emails are triggered after 2 hours

**Priority:** P1 (Should have)

---

#### F9: Loyalty Program

**Description:** Points-based loyalty that drives repeat visits. Simple to understand, valuable to earn, easy to redeem.

**Features:**
- Points earn rate: configurable (e.g., $1 spent = 1 point)
- Points redemption: configurable (e.g., 100 points = $1 off)
- Point balance visible on customer profile and PWA
- Points expiration policy (configurable)
- Bonus point events (birthday, anniversary, specific product purchases)
- Tier system (Bronze, Silver, Gold — unlock based on annual spend)
- Redemption at POS (applied to cart before payment)
- Redemption on PWA (applied during checkout)
- Loyalty dashboard: total points redeemed, active members, redemption rate

**Acceptance Criteria:**
- [ ] Points are awarded automatically within 1 minute of POS transaction
- [ ] Point balance is visible in <2 seconds on any screen
- [ ] Redemption at POS applies correct discount within 1 second
- [ ] PWA checkout respects loyalty redemption
- [ ] Tier thresholds are enforced automatically

**Priority:** P1 (Should have)

---

#### F10: Staff Management

**Description:** Schedule and manage budtender teams.

**Features:**
- Interactive schedule builder (drag-and-drop)
- Shift swapping (budtenders request swaps, manager approves)
- Role assignment per shift
- Attendance tracking (clock in/out via POS)
- Simple time-off request form

**Acceptance Criteria:**
- [ ] Schedule can be published to all staff in <1 click
- [ ] Shift swaps require manager approval
- [ ] Clock-in from POS is <2 seconds
- [ ] Staff can view their schedule on PWA

**Priority:** P2 (Nice to have)

---

#### F11: Multi-Location Support

**Description:** For operators running 2+ locations.

**Features:**
- Owner dashboard showing all locations
- Location selector for location-specific operations
- Inventory transfer between locations
- Synchronized product catalog across locations
- Location-specific pricing (override per location)
- Consolidated reporting (rollup across all locations)
- Location-level user management

**Acceptance Criteria:**
- [ ] Owner can view combined revenue across all locations
- [ ] Inventory transfers create automatic stock adjustments on both locations
- [ ] Product catalog syncs within 30 seconds
- [ ] Location-specific pricing is enforced at POS

**Priority:** P2 (Nice to have)

---

### 3.3 PHASE 3 — Months 13-24

#### F12: CRM & Marketing Automation

**Description:** Advanced customer relationship management with automated marketing.

**Features:**
- Customer segmentation (relaxation, wellness, social, connoisseur, etc.)
- Automated email campaigns (abandoned cart, welcome series, re-engagement)
- SMS marketing (opt-in, state-compliant)
- Push notification support (via PWA)
- Customer journey tracking (first purchase → repeat → loyal → churn risk)
- Churn prediction (ML model based on purchase frequency)
- A/B testing for email campaigns

**Priority:** P2 (Nice to have)

---

#### F13: Advanced Analytics

**Description:** Predictive insights and deeper business intelligence.

**Features:**
- Demand forecasting (predict what products will be needed next week)
- Price optimization suggestions (based on demand, margin, competition)
- Customer lifetime value (CLV) per customer
- Cohort analysis (group customers by first purchase date, track behavior)
- Forecasted revenue (based on historical trends)
- Custom report builder (drag-and-drop metrics)
- Scheduled report delivery (daily/weekly/monthly via email)

**Priority:** P2 (Nice to have)

---

#### F14: Delivery Management

**Description:** End-to-end delivery operations.

**Features:**
- Driver assignment and tracking
- Route optimization
- Digital age verification at delivery (photo + signature)
- Real-time delivery tracking for customer (PWA)
- Proof of delivery
- Delivery zone management
- Driver app (PWA)

**Priority:** P2 (Nice to have)

---

#### F15: API Marketplace

**Description:** Open API for third-party integrations.

**Features:**
- REST API with documentation
- Webhook support (events: transaction.complete, inventory.low, customer.registered)
- OAuth 2.0 for third-party app auth
- Integration marketplace (browse, install, manage third-party apps)

**Priority:** P2 (Nice to have)

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Metric | Target |
|---|---|
| POS transaction time | <10 seconds |
| Dashboard load time | <2 seconds |
| PWA initial load (4G) | <2 seconds |
| METRC sync latency | <60 seconds |
| Search response time | <1 second |
| Concurrent POS terminals per store | 5-10 |

### 4.2 Reliability
- POS uptime: 99.99%
- Zero-crush guarantee: tested to 500+ transactions per POS terminal in a 4-hour window
- Offline mode: can process transactions without internet for up to 24 hours
- Automatic backup: daily database backup, 30-day retention
- Disaster recovery: restore to <4 hours RTO, <1 hour RPO

### 4.3 Security
- TLS 1.3 for all connections
- AES-256 encryption for data at rest
- Password hashing: bcrypt (cost factor 12)
- 2FA: TOTP or SMS
- Session timeout: 30 minutes of inactivity
- Audit trail: every user action logged
- SOC 2 Type II: target within 12 months

### 4.4 Scalability
- Support 10,000+ dispensary tenants at launch scale
- Horizontal scaling: add application servers as tenant count grows
- Database: single PostgreSQL instance per region, sharding plan for future
- CDN: static assets (PWA) served via CDN (Cloudflare free tier)

### 4.5 Accessibility
- POS UI: WCAG 2.1 AA compliance (budtenders with different abilities)
- PWA: WCAG 2.1 AA compliance (consumer-facing)
- Keyboard navigation support on POS
- Touch target minimum: 44x44px

---

## 5. Technical Constraints (Bootstrapped Reality)

### 5.1 Hosting: Self-Hosted, Single-Server MVP

**Why:** No $200K/mo AWS bill. No VCs forcing growth at all costs.

**Stack:**
- **OS:** Linux (Debian or Ubuntu)
- **Web server:** Nginx (reverse proxy + TLS termination)
- **Application:** Node.js (Monzo/Express) — single process, no Kubernetes
- **Database:** PostgreSQL 16 — single instance, WAL archiving for backups
- **Cache:** Redis 7 — single instance, AOF persistence
- **File storage:** Local filesystem (S3 later)
- **Email:** Resend or Postmark (cheap, reliable, $15-30/mo)
- **SMS:** Twilio ($15-30/mo)
- **PWA hosting:** Same server, served via Nginx
- **TLS:** Let's Encrypt (automatic certificates)
- **Monitoring:** Uptime Kuma (self-hosted) + Sentry (self-hosted or free tier)
- **CI/CD:** GitHub Actions (free tier) → deploy via SSH to server

**Server cost:** $20-40/month (DigitalOcean / Hetzner / Linode)

### 5.2 What's NOT in MVP
- No Kubernetes. No microservices. No service mesh. No Istio.
- No cloud CDN (use Cloudflare free tier for PWA caching).
- No AI/ML at launch. Rule-based logic only.
- No custom domain SSL provisioning from our side (use Cloudflare origin cert).
- No payment processor owned by us (integrate via partner APIs).
- No multi-region deployment. Start in one region (US East).

### 5.3 Transition Plan (When Revenue Justifies Scale)
- **At $50K MRR:** Add second server (read replica for DB), separate app server from DB
- **At $200K MRR:** Add Redis cluster, load balancer, CDN, S3 for files
- **At $500K MRR:** Multi-region, auto-scaling, CI/CD pipeline upgrades

---

## 6. Acceptance Criteria Summary

### MVP Must-Have Checklist (All P0)
- [ ] F1: Core Platform & Authentication
- [ ] F2: POS (full feature set including offline mode)
- [ ] F3: Inventory Management (with METRC sync)
- [ ] F4: Compliance Engine (with purchase limit enforcement)
- [ ] F5: Branded PWA Builder (full builder with live preview and publish)
- [ ] F6: Basic Analytics (dashboard)
- [ ] F7: Customer Profiles (basic CRM)

### Phase 2 Must-Have (P1)
- [ ] F8: E-Commerce Online Ordering
- [ ] F9: Loyalty Program

### Phase 3 Must-Have (P2)
- [ ] F10: Staff Management
- [ ] F11: Multi-Location Support
- [ ] F12: CRM & Marketing Automation
- [ ] F13: Advanced Analytics
- [ ] F14: Delivery Management
- [ ] F15: API Marketplace

---

## 7. Open Questions

| Question | Impact | Needed By |
|---|---|---|
| Which payment processor for PIN debit? | Revenue model, compliance | Pre-MVP |
| Do we handle METRC state-by-state or abstract it? | Architecture complexity | Pre-MVP |
| PWA: subdomain (dankos.io) vs. custom domain only? | Builder complexity | Pre-MVP |
| PDF receipts or digital-only for MVP? | POS scope | MVP |
| Do we support Hemp THC at launch? | State coverage | Phase 1 |
| Do we need HIPAA compliance for medical states? | Security scope | Phase 2 |

---

*This PRD will be updated as features are built, validated with operators, and refined based on feedback.*
