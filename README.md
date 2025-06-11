# 🩺 DocOnTime – Smart Healthcare Appointment & AI Symptom Checker

DocOnTime is an end-to-end full-stack healthcare platform that allows patients to book doctor appointments, get AI-powered symptom analysis(free-response exhuasted), and store their medical history — all in one place.


DocOnTime is Hosted on  -   https://dot-xgr9.onrender.com

![Screenshot (276)](https://github.com/user-attachments/assets/458b8edc-21b0-4433-a1e6-2bec49a8076c)

![Screenshot (277)](https://github.com/user-attachments/assets/d4dbc826-6bba-4a90-bd17-0bfbbb7343b8)

![Screenshot (278)](https://github.com/user-attachments/assets/ead9a605-2255-47cb-8f57-945019ee0ad2)

![Screenshot (279)](https://github.com/user-attachments/assets/c03fb31e-60fb-4931-becb-3ad071ac0720)


![Screenshot (280)](https://github.com/user-attachments/assets/1ef8810f-bc35-41f1-81af-ac93e04a0143)

![Screenshot (241)](https://github.com/user-attachments/assets/047d9320-fdba-42d9-a72d-6c4ef54f67e4)

## 🌟 Features

### 👨‍⚕️ For Patients:
- 🔍 **AI Symptom Checker** – Get instant health insights using advanced NLP.
- 📅 **Smart Appointment Booking** – Book available slots based on doctor schedules.
- 🧠 **Chat-based Medical Assistant** – Ask health-related questions with contextual memory.
- 📜 **View Medical History** – Access previously booked appointments and AI suggestions.

### 👩‍⚕️ For Doctors:
- 👨‍⚕️ **Profile Management** – Update personal and professional details, including profile image.
- 👥 **Manage Patients** – View patients who have booked with you.
- 📈 **AI-enhanced Suggestions** – AI learns from past chats for better diagnosis support.

---

## 🧠 AI Symptom Checker (MNC-Level Feature)(due to free version of open ai currently it is not working)
DocOnTime integrates an AI-powered medical assistant that:
- Analyzes symptoms using **natural language processing**
- Provides **follow-up questions**
- Detects **emergencies** (e.g., chest pain, high fever)
- Suggests relevant specialists
- Learns from **chat history** (stored in MongoDB)

---

## 💻 Tech Stack

| Tech Area        | Stack Used                                       |
|------------------|--------------------------------------------------|
| Frontend         | EJS + TailwindCSS + Vanilla JavaScript           |
| Backend          | Express.js + Node.js                             |
| Database         | MongoDB + Mongoose                               |
| Authentication   | JWT (Doctor/Patient roles)                       |
| AI Integration   | OpenAI GPT-4 / Custom NLP Model                  |
| Image Upload     | Multer (with profile picture upload for doctors) |
| Payment (optional)| Razorpay (for consultations)                    |
| Deployment       | Vercel (Frontend) + Render (Backend)             |

---

## 📁 Folder Structure


DocOnTime/
│
├── server/
│ ├── routes/ # All Express routes (auth, doctors, symptoms)
│ ├── models/ # Mongoose schemas (User, Doctor, Appointments)
│ ├── controllers/ # Route logic handlers
│ └── utils/ # AI logic, helper functions
│
├── views/
│ ├── partials/ # Reusable EJS components (navbar, footer)
│ ├── main/ # Patient-facing pages
│ ├── doctor/ # Doctor-facing pages
│
├── public/
│ └── uploads/ # Profile images & assets
│
└── .env # Environment variables





---

## 🚀 Getting Started

### 🛠️ Prerequisites
- Node.js v18+
- MongoDB Atlas connection string
- OpenAI API Key (optional, for GPT-4)

### 🔧 Setup Instructions

```bash
# 1. Clone both frontend and backend repos
git clone https://github.com/your-username/DocOnTime

# 2. Install dependencies
cd DocOnTime
npm install

# 3. Create a `.env` file in root:
MONGO_URL=your-mongo-uri
JWT_SECRET=your-secret
OPENAI_API_KEY=your-openai-key

# 4. Run server
npm start

# App runs on http://localhost:8000
```


📌 Unique Points
✨ AI-driven Healthcare – Not just static forms, but smart interaction.

✨ Role-based Views – Seamless doctor vs patient dashboards.

✨ Production-grade UX – EJS-Mate layout system, polished UI using Tailwind.

✨ First-run Deployable – Clone → Setup → Run with zero confusion.

✨ Modular Codebase – MVC structure, ready for team scale.

🤝 Contribution
Want to contribute? Open issues, suggest features, or raise PRs.
This project is ideal for expanding into:

🧬 Telemedicine

💊 Prescription uploads

📞 Video consultations (Jitsi/Agora)



📧 Contact
Made with ❤️ by Ayush Upadhyay
Email: puskaru202@gmail.com

