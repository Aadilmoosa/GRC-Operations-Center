# GRC Operations Center
Aadil Moosa | GRC Analyst | ISC2 Certified in Cybersecurity (CC) | CISA Candidate**

An interactive, browser-based GRC and SOC operations dashboard that visualizes the complete health of
a security program in real time. Built as part of an active CISA certification preparation portfolio to
demonstrate that GRC is not just a documentation discipline — it is an operational one.

GRC Operations Center is the companion application to
[GRC Forge](https://github.com/Aadilmoosa/GRC-Document-Automation-Platform-). Where GRC Forge
generates the documents that define a security program, GRC Operations Center monitors and tracks
the program as it runs. Together they cover the full GRC lifecycle from program creation to ongoing
operations.

Scroll down and see Installation section for a step-by-step guide on running this app locally on your machine.

<img width="1512" height="865" alt="Screenshot 2026-04-08 at 1 13 20 PM" src="https://github.com/user-attachments/assets/bfc32b0b-0e19-43c1-9e24-39e1ece450c7" />


---

## Live Demo

[**→ Launch GRC Operations Center**](https://grc-operations-center.vercel.app)

---

## What Problem Does It Solve?

A GRC analyst's day-to-day work involves tracking many moving pieces simultaneously — open audit
findings, upcoming certification deadlines, control testing results, vulnerability remediation SLAs,
security awareness training completion rates, and active security incidents. In most organizations
this information lives across four or five different tools: a spreadsheet for the risk register, a
calendar app for audit dates, a ticketing system for findings, a SIEM for incidents, and a separate
platform for vulnerability data.

GRC Operations Center consolidates all of that into a single dashboard. Every module is interactive —
you enter your organization's real data and the dashboard reflects it live. Nothing is hardcoded
beyond the default demo data. The entire application runs in the browser with no backend, no server,
and no external services required.

---

## The GRC Forge Connection

GRC Operations Center is directly integrated with GRC Forge via a document import pipeline. If you
generate documents in GRC Forge, you can upload those Markdown files directly into GRC Operations
Center and the dashboard will auto-populate itself from the document content.

Specifically:

- The **Risk Register** from GRC Forge → populates the Risk Heatmap module with all risks plotted
  by likelihood and impact
- The **NIST CSF 2.0 Assessment** → populates the NIST CSF ring chart with real maturity scores
  per function
- The **ISO 27001 Gap Analysis** → populates the ISO 27001 ring chart with conformity percentages
  per domain
- The **SOC 2 Readiness Program** → populates the SOC 2 ring chart with TSC coverage percentages
- The **Policy Library** → extracts all eight policy review dates and adds them as events in the
  Compliance Calendar

This means the entire dashboard can be populated from real GRC Forge output in under 60 seconds.

---

## Application Structure

The application is a single-page React app with a persistent left sidebar for navigation and a main
content area that renders one module at a time. The sidebar is organized into five sections:

| Section | Modules |
|---|---|
| Dashboard | Overview |
| GRC Forge | Import from GRC Forge |
| Compliance | Framework Coverage, Risk Heatmap, Compliance Calendar |
| Operations | Control Testing, Findings Tracker, Vulnerability Metrics, Security Awareness |
| SOC | Incident Log, Threat Feed |

The sidebar bottom left shows the current organization name and analyst name. Clicking it opens an
Edit Organization modal where you can update the org name, analyst name, and industry. These values
flow through the entire dashboard wherever organization context is displayed.

The topbar shows the current module name and a subtitle description. A green pulsing dot in the top
right indicates the dashboard is live. If any Critical severity incidents are open, a red Critical
badge also appears in the topbar as a persistent alert.

---

## All 11 Modules — Detailed Breakdown

---

### 1. Overview

The Overview is the landing page of the dashboard. It gives a complete picture of the entire
security program's health without requiring you to navigate anywhere else.

**Overall Health Score** — a single number from 0 to 100 displayed in the top right of the
Overview header. It is calculated automatically as the average of five program health indicators:
SOC 2 coverage percentage, NIST CSF maturity percentage, ISO 27001 conformity percentage, ITGC
control pass rate, and security awareness training completion rate. The number is color-coded:
green for 75 and above (healthy), amber for 55–74 (attention needed), and red for below 55
(critical gaps present).

**10 Health Cards** — a grid of clickable tiles, each showing a key metric from a specific module.
Clicking any card navigates directly to that module. The cards cover SOC 2 Coverage, NIST CSF
Maturity, ISO 27001 Conformity, Active Incidents, Open Findings, Critical CVEs, Control Pass Rate,
Upcoming Deadlines, Threat Advisories marked Relevant, and Security Awareness Completion. Each
card shows the metric value in the color of its severity — red for critical items, amber for
items needing attention, teal for healthy items.

**Immediate Attention Required panel** — the bottom left card on the Overview pulls together
everything that needs action right now: any active High or Critical severity incidents, any
Significant findings with Open status, and any calendar events within 14 days. This panel updates
automatically as you update data in other modules.

**Framework Coverage Summary rings** — the bottom right card shows the three animated ring charts
for SOC 2, NIST CSF, and ISO 27001 as a compact summary. Each ring shows the average coverage
percentage across all domains in that framework.

---

### 2. Import from GRC Forge

This module is the integration bridge between GRC Forge and GRC Operations Center. It allows you
to upload the Markdown files generated by GRC Forge and have the dashboard auto-populate from
their contents.

**How to use it:** Click the upload zone or drag and drop one or more `.md` files exported from
GRC Forge. The application reads each file as text, identifies which of the five document types it
is based on the content structure, runs the appropriate parser, and extracts structured data from
the document. After uploading, click the Import button. The import runs in sequence across all
uploaded files and shows a results banner when complete.

**What the results banner shows:** The number of documents successfully parsed, the number of
risks extracted and sent to the Risk Heatmap, the number of frameworks updated, and the number of
calendar events added. If the company name was detected in the document headers, it is also shown
and used to update the organization name in the sidebar. Quick navigation buttons in the results
banner let you jump directly to the Risk Heatmap, Framework Coverage, or Compliance Calendar to
see the imported data.

**How the parsers work:** Each parser uses regular expression pattern matching against the
predictable structure of GRC Forge documents. Because GRC Forge always generates documents with
the same table and heading formats, the parsers can reliably extract data. For example, the risk
register parser looks for table rows matching the pattern `| R-001 | Category | Title | L | I |`
and extracts the risk name, likelihood score, and impact score from each row. The NIST CSF parser
looks for the maturity summary table and extracts the current score per function, converting each
score from the 1–5 scale to a percentage. The ISO 27001 parser counts Conformant, Partial, and
Non-Conformant ratings per domain theme and calculates a coverage percentage for each.

**Import History** — the right panel of this module shows the last five imports with timestamps,
company names, and a summary of what was extracted. This persists through the session so you can
track which documents have been loaded.

**Files must be original GRC Forge outputs.** The parsers rely on the specific table and heading
structure that GRC Forge produces. Renamed files are fine — the parser identifies document type
from content, not filename. Arbitrary Markdown files from other sources will not parse correctly
and will be flagged as unrecognized.

---

### 3. Framework Coverage

The Framework Coverage module visualizes your organization's control coverage across three major
security frameworks: SOC 2 Type II, NIST Cybersecurity Framework 2.0, and ISO/IEC 27001:2022.

**Three animated ring charts** at the top of the module show the average coverage percentage for
each framework. Each ring animates from 0 to the current percentage when the page loads, providing
a visual indication of overall posture at a glance. The sublabel inside each ring describes the
coverage level: "strong" for 75% and above, "partial" for 50–74%, and "gaps" for below 50%.

**Domain breakdown progress bars** below the rings show the coverage percentage for each individual
domain or function within the framework. SOC 2 breaks down by Trust Services Criteria category
(Common Criteria, Availability, Confidentiality, etc.). NIST CSF breaks down by the six functions
(Govern, Identify, Protect, Detect, Respond, Recover). ISO 27001 breaks down by mandatory clause
groups and Annex A control themes.

**Edit mode** — the Edit button in the top right opens a modal where you can adjust any domain's
coverage percentage using sliders. Each slider runs from 0 to 100 and shows the current value in
real time as you drag. Clicking Save updates all three ring charts and progress bars live.

---

### 4. Risk Heatmap

The Risk Heatmap module provides an interactive 5×5 risk matrix for visualizing your organization's
risk inventory by likelihood and impact.

**The 5×5 matrix** — the left panel of this module renders a grid where each row represents a
likelihood level (1 = Rare through 5 = Almost Certain) and each column represents an impact level
(1 = Negligible through 5 = Critical). Each cell is color-coded by risk severity: dark red for
Critical (score 16–25), light red for High (10–15), amber for Medium (6–9), and green for Low
(1–5). Risks appear as white dots plotted in the corresponding cell. When a cell contains risks,
hovering over it shows the risk name in a tooltip.

**Risk Inventory** — the right panel lists all risks sorted by score from highest to lowest. Each
risk shows its severity badge, name, and the calculation (likelihood × impact = score). The ✕
button on each risk removes it from both the inventory and the matrix immediately.

**Adding a risk** — clicking the Add Risk button opens a modal with a name field and two sliders
for likelihood and impact. As you move the sliders, the risk score calculates in real time and
shows the severity rating. Clicking Add Risk plots the new dot on the matrix and adds it to the
inventory list.

Risk scores are calculated using the standard ISO 27001 and NIST SP 800-30 methodology of
multiplying likelihood by impact on a 1–5 scale, producing scores from 1 to 25.

---

### 5. Compliance Calendar

The Compliance Calendar tracks all upcoming deadlines relevant to your security program —
audit dates, certification target dates, policy review dates, penetration test schedules, access
review cycles, and any other time-sensitive compliance obligations.

**Upcoming Events list** — the left panel shows all events sorted by date, earliest first. Each
event has a countdown tile showing the number of days remaining. The countdown tile is color-coded
by urgency: red for events within 7 days, amber for 8–30 days, and green for more than 30 days
away. Each event also shows its formatted date and event type. The ✕ button removes an event.

**Urgency Breakdown** — the right panel shows a count of events in each urgency band (within 7
days, 8–30 days, 31–90 days, 90+ days), making it easy to see how loaded the near-term schedule
is.

**Adding an event** — clicking the Add Event button opens a modal where you enter the event name,
date using a date picker, and type (audit, assessment, policy, review, or certification). Each type
has a distinct icon in the events list.

When documents are imported from GRC Forge, policy review dates from the Policy Library are
automatically added to this calendar as policy-type events — one event per policy in the library,
with the review date from the policy's header metadata.

---

### 6. Control Testing

The Control Testing module tracks the status of your ITGC (IT General Controls) across the four
standard ITGC domains used in SOC 2 and SOX audit frameworks.

**Pass Rate ring** — the top right of the module header shows a live ring chart with the current
control pass rate as a percentage. This ring updates automatically every time you change a
control's status.

**Four summary stat cards** show the count of controls in each status: Pass, Fail, Exception,
and Not Tested. Each card shows the count and what percentage of total controls that represents.

**Domain tables** — controls are grouped into their four ITGC domains: Access Control, Change
Management, Computer Operations, and Program Development. Each control appears as a table row
with its name, current status badge, and a Cycle Status button. Clicking Cycle Status advances
the control through the four statuses in sequence: Pass → Fail → Exception → Not Tested → Pass.
This allows an auditor to quickly update testing results without a modal or form.

The pre-loaded data uses Callisto Cloud's ITGC controls from the Project 6 CISA audit workpapers,
making the default data realistic and directly tied to real audit work.

---

### 7. Findings Tracker

The Findings Tracker is an audit findings management board that tracks open findings through
remediation to closure.

**Summary stat cards** at the top show open findings counts by severity — Significant, Moderate,
and Minor — plus a total closed count.

**All Findings table** shows every finding with its title, severity badge, status badge, assigned
owner, and due date. Due dates within 14 days turn red automatically as a visual warning. Two
action buttons appear on each row: the ▶ button advances the finding's status through the
remediation cycle (Open → In Progress → Closed → Open), and the ✕ button removes the finding.

**Adding a finding** — the Add Finding button opens a modal where you enter the finding title,
severity (Significant, Moderate, Minor, or Informational), initial status, assigned owner, and
due date.

The pre-loaded findings are the five real findings from the Callisto Cloud ITGC audit in Project 6,
including the Salesforce offboarding gap and the GitHub Owner permission bypass of branch
protection.

---

### 8. Vulnerability Metrics

The Vulnerability Metrics module tracks open vulnerability counts by severity, monitors SLA
compliance rates for remediation, and visualizes a six-month trend.

**Severity stat cards** show the current open count for Critical, High, Medium, and Low
vulnerabilities, each with its remediation deadline (Critical: 24 hours, High: 7 days, Medium:
30 days, Low: 90 days).

**SLA Compliance Rate bars** show what percentage of vulnerabilities in each severity tier were
remediated within their SLA deadline, with a target threshold line. Bars are color-coded: green
if meeting target, amber if within 10 percentage points of target, red if below target.

**6-Month Trend chart** shows a horizontal bar visualization of Critical, High, and Medium
vulnerability counts over the past six months. Each month is a row with proportional bars for
each severity level, allowing you to see whether your vulnerability exposure is trending up or
down.

**Update Counts form** — at the bottom of the module, inline number inputs let you update the
current vulnerability counts and SLA compliance percentages directly. Changes update all charts
and bars immediately without saving.

---

### 9. Security Awareness

The Security Awareness module tracks employee security training completion rates by department.

**Overall completion ring** in the top right of the module header shows a single ring chart with
the overall training completion rate across all departments combined. The ring is green for 90%
and above, amber for 70–89%, and red for below 70%.

**Completion by Department progress bars** show each department's completion rate as a horizontal
progress bar with the completed count, total staff count, and percentage. Bar colors follow the
same traffic light logic as the overall ring.

**Update Training Data table** allows you to edit the completed and total staff numbers for any
department inline using number input fields. Changes update both the progress bars and the overall
ring immediately. A status badge on each row shows Pass (≥90%), Exception (70–89%), or Fail
(<70%) for quick visual assessment.

A summary line at the bottom shows how many departments have reached 100% completion and how
many are below 70%.

---

### 10. Incident Log

The Incident Log is a SOC-focused module for tracking active security incidents from initial
detection through containment and resolution. This module bridges the GRC and SOC functions of
the platform.

**Four summary stat cards** show Active incidents, Critical/High open incidents, incidents
currently Investigating, and total Resolved incidents this cycle.

**All Incidents list** — each incident is shown as a row with severity badge, status badge, title,
detection timestamp, assigned analyst, and detection source. The ✕ button removes an incident
from the log.

**Expandable incident detail** — clicking any incident row expands it to show the full detail
panel. The detail panel includes the affected systems, a full description of what was detected
and what containment actions were taken, an Advance Status button, and the full incident timeline.

**Advance Status button** cycles the incident through the three SOC incident statuses:
Investigating → Contained → Resolved. Each status represents a distinct phase of incident
handling. Investigating means the incident is in active triage and the scope is being determined.
Contained means the immediate threat has been neutralized but recovery and root cause analysis
are still in progress. Resolved means the incident is fully closed and post-incident review has
been completed or is scheduled.

**Incident timeline** — the timeline panel inside each expanded incident shows a chronological
log of every action taken, with timestamp and description. New entries can be added in real time
using the text input at the bottom of the timeline. Press Enter or click the Add button to append
a new entry with the current time. This allows an analyst to maintain a live running log of
everything that happens during an active incident.

**Logging a new incident** — clicking the Log Incident button opens a detailed modal with fields
for the incident title, severity (Critical, High, Medium, Low), initial status, assigned analyst,
detection source, affected systems, and a free-text description. When the incident is created it
is added to the top of the list with a timestamp and an initial "Incident opened and logged"
timeline entry.

**Sidebar live badge** — the Incident Log nav item in the sidebar shows a red badge with the
count of active (non-Resolved) incidents. This badge is visible from every module in the
dashboard, providing a persistent alert that incidents need attention.

**Topbar Critical alert** — if any Critical severity incidents are open, a red "🚨 X Critical"
badge appears in the topbar on every module, not just the Incident Log. This ensures Critical
incidents are never out of sight.

The pre-loaded data includes three realistic Callisto Cloud incidents: a credential stuffing
attack on the login endpoint (High, Investigating), an S3 bucket ACL misconfiguration exposing
merchant documents (Critical, Contained), and a BEC phishing attempt targeting the finance
team for a wire transfer (Medium, Resolved). Each comes with a full timeline showing realistic
analyst response actions and timestamps.

---

### 11. Threat Feed

The Threat Feed module provides a curated panel of security threat intelligence — recent CVEs,
threat actor activity, and industry security advisories — that a SOC analyst or GRC professional
would review regularly to understand the current threat landscape.

**Four summary stat cards** show the count of Critical CVEs, High severity advisories, advisories
marked as Relevant to your environment, and advisories that appear on the CISA Known Exploited
Vulnerabilities catalog.

**Filter buttons** — four buttons at the top right let you filter the feed: All shows every
advisory, Relevant shows only those you have marked as applicable to your environment, Critical
shows only Critical CVEs, and High shows Critical and High together.

**Advisory cards** — each threat advisory appears as a card showing the CVE ID (if applicable),
severity badge, CISA KEV badge (for advisories that appear on the CISA Known Exploited
Vulnerabilities list), a Relevant badge (if you have marked it relevant), the source organization,
date, CVSS score, and title. Clicking the title or the "Click here to expand" text opens the full
advisory description.

**Mark Relevant button** — each advisory has a Mark Relevant button in the bottom right. Clicking
it toggles whether the advisory is considered applicable to your environment. Marked advisories
get a gold left border on their card, a gold Relevant badge in the header, and are counted in the
Relevant stat card. The sidebar Threat Feed nav item shows a purple badge with the count of marked
advisories.

**CVSS score display** — advisories with a CVSS score show it prominently in a small panel on the
right side of the card, color-coded by severity. This makes high-severity items visually
distinguishable at a glance without reading the full description.

The pre-loaded threat feed contains eight real advisories from Q1 2025, including CVE-2025-29927
(Next.js authorization bypass, CVSS 9.1, CISA KEV), CVE-2025-30065 (Apache Parquet RCE, CVSS
10.0), CVE-2025-1974 (ingress-nginx RCE, CVSS 9.8, CISA KEV), the GitHub Actions supply chain
attack targeting tj-actions, and additional high-severity Windows and Apache vulnerabilities. Four
of these are pre-marked as Relevant to the Callisto Cloud environment based on their technology
stack (Next.js, Kubernetes, GitHub Actions).

---

## How to Run It Locally — Complete Step-by-Step Guide

### Prerequisites

Before you can run GRC Operations Center on your machine you need two things installed:
Node.js and Git. If you already set up GRC Forge, both are already installed and you can
skip to the Installation section.

**Installing Node.js**

Go to **https://nodejs.org** in your browser. You will see two download buttons. Click the one
labeled **LTS** — this stands for Long Term Support and is the stable recommended version.

The download will produce a `.pkg` file on Mac or a `.msi` file on Windows. Open it and follow
the installation wizard — click Continue through all screens, enter your computer password when
asked (this is normal, it requires admin rights), and click Install. When it says the installation
was successful, click Close.

To verify the installation worked, open a new terminal window and run:

```bash
node --version
npm --version
```

Both should print version numbers (something like `v22.x.x` and `10.x.x` respectively). If
either says "command not found," close your terminal completely and reopen it, then try again.

**Checking Git**

```bash
git --version
```

Should print something like `git version 2.x.x`. If not, download Git from **https://git-scm.com**.

---

### Installation

**Step 1 — Clone the repository**

Open your terminal. Navigate to wherever you keep your projects:

```bash
cd ~/projects
```

If that folder doesn't exist yet, create it first:

```bash
mkdir -p ~/projects
cd ~/projects
```

Now clone the repository:

```bash
git clone https://github.com/Aadilmoosa/grc-operations-center.git
```

This downloads all the project files to a new folder called `grc-operations-center` inside your
projects directory.

**Step 2 — Navigate into the project folder**

```bash
cd grc-operations-center
```

Confirm you are in the right place:

```bash
pwd
```

Should print something ending in `/projects/grc-operations-center`.

**Step 3 — Install dependencies**

```bash
npm install
```

This reads the `package.json` file and downloads all the packages the project needs to run.
You will see a progress bar and then a summary line like `added 143 packages in 12s`. The
exact numbers do not matter. As long as it does not print any red error messages, the
installation succeeded.

This step creates a `node_modules` folder in the project. This folder can be large (typically
100–200 MB) and is not tracked by Git — it will be recreated fresh every time you run
`npm install`.

**Step 4 — Start the development server**

```bash
npm run dev
```

You will see output like this:

```
  VITE v5.x.x  ready in 312ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Step 5 — Open the application**

Open your browser — Chrome, Firefox, or Safari all work — and navigate to:

```
http://localhost:5173
```

The GRC Operations Center dashboard will load immediately, pre-populated with Callisto Cloud
demo data so it looks like a live, functioning dashboard from the moment it opens.

**Step 6 — Stop the application**

When you are done, return to your terminal and press **Control + C** to stop the development
server. The application will no longer be accessible at localhost:5173 until you start it again.

---

### How to Start It Again Later

The next time you want to run the application, you only need two commands:

```bash
cd ~/projects/grc-operations-center
npm run dev
```

Then open `http://localhost:5173` in your browser. You never need to run `npm install` again
unless you specifically add new packages to the project.

---

### Personalizing the Dashboard to Your Own Organization

When you first open the app it shows Callisto Cloud, Inc. as the organization and Aadil Moosa
as the analyst. To change this to your own organization:

1. Click the **org pill in the bottom left corner of the sidebar** — it shows the organization
   name and analyst name with a small ✏️ icon
2. An Edit Organization modal will open
3. Update the Organization Name, Analyst Name, and Industry fields
4. Click Save Changes

The organization name and analyst name will update throughout the dashboard immediately.

To update the default data that loads every time the app starts, open `src/App.jsx` in VS Code,
scroll to the top of the file, and find the `DEFAULT_DATA` object. The very first few lines look
like this:

```javascript
const DEFAULT_DATA = {
  org:{ name:"Callisto Cloud, Inc.", analyst:"Aadil Moosa", industry:"SaaS" },
```

Change those values to your own organization's name, your name, and your industry. Save the
file. Vite will detect the change and reload the browser automatically within one second.

---

### Connecting It to GRC Forge

If you have GRC Forge set up locally or as a live Vercel deployment, you can use it to
generate documents and then import them into GRC Operations Center.

**Full workflow:**

1. Open GRC Forge at `http://localhost:5173` (or at your Vercel URL if deployed)
2. Fill out the six-step intake form for any company — real or fictional
3. On step 6 click Generate All Documents
4. Download the five Markdown files that appear in the download panel
5. Open GRC Operations Center at `http://localhost:5174` (it runs on a different port if
   both are running simultaneously, or simply run one at a time on the same port)
6. Click **Import from GRC Forge** in the sidebar
7. Drag and drop all five downloaded `.md` files onto the upload zone, or click Browse to
   select them
8. Click the Import button
9. The dashboard will populate with the data from your GRC Forge documents — risks on the
   heatmap, framework coverage in the rings, and policy review dates in the calendar

---

### Running GRC Forge and GRC Operations Center Simultaneously

If you want to run both apps at the same time on the same machine, they will need to run on
different ports. Vite automatically assigns the next available port if 5173 is taken.

Open two separate terminal windows. In the first:

```bash
cd ~/projects/grc-document-automation-platform
npm run dev
```

GRC Forge will start on `http://localhost:5173`.

In the second terminal:

```bash
cd ~/projects/grc-operations-center
npm run dev
```

GRC Operations Center will start on `http://localhost:5174` (the next available port).

Both applications will be running simultaneously and you can switch between them in your browser.

---

## Technical Architecture

### How the Application Works

GRC Operations Center is a single-file React application. Every component — the sidebar, all
11 modules, all modals, all parsers — lives in `src/App.jsx`. There is no backend, no database,
no API calls of any kind (except for loading Google Fonts), and no external services.

**React state management** — all dashboard data is stored in a single React state object called
`data` at the top of the main `GRCOperationsCenter` component. Every module receives the
relevant slice of this state as props and a setter function to update it. When any module updates
the data — adding a risk, cycling a control status, logging an incident — the entire dashboard
re-renders immediately, which is why the sidebar badges, the Overview health score, and all
dependent indicators update in real time.

**No persistence between sessions** — because there is no database or server, all changes you
make during a session are held in browser memory. When you close the browser or refresh the page,
the data resets to the `DEFAULT_DATA` values defined at the top of the file. To make your changes
persist across sessions, you would need to update the `DEFAULT_DATA` object directly in the source
code, or a future version could use localStorage or a backend API.

**The import pipeline** — the five parser functions (`parseRiskRegister`, `parseNISTCSF`,
`parseISO27001`, `parseSOC2`, `parsePolicyLibrary`) use JavaScript's built-in `FileReader` API to
read uploaded files as text strings, then apply regular expression pattern matching to extract
structured data. The extracted data is merged into the main React state object and all modules
re-render immediately with the new data.

**No AI, no API keys** — the dashboard is entirely mechanical. There are no calls to any AI API.
The threat feed is pre-populated with real CVE data written directly into the source code. The
framework coverage, risk scores, control statuses, and all other data are either loaded from
`DEFAULT_DATA` or entered by the user.

---

## Technical Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework and component architecture |
| Vite | Build tool and development server |
| Pure CSS | All custom styles — no component library |
| Google Fonts | DM Serif Display, DM Mono, Outfit |
| JavaScript FileReader API | Client-side file upload and parsing |
| React useState | All application state management |
| SVG | Ring chart animations |
| CSS animations | fadeUp, pulse, and ring fill transitions |

---

## Portfolio Context

GRC Operations Center is part of a ten-project GRC and cybersecurity portfolio built during
active CISA exam preparation. Each project demonstrates practical application of a major GRC
framework or discipline.

| Project | Type | Company | Framework / Domain |
|---|---|---|---|
| SOC 2 Readiness Program | GRC Deliverable | Meridian Analytics | SOC 2 Type II |
| NIST CSF 2.0 Assessment | GRC Deliverable | Veridian Health | NIST CSF 2.0 |
| ISO 27001 Gap Analysis | GRC Deliverable | Crestline Payments | ISO/IEC 27001:2022 |
| Risk Register | GRC Deliverable | Axiom Pay | ISO 27001 / NIST 800-30 |
| Policy Library | GRC Deliverable | Luminary Learning | Multi-framework |
| ITGC Audit Program & Workpapers | CISA Deliverable | Callisto Cloud | ISACA / COSO / PCAOB AS 2201 |
| GRC Forge (document generator) | Tool | — | All five frameworks |
| GRC Operations Center (this) | Tool | — | GRC + SOC operations |

---

## About

**Aadil Moosa**
GRC Analyst · Dallas, TX
ISC2 Certified in Cybersecurity (CC) · CISA Candidate

[LinkedIn](www.linkedin.com/in/aadil-moosa-) ·
[GitHub](https://github.com/Aadilmoosa) ·
[GRC Forge](https://github.com/Aadilmoosa/GRC-Document-Automation-Platform-)
