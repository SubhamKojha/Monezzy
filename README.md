# Monezzy 💸

*Monezzy: your money, made wise.*

Monezzy is an all-in-one AI-powered personal finance platform to help you track expenses, plan budgets, manage taxes, and gain smart financial insights — no fluff, no unnecessary frameworks, just efficient, server-rendered Node.js tech that respects your data and your peace of mind.

> *“Let every paisa find its place, and let no rupee go astray.”*

---

## 🌟 Features

- Expense tracking with one-time and recurring entries
- Budget planning with overspending alerts (email/SMS)
- Daily summaries via WhatsApp or email
- Smart “AI-lite” financial suggestions
- Income filtering by month/year
- Tax regime comparison (old vs new)
- ITR readiness with OCR-powered Form 16 data extraction
- Clean, minimal UI with EJS templating (no bloated frameworks)
- Server-side rendered architecture for better performance and SEO
- Secure user data handling with MongoDB
- Offline-friendly report downloads
- Modular, future-proof backend
- Designed for traditional separation of concerns (no inline JS styles)

---

## 🚀 Setup & Installation

**1️⃣ Clone this repo**

```bash
git clone https://github.com/yourusername/monezzy.git
cd monezzy
```

**1️⃣ Install Dependencies**
```bash
npm install
```

**3️⃣ Configure environment**: Create a .env file in your root folder with:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

**4️⃣ Fire it up**
```bash
npm start
```

Visit http://localhost:3000 and let the numbers sing.

## 🛠 Current Progress

- App architecture fully functional
- Expenses and income data models implemented
- Recurring vs one-time expenses separated with own collection
- Income filtering working (month/year)
- Budget alert base functionality coded
- Server-side deletion of entries working
- Tax regime comparison (old vs new) ready
- OCR pipeline for Form16 started, WIP
- EJS templates built, responsive and tested
- Data aggregation pipelines working
- Initial security measures (helmet, input validation) in place
- Manual testing ongoing

## 🔮 Future Plans
> *“Code today with a vision for tomorrow.”*

- Finish OCR + pre-fill ITR page seamlessly
- Complete budget alerts via SMS/email
- Finalize WhatsApp/daily email summary feature
- Expand AI-lite suggestions with more predictive insights
- Add multilingual support (regional languages)
- Support family accounts and role-based controls
- Add user activity tracking with opt-out
- Harden security with full pen-testing
- Dockerize with multi-stage build
- CI/CD pipelines
- Deploy to a cloud (AWS / Fly.io / GCP)
- Write robust unit/integration test suites
- Release stable v1.0

## 🧪 Testing
For now: manual exploratory testing only.
Planned test strategy:
- Unit tests (Jest)
- Integration tests (Supertest)
- Security and input validation tests
- Regression test scripts
- coming soon, once the base features lock.

## 🖇 Deployment Plan
- Containerize with Docker
- Use MongoDB Atlas in production
- Setup Nginx reverse proxy
- Cloud deployment on AWS, GCP, or Fly.io
- Automate environment variables using .env
- Add CI/CD pipelines for automated testing + deployment

# 👀 Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)
- EJS
- CSS
- JWT
- Bcrypt
- Nodemailer (email)
- OCR using Tesseract.js
- Gemini Flash 2.0 API
- WhatsApp Business API (planned)
- Docker (planned)
- CI/CD (planned)


## 👥 Team

| Name              | Role                  | Email                      |
|-------------------|-----------------------|----------------------------|
| Subham Kumar Ojha           | Lead Developer        | ojhas6667@gmail.com         |
| Rik Maity     | Backend Developer      | rikmaity522@gmail.com          |
| Shivanjan Saha       | Frontend Developer    | shivanjan2004@gmail.com          |
| Arpit Debnath       | Team Member | arpitdebnath226@gmail.com          |

---

> *“built by team BrainRot.”*
