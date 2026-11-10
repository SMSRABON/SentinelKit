# 🛡️ SentinelKit – Cyber Security Toolkit

A lightweight, modern, and responsive Cyber Security Toolkit built with **Cloudflare Workers, HTML, CSS, and JavaScript**.

SentinelKit provides useful security-checking tools to help users understand website security headers, SSL certificates, password strength, URL safety indicators, and public IP information.

<p align="center">
  <strong>Developed with ❤️ by MD Awal Sheikh</strong>
</p>

---

## 🌐 Live Website

**Live Demo:** https://cyber-security-toolkit.mdawalsheikh.workers.dev

**GitHub Repository:** https://github.com/SMSRABON/SentinelKit

---

## ✨ Features

### 1. Website Security Header Checker
- Checks common HTTP security headers.
- Identifies missing security headers.
- Provides basic security recommendations.

### 2. SSL Certificate Checker
- Checks SSL/TLS certificate information.
- Uses the SSL Labs API for assessment.
- Helps users understand certificate status.

### 3. Password Strength Checker
- Evaluates password strength locally in the browser.
- Provides a strength score and suggestions.
- Passwords are not sent to the backend.

### 4. URL Safety Analyzer
- Analyzes URLs using basic security heuristics.
- Identifies potentially suspicious URL patterns.
- Provides safety recommendations.

### 5. IP Information Lookup
- Retrieves public IP information.
- Displays approximate network and geolocation details.
- Uses the ipapi.co service.

### 6. Security Report Generator
- Generates downloadable JSON security reports.
- Provides a printable PDF report using the browser's Save as PDF option.

---

## 🧰 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Cloudflare Workers
- **SSL Assessment:** SSL Labs API
- **IP Information:** ipapi.co
- **Deployment:** Cloudflare Workers
- **Version Control:** Git & GitHub

---

## 📁 Project Structure

```text
SentinelKit/
├── public/
│   └── index.html
├── src/
│   └── index.js
├── .gitignore
├── package.json
├── package-lock.json
├── wrangler.jsonc
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js
- npm
- A Cloudflare account

### 1. Clone the Repository

```bash
git clone https://github.com/SMSRABON/SentinelKit.git
```

### 2. Navigate to the Project Folder

```bash
cd SentinelKit
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

### 5. Deploy to Cloudflare Workers

Login to Cloudflare:

```bash
npx wrangler login
```

Deploy:

```bash
npm run deploy
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |
| POST | `/api/headers` | Website security header analysis |
| GET | `/api/ssl?host=example.com` | SSL certificate assessment |
| GET | `/api/ip?ip=8.8.8.8` | Public IP information |

---

## 🔐 Security & Privacy Notice

- Password strength checking is performed locally in the browser.
- Passwords are not transmitted to the backend.
- URL analysis is heuristic-based and does not guarantee malware detection.
- IP geolocation is approximate and does not identify a person's exact location.
- Website header checks and SSL assessments are informational tools, not a complete security audit.
- Only analyze websites and systems you own or have permission to test.

---

## ⚠️ Disclaimer

SentinelKit is an educational and informational cyber security toolkit. It is not a replacement for professional penetration testing, vulnerability assessment, or a comprehensive security audit.

The developer is not responsible for misuse of this project.

---

## 👨‍💻 Author

**MD Awal Sheikh**

- GitHub: [@SMSRABON](https://github.com/SMSRABON)
- Project: [SentinelKit](https://github.com/SMSRABON/SentinelKit)

**Made with ❤️ by MD Awal Sheikh**

---

## ⭐ Support

If you find SentinelKit useful, please consider giving this repository a ⭐ star on GitHub.

Your support helps the project grow!

---

<p align="center">
  <strong>🛡️ SentinelKit — Your Lightweight Cyber Security Toolkit</strong>
</p>
