# 🚗 ParkEase – Smart Parking Management System (Spring Boot + MySQL + React)

ParkEase is a full-stack **Smart Parking Management System** built using **Spring Boot, MySQL, and React**.
It provides role-based authentication, parking slot booking, admin & user dashboards, analytics, and a modern UI.

This project is developed as part of the **Infosys Internship Program – 2025**.

---

## 📌 Features Overview

### 🔐 Authentication
- Role-based authentication using JWT
- Secure login & registration
- Roles: Admin, Company Admin, User
- Password hashing with BCrypt
- Spring Security integration

### 👤 User Features
- Vehicle management
- Location-based parking search
- Slot booking & history
- Online payments (Razorpay / Mock)
- Ratings & reviews

### 🧑‍💼 Admin Features
- Company & parking area management
- Multi-floor slot layout
- Bulk slot operations
- Revenue & occupancy analytics

### 💰 Pricing Logic
- Base charge: ₹19
- Additional charge: ₹50 per hour
- Final price calculated on exit

---

## 🏗️ Tech Stack

**Frontend**
- React 19 (Vite)
- React Router v7
- Axios
- Recharts
- React Leaflet
- Vanilla CSS

**Backend**
- Spring Boot
- Spring Security + JWT
- Spring Data JPA
- MySQL
- Razorpay (Test Mode)

---

## 📁 Project Structure

ParkEase/
├── backend/
├── frontend/
└── README.md

---

## ⚙️ Backend Setup

### Create Database
CREATE DATABASE parkease;

### Run Backend
cd backend
mvn spring-boot:run

Backend runs on http://localhost:8080

---

## ⚙️ Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173

---

## 🎓 Internship Context
Infosys Internship Program – 2025

---

## 👨‍💻 Developer
Vaibhav Bhardwaj  
https://vaughv.netlify.app/

---

## 📜 License
Educational & internship use only.
