# CitizenVoice
**CitizenVoice** is an inclusive, web-based platform designed to enable collaborative data collection and meaningful citizen participation. It helps researchers, civil society, and communities collect, share, and analyze local data through a user-friendly interface.

---

## 🚀 Features

* **Collaborative Data Collection**: Users can jointly gather structured data through customizable forms and surveys.
* **Interactive Frontend**: Built with Vue.js, for a responsive and intuitive user experience.
* **Python Backend**: Powered by a RESTful API and business logic written in Python.
* **Scalable Architecture**: Deployable via Docker & Docker Compose; configurable via `.env`.
* **Secure Endpoints**: JWT-based authentication; Nginx gateway for HTTPS routing.

---

## 📦 Repository Structure

```
/.github/             CI/CD workflows
citizenvoice/        Backend (Python API)
/frontend/           Frontend (Vue.js SPA)
/docs/               Documentation
/examples/           Sample forms & setup scripts
/scripts/            Utility scripts (e.g. DB initialization)
/cerbot/ & nginx.conf Let's Encrypt & reverse-proxy configs
docker-compose.yaml  Deploy full stack
.env.example         Template for environment variables
init-user-db.sh      Seed admin & roles
CHANGELOG.md         Version history
CODE_OF_CONDUCT.md   Community guidelines
CONTRIBUTING.md      Contribution process
LICENSE              GPL‑3.0 license
CITATION.cff         Citation metadata
README.dev.md        Developer/deployment notes
dev-notes.md         Internal dev tips & TODOs
...
```

---

## 🧑‍💻 Installation & Setup

### 1. Prerequisites

Ensure you have:

* Docker & Docker Compose
* Node.js (latest LTS) & npm
* Python 3.9+ & pip (if running backend locally)

### 2. Clone & Configure

```bash
git clone https://github.com/git-devisha/CitizenVoice.git
cd CitizenVoice
cp .env.example .env
# Edit `.env` to set DB credentials, JWT secrets, etc.
```

### 3. Run via Docker

```bash
docker-compose up --build
```

* Backend at: `http://localhost:8000`
* Frontend at: `http://localhost:8080`

### 4. Initialize Database

Run one-time setup:

```bash
./init-user-db.sh
```

This seeds the database with an admin account and required roles.

---

## 🧩 Development Workflow

### Backend

```bash
cd citizenvoice
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run serve
```

### Developer Notes

* Consult **README.dev.md** & **dev-notes.md** for architectural details and developer tips.
* Schema migrations and script automation guidelines are detailed in **docs/**.

---

## 🧭 Contributing

Your contributions are welcome! Please:

1. Read **CONTRIBUTING.md** for branching & workflow rules.
2. Follow **CODE\_OF\_CONDUCT.md** for community behavior standards.
3. Submit issues, feature requests, or pull requests via GitHub.

---

## 📖 Documentation

User guides, API reference, sample forms, and developer docs are available under **/docs/**.

---

## 📚 Citation

If using **CitizenVoice**, please cite:

```
Goncalves, J. E., Forgaci, C., Verma, T., van der Laarse, G., Ijpma, J., Aslan, Y., Ioannou, I., & Garcia Alvarez, M. (2022). Citizen Voice [Computer software].
```

See **CITATION.cff** for full metadata.

---

## 📄 License & Acknowledgements

* Licensed under **GPL‑3.0**. See **LICENSE**.
* Developed by Goncalves, Forgaci, Verma et al. at Delft University of Technology.
* Supported by the Digital Competence Centre, TU Delft.

See **CODE\_OF\_CONDUCT.md** for community norms.

---

## 🏗 Changelog

Refer to **CHANGELOG.md** for version updates and release history.

---

This project is a work in progress. Some features may still be experimental—please refer to docs for maturity status.

