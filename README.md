# 📋 Task Manager Web Application

A clean, responsive Task Manager built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no libraries, no inline styles or scripts. Tasks persist across page reloads using the browser's **Local Storage**.

---

## 📝 Project Description

This project is a fully functional Task Manager that lets users add, edit, complete, delete, search, and filter their daily tasks. Each task can have a **priority level** (High / Medium / Low) and a **due date**, and the UI updates dynamically through DOM manipulation — no page reloads required.

This was built to satisfy the **Minor Project 2: Task Manager** requirements (InternsElite), including the mandatory separation of `index.html`, `style.css`, and `script.js` with no inline CSS/JS.

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure and form elements
- **CSS3** — Flexbox, Grid, CSS variables, responsive media queries, animations/transitions
- **Vanilla JavaScript (ES6+)** — DOM manipulation, event handling, Local Storage API

No frameworks or libraries (no React, Vue, Angular, Bootstrap, Tailwind, jQuery, etc.) are used.

---

## ✨ Features

- ✅ Add new tasks with text, priority, and due date
- ✅ Display all tasks dynamically in a list
- ✅ Mark tasks as completed (checkbox toggle with strikethrough)
- ✅ Edit existing tasks (text, priority, due date) inline
- ✅ Delete tasks (with smooth removal animation)
- ✅ Search tasks by keyword in real time
- ✅ Filter tasks by **All / Pending / Completed**
- ✅ Task priority badges (High 🔴 / Medium 🟡 / Low 🟢)
- ✅ Due date display with **overdue** highlighting
- ✅ Live task counter (Total / Pending / Completed)
- ✅ Data persistence via **Local Storage** (tasks survive page refresh)
- ✅ Fully responsive design (mobile + desktop)
- ✅ Smooth animations for adding/removing tasks and hover states
- ✅ No page reloads — all updates happen via dynamic DOM manipulation

---

## 📂 File Structure
task-manager/

├── index.html      # App markup/structure

├── style.css       # All styling (no inline CSS)

├── script.js       # All logic (no inline JS)

└── README.md       # Project documentation
---

## ▶️ How to Run the Project Locally

1. **Download or clone** this repository:
```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
```
2. **Navigate** into the project folder:
```bash
   cd <your-repo-name>
```
3. **Open `index.html`** directly in any modern web browser (double-click the file, or right-click → "Open with" → your browser).

No build steps, installations, or servers are required — it's pure static HTML/CSS/JS.

> Optional: For a local dev server (useful for live-reload), you can use the VS Code "Live Server" extension or run:
> ```bash
> npx serve .
> ```

---

## 🚀 Deployment Instructions

### Option 1: GitHub Pages

1. Push this project to a **public GitHub repository**.
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then click **Save**.
5. Wait a minute, then your live URL will appear at the top of the Pages settings, typically:
https://<your-username>.github.io/<your-repo-name>/
### Option 2: Netlify

1. Go to [https://netlify.com](https://netlify.com) and log in.
2. Click **Add new site → Import an existing project**.
3. Connect your GitHub account and select this repository.
4. Leave build settings empty (no build command needed; publish directory = root `/`).
5. Click **Deploy** — Netlify will give you a live URL instantly.

### Option 3: Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in.
2. Click **Add New → Project**.
3. Import this GitHub repository.
4. Leave framework preset as **Other** (no build step needed).
5. Click **Deploy** — Vercel will provide a live URL.

---

## 📦 Submission Checklist

- [x] `index.html`, `style.css`, `script.js` as separate files
- [x] No inline CSS or JavaScript
- [x] No frameworks/libraries used
- [x] Public GitHub repository
- [x] Hosted live link (GitHub Pages / Netlify / Vercel)
- [x] README.md included with description, tech stack, features, and run/deploy instructions

---

## 👤 Author

Feel free to update this section with your name and contact details before submission.

---

## 📄 License

This project is free to use for educational purposes.
