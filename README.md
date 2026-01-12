# 🚛 SmartDelivery (NeuroFleetX)
> **AI-Powered Urban Fleet & Traffic Intelligence System**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Java%20Spring%20Boot-green)
![Frontend](https://img.shields.io/badge/Frontend-React.js-blue)
![Database](https://img.shields.io/badge/Database-MongoDB-forestgreen)
![AI](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203-orange)

## 📖 Overview
**SmartDelivery** is a full-stack logistics management platform designed to solve the "visibility" problem in last-mile delivery. It features **real-time driver tracking**, **intelligent route optimization**, and **AI-driven performance analysis**.

Built to simulate a real-world fleet environment, the system allows Admins to manage orders and view live driver locations, while Drivers can manage their availability and view assigned tasks.

---

## Key Features

### 🗺️ Real-Time Tracking & Maps
- **Live Location Tracking:** Admins can view driver movements in real-time on an interactive map (OpenStreetMap/Leaflet).
- **Route Optimization:** Integrated **OSRM API** to calculate the most efficient delivery routes and ETAs.
- **Geospatial Logic:** Backend support for coordinate management and calculating real-time delivery routes via OSRM.

### 🤖 AI Integration (GenAI)
- **Performance Reviews:** Integrated **Groq API (Llama 3)** to analyze driver delivery history.
- **Automated Insights:** Converts raw data (delivery times, ratings) into human-readable performance summaries for the Admin.

### 🔐 Security & Role Management
- **Role-Based Access Control (RBAC):** Distinct dashboards for **Admins** and **Drivers**.
- **Secure Authentication:** Custom Login/Registration system using Local Storage persistence.
- **Password Recovery:** Secure server-side OTP token generation for verifying identity during password resets.

### 📦 Order Management
- **Dynamic Assignment:** Admins can create orders and assign them to available drivers.
- **Status Updates:** Drivers can toggle "Online/Offline" status and update order stages (Picked Up, Delivered).

### 📊 Reporting & Analytics
- **Export to Sheet:** One-click data export feature allowing Admins to download driver logs and delivery history as CSV/Excel files for offline reporting.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java (JDK 17+), Spring Boot 3.x, Maven |
| **Frontend** | React.js, Leaflet Maps |
| **Database** | MongoDB (NoSQL) |
| **AI Model** | Groq Cloud API (Llama 3) |
| **Routing** | OSRM (Open Source Routing Machine) |
| **Tools** | Postman, Git, GitHub |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Java JDK 17 or higher
- Node.js & npm
- MongoDB (Running locally or Atlas URL)

### 1. Clone the Repository
```bash
git clone [https://github.com/tejast22/neurofleetx.git](https://github.com/tejast22/neurofleetx.git)
cd neurofleetx
2. Backend Setup (Spring Boot)

1. Navigate to the backend folder:
   cd backend

2. Configure the database in src/main/resources/application.properties:
spring.data.mongodb.uri=mongodb://localhost:27017/smartdelivery
server.port=5000

3. Run the application:
.\mvnw spring-boot:run

3. Frontend Setup (React)

1. Open a new terminal and navigate to the frontend folder:
cd traffic-dashboard

2. Install dependencies:
npm install

3. Start the server:
npm start

4. Access the app at http://localhost:3000

## 📸 Screenshots

| Admin Dashboard | Driver Map View |
| :---: | :---: |
| ![Dashboard](documentation/screenshots/admin-dashboard.png) | ![Map](documentation/screenshots/live-map.png) |

| Login Page | AI Performance Review |
| :---: | :---: |
| ![Login](documentation/screenshots/login-page.png) | ![AI Review](documentation/screenshots/ai-review.png) |


The Team
→Tejas: Backend Developer & Architecture (Spring Boot, Security, Database)

→Mehek Fatima Sheik, Shubhashini, Harshavarthini: Frontend Developer (React UI)

→Ayush Kale: API Integrator

## 📄 License

This project is licensed under the **MIT License**.See the LICENSE file for details











