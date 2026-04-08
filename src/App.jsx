import { useState, useRef } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0d1117;--ink-s:#161b22;--ink-s2:#1c2333;--ink-s3:#21262d;
  --border:#21262d;--border2:#30363d;
  --gold:#e3b341;--gold-dim:#a07d1f;--gold-pale:rgba(227,179,65,0.08);
  --teal:#3fb950;--teal-bg:rgba(63,185,80,0.1);
  --red:#f85149;--red-bg:rgba(248,81,73,0.1);
  --amber:#d29922;--amber-bg:rgba(210,153,34,0.1);
  --blue:#58a6ff;--blue-bg:rgba(88,166,255,0.1);
  --purple:#a371f7;--purple-bg:rgba(163,113,247,0.1);
  --text:#e6edf3;--text-m:#8b949e;--text-d:#58677a;
  --radius:10px;--radius-lg:14px;--sidebar:240px;
}
html,body{height:100%;background:var(--ink);color:var(--text);font-family:'Outfit',sans-serif}
.app{display:flex;height:100vh;overflow:hidden;position:relative}
.app::before{content:'';position:fixed;inset:0;
  background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
  background-size:48px 48px;opacity:.2;pointer-events:none;z-index:0}
.sidebar{width:var(--sidebar);background:var(--ink-s);border-right:1px solid var(--border);
  display:flex;flex-direction:column;position:relative;z-index:10;flex-shrink:0;overflow-y:auto}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}
.sidebar-logo{padding:20px 20px 16px;border-bottom:1px solid var(--border);flex-shrink:0}
.logo-row{display:flex;align-items:center;gap:9px}
.logo-icon{width:32px;height:32px;border-radius:7px;background:linear-gradient(135deg,var(--gold),var(--gold-dim));
  display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 16px rgba(227,179,65,.3);flex-shrink:0}
.logo-text{font-family:'DM Serif Display',serif;font-size:15px;color:var(--text);line-height:1.1}
.logo-sub{font-size:9px;color:var(--text-d);letter-spacing:1.5px;text-transform:uppercase;margin-top:1px}
.sidebar-section{padding:12px 12px 4px}
.sidebar-section-label{font-size:9px;font-weight:600;color:var(--text-d);letter-spacing:2px;text-transform:uppercase;padding:0 8px;margin-bottom:4px}
.nav-item{display:flex;align-items:center;gap:9px;padding:7px 10px;border-radius:8px;
  cursor:pointer;transition:all .2s;font-size:12px;color:var(--text-m);font-weight:500;position:relative}
.nav-item:hover{background:var(--ink-s2);color:var(--text)}
.nav-item.active{background:var(--gold-pale);color:var(--gold)}
.nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);
  width:3px;height:60%;background:var(--gold);border-radius:0 3px 3px 0}
.nav-icon{font-size:13px;width:18px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:var(--red-bg);border:1px solid rgba(248,81,73,.3);
  color:var(--red);border-radius:99px;padding:1px 7px;font-size:10px;font-weight:600;font-family:'DM Mono',monospace}
.nav-badge.amber{background:var(--amber-bg);border-color:rgba(210,153,34,.3);color:var(--amber)}
.nav-badge.purple{background:var(--purple-bg);border-color:rgba(163,113,247,.3);color:var(--purple)}
.sidebar-footer{margin-top:auto;padding:14px 12px;border-top:1px solid var(--border);flex-shrink:0}
.org-pill{display:flex;align-items:center;gap:8px;background:var(--ink-s2);border:1px solid var(--border);
  border-radius:8px;padding:8px 10px;cursor:pointer;transition:all .2s}
.org-pill:hover{border-color:var(--border2)}
.org-avatar{width:26px;height:26px;border-radius:6px;background:linear-gradient(135deg,var(--gold-dim),var(--gold));
  display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--ink)}
.org-name{font-size:12px;font-weight:600;color:var(--text)}
.org-role{font-size:10px;color:var(--text-m)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1}
.topbar{height:52px;border-bottom:1px solid var(--border);display:flex;align-items:center;
  padding:0 24px;gap:16px;background:rgba(13,17,23,.8);backdrop-filter:blur(8px);flex-shrink:0}
.topbar-title{font-family:'DM Serif Display',serif;font-size:18px;color:var(--text)}
.topbar-sub{font-size:12px;color:var(--text-m);margin-left:4px}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.status-dot{width:7px;height:7px;border-radius:50%;background:var(--teal);
  box-shadow:0 0 6px rgba(63,185,80,.5);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.status-label{font-size:11px;color:var(--teal);font-weight:500}
.content{flex:1;overflow-y:auto;padding:24px}
.content::-webkit-scrollbar{width:4px}
.content::-webkit-scrollbar-track{background:transparent}
.content::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px}
.card{background:var(--ink-s);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.card-title{font-size:11px;font-weight:600;color:var(--text-m);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:7px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.stat-card{background:var(--ink-s);border:1px solid var(--border);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:6px}
.stat-label{font-size:10px;font-weight:600;color:var(--text-m);letter-spacing:1px;text-transform:uppercase}
.stat-value{font-family:'DM Mono',monospace;font-size:26px;font-weight:500;color:var(--text)}
.stat-sub{font-size:11px;color:var(--text-m)}
.ring-wrap{display:flex;flex-direction:column;align-items:center;gap:10px}
.ring-svg{transform:rotate(-90deg)}
.ring-bg{fill:none;stroke:var(--border2)}
.ring-fill{fill:none;stroke-linecap:round;transition:stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)}
.ring-name{font-size:12px;font-weight:600;color:var(--text);text-align:center}
.prog-bar-wrap{display:flex;flex-direction:column;gap:3px;margin-bottom:10px}
.prog-bar-header{display:flex;justify-content:space-between;font-size:12px}
.prog-bar-label{color:var(--text);font-weight:500}
.prog-bar-value{font-family:'DM Mono',monospace;color:var(--text-m)}
.prog-bar-track{height:6px;background:var(--ink-s3);border-radius:99px;overflow:hidden}
.prog-bar-fill{height:100%;border-radius:99px;transition:width .8s cubic-bezier(.4,0,.2,1)}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600;font-family:'DM Mono',monospace}
.badge-pass{background:var(--teal-bg);color:var(--teal);border:1px solid rgba(63,185,80,.25)}
.badge-fail{background:var(--red-bg);color:var(--red);border:1px solid rgba(248,81,73,.25)}
.badge-exception{background:var(--amber-bg);color:var(--amber);border:1px solid rgba(210,153,34,.25)}
.badge-untested{background:var(--ink-s3);color:var(--text-m);border:1px solid var(--border2)}
.badge-critical{background:rgba(188,30,30,.15);color:#ff6b6b;border:1px solid rgba(188,30,30,.3)}
.badge-high{background:var(--red-bg);color:var(--red);border:1px solid rgba(248,81,73,.25)}
.badge-medium{background:var(--amber-bg);color:var(--amber);border:1px solid rgba(210,153,34,.25)}
.badge-low{background:var(--teal-bg);color:var(--teal);border:1px solid rgba(63,185,80,.25)}
.badge-open{background:var(--red-bg);color:var(--red);border:1px solid rgba(248,81,73,.25)}
.badge-closed{background:var(--teal-bg);color:var(--teal);border:1px solid rgba(63,185,80,.25)}
.badge-progress{background:var(--blue-bg);color:var(--blue);border:1px solid rgba(88,166,255,.25)}
.badge-investigating{background:var(--purple-bg);color:var(--purple);border:1px solid rgba(163,113,247,.25)}
.badge-contained{background:var(--amber-bg);color:var(--amber);border:1px solid rgba(210,153,34,.25)}
.badge-resolved{background:var(--teal-bg);color:var(--teal);border:1px solid rgba(63,185,80,.25)}
.badge-info{background:var(--blue-bg);color:var(--blue);border:1px solid rgba(88,166,255,.25)}
.data-table{width:100%;border-collapse:collapse;font-size:12px}
.data-table th{text-align:left;padding:8px 12px;font-size:10px;font-weight:600;color:var(--text-d);letter-spacing:1.5px;text-transform:uppercase;border-bottom:1px solid var(--border)}
.data-table td{padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text);vertical-align:middle}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:rgba(255,255,255,.02)}
.cal-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.cal-item:last-child{border-bottom:none}
.cal-days{width:46px;height:46px;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;font-weight:700}
.cal-days-num{font-family:'DM Mono',monospace;font-size:18px;line-height:1}
.cal-days-label{font-size:8px;letter-spacing:1px;text-transform:uppercase;opacity:.8}
.cal-urgent{background:var(--red-bg);border:1px solid rgba(248,81,73,.25);color:var(--red)}
.cal-warn{background:var(--amber-bg);border:1px solid rgba(210,153,34,.25);color:var(--amber)}
.cal-ok{background:var(--teal-bg);border:1px solid rgba(63,185,80,.25);color:var(--teal)}
.cal-info{font-size:12px;flex:1}
.cal-name{font-weight:600;color:var(--text);margin-bottom:2px}
.cal-date{font-size:11px;color:var(--text-m)}
.form-section{margin-bottom:20px}
.form-title{font-size:13px;font-weight:600;color:var(--gold);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.form-full{grid-column:1/-1}
.field-label{font-size:11px;font-weight:600;color:var(--text-m);letter-spacing:.4px;text-transform:uppercase;margin-bottom:4px}
.field-input,.field-select,.field-textarea{background:var(--ink-s2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'Outfit',sans-serif;font-size:13px;padding:8px 12px;outline:none;width:100%;transition:border-color .2s,box-shadow .2s}
.field-input:focus,.field-select:focus,.field-textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(227,179,65,.1)}
.field-select{appearance:none;cursor:pointer}
.field-input::placeholder,.field-textarea::placeholder{color:var(--text-d)}
.field-textarea{resize:vertical;min-height:80px;line-height:1.5}
.btn{padding:8px 16px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;border:none;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:linear-gradient(135deg,var(--gold),var(--gold-dim));color:var(--ink);box-shadow:0 0 14px rgba(227,179,65,.2)}
.btn-primary:hover{box-shadow:0 0 22px rgba(227,179,65,.35);transform:translateY(-1px)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text-m)}
.btn-ghost:hover{border-color:var(--border2);color:var(--text)}
.btn-sm{padding:5px 11px;font-size:11px;border-radius:6px}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.section-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--text)}
.section-sub{font-size:12px;color:var(--text-m);margin-top:2px}
.health-card{background:var(--ink-s);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px}
.health-card:hover{border-color:var(--border2);transform:translateY(-1px)}
.health-card-icon{font-size:20px;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.health-card-info{flex:1}
.health-card-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:3px}
.health-card-status{font-size:11px;color:var(--text-m)}
.health-score{font-family:'DM Mono',monospace;font-size:18px;font-weight:500}
.divider{height:1px;background:var(--border);margin:16px 0}
.empty{text-align:center;padding:32px 20px;color:var(--text-m)}
.empty-icon{font-size:28px;margin-bottom:8px;opacity:.5}
.empty-text{font-size:13px}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:var(--ink-s);border:1px solid var(--border2);border-radius:16px;padding:24px;width:100%;max-width:520px;max-height:85vh;overflow-y:auto;animation:fadeUp .25s ease}
.modal-title{font-family:'DM Serif Display',serif;font-size:18px;color:var(--text);margin-bottom:16px}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}
.import-drop-zone{border:2px dashed var(--border2);border-radius:var(--radius-lg);padding:40px 24px;text-align:center;transition:all .25s;cursor:pointer;position:relative}
.import-drop-zone:hover,.import-drop-zone.dragover{border-color:var(--gold);background:rgba(227,179,65,.04)}
.import-drop-input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.import-file-row{display:flex;align-items:center;gap:10px;background:var(--ink-s2);border:1px solid var(--border);border-radius:9px;padding:10px 14px;margin-bottom:8px}
.import-result-banner{border-radius:var(--radius);padding:14px 16px;margin-bottom:16px;display:flex;align-items:flex-start;gap:12px}
.import-result-banner.success{background:var(--teal-bg);border:1px solid rgba(63,185,80,.25)}
.import-result-banner.warning{background:var(--amber-bg);border:1px solid rgba(210,153,34,.25)}
.import-result-banner.error{background:var(--red-bg);border:1px solid rgba(248,81,73,.25)}
.import-summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
.import-summary-card{background:var(--ink-s2);border:1px solid var(--border);border-radius:9px;padding:12px;text-align:center}
.import-summary-num{font-family:'DM Mono',monospace;font-size:22px;font-weight:500;color:var(--gold)}
.import-summary-label{font-size:10px;color:var(--text-m);margin-top:2px}
.import-history-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px}
.import-history-item:last-child{border-bottom:none}
.incident-row{display:flex;flex-direction:column;gap:6px;padding:14px 0;border-bottom:1px solid var(--border)}
.incident-row:last-child{border-bottom:none}
.incident-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.incident-title{font-size:13px;font-weight:600;color:var(--text);flex:1;min-width:180px}
.incident-meta{font-size:11px;color:var(--text-m);display:flex;gap:12px;flex-wrap:wrap}
.incident-timeline{margin-top:8px;padding:10px 12px;background:var(--ink-s2);border-radius:8px;border-left:2px solid var(--border2)}
.timeline-entry{font-size:11px;padding:3px 0;display:flex;gap:8px}
.timeline-time{font-family:'DM Mono',monospace;color:var(--text-d);flex-shrink:0;width:80px}
.timeline-text{color:var(--text-m)}
.threat-item{padding:14px 0;border-bottom:1px solid var(--border)}
.threat-item:last-child{border-bottom:none}
.threat-source{font-size:9px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-d);margin-bottom:4px}
.threat-title{font-size:13px;font-weight:600;color:var(--text);line-height:1.4;cursor:pointer}
.threat-body{font-size:12px;color:var(--text-m);line-height:1.6;margin:8px 0}
.threat-tags{display:flex;gap:6px;flex-wrap:wrap}
.threat-tag{background:var(--ink-s2);border:1px solid var(--border);border-radius:5px;padding:2px 8px;font-size:10px;color:var(--text-m)}
.cve-id{font-family:'DM Mono',monospace;font-size:11px;font-weight:600;color:var(--gold)}
@media(max-width:768px){.sidebar{display:none}.grid-4,.grid-3{grid-template-columns:1fr 1fr}.grid-2{grid-template-columns:1fr}}
`;

const DEFAULT_DATA = {
  org:{ name:"Callisto Cloud, Inc.", analyst:"Aadil Moosa", industry:"SaaS" },
  frameworks:{
    soc2:{ domains:[{name:"CC — Common Criteria",pct:72},{name:"A — Availability",pct:85},{name:"C — Confidentiality",pct:60}] },
    nist:{ domains:[{name:"GV — Govern",pct:55},{name:"ID — Identify",pct:70},{name:"PR — Protect",pct:78},{name:"DE — Detect",pct:62},{name:"RS — Respond",pct:50},{name:"RC — Recover",pct:45}] },
    iso:{ domains:[{name:"Clauses 4–10",pct:40},{name:"Theme 5 — Org",pct:58},{name:"Theme 6 — People",pct:65},{name:"Theme 7 — Physical",pct:72},{name:"Theme 8 — Tech",pct:68}] },
  },
  risks:[
    {id:1,name:"API data breach",likelihood:3,impact:5},
    {id:2,name:"Ransomware attack",likelihood:2,impact:5},
    {id:3,name:"Privilege escalation",likelihood:3,impact:4},
    {id:4,name:"BEC / social engineering",likelihood:3,impact:3},
    {id:5,name:"Vendor SOC 2 failure",likelihood:2,impact:3},
    {id:6,name:"Cloud provider outage",likelihood:1,impact:5},
    {id:7,name:"Phishing credential theft",likelihood:4,impact:3},
  ],
  calendar:[
    {id:1,name:"SOC 2 Type II Audit",date:"2026-05-15",type:"audit"},
    {id:2,name:"ISO 27001 Stage 1 Audit",date:"2026-06-30",type:"audit"},
    {id:3,name:"Annual Pen Test",date:"2026-04-20",type:"assessment"},
    {id:4,name:"POL-001 InfoSec Policy Review",date:"2026-04-10",type:"policy"},
    {id:5,name:"Q2 Access Review",date:"2026-04-30",type:"review"},
    {id:6,name:"CISA Exam",date:"2026-07-15",type:"certification"},
  ],
  controls:[
    {id:1,domain:"Access Control",name:"User provisioning with manager approval",status:"Pass"},
    {id:2,domain:"Access Control",name:"MFA enforced — all users",status:"Pass"},
    {id:3,domain:"Access Control",name:"Quarterly access reviews",status:"Exception"},
    {id:4,domain:"Access Control",name:"Access revoked within 4hrs of termination",status:"Fail"},
    {id:5,domain:"Change Management",name:"PR review required before production merge",status:"Pass"},
    {id:6,domain:"Change Management",name:"Emergency change post-review within 24hrs",status:"Pass"},
    {id:7,domain:"Change Management",name:"SAST scanning on all PRs",status:"Exception"},
    {id:8,domain:"Computer Operations",name:"Automated backups — Tier 1 systems",status:"Pass"},
    {id:9,domain:"Computer Operations",name:"Quarterly backup restoration testing",status:"Fail"},
    {id:10,domain:"Computer Operations",name:"Security alert SLA compliance",status:"Pass"},
    {id:11,domain:"Program Development",name:"Security requirements in SDLC",status:"Pass"},
    {id:12,domain:"Program Development",name:"Annual penetration test",status:"Pass"},
  ],
  findings:[
    {id:1,title:"Retroactive access approval — AWS IAM",severity:"Minor",status:"In Progress",owner:"IT Manager",due:"2026-04-30"},
    {id:2,title:"MFA enrollment monitoring gap",severity:"Minor",status:"In Progress",owner:"IT Manager",due:"2026-05-15"},
    {id:3,title:"Offboarding gap — Salesforce not in automated workflow",severity:"Significant",status:"Open",owner:"VP Engineering",due:"2026-05-31"},
    {id:4,title:"GitHub Owner permission bypass of branch protection",severity:"Significant",status:"Open",owner:"VP Engineering",due:"2026-06-30"},
    {id:5,title:"Q3 backup restoration test not completed",severity:"Moderate",status:"In Progress",owner:"VP Engineering",due:"2026-04-30"},
  ],
  vulns:{
    critical:2,high:7,medium:18,low:34,
    sla:{critical:50,high:71,medium:88,low:97},
    trend:[
      {month:"Oct",critical:5,high:12,medium:24},
      {month:"Nov",critical:4,high:10,medium:22},
      {month:"Dec",critical:3,high:9,medium:20},
      {month:"Jan",critical:4,high:8,medium:19},
      {month:"Feb",critical:3,high:8,medium:18},
      {month:"Mar",critical:2,high:7,medium:18},
    ]
  },
  awareness:[
    {dept:"Engineering",completed:28,total:32},
    {dept:"Finance",completed:8,total:8},
    {dept:"Sales",completed:15,total:22},
    {dept:"Customer Success",completed:12,total:14},
    {dept:"HR",completed:6,total:6},
    {dept:"Legal",completed:4,total:5},
    {dept:"Leadership",completed:7,total:8},
  ],
  incidents:[
    {id:1,title:"Suspected credential stuffing attack on login endpoint",severity:"High",status:"Investigating",analyst:"Aadil Moosa",detected:"2026-04-07T08:14:00",source:"CloudWatch / WAF",affectedSystems:"CallistoOps API gateway, Azure AD",description:"WAF rule triggered on 3,847 failed login attempts from 12 distinct IPs over 22 minutes. IP block applied at 08:16. No successful logins confirmed. Investigating whether any accounts were compromised prior to block.",
      timeline:[
        {time:"08:14",text:"WAF alert fired — 500+ failed auth attempts/min threshold exceeded"},
        {time:"08:16",text:"IP block applied to 12 source IPs via AWS WAF rule update"},
        {time:"08:22",text:"Azure AD sign-in logs reviewed — no successful logins from flagged IPs"},
        {time:"08:45",text:"Incident opened — Aadil Moosa assigned as primary analyst"},
        {time:"09:10",text:"Password reset notifications sent to 14 highest-targeted accounts"},
      ]},
    {id:2,title:"Sensitive S3 bucket ACL misconfiguration detected",severity:"Critical",status:"Contained",analyst:"Sarah Kim",detected:"2026-04-06T14:30:00",source:"AWS Config",affectedSystems:"S3 bucket: callisto-merchant-exports",description:"AWS Config rule flagged public-read ACL on callisto-merchant-exports bucket containing merchant onboarding documents. Bucket made private at 14:33. Reviewing access logs to determine if unauthorized access occurred during the 6-hour exposure window.",
      timeline:[
        {time:"14:30",text:"AWS Config rule triggered — S3 bucket public-read ACL detected"},
        {time:"14:33",text:"Bucket ACL corrected to private by VP Engineering"},
        {time:"14:45",text:"S3 access logs pulled for 6-hour exposure window"},
        {time:"15:20",text:"Preliminary log review: 3 external IP GET requests identified"},
        {time:"16:00",text:"Legal notified per potential data exposure protocol"},
      ]},
    {id:3,title:"Phishing email targeting finance team — wire transfer BEC",severity:"Medium",status:"Resolved",analyst:"Marcus Webb",detected:"2026-04-05T11:02:00",source:"Employee report",affectedSystems:"Google Workspace (Gmail)",description:"Finance analyst reported suspicious email impersonating CEO requesting urgent $47,500 wire transfer. Email originated from lookalike domain caliisto-cloud.com. No wire transfer initiated. DMARC enforcement gap identified as contributing factor.",
      timeline:[
        {time:"11:02",text:"Finance analyst reported suspicious email to security team"},
        {time:"11:08",text:"Confirmed BEC attempt from lookalike domain caliisto-cloud.com"},
        {time:"11:15",text:"Domain blocked in Google Workspace email filtering"},
        {time:"11:30",text:"DMARC enforcement gap documented — added to findings tracker"},
        {time:"12:00",text:"Incident resolved — no financial impact. BEC training scheduled."},
      ]},
  ],
  threats:[
    {id:1,cve:"CVE-2025-29927",title:"Next.js Authorization Bypass — Middleware Header Injection",severity:"Critical",cvss:"9.1",source:"NVD / CISA KEV",date:"2025-03-21",body:"Critical authorization bypass in Next.js allows attackers to bypass middleware-based access controls by injecting a crafted x-middleware-subrequest header. Affects all versions prior to 15.2.3, 14.2.25, and 13.5.9. Actively exploited in the wild. CISA added to Known Exploited Vulnerabilities catalog.",tags:["Next.js","Authorization Bypass","CISA KEV"],relevant:true},
    {id:2,cve:"CVE-2025-30065",title:"Apache Parquet RCE via Crafted File — CVSS 10.0",severity:"Critical",cvss:"10.0",source:"NVD / Apache",date:"2025-04-01",body:"Maximum severity RCE in Apache Parquet Java library. Attackers execute arbitrary code via a malicious .parquet file. Affects apache-parquet-java up to 1.15.0. Organizations using Parquet for data pipelines (Snowflake, Spark, AWS Glue) should patch immediately.",tags:["Apache","Parquet","RCE","Data Pipeline"],relevant:true},
    {id:3,cve:"CVE-2025-1974",title:"Ingress-nginx RCE — 43% of Kubernetes Clusters Affected",severity:"Critical",cvss:"9.8",source:"Wiz Research",date:"2025-03-24",body:"Unauthenticated RCE in ingress-nginx affecting Kubernetes clusters. The AdmissionWebhook can be exploited without authentication to inject arbitrary nginx configuration. Wiz Research estimates 43% of cloud environments are affected. Patch to v1.11.5 or v1.12.1 immediately.",tags:["Kubernetes","ingress-nginx","RCE","Cloud"],relevant:true},
    {id:4,cve:null,title:"GitHub Actions Supply Chain Attack — tj-actions/changed-files Compromised",severity:"High",cvss:null,source:"StepSecurity / GitHub",date:"2025-03-15",body:"The popular tj-actions/changed-files GitHub Action was compromised to exfiltrate CI/CD secrets from workflow logs. Approximately 23,000 repositories potentially affected. Organizations should audit workflow logs and rotate any secrets exposed since March 14.",tags:["GitHub Actions","Supply Chain","CI/CD","Secrets"],relevant:true},
    {id:5,cve:"CVE-2025-24813",title:"Apache Tomcat Partial PUT Request RCE",severity:"High",cvss:"8.1",source:"NVD / Apache",date:"2025-03-13",body:"Deserialization vulnerability in Apache Tomcat allows RCE via malicious partial PUT request. Default servlet must be enabled with write permissions. Affects Tomcat 11.0.0-M1 through 11.0.2, 10.1.0-M1 through 10.1.34, and 9.0.0.M1 through 9.0.98.",tags:["Apache Tomcat","RCE","Deserialization"],relevant:false},
    {id:6,cve:"CVE-2025-24071",title:"Windows File Explorer NTLM Hash Leak — Zero User Interaction",severity:"High",cvss:"7.5",source:"NVD / Microsoft",date:"2025-03-11",body:"Windows File Explorer vulnerability causes automatic NTLM hash disclosure when a user downloads and opens a folder containing a malicious file. NTLM hashes can be used in relay attacks or cracked offline. Affects Windows 7 through 11. Patch in March 2025 Patch Tuesday.",tags:["Windows","NTLM","Hash Leak"],relevant:false},
    {id:7,cve:null,title:"EncryptHub Threat Actor Exploiting Windows Zero-Day — 618 Orgs Targeted",severity:"High",cvss:null,source:"Trend Micro Research",date:"2025-03-28",body:"Threat actor EncryptHub has been exploiting a Windows zero-day (CVE-2025-26633) via MSC files to deploy backdoors and infostealers. 618 organizations targeted globally. Campaign uses social engineering and file-based delivery via Windows Installer and MMC.",tags:["Windows","Zero-Day","Infostealer","Social Engineering"],relevant:false},
    {id:8,cve:null,title:"NIST CSF 2.0 Adoption: 68% of Organizations Still on CSF 1.1",severity:"Info",cvss:null,source:"ISACA / Ponemon",date:"2025-04-01",body:"New ISACA research finds 68% of organizations have not begun formal transition from NIST CSF 1.1 to CSF 2.0. Primary barriers: resource constraints (54%), lack of internal expertise (41%), and uncertainty about mapping existing controls to the new Govern function (37%).",tags:["NIST CSF","Compliance","Framework","GRC"],relevant:false},
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function daysUntil(d){return Math.ceil((new Date(d)-new Date())/(1000*60*60*24));}
function fmtDate(d){return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function fmtDateTime(d){return new Date(d).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}
function avgPct(domains){return Math.round(domains.reduce((s,d)=>s+d.pct,0)/domains.length);}

function Ring({pct,color,size=100,label,sublabel}){
  const r=(size-14)/2,circ=2*Math.PI*r,offset=circ-(pct/100)*circ;
  return(
    <div className="ring-wrap">
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} className="ring-svg">
          <circle className="ring-bg" cx={size/2} cy={size/2} r={r} strokeWidth={8}/>
          <circle className="ring-fill" cx={size/2} cy={size/2} r={r} strokeWidth={8} stroke={color} strokeDasharray={circ} strokeDashoffset={offset}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,pointerEvents:"none"}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:size>80?18:13,fontWeight:500,color,lineHeight:1}}>{pct}%</span>
          {sublabel&&<span style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:"var(--text-m)",letterSpacing:"1px",textTransform:"uppercase",lineHeight:1}}>{sublabel}</span>}
        </div>
      </div>
      {label&&<div className="ring-name">{label}</div>}
    </div>
  );
}

function ProgBar({label,value,max}){
  const pct=Math.round((value/max)*100);
  return(
    <div className="prog-bar-wrap">
      <div className="prog-bar-header">
        <span className="prog-bar-label">{label}</span>
        <span className="prog-bar-value">{value}/{max} ({pct}%)</span>
      </div>
      <div className="prog-bar-track">
        <div className="prog-bar-fill" style={{width:`${pct}%`,background:pct>=90?"var(--teal)":pct>=70?"var(--amber)":"var(--red)"}}/>
      </div>
    </div>
  );
}

function StatusBadge({s}){
  const map={
    Pass:"badge-pass",Fail:"badge-fail",Exception:"badge-exception","Not Tested":"badge-untested",
    Critical:"badge-critical",Significant:"badge-high",Moderate:"badge-medium",Minor:"badge-low",
    Open:"badge-open",Closed:"badge-closed","In Progress":"badge-progress",
    Investigating:"badge-investigating",Contained:"badge-contained",Resolved:"badge-resolved",
    High:"badge-high",Medium:"badge-medium",Low:"badge-low",Info:"badge-info",
  };
  return <span className={`badge ${map[s]||"badge-untested"}`}>{s}</span>;
}

function Modal({title,onClose,children}){
  return(
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div className="modal-title">{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function Overview({data,setModule}){
  const soc2Pct=avgPct(data.frameworks.soc2.domains);
  const nistPct=avgPct(data.frameworks.nist.domains);
  const isoPct=avgPct(data.frameworks.iso.domains);
  const openFindings=data.findings.filter(f=>f.status!=="Closed").length;
  const activeIncidents=data.incidents.filter(i=>i.status!=="Resolved").length;
  const critVulns=data.vulns.critical;
  const passCtrl=data.controls.filter(c=>c.status==="Pass").length;
  const totalCtrl=data.controls.length;
  const totalCompleted=data.awareness.reduce((s,d)=>s+d.completed,0);
  const totalStaff=data.awareness.reduce((s,d)=>s+d.total,0);
  const relevantThreats=data.threats.filter(t=>t.relevant).length;
  const overallHealth=Math.round((soc2Pct+nistPct+isoPct+(passCtrl/totalCtrl*100)+(totalCompleted/totalStaff*100))/5);
  const cards=[
    {icon:"🔐",name:"SOC 2 Coverage",value:`${soc2Pct}%`,sub:"Trust Services Criteria",color:"var(--gold)",module:"frameworks"},
    {icon:"📊",name:"NIST CSF Maturity",value:`${nistPct}%`,sub:"Six function average",color:"var(--blue)",module:"frameworks"},
    {icon:"🌐",name:"ISO 27001 Conformity",value:`${isoPct}%`,sub:"Clause & Annex A",color:"var(--teal)",module:"frameworks"},
    {icon:"🚨",name:"Active Incidents",value:activeIncidents,sub:`${data.incidents.filter(i=>i.severity==="Critical"&&i.status!=="Resolved").length} critical open`,color:activeIncidents>0?"var(--red)":"var(--teal)",module:"incidents"},
    {icon:"⚠️",name:"Open Findings",value:openFindings,sub:`${data.findings.filter(f=>f.severity==="Significant").length} significant`,color:"var(--red)",module:"findings"},
    {icon:"🔍",name:"Critical CVEs",value:critVulns,sub:`${data.vulns.high} high severity`,color:critVulns>0?"var(--red)":"var(--teal)",module:"vulns"},
    {icon:"🛡️",name:"Control Pass Rate",value:`${Math.round(passCtrl/totalCtrl*100)}%`,sub:`${passCtrl}/${totalCtrl} passing`,color:"var(--teal)",module:"controls"},
    {icon:"📅",name:"Due Within 30d",value:data.calendar.filter(e=>daysUntil(e.date)<=30).length,sub:"Upcoming deadlines",color:"var(--amber)",module:"calendar"},
    {icon:"📡",name:"Threat Advisories",value:relevantThreats,sub:"Relevant to environment",color:"var(--purple)",module:"threats"},
    {icon:"🎓",name:"Awareness",value:`${Math.round(totalCompleted/totalStaff*100)}%`,sub:`${totalCompleted}/${totalStaff} trained`,color:"var(--teal)",module:"awareness"},
  ];
  return(
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Program Overview</div>
          <div className="section-sub">GRC & SOC operations at a glance — {data.org.name}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:32,color:overallHealth>=75?"var(--teal)":overallHealth>=55?"var(--amber)":"var(--red)",lineHeight:1}}>{overallHealth}</div>
          <div style={{fontSize:10,color:"var(--text-m)",letterSpacing:"1px",textTransform:"uppercase",marginTop:2}}>Overall Health Score</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:16}}>
        {cards.map(c=>(
          <div key={c.name} className="health-card" onClick={()=>setModule(c.module)}>
            <div className="health-card-icon" style={{background:`${c.color}18`}}>{c.icon}</div>
            <div className="health-card-info">
              <div className="health-card-name">{c.name}</div>
              <div className="health-card-status">{c.sub}</div>
            </div>
            <div className="health-score" style={{color:c.color}}>{c.value}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">⚡ Immediate Attention Required</div>
          {data.incidents.filter(i=>i.status!=="Resolved"&&(i.severity==="Critical"||i.severity==="High")).map(i=>(
            <div key={i.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <StatusBadge s={i.severity}/><StatusBadge s={i.status}/>
              <span style={{fontSize:12,color:"var(--text)",flex:1}}>{i.title}</span>
            </div>
          ))}
          {data.findings.filter(f=>f.status==="Open"&&f.severity==="Significant").map(f=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <StatusBadge s={f.severity}/>
              <span style={{fontSize:12,color:"var(--text)",flex:1}}>{f.title}</span>
              <span style={{fontSize:11,color:"var(--text-m)"}}>Due {fmtDate(f.due)}</span>
            </div>
          ))}
          {data.calendar.filter(e=>daysUntil(e.date)<=14).map(e=>(
            <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
              <span className="badge badge-high">⚡ {daysUntil(e.date)}d</span>
              <span style={{fontSize:12,color:"var(--text)",flex:1}}>{e.name}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">📈 Framework Coverage Summary</div>
          <div style={{display:"flex",justifyContent:"space-around",padding:"8px 0"}}>
            <Ring pct={soc2Pct} color="var(--gold)" size={90} label="SOC 2" sublabel="coverage"/>
            <Ring pct={nistPct} color="var(--blue)" size={90} label="NIST CSF" sublabel="maturity"/>
            <Ring pct={isoPct} color="var(--teal)" size={90} label="ISO 27001" sublabel="conformity"/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FRAMEWORKS ────────────────────────────────────────────────────────────────
function Frameworks({data,setData}){
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(null);
  const fw=data.frameworks;
  const colors={soc2:"var(--gold)",nist:"var(--blue)",iso:"var(--teal)"};
  const labels={soc2:"SOC 2 Type II",nist:"NIST CSF 2.0",iso:"ISO 27001:2022"};
  const icons={soc2:"🔐",nist:"📊",iso:"🌐"};
  const startEdit=()=>{setDraft(JSON.parse(JSON.stringify(fw)));setEditing(true);};
  const save=()=>{setData(p=>({...p,frameworks:draft}));setEditing(false);};
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Framework Coverage</div><div className="section-sub">Control coverage across SOC 2, NIST CSF 2.0, and ISO 27001:2022</div></div>
        <button className="btn btn-ghost btn-sm" onClick={startEdit}>✏️ Edit</button>
      </div>
      <div className="grid-3" style={{marginBottom:16}}>
        {["soc2","nist","iso"].map(key=>{
          const pct=avgPct(fw[key].domains);
          return(
            <div key={key} className="card" style={{textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:8}}>{icons[key]}</div>
              <Ring pct={pct} color={colors[key]} size={110} sublabel={pct>=75?"strong":pct>=50?"partial":"gaps"}/>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginTop:10}}>{labels[key]}</div>
              <div style={{fontSize:11,color:"var(--text-m)",marginTop:2}}>{fw[key].domains.length} domains assessed</div>
            </div>
          );
        })}
      </div>
      {["soc2","nist","iso"].map(key=>(
        <div key={key} className="card" style={{marginBottom:14}}>
          <div className="card-title">{icons[key]} {labels[key]} — Domain Breakdown</div>
          {fw[key].domains.map(d=><ProgBar key={d.name} label={d.name} value={d.pct} max={100}/>)}
        </div>
      ))}
      {editing&&draft&&(
        <Modal title="Edit Framework Coverage" onClose={()=>setEditing(false)}>
          {["soc2","nist","iso"].map(key=>(
            <div key={key} className="form-section">
              <div className="form-title">{icons[key]} {labels[key]}</div>
              {draft[key].domains.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:12,color:"var(--text-m)",flex:1}}>{d.name}</span>
                  <input type="range" min={0} max={100} value={d.pct} style={{width:120}}
                    onChange={e=>{const nd=JSON.parse(JSON.stringify(draft));nd[key].domains[i].pct=+e.target.value;setDraft(nd);}}/>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold)",width:36,textAlign:"right"}}>{d.pct}%</span>
                </div>
              ))}
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={save}>Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── RISK HEATMAP ──────────────────────────────────────────────────────────────
function RiskHeatmap({data,setData}){
  const [showAdd,setShowAdd]=useState(false);
  const [newRisk,setNewRisk]=useState({name:"",likelihood:3,impact:3});
  const risks=data.risks;
  const cellColor=(l,i)=>{const s=l*i;if(s>=16)return"rgba(248,81,73,0.35)";if(s>=10)return"rgba(248,81,73,0.18)";if(s>=6)return"rgba(210,153,34,0.25)";return"rgba(63,185,80,0.15)";};
  const addRisk=()=>{if(!newRisk.name)return;setData(p=>({...p,risks:[...p.risks,{...newRisk,id:Date.now()}]}));setNewRisk({name:"",likelihood:3,impact:3});setShowAdd(false);};
  const removeRisk=id=>setData(p=>({...p,risks:p.risks.filter(r=>r.id!==id)}));
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Risk Heatmap</div><div className="section-sub">Likelihood × Impact — {risks.length} risks plotted</div></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Add Risk</button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">🔥 5×5 Risk Matrix</div>
          <div style={{display:"grid",gridTemplateColumns:"52px repeat(5,1fr)",gridTemplateRows:"repeat(5,1fr) 28px",gap:4,aspectRatio:"1.1"}}>
            {[5,4,3,2,1].map(l=>(
              <>{/* row */}
                <div key={`yl${l}`} style={{display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6}}>
                  <span style={{fontSize:9,color:"var(--text-d)",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{l}</span>
                </div>
                {[1,2,3,4,5].map(i=>{
                  const cr=risks.filter(r=>r.likelihood===l&&r.impact===i);
                  return(
                    <div key={`${l}-${i}`} style={{background:cellColor(l,i),borderRadius:5,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",minHeight:36,flexWrap:"wrap",gap:2,padding:2}}>
                      {cr.map(r=><div key={r.id} style={{width:9,height:9,borderRadius:"50%",background:"white",opacity:.9}} title={r.name}/>)}
                    </div>
                  );
                })}
              </>
            ))}
            <div style={{gridColumn:"1/2"}}/>
            {[1,2,3,4,5].map(i=>(
              <div key={`xi${i}`} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:9,color:"var(--text-d)",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{i}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--text-d)",marginTop:6,paddingLeft:52}}>
            <span>← Negligible</span><span>Impact →</span><span>Critical →</span>
          </div>
          <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
            {[{c:"rgba(248,81,73,0.35)",l:"Critical"},{c:"rgba(248,81,73,0.18)",l:"High"},{c:"rgba(210,153,34,0.25)",l:"Medium"},{c:"rgba(63,185,80,0.15)",l:"Low"}].map(x=>(
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:10,height:10,borderRadius:2,background:x.c}}/>
                <span style={{fontSize:10,color:"var(--text-m)"}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">📋 Risk Inventory</div>
          {risks.sort((a,b)=>(b.likelihood*b.impact)-(a.likelihood*a.impact)).map(r=>{
            const score=r.likelihood*r.impact;
            const rating=score>=16?"Critical":score>=10?"High":score>=6?"Medium":"Low";
            return(
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                <StatusBadge s={rating}/>
                <span style={{flex:1,fontSize:12,color:"var(--text)"}}>{r.name}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--text-m)"}}>{r.likelihood}×{r.impact}={score}</span>
                <button className="btn btn-ghost btn-sm" style={{padding:"2px 7px"}} onClick={()=>removeRisk(r.id)}>✕</button>
              </div>
            );
          })}
          {risks.length===0&&<div className="empty"><div className="empty-icon">⚠️</div><div className="empty-text">No risks added yet</div></div>}
        </div>
      </div>
      {showAdd&&(
        <Modal title="Add Risk" onClose={()=>setShowAdd(false)}>
          <div className="form-grid">
            <div className="form-full field"><div className="field-label">Risk Name</div>
              <input className="field-input" placeholder="e.g. Unauthorized access via API" value={newRisk.name} onChange={e=>setNewRisk(p=>({...p,name:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Likelihood (1–5)</div>
              <input type="range" min={1} max={5} value={newRisk.likelihood} onChange={e=>setNewRisk(p=>({...p,likelihood:+e.target.value}))} style={{width:"100%"}}/>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold)",textAlign:"center"}}>{newRisk.likelihood} — {["","Rare","Unlikely","Possible","Likely","Almost Certain"][newRisk.likelihood]}</div>
            </div>
            <div className="field"><div className="field-label">Impact (1–5)</div>
              <input type="range" min={1} max={5} value={newRisk.impact} onChange={e=>setNewRisk(p=>({...p,impact:+e.target.value}))} style={{width:"100%"}}/>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--gold)",textAlign:"center"}}>{newRisk.impact} — {["","Negligible","Minor","Moderate","Significant","Critical"][newRisk.impact]}</div>
            </div>
          </div>
          <div style={{margin:"12px 0",padding:10,background:"var(--ink-s3)",borderRadius:8,textAlign:"center"}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:20,color:newRisk.likelihood*newRisk.impact>=10?"var(--red)":newRisk.likelihood*newRisk.impact>=6?"var(--amber)":"var(--teal)"}}>{newRisk.likelihood*newRisk.impact}</span>
            <span style={{fontSize:11,color:"var(--text-m)",marginLeft:8}}>Score — {newRisk.likelihood*newRisk.impact>=16?"Critical":newRisk.likelihood*newRisk.impact>=10?"High":newRisk.likelihood*newRisk.impact>=6?"Medium":"Low"}</span>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addRisk}>Add Risk</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── COMPLIANCE CALENDAR ───────────────────────────────────────────────────────
function ComplianceCalendar({data,setData}){
  const [showAdd,setShowAdd]=useState(false);
  const [newEvent,setNewEvent]=useState({name:"",date:"",type:"audit"});
  const events=[...data.calendar].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const addEvent=()=>{if(!newEvent.name||!newEvent.date)return;setData(p=>({...p,calendar:[...p.calendar,{...newEvent,id:Date.now()}]}));setNewEvent({name:"",date:"",type:"audit"});setShowAdd(false);};
  const removeEvent=id=>setData(p=>({...p,calendar:p.calendar.filter(e=>e.id!==id)}));
  const typeIcons={audit:"🔍",assessment:"📋",policy:"📄",review:"👁️",certification:"🏆"};
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Compliance Calendar</div><div className="section-sub">Upcoming audits, reviews, certifications, and policy renewals</div></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Add Event</button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">📅 Upcoming Events</div>
          {events.map(e=>{
            const days=daysUntil(e.date);
            const urg=days<=7?"cal-urgent":days<=30?"cal-warn":"cal-ok";
            return(
              <div key={e.id} className="cal-item">
                <div className={`cal-days ${urg}`}><div className="cal-days-num">{days>999?"999+":days}</div><div className="cal-days-label">days</div></div>
                <div className="cal-info"><div className="cal-name">{typeIcons[e.type]||"📌"} {e.name}</div><div className="cal-date">{fmtDate(e.date)} · {e.type}</div></div>
                <button className="btn btn-ghost btn-sm" style={{padding:"2px 7px"}} onClick={()=>removeEvent(e.id)}>✕</button>
              </div>
            );
          })}
          {events.length===0&&<div className="empty"><div className="empty-icon">📅</div><div className="empty-text">No events added</div></div>}
        </div>
        <div className="card">
          <div className="card-title">⚡ Urgency Breakdown</div>
          {[{label:"Within 7 days",fn:e=>daysUntil(e.date)<=7,color:"var(--red)"},
            {label:"8–30 days",fn:e=>daysUntil(e.date)>7&&daysUntil(e.date)<=30,color:"var(--amber)"},
            {label:"31–90 days",fn:e=>daysUntil(e.date)>30&&daysUntil(e.date)<=90,color:"var(--gold)"},
            {label:"90+ days",fn:e=>daysUntil(e.date)>90,color:"var(--teal)"},
          ].map(x=>{
            const count=events.filter(x.fn).length;
            return(
              <div key={x.label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:x.color,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:"var(--text)"}}>{x.label}</span>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:x.color}}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      {showAdd&&(
        <Modal title="Add Calendar Event" onClose={()=>setShowAdd(false)}>
          <div className="form-grid">
            <div className="form-full field"><div className="field-label">Event Name</div>
              <input className="field-input" placeholder="e.g. SOC 2 Type II Audit" value={newEvent.name} onChange={e=>setNewEvent(p=>({...p,name:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Date</div>
              <input type="date" className="field-input" value={newEvent.date} onChange={e=>setNewEvent(p=>({...p,date:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Type</div>
              <select className="field-select" value={newEvent.type} onChange={e=>setNewEvent(p=>({...p,type:e.target.value}))}>
                {["audit","assessment","policy","review","certification"].map(t=><option key={t} value={t}>{t}</option>)}
              </select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addEvent}>Add Event</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CONTROL TESTING ───────────────────────────────────────────────────────────
function ControlTesting({data,setData}){
  const controls=data.controls;
  const domains=[...new Set(controls.map(c=>c.domain))];
  const statusCount=s=>controls.filter(c=>c.status===s).length;
  const passRate=Math.round(statusCount("Pass")/controls.length*100);
  const cycleStatus=id=>{
    const cycle={Pass:"Fail",Fail:"Exception",Exception:"Not Tested","Not Tested":"Pass"};
    setData(p=>({...p,controls:p.controls.map(c=>c.id===id?{...c,status:cycle[c.status]||"Pass"}:c)}));
  };
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Control Testing</div><div className="section-sub">ITGC control status across all four domains</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Ring pct={passRate} color="var(--teal)" size={52}/>
          <div><div style={{fontSize:11,color:"var(--text-m)"}}>Pass Rate</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--teal)"}}>{statusCount("Pass")}/{controls.length}</div></div>
        </div>
      </div>
      <div className="grid-4" style={{marginBottom:16}}>
        {[{s:"Pass",c:"var(--teal)"},{s:"Fail",c:"var(--red)"},{s:"Exception",c:"var(--amber)"},{s:"Not Tested",c:"var(--text-m)"}].map(x=>(
          <div key={x.s} className="stat-card">
            <div className="stat-label">{x.s}</div>
            <div className="stat-value" style={{color:x.c}}>{statusCount(x.s)}</div>
            <div className="stat-sub">{Math.round(statusCount(x.s)/controls.length*100)}% of controls</div>
          </div>
        ))}
      </div>
      {domains.map(domain=>(
        <div key={domain} className="card" style={{marginBottom:14}}>
          <div className="card-title">{domain}</div>
          <table className="data-table">
            <thead><tr><th>Control</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {controls.filter(c=>c.domain===domain).map(c=>(
                <tr key={c.id}>
                  <td style={{fontSize:12}}>{c.name}</td>
                  <td><StatusBadge s={c.status}/></td>
                  <td><button className="btn btn-ghost btn-sm" onClick={()=>cycleStatus(c.id)}>Cycle Status</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ── FINDINGS TRACKER ──────────────────────────────────────────────────────────
function FindingsTracker({data,setData}){
  const [showAdd,setShowAdd]=useState(false);
  const [newF,setNewF]=useState({title:"",severity:"Moderate",status:"Open",owner:"",due:""});
  const findings=data.findings;
  const addFinding=()=>{if(!newF.title)return;setData(p=>({...p,findings:[...p.findings,{...newF,id:Date.now()}]}));setNewF({title:"",severity:"Moderate",status:"Open",owner:"",due:""});setShowAdd(false);};
  const cycleStatus=id=>{const cycle={Open:"In Progress","In Progress":"Closed",Closed:"Open"};setData(p=>({...p,findings:p.findings.map(f=>f.id===id?{...f,status:cycle[f.status]}:f)}));};
  const remove=id=>setData(p=>({...p,findings:p.findings.filter(f=>f.id!==id)}));
  const openCount=findings.filter(f=>f.status!=="Closed").length;
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Findings Tracker</div><div className="section-sub">{openCount} open · {findings.filter(f=>f.status==="Closed").length} closed</div></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Add Finding</button>
      </div>
      <div className="grid-4" style={{marginBottom:16}}>
        {["Significant","Moderate","Minor"].map(sev=>{
          const count=findings.filter(f=>f.severity===sev&&f.status!=="Closed").length;
          return(
            <div key={sev} className="stat-card">
              <div className="stat-label">{sev} (Open)</div>
              <div className="stat-value" style={{color:sev==="Significant"?"var(--red)":sev==="Moderate"?"var(--amber)":"var(--teal)"}}>{count}</div>
            </div>
          );
        })}
        <div className="stat-card">
          <div className="stat-label">Total Closed</div>
          <div className="stat-value" style={{color:"var(--teal)"}}>{findings.filter(f=>f.status==="Closed").length}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">📋 All Findings</div>
        <table className="data-table">
          <thead><tr><th>Finding</th><th>Severity</th><th>Status</th><th>Owner</th><th>Due</th><th>Action</th></tr></thead>
          <tbody>
            {findings.map(f=>(
              <tr key={f.id}>
                <td style={{fontSize:12,maxWidth:260}}>{f.title}</td>
                <td><StatusBadge s={f.severity}/></td>
                <td><StatusBadge s={f.status}/></td>
                <td style={{fontSize:11,color:"var(--text-m)"}}>{f.owner||"—"}</td>
                <td style={{fontSize:11,color:f.due&&daysUntil(f.due)<=14?"var(--red)":"var(--text-m)"}}>{f.due?fmtDate(f.due):"—"}</td>
                <td style={{display:"flex",gap:5}}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>cycleStatus(f.id)}>▶</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>remove(f.id)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {findings.length===0&&<div className="empty"><div className="empty-icon">✅</div><div className="empty-text">No findings — clean audit!</div></div>}
      </div>
      {showAdd&&(
        <Modal title="Add Finding" onClose={()=>setShowAdd(false)}>
          <div className="form-grid">
            <div className="form-full field"><div className="field-label">Finding Title</div>
              <input className="field-input" placeholder="e.g. MFA not enforced on admin accounts" value={newF.title} onChange={e=>setNewF(p=>({...p,title:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Severity</div>
              <select className="field-select" value={newF.severity} onChange={e=>setNewF(p=>({...p,severity:e.target.value}))}>
                {["Significant","Moderate","Minor","Informational"].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div className="field"><div className="field-label">Status</div>
              <select className="field-select" value={newF.status} onChange={e=>setNewF(p=>({...p,status:e.target.value}))}>
                {["Open","In Progress","Closed"].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div className="field"><div className="field-label">Owner</div>
              <input className="field-input" placeholder="e.g. IT Manager" value={newF.owner} onChange={e=>setNewF(p=>({...p,owner:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Due Date</div>
              <input type="date" className="field-input" value={newF.due} onChange={e=>setNewF(p=>({...p,due:e.target.value}))}/></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addFinding}>Add Finding</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── VULNERABILITY METRICS ─────────────────────────────────────────────────────
function VulnMetrics({data,setData}){
  const v=data.vulns;
  const total=v.critical+v.high+v.medium+v.low;
  const slas=[
    {sev:"Critical",count:v.critical,sla:v.sla.critical,target:100,color:"var(--red)",deadline:"24hrs"},
    {sev:"High",count:v.high,sla:v.sla.high,target:95,color:"var(--red)",deadline:"7 days"},
    {sev:"Medium",count:v.medium,sla:v.sla.medium,target:90,color:"var(--amber)",deadline:"30 days"},
    {sev:"Low",count:v.low,sla:v.sla.low,target:80,color:"var(--teal)",deadline:"90 days"},
  ];
  const edit=(f,val)=>setData(p=>({...p,vulns:{...p.vulns,[f]:+val}}));
  const editSla=(f,val)=>setData(p=>({...p,vulns:{...p.vulns,sla:{...p.vulns.sla,[f]:+val}}}));
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Vulnerability Metrics</div><div className="section-sub">{total} total open · SLA compliance tracking</div></div>
      </div>
      <div className="grid-4" style={{marginBottom:16}}>
        {slas.map(x=>(
          <div key={x.sev} className="stat-card">
            <div className="stat-label">{x.sev}</div>
            <div className="stat-value" style={{color:x.color}}>{x.count}</div>
            <div className="stat-sub">Remediate within {x.deadline}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">📏 SLA Compliance Rate</div>
          {slas.map(x=>(
            <div key={x.sev} className="prog-bar-wrap">
              <div className="prog-bar-header">
                <span className="prog-bar-label">{x.sev} — {x.deadline} SLA</span>
                <span className="prog-bar-value" style={{color:x.sla>=x.target?"var(--teal)":"var(--red)"}}>{x.sla}% <span style={{fontSize:10,color:"var(--text-d)"}}>target {x.target}%</span></span>
              </div>
              <div className="prog-bar-track">
                <div className="prog-bar-fill" style={{width:`${x.sla}%`,background:x.sla>=x.target?"var(--teal)":x.sla>=x.target-10?"var(--amber)":"var(--red)"}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">📈 6-Month Trend</div>
          {v.trend.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
              <span style={{fontSize:11,color:"var(--text-m)",width:28,fontFamily:"'DM Mono',monospace"}}>{t.month}</span>
              <div style={{flex:1,display:"flex",gap:3,alignItems:"center"}}>
                <div style={{height:14,width:`${(t.critical/5)*100}%`,minWidth:t.critical>0?8:0,background:"var(--red)",borderRadius:2,opacity:.8}}/>
                <div style={{height:14,width:`${(t.high/12)*100}%`,minWidth:t.high>0?8:0,background:"var(--amber)",borderRadius:2,opacity:.8}}/>
                <div style={{height:14,width:`${(t.medium/24)*80}%`,minWidth:t.medium>0?8:0,background:"var(--blue)",borderRadius:2,opacity:.6}}/>
              </div>
              <span style={{fontSize:10,color:"var(--text-d)",fontFamily:"'DM Mono',monospace",width:48,textAlign:"right"}}>{t.critical}C {t.high}H</span>
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            {[{c:"var(--red)",l:"Critical"},{c:"var(--amber)",l:"High"},{c:"var(--blue)",l:"Medium"}].map(x=>(
              <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:8,height:8,borderRadius:1,background:x.c}}/>
                <span style={{fontSize:10,color:"var(--text-m)"}}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{marginTop:16}}>
        <div className="card-title">✏️ Update Counts</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12}}>
          {["critical","high","medium","low"].map(s=>(
            <div key={s} className="field">
              <div className="field-label">{s.charAt(0).toUpperCase()+s.slice(1)}</div>
              <input type="number" className="field-input" min={0} value={v[s]} onChange={e=>edit(s,e.target.value)}/>
            </div>
          ))}
        </div>
        <div className="field-label" style={{marginBottom:8}}>SLA Compliance %</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {["critical","high","medium","low"].map(s=>(
            <div key={s} className="field">
              <div className="field-label">{s.charAt(0).toUpperCase()+s.slice(1)}</div>
              <input type="number" className="field-input" min={0} max={100} value={v.sla[s]} onChange={e=>editSla(s,e.target.value)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SECURITY AWARENESS ────────────────────────────────────────────────────────
function SecurityAwareness({data,setData}){
  const depts=data.awareness;
  const total=depts.reduce((s,d)=>s+d.total,0);
  const completed=depts.reduce((s,d)=>s+d.completed,0);
  const overallPct=Math.round(completed/total*100);
  const update=(i,field,val)=>{const u=depts.map((d,idx)=>idx===i?{...d,[field]:Math.max(0,+val)}:d);setData(p=>({...p,awareness:u}));};
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Security Awareness</div><div className="section-sub">Training completion by department — {completed}/{total} staff trained</div></div>
        <div style={{textAlign:"center"}}>
          <Ring pct={overallPct} color={overallPct>=90?"var(--teal)":overallPct>=70?"var(--amber)":"var(--red)"} size={64}/>
          <div style={{fontSize:10,color:"var(--text-m)",marginTop:4}}>Overall</div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title">🏢 Completion by Department</div>
          {depts.map(d=><ProgBar key={d.dept} label={d.dept} value={d.completed} max={d.total}/>)}
        </div>
        <div className="card">
          <div className="card-title">✏️ Update Training Data</div>
          <table className="data-table">
            <thead><tr><th>Department</th><th>Completed</th><th>Total</th><th>Rate</th></tr></thead>
            <tbody>
              {depts.map((d,i)=>(
                <tr key={d.dept}>
                  <td style={{fontSize:12}}>{d.dept}</td>
                  <td><input type="number" className="field-input" style={{width:60,padding:"4px 8px",fontSize:12}} min={0} max={d.total} value={d.completed} onChange={e=>update(i,"completed",e.target.value)}/></td>
                  <td><input type="number" className="field-input" style={{width:60,padding:"4px 8px",fontSize:12}} min={0} value={d.total} onChange={e=>update(i,"total",e.target.value)}/></td>
                  <td><StatusBadge s={Math.round(d.completed/d.total*100)>=90?"Pass":Math.round(d.completed/d.total*100)>=70?"Exception":"Fail"}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="divider"/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--text-m)"}}>
            <span>At 100%: <strong style={{color:"var(--teal)"}}>{depts.filter(d=>d.completed===d.total).length}</strong></span>
            <span>Below 70%: <strong style={{color:"var(--red)"}}>{depts.filter(d=>d.completed/d.total<0.7).length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INCIDENT LOG ──────────────────────────────────────────────────────────────
function IncidentLog({data,setData}){
  const [showAdd,setShowAdd]=useState(false);
  const [selected,setSelected]=useState(null);
  const [newEntry,setNewEntry]=useState("");
  const [newI,setNewI]=useState({title:"",severity:"High",status:"Investigating",analyst:"",source:"",affectedSystems:"",description:""});
  const incidents=data.incidents;
  const activeCount=incidents.filter(i=>i.status!=="Resolved").length;
  const critCount=incidents.filter(i=>i.severity==="Critical"&&i.status!=="Resolved").length;
  const sevColor={Critical:"var(--red)",High:"var(--red)",Medium:"var(--amber)",Low:"var(--teal)"};

  const addIncident=()=>{
    if(!newI.title)return;
    const now=new Date().toISOString();
    const t=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    setData(p=>({...p,incidents:[{...newI,id:Date.now(),detected:now,timeline:[{time:t,text:"Incident opened and logged"}]},...p.incidents]}));
    setNewI({title:"",severity:"High",status:"Investigating",analyst:"",source:"",affectedSystems:"",description:""});
    setShowAdd(false);
  };

  const cycleStatus=id=>{
    const cycle={Investigating:"Contained",Contained:"Resolved",Resolved:"Investigating"};
    setData(p=>({...p,incidents:p.incidents.map(i=>i.id===id?{...i,status:cycle[i.status]}:i)}));
  };

  const addTimelineEntry=(id)=>{
    if(!newEntry.trim())return;
    const time=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    setData(p=>({...p,incidents:p.incidents.map(i=>i.id===id?{...i,timeline:[...i.timeline,{time,text:newEntry.trim()}]}:i)}));
    setNewEntry("");
  };

  const removeIncident=id=>{
    setData(p=>({...p,incidents:p.incidents.filter(i=>i.id!==id)}));
    if(selected===id)setSelected(null);
  };

  return(
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Incident Log</div>
          <div className="section-sub">{activeCount} active incidents · {incidents.filter(i=>i.status==="Resolved").length} resolved this cycle</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>+ Log Incident</button>
      </div>

      <div className="grid-4" style={{marginBottom:16}}>
        <div className="stat-card"><div className="stat-label">Active</div><div className="stat-value" style={{color:activeCount>0?"var(--red)":"var(--teal)"}}>{activeCount}</div><div className="stat-sub">Require attention</div></div>
        <div className="stat-card"><div className="stat-label">Critical / High</div><div className="stat-value" style={{color:critCount>0?"var(--red)":"var(--teal)"}}>{critCount}</div><div className="stat-sub">Open critical severity</div></div>
        <div className="stat-card"><div className="stat-label">Investigating</div><div className="stat-value" style={{color:"var(--purple)"}}>{incidents.filter(i=>i.status==="Investigating").length}</div><div className="stat-sub">Active triage</div></div>
        <div className="stat-card"><div className="stat-label">Resolved</div><div className="stat-value" style={{color:"var(--teal)"}}>{incidents.filter(i=>i.status==="Resolved").length}</div><div className="stat-sub">This cycle</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">🚨 All Incidents — Click to Expand</div>
          {incidents.map(i=>(
            <div key={i.id} className="incident-row">
              <div className="incident-header" style={{cursor:"pointer"}} onClick={()=>setSelected(selected===i.id?null:i.id)}>
                <StatusBadge s={i.severity}/>
                <StatusBadge s={i.status}/>
                <span className="incident-title">{i.title}</span>
                <button className="btn btn-ghost btn-sm" style={{padding:"2px 7px",marginLeft:"auto",flexShrink:0}} onClick={e=>{e.stopPropagation();removeIncident(i.id);}}>✕</button>
              </div>
              <div className="incident-meta">
                <span>🕐 {fmtDateTime(i.detected)}</span>
                <span>👤 {i.analyst||"Unassigned"}</span>
                <span>📡 {i.source||"Unknown source"}</span>
              </div>
              {selected===i.id&&(
                <div style={{marginTop:10}}>
                  {i.affectedSystems&&<div style={{fontSize:11,color:"var(--text-d)",marginBottom:6}}>Affected: <span style={{color:"var(--text-m)"}}>{i.affectedSystems}</span></div>}
                  <div style={{fontSize:12,color:"var(--text-m)",lineHeight:1.6,marginBottom:10}}>{i.description}</div>
                  <button className="btn btn-ghost btn-sm" style={{marginBottom:10}} onClick={()=>cycleStatus(i.id)}>
                    Advance Status: {i.status} → {{Investigating:"Contained",Contained:"Resolved",Resolved:"Investigating"}[i.status]}
                  </button>
                  <div className="incident-timeline">
                    <div style={{fontSize:10,fontWeight:600,color:"var(--text-d)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>Timeline</div>
                    {i.timeline.map((t,idx)=>(
                      <div key={idx} className="timeline-entry">
                        <span className="timeline-time">{t.time}</span>
                        <span className="timeline-text">{t.text}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",gap:6,marginTop:8}}>
                      <input className="field-input" style={{fontSize:11,padding:"5px 10px"}} placeholder="Add timeline note..." value={newEntry} onChange={e=>setNewEntry(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTimelineEntry(i.id)}/>
                      <button className="btn btn-ghost btn-sm" onClick={()=>addTimelineEntry(i.id)}>+ Add</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {incidents.length===0&&<div className="empty"><div className="empty-icon">✅</div><div className="empty-text">No incidents logged</div></div>}
        </div>

        <div>
          <div className="card" style={{marginBottom:14}}>
            <div className="card-title">📊 Severity Summary</div>
            {["Critical","High","Medium","Low"].map(sev=>{
              const total=incidents.filter(i=>i.severity===sev).length;
              const active=incidents.filter(i=>i.severity===sev&&i.status!=="Resolved").length;
              if(!total)return null;
              return(
                <div key={sev} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{width:3,height:32,borderRadius:2,background:sevColor[sev],flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{sev}</div>
                    <div style={{fontSize:11,color:"var(--text-m)"}}>{active} active · {total-active} resolved</div>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:22,color:sevColor[sev]}}>{total}</span>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-title">🔄 By Status</div>
            {["Investigating","Contained","Resolved"].map(st=>{
              const count=incidents.filter(i=>i.status===st).length;
              return(
                <div key={st} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                  <StatusBadge s={st}/>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:"var(--text)"}}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAdd&&(
        <Modal title="Log New Incident" onClose={()=>setShowAdd(false)}>
          <div className="form-grid">
            <div className="form-full field"><div className="field-label">Incident Title</div>
              <input className="field-input" placeholder="Brief description of what was detected" value={newI.title} onChange={e=>setNewI(p=>({...p,title:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Severity</div>
              <select className="field-select" value={newI.severity} onChange={e=>setNewI(p=>({...p,severity:e.target.value}))}>
                {["Critical","High","Medium","Low"].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div className="field"><div className="field-label">Initial Status</div>
              <select className="field-select" value={newI.status} onChange={e=>setNewI(p=>({...p,status:e.target.value}))}>
                {["Investigating","Contained","Resolved"].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div className="field"><div className="field-label">Assigned Analyst</div>
              <input className="field-input" placeholder="e.g. Aadil Moosa" value={newI.analyst} onChange={e=>setNewI(p=>({...p,analyst:e.target.value}))}/></div>
            <div className="field"><div className="field-label">Detection Source</div>
              <input className="field-input" placeholder="e.g. SIEM alert / CloudWatch" value={newI.source} onChange={e=>setNewI(p=>({...p,source:e.target.value}))}/></div>
            <div className="form-full field"><div className="field-label">Affected Systems</div>
              <input className="field-input" placeholder="e.g. AWS S3, Azure AD, GitHub" value={newI.affectedSystems} onChange={e=>setNewI(p=>({...p,affectedSystems:e.target.value}))}/></div>
            <div className="form-full field"><div className="field-label">Description</div>
              <textarea className="field-textarea" placeholder="What was detected? What initial containment was applied?" value={newI.description} onChange={e=>setNewI(p=>({...p,description:e.target.value}))}/></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addIncident}>Log Incident</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── THREAT FEED ───────────────────────────────────────────────────────────────
function ThreatFeed({data,setData}){
  const [filter,setFilter]=useState("all");
  const [selected,setSelected]=useState(null);
  const threats=data.threats;
  const relevant=threats.filter(t=>t.relevant);
  const sevColor={Critical:"var(--red)",High:"var(--red)",Medium:"var(--amber)",Low:"var(--teal)",Info:"var(--blue)"};

  const filtered=
    filter==="relevant"?threats.filter(t=>t.relevant):
    filter==="critical"?threats.filter(t=>t.severity==="Critical"):
    filter==="high"?threats.filter(t=>t.severity==="High"||t.severity==="Critical"):
    threats;

  const toggleRelevant=id=>setData(p=>({...p,threats:p.threats.map(t=>t.id===id?{...t,relevant:!t.relevant}:t)}));

  return(
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Threat Intelligence Feed</div>
          <div className="section-sub">{relevant.length} advisories relevant to your environment · Q1/Q2 2025 CVEs & advisories</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["all","relevant","critical","high"].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f==="relevant"?"⚑ Relevant":f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-4" style={{marginBottom:16}}>
        <div className="stat-card"><div className="stat-label">Critical CVEs</div><div className="stat-value" style={{color:"var(--red)"}}>{threats.filter(t=>t.severity==="Critical").length}</div><div className="stat-sub">Immediate review required</div></div>
        <div className="stat-card"><div className="stat-label">High Severity</div><div className="stat-value" style={{color:"var(--red)"}}>{threats.filter(t=>t.severity==="High").length}</div><div className="stat-sub">Priority remediation</div></div>
        <div className="stat-card"><div className="stat-label">Marked Relevant</div><div className="stat-value" style={{color:"var(--purple)"}}>{relevant.length}</div><div className="stat-sub">Applies to your environment</div></div>
        <div className="stat-card"><div className="stat-label">CISA KEV</div><div className="stat-value" style={{color:"var(--amber)"}}>{threats.filter(t=>t.source&&t.source.includes("CISA")).length}</div><div className="stat-sub">Known exploited</div></div>
      </div>

      <div>
        {filtered.map(t=>(
          <div key={t.id} className="card" style={{marginBottom:12,borderLeft:`3px solid ${t.relevant?"var(--gold)":"var(--border)"}`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                  {t.cve&&<span className="cve-id">{t.cve}</span>}
                  <StatusBadge s={t.severity}/>
                  {t.source&&t.source.includes("CISA")&&(
                    <span className="badge" style={{background:"rgba(248,81,73,.12)",color:"var(--red)",border:"1px solid rgba(248,81,73,.25)",fontSize:9}}>CISA KEV</span>
                  )}
                  {t.relevant&&(
                    <span className="badge" style={{background:"rgba(227,179,65,.08)",color:"var(--gold)",border:"1px solid rgba(227,179,65,.25)",fontSize:9}}>⚑ Relevant</span>
                  )}
                  <span style={{fontSize:10,color:"var(--text-d)",marginLeft:"auto"}}>{t.date}</span>
                </div>
                <div className="threat-source">{t.source}</div>
                <div className="threat-title" onClick={()=>setSelected(selected===t.id?null:t.id)}>{t.title}</div>
              </div>
              {t.cvss&&(
                <div style={{textAlign:"center",flexShrink:0,background:"var(--ink-s2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",minWidth:56}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:20,fontWeight:700,color:sevColor[t.severity]}}>{t.cvss}</div>
                  <div style={{fontSize:9,color:"var(--text-d)",letterSpacing:"1px",textTransform:"uppercase"}}>CVSS</div>
                </div>
              )}
            </div>
            {selected===t.id&&<div className="threat-body">{t.body}</div>}
            {selected!==t.id&&<div style={{fontSize:11,color:"var(--text-d)",marginBottom:8,cursor:"pointer"}} onClick={()=>setSelected(t.id)}>Click title or here to read full advisory ↓</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="threat-tags">{t.tags.map(tag=><span key={tag} className="threat-tag">{tag}</span>)}</div>
              <button className={`btn btn-sm ${t.relevant?"btn-primary":"btn-ghost"}`} style={{flexShrink:0,marginLeft:10}} onClick={()=>toggleRelevant(t.id)}>
                {t.relevant?"⚑ Relevant":"Mark Relevant"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GRC FORGE PARSERS ─────────────────────────────────────────────────────────
function detectDocType(text){
  if(text.includes("SOC 2 Type II Readiness Program")||text.includes("Trust Services Criteria"))return"soc2";
  if(text.includes("NIST CSF 2.0")||text.includes("NIST Cybersecurity Framework"))return"nist";
  if(text.includes("ISO/IEC 27001")||(text.includes("ISO 27001")&&text.includes("Gap Analysis")))return"iso";
  if(text.includes("Risk Register")&&text.includes("Likelihood")&&text.includes("Impact"))return"risk";
  if(text.includes("Policy Library")||text.includes("POL-001"))return"policy";
  return null;
}
function parseRiskRegister(text){
  const risks=[];let id=1;
  for(const line of text.split("\n")){
    const m=line.match(/\|\s*R-\d+\s*\|[^|]+\|([^|]+)\|\s*(\d)\s*\|\s*(\d)\s*\|/);
    if(m){const name=m[1].trim(),l=parseInt(m[2]),i=parseInt(m[3]);if(name&&l>=1&&l<=5&&i>=1&&i<=5)risks.push({id:id++,name,likelihood:l,impact:i});}
  }
  return risks;
}
function parseNISTCSF(text){
  const domains=[];
  for(const line of text.split("\n")){
    const m=line.match(/\|\s*([A-Z]{2}\s*[—–-]\s*[^|]+)\|\s*([\d.]+)\s*\|\s*([\d.]+)/);
    if(m){const name=m[1].trim(),cur=parseFloat(m[2]);if(!isNaN(cur)&&cur>0&&cur<=5&&!name.toLowerCase().includes("overall"))domains.push({name,pct:Math.round((cur/5)*100)});}
  }
  return domains.length>0?domains:null;
}
function parseISO27001(text){
  const map={"Clauses 4–10":0,"Theme 5":0,"Theme 6":0,"Theme 7":0,"Theme 8":0};
  const counts={"Clauses 4–10":0,"Theme 5":0,"Theme 6":0,"Theme 7":0,"Theme 8":0};
  for(const line of text.split("\n")){
    const conf=line.includes("Conformant"),part=line.includes("Partial")&&!line.includes("Non-Conformant"),nonConf=line.includes("Non-Conformant");
    if(!conf&&!part&&!nonConf)continue;
    let b=null;
    if(/clause\s+[4-9]|clause\s+10/i.test(line))b="Clauses 4–10";
    else if(/theme\s*5|organizational/i.test(line))b="Theme 5";
    else if(/theme\s*6|people/i.test(line))b="Theme 6";
    else if(/theme\s*7|physical/i.test(line))b="Theme 7";
    else if(/theme\s*8|technolog/i.test(line))b="Theme 8";
    if(!b)b="Clauses 4–10";
    counts[b]++;if(conf)map[b]+=2;else if(part)map[b]+=1;
  }
  return Object.keys(map).map(name=>{const t=counts[name];return{name,pct:t>0?Math.max(10,Math.round((map[name]/(t*2))*100)):30};});
}
function parseSOC2(text){
  const domains=[];
  for(const line of text.split("\n")){
    const m=line.match(/\|\s*(CC[\d.]+|A\.[\d.]+|C\.[\d.]+)\s*\|/);
    if(m){
      const cat=m[1].startsWith("CC")?"CC — Common Criteria":m[1].startsWith("A")?"A — Availability":"C — Confidentiality";
      const conf=/conformant|in place|mfa\/sso|deployed/i.test(line);
      const ex=domains.find(d=>d.name===cat);
      if(ex){ex._total++;if(conf)ex._pass++;}else domains.push({name:cat,_total:1,_pass:conf?1:0});
    }
  }
  if(domains.length===0){
    const out=[];
    if(text.includes("Common Criteria"))out.push({name:"CC — Common Criteria",pct:72});
    if(text.includes("Availability"))out.push({name:"A — Availability",pct:85});
    return out;
  }
  return domains.map(d=>({name:d.name,pct:Math.round((d._pass/d._total)*100)}));
}
function parsePolicyLibrary(text){
  const events=[];
  for(const line of text.split("\n")){
    const m=line.match(/\|\s*(POL-\d+)\s*\|\s*([^|]+)\|[^|]*\|[^|]*\|\s*([A-Za-z]+\s+\d{4})\s*\|/);
    if(m){const parsed=new Date(`${m[3].trim()} 01`);if(!isNaN(parsed.getTime()))events.push({id:Date.now()+events.length,name:`${m[1].trim()} Review — ${m[2].trim()}`,date:parsed.toISOString().split("T")[0],type:"policy"});}
  }
  return events;
}
function extractOrgName(text){const m=text.match(/^#\s+([^\n—–]+?)(?:\s*[—–]|\n)/m);return m?m[1].trim():null;}

// ── IMPORT FROM GRC FORGE ─────────────────────────────────────────────────────
function ImportForge({data,setData,setModule}){
  const [files,setFiles]=useState([]);
  const [results,setResults]=useState(null);
  const [importing,setImporting]=useState(false);
  const [dragover,setDragover]=useState(false);
  const [history,setHistory]=useState([]);
  const fileInputRef=useRef(null);
  const docTypeInfo={
    soc2:{icon:"🔐",label:"SOC 2 Readiness Program",color:"var(--gold)"},
    nist:{icon:"📊",label:"NIST CSF 2.0 Assessment",color:"var(--blue)"},
    iso:{icon:"🌐",label:"ISO 27001 Gap Analysis",color:"var(--teal)"},
    risk:{icon:"📋",label:"Risk Register",color:"var(--red)"},
    policy:{icon:"📄",label:"Policy Library",color:"var(--amber)"},
  };
  const readFile=f=>new Promise(res=>{const r=new FileReader();r.onload=e=>res({name:f.name,text:e.target.result});r.readAsText(f);});
  const handleFiles=inc=>{const mds=Array.from(inc).filter(f=>f.name.endsWith(".md")||f.name.endsWith(".txt"));if(!mds.length)return;setFiles(mds.map(f=>({name:f.name,status:"pending",type:null,file:f})));setResults(null);};
  const runImport=async()=>{
    if(!files.length)return;setImporting(true);
    const upd=[...files];const log={risks:0,frameworks:0,calendarEvents:0,errors:[],orgName:null};
    let nd=JSON.parse(JSON.stringify(data));
    for(let i=0;i<files.length;i++){
      const{text,name}=await readFile(files[i].file);
      const dt=detectDocType(text);
      upd[i]={...upd[i],status:dt?"ok":"err",type:dt};
      if(!dt){log.errors.push(`${name}: unrecognized`);continue;}
      if(!log.orgName){const on=extractOrgName(text);if(on){log.orgName=on;nd.org={...nd.org,name:on};}}
      if(dt==="risk"){const r=parseRiskRegister(text);if(r.length){nd.risks=r;log.risks=r.length;}else log.errors.push(`${name}: no risks found`);}
      if(dt==="nist"){const d=parseNISTCSF(text);if(d&&d.length){nd.frameworks.nist.domains=d;log.frameworks++;}}
      if(dt==="iso"){const d=parseISO27001(text);if(d&&d.length){nd.frameworks.iso.domains=d;log.frameworks++;}}
      if(dt==="soc2"){const d=parseSOC2(text);if(d&&d.length){nd.frameworks.soc2.domains=d;log.frameworks++;}}
      if(dt==="policy"){const ev=parsePolicyLibrary(text);if(ev.length){nd.calendar=[...nd.calendar.filter(e=>e.type!=="policy"),...ev];log.calendarEvents+=ev.length;}}
    }
    setFiles(upd);setData(nd);setResults(log);
    setHistory(prev=>[{time:new Date().toLocaleTimeString(),files:files.length,risks:log.risks,frameworks:log.frameworks,events:log.calendarEvents,org:log.orgName||"Unknown"},...prev.slice(0,4)]);
    setImporting(false);
  };
  const successCount=files.filter(f=>f.status==="ok").length;
  const errCount=files.filter(f=>f.status==="err").length;
  return(
    <div>
      <div className="section-header">
        <div><div className="section-title">Import from GRC Forge</div><div className="section-sub">Upload GRC Forge Markdown outputs to auto-populate the dashboard</div></div>
        {results&&<button className="btn btn-ghost btn-sm" onClick={()=>{setFiles([]);setResults(null);}}>Clear & Import Again</button>}
      </div>
      {results&&(
        <div className={`import-result-banner ${errCount===0?"success":errCount<files.length?"warning":"error"}`}>
          <div style={{fontSize:20}}>{errCount===0?"✅":errCount<files.length?"⚠️":"❌"}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:4}}>
              {errCount===0?`Import complete — ${successCount} document${successCount!==1?"s":""} parsed`:errCount<files.length?`Partial import — ${successCount} succeeded, ${errCount} failed`:"Import failed"}
            </div>
            <div style={{fontSize:11,color:"var(--text-m)"}}>
              {results.orgName&&<span>Company: <strong style={{color:"var(--gold)"}}>{results.orgName}</strong> · </span>}
              {results.risks>0&&<span>{results.risks} risks → Risk Heatmap · </span>}
              {results.frameworks>0&&<span>{results.frameworks} frameworks updated · </span>}
              {results.calendarEvents>0&&<span>{results.calendarEvents} calendar events added</span>}
            </div>
            <div className="import-summary-grid">
              <div className="import-summary-card"><div className="import-summary-num">{results.risks}</div><div className="import-summary-label">Risks imported</div></div>
              <div className="import-summary-card"><div className="import-summary-num">{results.frameworks}</div><div className="import-summary-label">Frameworks updated</div></div>
              <div className="import-summary-card"><div className="import-summary-num">{results.calendarEvents}</div><div className="import-summary-label">Calendar events</div></div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn btn-primary btn-sm" onClick={()=>setModule("overview")}>View Dashboard →</button>
              <button className="btn btn-ghost btn-sm" onClick={()=>setModule("heatmap")}>Risk Heatmap</button>
              <button className="btn btn-ghost btn-sm" onClick={()=>setModule("frameworks")}>Frameworks</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid-2">
        <div>
          <div className={`import-drop-zone ${dragover?"dragover":""}`}
            onDragOver={e=>{e.preventDefault();setDragover(true);}}
            onDragLeave={()=>setDragover(false)}
            onDrop={e=>{e.preventDefault();setDragover(false);handleFiles(e.dataTransfer.files);}}
            onClick={()=>fileInputRef.current?.click()}>
            <input ref={fileInputRef} type="file" accept=".md,.txt" multiple className="import-drop-input" onChange={e=>handleFiles(e.target.files)}/>
            <div style={{fontSize:36,marginBottom:12,opacity:.7}}>⬆️</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"var(--text)",marginBottom:6}}>Drop GRC Forge files here</div>
            <div style={{fontSize:12,color:"var(--text-m)",lineHeight:1.6}}>
              Accepts .md files exported from GRC Forge<br/>
              <span style={{color:"var(--gold)",fontWeight:600}}>Click to browse or drag and drop</span>
            </div>
          </div>
          {files.length>0&&(
            <div style={{marginTop:12}}>
              {files.map((f,i)=>{
                const info=f.type?docTypeInfo[f.type]:null;
                return(
                  <div key={i} className="import-file-row">
                    <span style={{fontSize:18}}>{info?.icon||"📄"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{f.name}</div>
                      <div style={{fontSize:10,color:"var(--text-m)"}}>{info?.label||"Detecting..."}</div>
                    </div>
                    <span style={{fontSize:11,fontWeight:600,color:f.status==="ok"?"var(--teal)":f.status==="err"?"var(--red)":"var(--text-m)"}}>
                      {f.status==="ok"?"✓ Parsed":f.status==="err"?"✕ Unknown":"…"}
                    </span>
                  </div>
                );
              })}
              {!results&&(
                <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginTop:12}} onClick={runImport} disabled={importing}>
                  {importing?"⟳ Parsing...":` Import ${files.length} Document${files.length!==1?"s":""} into Dashboard`}
                </button>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="card">
            <div className="card-title">🗂️ What Gets Imported</div>
            {[
              {icon:"📋",doc:"Risk Register",dest:"Risk Heatmap",detail:"All risks plotted on 5×5 matrix by L×I"},
              {icon:"📊",doc:"NIST CSF Assessment",dest:"Framework Coverage",detail:"Six-function maturity → NIST ring"},
              {icon:"🌐",doc:"ISO 27001 Gap Analysis",dest:"Framework Coverage",detail:"Conformity ratings → ISO 27001 ring"},
              {icon:"🔐",doc:"SOC 2 Readiness Program",dest:"Framework Coverage",detail:"TSC coverage → SOC 2 ring"},
              {icon:"📄",doc:"Policy Library",dest:"Compliance Calendar",detail:"Policy review dates → calendar events"},
            ].map(x=>(
              <div key={x.doc} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                <span style={{fontSize:16}}>{x.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{x.doc}</div>
                  <div style={{fontSize:11,color:"var(--text-m)"}}>{x.detail}</div>
                </div>
                <span style={{fontSize:11,color:"var(--gold)",fontWeight:600,flexShrink:0,textAlign:"right"}}>→ {x.dest}</span>
              </div>
            ))}
          </div>
          {history.length>0&&(
            <div className="card" style={{marginTop:14}}>
              <div className="card-title">🕐 Import History</div>
              {history.map((h,i)=>(
                <div key={i} className="import-history-item">
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--text-d)",width:56,flexShrink:0}}>{h.time}</span>
                  <span style={{flex:1,fontSize:12,color:"var(--text)",fontWeight:500}}>{h.org}</span>
                  <span style={{fontSize:11,color:"var(--text-m)"}}>{h.files} files · {h.risks} risks</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV=[
  {id:"overview",  icon:"⊞",  label:"Overview"},
  {id:"import",    icon:"⬆️", label:"Import from GRC Forge"},
  {id:"frameworks",icon:"📈", label:"Framework Coverage"},
  {id:"heatmap",   icon:"🔥", label:"Risk Heatmap"},
  {id:"calendar",  icon:"📅", label:"Compliance Calendar"},
  {id:"controls",  icon:"🛡️", label:"Control Testing"},
  {id:"findings",  icon:"🔍", label:"Findings Tracker"},
  {id:"vulns",     icon:"⚠️", label:"Vulnerability Metrics"},
  {id:"awareness", icon:"🎓", label:"Security Awareness"},
  {id:"incidents", icon:"🚨", label:"Incident Log"},
  {id:"threats",   icon:"📡", label:"Threat Feed"},
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function GRCOperationsCenter(){
  const [module,setModule]=useState("overview");
  const [data,setData]=useState(DEFAULT_DATA);
  const [editingOrg,setEditingOrg]=useState(false);
  const [orgDraft,setOrgDraft]=useState(null);
  const openOrgEdit=()=>{setOrgDraft({...data.org});setEditingOrg(true);};
  const saveOrg=()=>{setData(p=>({...p,org:orgDraft}));setEditingOrg(false);};
  const openFindings=data.findings.filter(f=>f.status!=="Closed").length;
  const critVulns=data.vulns.critical;
  const activeIncidents=data.incidents.filter(i=>i.status!=="Resolved").length;
  const critIncidents=data.incidents.filter(i=>i.severity==="Critical"&&i.status!=="Resolved").length;
  const relevantThreats=data.threats.filter(t=>t.relevant).length;
  const activeModule=NAV.find(n=>n.id===module);
  const topbarSubs={
    overview:"GRC & SOC operations at a glance",
    import:"Upload GRC Forge outputs to auto-populate the dashboard",
    frameworks:"SOC 2 · NIST CSF 2.0 · ISO 27001:2022",
    heatmap:"Likelihood × Impact risk matrix",
    calendar:"Upcoming audits, reviews & certifications",
    controls:"ITGC control testing status",
    findings:"Open findings & remediation tracking",
    vulns:"CVE counts, SLA compliance & trends",
    awareness:"Security training completion by department",
    incidents:"Active security incident tracking & timeline management",
    threats:"Curated threat intelligence feed & CVE advisories",
  };
  return(
    <>
      <style>{STYLES}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-row">
              <div className="logo-icon">⚑</div>
              <div>
                <div className="logo-text">GRC Operations</div>
                <div className="logo-sub">Center</div>
              </div>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Dashboard</div>
            {NAV.slice(0,1).map(n=>(
              <div key={n.id} className={`nav-item ${module===n.id?"active":""}`} onClick={()=>setModule(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">GRC Forge</div>
            {NAV.slice(1,2).map(n=>(
              <div key={n.id} className={`nav-item ${module===n.id?"active":""}`} onClick={()=>setModule(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Compliance</div>
            {NAV.slice(2,5).map(n=>(
              <div key={n.id} className={`nav-item ${module===n.id?"active":""}`} onClick={()=>setModule(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Operations</div>
            {NAV.slice(5,9).map(n=>(
              <div key={n.id} className={`nav-item ${module===n.id?"active":""}`} onClick={()=>setModule(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
                {n.id==="findings"&&openFindings>0&&<span className="nav-badge">{openFindings}</span>}
                {n.id==="vulns"&&critVulns>0&&<span className="nav-badge amber">{critVulns}</span>}
              </div>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">SOC</div>
            {NAV.slice(9).map(n=>(
              <div key={n.id} className={`nav-item ${module===n.id?"active":""}`} onClick={()=>setModule(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
                {n.id==="incidents"&&activeIncidents>0&&<span className="nav-badge">{activeIncidents}</span>}
                {n.id==="threats"&&relevantThreats>0&&<span className="nav-badge purple">{relevantThreats}</span>}
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <div className="org-pill" onClick={openOrgEdit} title="Edit organization">
              <div className="org-avatar">{data.org.name.charAt(0)}</div>
              <div style={{flex:1}}>
                <div className="org-name">{data.org.name.length>20?data.org.name.slice(0,20)+"…":data.org.name}</div>
                <div className="org-role">{data.org.analyst}</div>
              </div>
              <span style={{fontSize:12,color:"var(--text-d)",flexShrink:0}}>✏️</span>
            </div>
          </div>
        </aside>
        {editingOrg&&orgDraft&&(
          <Modal title="Edit Organization" onClose={()=>setEditingOrg(false)}>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="field">
                <div className="field-label">Organization Name</div>
                <input className="field-input" placeholder="e.g. Callisto Cloud, Inc." value={orgDraft.name} onChange={e=>setOrgDraft(p=>({...p,name:e.target.value}))}/>
              </div>
              <div className="field">
                <div className="field-label">Analyst Name</div>
                <input className="field-input" placeholder="e.g. Aadil Moosa" value={orgDraft.analyst} onChange={e=>setOrgDraft(p=>({...p,analyst:e.target.value}))}/>
              </div>
              <div className="field">
                <div className="field-label">Industry</div>
                <select className="field-select" value={orgDraft.industry} onChange={e=>setOrgDraft(p=>({...p,industry:e.target.value}))}>
                  {["SaaS","Fintech / Payments","Healthcare Technology","EdTech","Cybersecurity","E-Commerce","Legal Tech","Manufacturing","Financial Services","Insurance","Government","Other"].map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div style={{padding:12,background:"var(--ink-s2)",borderRadius:8,fontSize:12,color:"var(--text-m)",lineHeight:1.6}}>
                The organization name and analyst name appear throughout the dashboard — in the sidebar, the Overview header, and any generated report context. Update these to match the company you are currently monitoring.
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost btn-sm" onClick={()=>setEditingOrg(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={saveOrg}>Save Changes</button>
            </div>
          </Modal>
        )}
        <main className="main">
          <div className="topbar">
            <div>
              <span className="topbar-title">{activeModule?.label}</span>
              <span className="topbar-sub"> — {topbarSubs[module]}</span>
            </div>
            <div className="topbar-right">
              {critIncidents>0&&<span className="badge badge-critical" style={{marginRight:6}}>🚨 {critIncidents} Critical</span>}
              <div className="status-dot"/>
              <span className="status-label">Live</span>
            </div>
          </div>
          <div className="content">
            {module==="overview"   &&<Overview    data={data} setModule={setModule}/>}
            {module==="import"     &&<ImportForge data={data} setData={setData} setModule={setModule}/>}
            {module==="frameworks" &&<Frameworks  data={data} setData={setData}/>}
            {module==="heatmap"    &&<RiskHeatmap data={data} setData={setData}/>}
            {module==="calendar"   &&<ComplianceCalendar data={data} setData={setData}/>}
            {module==="controls"   &&<ControlTesting data={data} setData={setData}/>}
            {module==="findings"   &&<FindingsTracker data={data} setData={setData}/>}
            {module==="vulns"      &&<VulnMetrics data={data} setData={setData}/>}
            {module==="awareness"  &&<SecurityAwareness data={data} setData={setData}/>}
            {module==="incidents"  &&<IncidentLog data={data} setData={setData}/>}
            {module==="threats"    &&<ThreatFeed  data={data} setData={setData}/>}
          </div>
        </main>
      </div>
    </>
  );
}
