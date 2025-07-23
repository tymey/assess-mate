# 📝 AssessMate

**AI-assisted grading for teachers so they can spend more time engaging with their students.**

---

## 📚 Overview

AssessMate helps middle and high school teachers streamline the grading process using AI. Teachers can upload scanned student tests, define rubrics, and receive AI-generated scores and feedback—along with tools to refine tone and maintain consistency across student responses.

> “As a former high school math teacher with ten years of experience, I remember the dread of having hundreds of papers to grade. I always wanted to spend more time designing meaningful lessons. AssessMate is the tool I wish I had—it brings back that time by handling the grading.”

---

## 👩‍🏫 Who It’s For

- **Target Users**: Teachers (Grades 6–12)
- **Primary Use Case**: Grading written or scanned math/short-answer tests with rubric-based partial credit and tailored AI feedback

---

## ✅ Features

### Implemented

- 📄 **PDF Test Upload**: Upload scanned student tests or quizzes
- 🧠 **OCR Parsing**: Extracts question numbers and student boxed answers using Tesseract.js
- 📊 **Rubric Builder**: Teachers define step-by-step criteria with point weights
- 🤖 **LangChain AI Grading**: Uses rubric to assign scores and justify them
- 🧑‍🏫 **Teacher Feedback Review**: Teachers can override scores, provide their own feedback, and score tone alignment (1–10)
- 🎯 **Tone Refinement**: Trains the AI to match a teacher’s voice using recent feedback comparisons (stored as ToneContext and used in few-shot examples)

### In Progress

- ⬛ **Boxed Answer Extraction**: Improved isolation of final student answers for precise grading

### Planned

- 🔄 **Rubric Sharing**: Share rubric templates between teachers
- 🛠️ **Admin Mode**: Manage users, roles, and analytics
- 📈 **Analytics Dashboard**: View trends by student, rubric, or question type

---

## 🛠️ Tech Stack

### 🧩 Backend

- **Node.js + Express** – API server
- **PostgreSQL + Prisma** – Relational database and ORM
- **LangChain + OpenAI** – AI feedback and tone learning
- **TypeScript**
- **Tesseract.js + pdf2pic + pdf-parse** – OCR and image generation for parsing student work

### 🖼️ Frontend

- **React + TypeScript**
- **Vite** – Lightning-fast build
- **TailwindCSS** – Styling framework

---

## 🧪 Testing

- ❌ No automated tests are written yet

---

## 🚀 Getting Started (Local Dev)

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start PostgreSQL**  
   Make sure your `.env` file includes a valid `DATABASE_URL`

3. **Run database migrations**:

   ```bash
   npx prisma migrate dev
   ```

4. **Start backend and frontend**:

   ```bash
   # backend
   npm run dev --workspace=apps/backend

   # frontend
   npm run dev --workspace=apps/frontend
   ```

---

## 🔐 Authentication

- Auth uses simple JWT-based authentication for local dev
- Teachers must log in to upload, grade, or refine tone

---

## 💡 Future Directions

- More granular analytics (per criterion, per rubric)
- Improved handwriting recognition
- Feedback tone presets (e.g., “Encouraging,” “Direct,” “Inquisitive”)
- Student-facing portal (stretch goal)

---
