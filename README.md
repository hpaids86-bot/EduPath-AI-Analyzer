# ExamInsight AI

**AI-powered exam preparation dashboard that analyzes past question papers and ranks topics by importance — helping students study smarter, not harder.**

🔗 Live Demo: [edupath-ai-analyzer.vercel.app](https://edupath-ai-analyzer.vercel.app/)

---

## 📌 Overview

ExamInsight AI analyzes historical exam papers to identify which topics appear most frequently, carry the most weightage, and have shown up most recently. Instead of guessing what to study, students get a data-backed priority list of topics — built using NLP techniques like TF-IDF, sentence embeddings, and K-Means clustering.

> **Note:** This tool performs *historical pattern analysis*, not prediction. It tells you what has mattered in the past — not what will definitely appear next.

---

## ✨ Features

- 📊 **Topic Importance Ranking** — Scores topics based on frequency, weightage, and recency across multiple years of question papers
- 🧠 **NLP-Powered Analysis** — Uses TF-IDF, sentence embeddings, and K-Means clustering to group and rank related topics/questions
- 📈 **Interactive Dashboard** — Visual breakdown of topic priority so students can plan revision time effectively
- 🗂️ **Multi-Year Paper Support** — Aggregates insights across several years of past papers instead of just one
- ⚡ **Fast, Clean UI** — Built with React + TypeScript for a responsive dashboard experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| NLP/ML | TF-IDF, Sentence Embeddings, K-Means Clustering |
| Deployment | Vercel (frontend) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/exam-insight-ai.git
cd exam-insight-ai
```

### 2. Backend setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/examinsight
SECRET_KEY=your_secret_key_here
```

Run database migrations (if applicable):

```bash
alembic upgrade head
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 3. Frontend setup (React + TypeScript)

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

### 4. Build for production

```bash
npm run build
```

---

## 📂 Project Structure

```
exam-insight-ai/
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── nlp/              # TF-IDF, embeddings, clustering logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

---

## 🧩 How It Works

1. **Ingest** past question papers (text/PDF input)
2. **Process** questions using NLP — extract topics, compute TF-IDF scores, generate sentence embeddings
3. **Cluster** similar questions/topics together using K-Means
4. **Score** each topic cluster based on:
   - Frequency (how often it appears)
   - Weightage (marks associated with it)
   - Recency (how recently it has appeared)
5. **Visualize** ranked topics on the dashboard for quick revision planning

---

## 🗺️ Roadmap

- [ ] OCR support for scanned/handwritten question papers
- [ ] User authentication and saved study plans
- [ ] Async job queue for large-scale paper processing
- [ ] Explainability view (why a topic was ranked high)
- [ ] Export ranked topics as PDF/study sheet

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Hari**
B.Tech AI & Data Science | V.S.B College of Engineering Technical Campus

---

⭐ If you find this project useful, consider giving it a star on GitHub!
