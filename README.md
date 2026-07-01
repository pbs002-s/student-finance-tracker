<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F2027,50:2C5364,100:1D9E75&height=180&section=header&text=Student%20Finance%20Tracker&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=A%20campus-tuned%20money%20tracker%20that%20talks%20back&descAlignY=58&descSize=16" width="100%"/>

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&size=18&duration=2500&pause=1000&color=2DD4BF&center=true&vCenter=true&width=650&height=50&lines=Single-file+HTML+finance+tracker;Built+for+hall+life%2C+CNG+fares+%26+tight+budgets;Comes+with+a+built-in+AI+money+advisor;No+backend.+No+build+step.+Just+open+it." alt="typing-svg" />

<br/>

![Single File](https://img.shields.io/badge/Architecture-Single%20File-2DD4BF?style=for-the-badge&logo=html5&logoColor=white&labelColor=0D1117)
![No Backend](https://img.shields.io/badge/Backend-None-8B7FE8?style=for-the-badge&labelColor=0D1117)
![Storage](https://img.shields.io/badge/Storage-localStorage-2DD4BF?style=for-the-badge&labelColor=0D1117)
![Status](https://img.shields.io/badge/Status-Active-8B7FE8?style=for-the-badge&labelColor=0D1117)

<img src="https://raw.githubusercontent.com/andreasbm/readme-cover/master/assets/lines.gif" width="100%" height="2px"/>

</div>

## What this is

A finance tracker built as one self-contained HTML file, tuned to how a university student actually spends money — hall dining, transport fares, printouts, mobile recharge, and a few categories most trackers pretend don't exist.

No sign-up, no server, no dependencies to install. Open the file, and it works. Everything is saved to `localStorage` in the browser.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="500">
</div>

## Features

**Tracking**
- Add, edit, and delete income and expense entries
- 17 built-in categories, each with its own monthly budget ceiling
- Category filtering across the transaction list
- Live spending-by-category bar chart, animated on render

**Dashboard**
- Current balance, total spent, and saved/remaining at a glance
- Dedicated cards for smoking spend, relationship expenses, and betting profit/loss
- Sidebar budget overview with per-category progress bars

**Built-in helpers**
- Cigarette budget calculator with real market prices and combo suggestions
- Preset bundles for common date/outing expenses
- Betting tracker that logs profit and loss as separate entries so the balance stays honest

**AI panel**
- A built-in budget advisor personality in the sidebar
- Quick-prompt buttons for common situations ("out of money," "won on a bet")
- Responds with context-aware feedback and saving tips based on actual spending data

<div align="center">

```mermaid
flowchart LR
    A[Add Transaction] --> B[localStorage]
    B --> C[Dashboard Cards]
    B --> D[Category Chart]
    B --> E[AI Advisor]
    E -->|reads spending| B
    style A fill:#2DD4BF,stroke:#0D1117,color:#0D1117
    style B fill:#0D1117,stroke:#2DD4BF,color:#2DD4BF
    style C fill:#8B7FE8,stroke:#0D1117,color:#0D1117
    style D fill:#8B7FE8,stroke:#0D1117,color:#0D1117
    style E fill:#2DD4BF,stroke:#0D1117,color:#0D1117
```

</div>

## Run it

There's nothing to install.

```bash
git clone https://github.com/pbs002-s/student-finance-tracker.git
cd student-finance-tracker
open index.html   # or just double-click it
```

## Deploy on GitHub Pages

1. Repo → **Settings** → **Pages**
2. Source: `Deploy from a branch`, branch `main`, folder `/ (root)`
3. Save — it's live in about a minute

## Stack

Vanilla HTML, CSS, and JavaScript. No frameworks, no bundler, no npm install. `localStorage` handles persistence.

## Project structure

```
student-finance-tracker/
├── index.html
└── README.md
```

---

<div align="center">

<img src="https://github-readme-stats.vercel.app/api/pin/?username=pbs002-s&repo=student-finance-tracker&theme=tokyonight&hide_border=true&border_radius=10" width="45%"/>

Built by [**@pbs002-s**](https://github.com/pbs002-s)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1D9E75,50:2C5364,100:0F2027&height=100&section=footer" width="100%"/>

</div>
