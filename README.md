# NFL Mock Draft Simulator

*By Rohan Mistry - Last updated July 19, 2025*

---

## 📖 Overview

Full-stack web application designed and developed to simulate NFL draft scenarios, allowing users to control specific teams, make real-time draft selections, and view draft results dynamically. Built with a React frontend and FastAPI backend, using PostgreSQL for data management. Deployed with Netlify and Render.

**Target Users** are both casual and diehard NFL fans and analysts who want a hands-on mock draft experience to simulate NFL draft scenarios.

🔗 **Try it live**: [https://nfl-mock-draft-simulator.netlify.app/](https://nfl-mock-draft-simulator.netlify.app/)

<br>

INSERT IMAGE OF HOME PAGE

INSERT IMAGE OF DRAFT INTERFACE

INSERT IMAGE OF RESULTS PAGE

---

## 📁 Contents

```bash
|── backend/
│   └── alembic/
│       └── versions/       # Database migrations
│       └── env.py          # Alembic environment configuration
│   └── apps/
│       └── crud.py             # CRUD operations
│       └── models.py           # SQLAlchemy ORM model structures
│       └── schemas.py          # Pydantic schemas
│   └── scripts/
│       └── draft_service.py    # Basic simulation script
│   └── database.py         # PostgreSQL database connection
│   └── main.py             # FastAPI endpoints and CORS middleware
|── data/
│   └── 2025/               # Draft data for 2025
│   └── import_data.py      # Database import from CSV data
│   └── schema.sql          # PostgreSQL database schema
|── frontend/
│   └── src/
│       └── pages/
│           └── Draft.jsx       # Draft page component
│           └── Home.jsx        # Home page component
│           └── Results.jsx     # Results page component
│       └── App.css             # CSS styling
│       └── App.jsx             # Main app component
|── LICENSE             # MIT License
|── README.md           # Project documentation
└── requirements.txt    # Python dependencies
```

___

## 🌟 Features

* **Full Draft Simulation**: Simulate NFL draft round-by-round.
* **Live Picks**: View and track draft picks live.
* **User-Controlled Teams**: Select specific teams to control your draft picks.
* **Draft Data**: Database-backed draft data (players, teams, draft picks).
* **Team Needs**: Automatically updates team positional needs during the draft.
* **Draft Tools**: Undo picks, pause/resume draft, and restart draft.
* **Trades**: Trade picks with other teams with algorithm-based trade evaluation display.
* **Pick Clock**: 60-second pick clock for manual picks.
* **Big Board**: Best players available displayed in scrollable list with position filtering and name searching.
* **CPU**: For non-user-controlled picks, CPU auto-selects from big board
* **Sounds**: Mute/unmute draft sounds as desired.
* **Results**: After simulation concludes, draft results displayed in list and grid view. Can toggle between full draft and team-specific results.
* **Export**: Export draft results via PNG, CSV, or JSON.
* **Shareable Link**: Copy draft results link and share with others.
* **Responsive Design**: Responsive frontend web design optimized for desktop.
* **API**: REST API built with FastAPI.
* **Public Application**: View public web application, deployed via Render (backend) and Netlify (frontend).
* **Security**: CORS-configured secure API access.

---

## 🛠️ Installation Instructions

To run the app locally:
1. Clone the repository:
```bash
git clone https://github.com/rmluck/NFL-Mock-Draft-Simulator.git
cd NFL-Mock-Draft-Simulator
```
2. Set up frontend:
```bash
cd frontend
npm install
npm run dev
```
3. Access frontend at __http://localhost:5173__ (or your local Vite port).

---

## 🚧 Future Improvements

* Loading button
* Multi-select position filtering for big board
* Dark mode support and advanced theme customization
* Advanced pre-draft setup enhancements (e.g., manually edit team needs, custom draft order, preset draft modes (realistic, chaos, team-focused, random, etc.))
* Post-draft analysis features (e.g., grades and team ranks)
* More complex CPU autodraft algorithm
* Social media sharing
* Optimize API performance and caching
* Advanced player stats and profiles
* Multiplayer mode
* User accounts with saved history tracking
* Mobile app

---

## 🧰 Tech Stack

* Python, JavaScript, HTML, CSS, SQL
* **Frontend**: React (Vite), React-Router
* **Backend**: FastAPI (Python), SQLAlchemy, Pydantic
* **Database** PostgreSQL
* **Migrations**: Alembic
* **Deployment**: Netlify (frontend), Render (backend, database)

## 🙏 Contributions / Acknowledgements

This project was built independelty as a portfolio project. Inspired by draft simulators like [PFF](https://www.pff.com/draft/nfl-mock-draft-simulator), [NFL Mock Draft Database](https://www.nflmockdraftdatabase.com/mock-draft-simulator), and [Mock Draft Central](https://www.mockdraftcentral.io/).

## 🪪 License

This project is licensed under the [MIT License](/LICENSE)