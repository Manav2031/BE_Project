# Internship Project with Electron

This project is a full-stack application developed using Electron.js for desktop integration, React.js for the frontend, and Node.js/Express for the backend. It demonstrates a feature-rich setup combining modern web technologies and desktop functionality.

## 📁 Project Structure

BE_Project-main/
├── .editorconfig
├── .gitignore
├── .prettierrc
├── README.md
├── main.js # Electron main process entry
├── package.json # Project metadata and scripts
├── package-lock.json
├── my-app/ # React frontend application
├── server/ # Express backend server

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/)
- [Electron](https://www.electronjs.org/)

### 1️⃣ Install Dependencies

From the root directory:
npm install

Install frontend dependencies:
cd my-app
npm install

Install backend dependencies:
cd server
npm install

### 2️⃣ Run the Application
In one terminal, start the backend server:
cd server
npm run dev

In a second terminal, run the frontend React app:
cd my-app
npm start

In a third terminal (from root), launch Electron:
npm run dev:watch

Ensure proper CORS and port settings for frontend-backend communication.


## 🛠 Features
🖥 Electron-based cross-platform desktop integration

⚛️ React frontend with live reloading

🌐 Express backend with REST API

🎯 Modular and scalable project structure

## 📦 Technologies Used
Electron.js

React.js

Node.js

Express.js

JavaScript (ES6+)

HTML5/CSS3

## 📌 Notes
Make sure ports and API endpoints are correctly set.

Consider using tools like Electron Builder for packaging.

## 👨‍💻 Author
Manav Mehta
B.E. Computer Engineering
Pune Institute of Computer Technology (PICT)

## 📃 License
This project is licensed under the MIT License.
