# Stay in the Loop (LOOP)

**Your neighborhood hub for local events, real-time safety updates, and community conversations.**

Stay in the Loop (LOOP) is a community platform that combines incident reports, local events, and real-time chat into a single application. Get live updates about incidents near you, discover local happenings, and connect with your community — all in one place.

Whether it's a transit delay, a street closure, an emergency alert, or a neighborhood meetup, LOOP keeps you informed and involved.

---

## Live Demo
Link here: [click me](https://capstonefall2025-frontend.onrender.com/)

---

## Features

- **Real-Time Incident Reports**  
  Live updates on safety incidents, transit delays, road closures, and emergencies reported by other users.

- **Local Events**  
  Discover and share community events, meetups, and activities.

- **Global & Event-Based Chat**  
  Engage with the community and event attendees in real time.

- **Interactive Map**  
  Visualize incidents and events on an interactive Google Maps interface.

- **User Authentication**  
  Secure login and registration using JWT authentication.

- **User Submissions**  
  Users can contribute incident reports and events to keep the community informed.

- **Onboarding Tutorial**  
  Interactive walkthrough for new users powered by Intro.js.

---

## The Tech Stack

### Frontend
- React
- Vite
- Google Maps API
- Axios (HTTP requests)
- Socket.io (real-time communication)
- Intro.js (onboarding tutorial)

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- AWS SDK v3 (cloud storage)
- Multer (file uploads)
- Socket.io (real-time communication)
- JWT (authentication & authorization)
- Bcrypt (password hashing)
- CORS

### Development Tools
- ESLint
- Dotenv

---

## Installation & Setup

1. Clone the repository and navigate to project directory:
    ```sh
    git clone https://github.com/fabiolaliwu/CapstoneFall2025
    cd CapstoneFall2025/website
    ```

2. Download the dependencies in package.json in both website and server:
    ```sh
    npm install
    cd server
    npm install
    ```

3. Create .env files for both frontend and backend and add required API keys.

4. Start the development server on frontend
    ```sh
    cd website
    npm run dev
    ```

5. In another terminal, run the backend
    ```sh 
    cd website/server
    node backend.js
    ```

### Local Development URLs

Frontend: http://localhost:5173
Backend API: http://localhost:4000

---

## Group Members

- Fabiola

- Angela

- Guan

- Reina
