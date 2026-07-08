# 🎟️ MyTickets - Full-Stack Movie Ticketing Platform

![MyTickets Hero](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80)

**Live Demo:** [[[Insert your Vercel Link here]](https://mytickets-pern-stack.vercel.app/)]

MyTickets is a complete, full-stack movie ticketing web application built with the **PERN Stack** (PostgreSQL, Express, React, Node.js). It features secure user authentication, real-time seat reservation, an Admin Command Center, and live payment processing via **Stripe Checkout**.

---

## ✨ Key Features

* **User Authentication:** Secure registration and login system with encrypted database storage.
* **Interactive Seat Mapping:** Visual theater layout where users can select seats. Real-time PostgreSQL queries prevent double-booking.
* **Secure Checkout:** Integrated with **Stripe** to handle real credit card transactions via a secure, Stripe-hosted payment session.
* **Personalized Dashboards:** Users can view their past bookings, ticket details, and digital receipts.
* **Admin Command Center:** A role-protected dashboard for platform administrators to:
  * Track total tickets sold and gross revenue.
  * View a live ledger of all customer transactions.
  * Dynamically add or delete movies from the catalog.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client)**
* **React.js** (Vite) - Single Page Application (SPA) architecture.
* **CSS3** - Custom, responsive UI design.
* **Vercel** - Cloud hosting and continuous deployment (with custom routing configuration).

### **Backend (API)**
* **Node.js & Express.js** - RESTful API routing and server logic.
* **Stripe SDK** - Server-side session generation for payment processing.
* **Render** - Cloud backend hosting.

### **Database**
* **PostgreSQL** - Relational database architecture.
* **Neon** - Serverless Postgres cloud hosting.

---

## 🚀 Running the Project Locally

If you would like to run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/Saicharan45V/mytickets-pern-stack.git](https://github.com/Saicharan45V/mytickets-pern-stack.git)
cd mytickets-pern-stack
