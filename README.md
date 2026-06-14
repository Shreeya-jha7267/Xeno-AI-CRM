# Xeno AI-CRM: AI-Powered Customer Relationship Management

Xeno AI-CRM is a modern full-stack Customer Relationship Management (CRM) system designed to leverage Google's Gemini AI to dynamically draft, preview, and launch customer campaigns, manage audience segments, and track engagement logs.

---

## 👤 Developer Profile
- **Name**: Shreeya Jha
- **Register Number**: RA2311003020072
- **College**: SRM Ramapuram

---

## 🚀 Key Features

### 1. Left-Hand Sidebar Navigation Layout
- Pin-point vertical sidebar navigation with active glowing indicators, smooth hover transitions, and collapsible panels. 
- Fully responsive adaptation collapsing to an ergonomic bottom navigation bar for mobile views.

### 2. AI Campaign Studio (Multi-Variant Copy Drafts)
- Marketers type general marketing objectives (e.g. "win back inactive buyers").
- The system drafts **3 distinct copy alternatives** side-by-side:
  1. *Warm & Conversational* (WhatsApp chat bubble simulation view)
  2. *Professional & Benefit-Focused* (Email browser client preview window)
  3. *Urgent & Direct* (SMS/Push notification bubble mockup)
- Marketers can preview, directly edit, save, and deploy the selected copy version.

### 3. Interactive Insights (SVG Charts)
- Replaced flat lists with custom interactive SVG graphs:
  - **Line Chart**: Logs CTR & Conversion rate variations over campaigns.
  - **Bar Chart**: Illustrates campaign channel distribution.
  - **Donut Progress Gauges**: Detail Delivery rate, open rates, and conversion achievement.
- Features coordinate-aligned hover tooltip popups following mouse movements.

### 4. Dynamic Audience Segmentation
- Filter customers by key metrics: VIPs (spent >= $5000), Dormant (no purchases for 60+ days), High-Value (spent > $2000), and Recent Buyers.
- **AI Segment Builder**: Allows typing criteria (e.g., "dormant VIPs") to generate query parameters and list matching profiles instantly.

### 5. Multi-Stage Production Builds
- Spring Boot Java backends configured with multi-stage production Dockerfiles using Java 21 JDK/JRE layers for optimal performance and footprint.

---

## 🛠️ Technology Stack
- **Frontend**: React (v19.2.6), React Router (v7.17), Tailwind CSS (v4.3), Axios
- **Backend Services**: Java 21, Spring Boot (v3.5.14), Spring Data JPA, H2 Database, GSON, Eclipse Temurin JRE
- **AI Engine**: Google Gemini 2.5 Flash
