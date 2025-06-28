# 🚀 Placement Management & Student Portfolio System


[![AWS](https://img.shields.io/badge/Cloud-AWS-orange)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Container-Docker-blue)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue)](https://www.mysql.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Framework-Express-blue)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize-lightgrey)](https://sequelize.org/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20CSS-teal)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)](https://vercel.com/)


---

A **full‑stack web application** to streamline placement drives and student portfolios at MSEC:

* 🗕️ **Placement Drive Updates** — schedule drives, post deadlines & company info
* 📝 **Student Queries & Journeys** — ask questions, share real‑world interview experiences
* 🎓 **Student Portfolios** — showcase skills, internships, projects & achievements
* 🔍 **Admin Tools** — filter & shortlist candidates, export lists, moderate content

---

## 📦 Tech Stack

| Layer          | Technology                  |
| :------------- | :-------------------------- |
| **Frontend**   | React ∙ Vite ∙ Tailwind CSS |
| **API Server** | Node.js ∙ Express           |
| **ORM**        | Sequelize                   |
| **Database**   | MySQL                       |
| **Hosting**    | Vercel (frontend)           |
| **Auth**       | JWT (HttpOnly cookies)      |

---

## 🎯 Features

1. **Student Portal**

   * 🏠 Dashboard: upcoming drives, recent public Q\&A, latest journeys
   * 📄 Drive Details: registration → test → interview timeline
   * ❓ Queries: post & view public/private questions per drive
   * ✍️ Journeys: submit and browse interview experiences
   * 👤 Profile: edit personal info, upload skills with proof links

2. **Admin Dashboard**

   * ➕ Create / update / delete placement drives
   * ✅ Moderate & publish student queries & journeys
   * 🔍 Filter students by CGPA, department, year, skills & arrears
   * 📅 Export shortlisted students as Excel

---

## 📁 Repository Structure

```
├── backend/
│   ├── config/            # DB & environment config
│   ├── controllers/       # Route handlers
│   ├── migrations/        # Sequelize migration files
│   ├── models/            # Sequelize models & associations
│   ├── routes/            # Express routers
│   ├── services/          # Business logic, email, file uploads
│   ├── utils/             # Helpers & validators
│   ├── app.js             # Express app setup
│   └── server.js          # HTTP server entrypoint
├── frontend/
│   ├── public/            # Static assets & index.html
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # Auth & global state
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Axios & API calls
│   │   ├── utils/         # Formatters & validators
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # ReactDOM.render
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env.example           # Sample environment variables
├── README.md              # This documentation
└── package.json           # Project metadata & scripts
```

---

## 🔧 Getting Started

### Prerequisites

* Node.js v16+ & npm
* MySQL server
* (Optional) Docker & Docker Compose

### Backend Setup

1. **Clone & install**

   ```bash
   git clone https://github.com/your-org/placement-system.git
   cd placement-system/backend
   npm install
   ```

2. **Environment variables**
   Copy `.env.example` → `.env` and fill in your credentials:

   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=placements_db

   JWT_SECRET=your_jwt_secret
   ```

3. **Run migrations**

   ```bash
   npx sequelize-cli db:migrate
   ```

4. **Start server**

   ```bash
   npm run dev
   ```

   > Backend runs on `http://localhost:4000/api`

### Frontend Setup

1. **Navigate & install**

   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure API URL**
   In `.env` (or `vite.config.js`):

   ```ini
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

3. **Start dev server**

   ```bash
   npm run dev
   ```

   > Frontend runs on `http://localhost:3000`

---

## 🛠️ Available Scripts

### Backend ( `/backend` )

```bash
npm run dev        # nodemon restart on file changes
npm run start      # production mode
npm run migrate    # run pending migrations
npm run seed       # (if you have seeds)
npm run test       # unit & integration tests
```

### Frontend ( `/frontend` )

```bash
npm run dev        # Vite dev server
npm run build      # Production build for Vercel
npm run preview    # Preview production build locally
npm run lint       # ESLint checks
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "feat: add …"`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Submit a Pull Request

Please follow **Conventional Commits** and include clear PR descriptions.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ by the MSEC Dev Team
