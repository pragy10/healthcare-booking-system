# Healthcare Appointment Booking – README

## 🌟 Overview
A full-stack MERN application that lets patients discover verified doctors, book appointments in real-time, and manage their entire healthcare journey online. Doctors get a dedicated portal to handle schedules, earnings, and patient interactions, while admins oversee the platform through an analytics-driven dashboard.

## ✨ Key Features
- **Role-based portals** – Patient, Doctor, and Admin dashboards with tailored functionality  
- **Secure authentication** – JWT, refresh tokens & encrypted passwords  
- **Doctor discovery** – Advanced filters (specialization, city, fee, rating) and responsive grid/list views  
- **Real-time booking** – Time-slot checking, schedule management, email notifications  
- **Earnings & analytics** – Doctor revenue tracking and admin usage metrics  
- **Modern UI** – Glassmorphism, dark-ready palette, fully responsive (mobile-first)  
- **Accessibility-ready** – Semantic HTML, keyboard navigation, ARIA labels  

## 🛠️ Tech Stack
| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Front-end     | React 18, React Router 6, Context API, Tailwind CSS |
| Back-end      | Node.js 18, Express 5                |
| Database      | MongoDB 6 (Mongoose ODM)             |
| Auth & Security | JWT, bcrypt, Helmet, CORS          |
| Tooling       | Vite, ESLint, Prettier               |
| DevOps        | Docker / Docker-Compose, PM2, GitHub Actions |

## 📁 Project Structure
```
.
├── client
│   ├── public
│   ├── src
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── doctor/
│   │   │   └── patient/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   └── vite.config.js
├── server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── seedData.js
│   └── server.js
└── docker-compose.yml
```

## ⚙️ Local Setup

### 1. Clone & Install
```bash
git clone https://github.com//healthcare-booking.git
cd healthcare-booking

# install server deps
npm i

# install client deps
cd client
npm i
```

### 2. Environment Variables

`server/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthcare-booking
JWT_SECRET=
JWT_EXPIRE=7d
```

`client/.env`
```
VITE_API_BASE=http://localhost:5000/api
```

### 3. Run MongoDB
```bash
docker-compose up -d mongo
# or
mongod --dbpath 
```

### 4. Seed Sample Data *(optional but recommended)*
```bash
cd server
node scripts/seedData.js
```

### 5. Start Dev Servers (concurrently)
```bash
# root folder
npm run dev          # launches: server on :5000 & client on :5173
```

## 🚀 Production Build

| Step | Command |
| ---- | ------- |
| Build front-end | `cd client && npm run build` |
| Copy assets    | `cp -r client/dist server/public` |
| Start server   | `NODE_ENV=production pm2 start server/server.js` |

Docker users can simply run:  
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🔑 Important Scripts
| Script (root)      | Action                                  |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Concurrent React + Express development  |
| `npm run lint`     | ESLint check                            |
| `npm run format`   | Prettier code format                    |
| `npm run seed`     | Run seed script                         |
| `npm run test`     | Jest / React Testing Library            |

## 🧑‍💻 Contributing
1. Fork the repo & create your branch (`git checkout -b feature/my-feature`).
2. Commit your changes (`git commit -m 'feat: add awesome feature'`).
3. Push to the branch (`git push origin feature/my-feature`).
4. Open a Pull Request.

Please follow the **Conventional Commits** spec and run `npm run lint` before pushing.

## 📝 License
Distributed under the **MIT License** – see [`LICENSE`](LICENSE) for details.

Have fun building and stay healthy!
