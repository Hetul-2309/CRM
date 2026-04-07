import { useState, useEffect, useMemo } from "react";
import {
  Search, LogOut, Moon, Sun, Building2, Users,
  LayoutDashboard, ChevronRight, Copy, Mail, Phone,
  Download, X, Check, Eye, EyeOff, Menu, Anchor,
  AlertCircle
} from "lucide-react";

// ══════════════════════════════════════════════════════════
//  DEMO CREDENTIALS
//  ID: admin     Password: Maritime@2024
//  ID: hetul     Password: VasPar@123
// ══════════════════════════════════════════════════════════

const USERS = [
  { id: "admin", password: "Maritime@2024", name: "Admin User",  role: "Administrator", initials: "AU" },
  { id: "hetul", password: "VasPar@123",    name: "Hetul Patel", role: "Manager",        initials: "HP" }
];

const COMPANIES = [
  { id:"c1", name:"Pacific Maritime Solutions",    country:"Singapore", status:"Active",    vessels:3, remarks:"Key account — fleet renewal due Q2 2025", todo:"Schedule quarterly review before June",       involvement:"Ship Manager, ISM" },
  { id:"c2", name:"Atlantic Shipping Corp",        country:"Greece",    status:"Active",    vessels:2, remarks:"Expanding fleet — 3 newbuilds confirmed",  todo:"Send revised proposal for MV Neptune Star",   involvement:"Ship Manager" },
  { id:"c3", name:"Ocean Management International",country:"Cyprus",    status:"Pending",   vessels:2, remarks:"Awaiting MOU finalization from legal team", todo:"Follow up on draft MOU — week 3",             involvement:"IMS, ISM" },
  { id:"c4", name:"Gulf Navigation LLC",           country:"UAE",       status:"Follow-up", vessels:1, remarks:"New client onboarded March 2025",           todo:"Complete KYC documentation",                  involvement:"Ship Manager" },
  { id:"c5", name:"Nordic Tanker Group",           country:"Norway",    status:"Active",    vessels:0, remarks:"Strategic partnership — exploratory phase",  todo:"Arrange senior management introduction",      involvement:"Consultant" }
];

const VESSELS = [
  { imo:"9123456", name:"MV Pacific Voyager", type:"Bulk Carrier",    companyId:"c1", department:"Operations", masterEmail:"master@pacificvoyager.com",    toCargo:"ops@pacificmaritime.sg",    ccCargo:"mgr@pacificmaritime.sg",     supplyMail:"supply@pacificmaritime.sg",  gmailId:"pacificvoyager.ops@gmail.com",   sludgeMail:"sludge@pacificmaritime.sg",  flag:"Panama",           yearBuilt:2015, dwt:"75,000 MT" },
  { imo:"9234567", name:"MV Atlantic Star",   type:"Container Ship", companyId:"c2", department:"Operations", masterEmail:"master@atlanticstar.gr",       toCargo:"ops@atlanticshipping.gr",   ccCargo:"mgr@atlanticshipping.gr",    supplyMail:"supply@atlanticshipping.gr", gmailId:"atlanticstar.ops@gmail.com",     sludgeMail:"sludge@atlanticshipping.gr", flag:"Greece",           yearBuilt:2018, dwt:"45,000 MT" },
  { imo:"9345678", name:"MT Ocean Glory",     type:"Chemical Tanker",companyId:"c1", department:"Tanker Ops", masterEmail:"master@oceanglory.sg",         toCargo:"tanker@pacificmaritime.sg", ccCargo:"ops@pacificmaritime.sg",     supplyMail:"supply@pacificmaritime.sg",  gmailId:"oceanglory.ops@gmail.com",       sludgeMail:"sludge@pacificmaritime.sg",  flag:"Marshall Islands", yearBuilt:2019, dwt:"25,000 MT" },
  { imo:"9456789", name:"MV Indian Spirit",   type:"General Cargo",  companyId:"c3", department:"Operations", masterEmail:"captain@indianspirit.cy",      toCargo:"cargo@oceancmgt.cy",        ccCargo:"ops@oceancmgt.cy",           supplyMail:"supply@oceancmgt.cy",         gmailId:"indianspirit.vessel@gmail.com",  sludgeMail:"env@oceancmgt.cy",           flag:"Cyprus",           yearBuilt:2012, dwt:"18,000 MT" },
  { imo:"9567890", name:"MT Gulf Pioneer",    type:"Crude Tanker",   companyId:"c4", department:"Tanker Ops", masterEmail:"master@gulfpioneer.ae",        toCargo:"tanker@gulfnav.ae",         ccCargo:"mgr@gulfnav.ae",             supplyMail:"supply@gulfnav.ae",           gmailId:"gulfpioneer.ops@gmail.com",      sludgeMail:"sludge@gulfnav.ae",          flag:"UAE",              yearBuilt:2017, dwt:"100,000 MT" },
  { imo:"9678901", name:"MT Horizon Quest",   type:"LPG Carrier",    companyId:"c3", department:"Gas Ops",    masterEmail:"master@horizonquest.cy",       toCargo:"gas@oceancmgt.cy",          ccCargo:"ops@oceancmgt.cy",           supplyMail:"supply@oceancmgt.cy",         gmailId:"horizonquest.vessel@gmail.com",  sludgeMail:"env@oceancmgt.cy",           flag:"Liberia",          yearBuilt:2020, dwt:"35,000 MT" },
  { imo:"9789012", name:"MV Arctic Wind",     type:"Reefer",         companyId:"c1", department:"Operations", masterEmail:"captain@arcticwind.sg",        toCargo:"reefer@pacificmaritime.sg", ccCargo:"ops@pacificmaritime.sg",     supplyMail:"supply@pacificmaritime.sg",  gmailId:"arcticwind.ops@gmail.com",       sludgeMail:"sludge@pacificmaritime.sg",  flag:"Singapore",        yearBuilt:2016, dwt:"12,000 MT" },
  { imo:"9890123", name:"MV Neptune Star",    type:"Container Ship", companyId:"c2", department:"Operations", masterEmail:"master@neptunestar.gr",        toCargo:"ops@atlanticshipping.gr",   ccCargo:"mgr@atlanticshipping.gr",    supplyMail:"supply@atlanticshipping.gr", gmailId:"neptunestar.ops@gmail.com",      sludgeMail:"sludge@atlanticshipping.gr", flag:"Malta",            yearBuilt:2021, dwt:"55,000 MT" }
];

const PERSONNEL = [
  { id:"p1",  name:"Capt. James Morrison",   role:"Marine Superintendent",  dept:"Operations", companyId:"c1", email:"j.morrison@pacificmaritime.sg",  phone:"+65 9123 4567",    notes:"Key contact for all fleet operational matters" },
  { id:"p2",  name:"Mr. Raj Patel",           role:"Fleet Manager",          dept:"Fleet Mgmt", companyId:"c1", email:"r.patel@pacificmaritime.sg",     phone:"+65 8234 5678",    notes:"Handles MV Pacific Voyager and MV Arctic Wind" },
  { id:"p3",  name:"Ms. Elena Stavros",       role:"Operations Director",    dept:"Operations", companyId:"c2", email:"e.stavros@atlanticshipping.gr",  phone:"+30 210 123 4567", notes:"Primary decision maker — all commercial matters" },
  { id:"p4",  name:"Mr. Nikos Papadopoulos", role:"Technical Superintendent",dept:"Technical",  companyId:"c2", email:"n.papa@atlanticshipping.gr",     phone:"+30 210 765 4321", notes:"Handles all technical queries and inspections" },
  { id:"p5",  name:"Mr. Andreas Christou",   role:"CEO",                    dept:"Management", companyId:"c3", email:"a.christou@oceancmgt.cy",        phone:"+357 22 123456",   notes:"Senior executive — direct contact for strategy" },
  { id:"p6",  name:"Ms. Maria Ioannou",       role:"Fleet Coordinator",      dept:"Operations", companyId:"c3", email:"m.ioannou@oceancmgt.cy",         phone:"+357 22 654321",   notes:"Day-to-day operations and scheduling" },
  { id:"p7",  name:"Mr. Khalid Al-Mansouri", role:"Managing Director",      dept:"Management", companyId:"c4", email:"k.mansouri@gulfnav.ae",          phone:"+971 4 123 4567",  notes:"New client — prefers WhatsApp over email" },
  { id:"p8",  name:"Ms. Priya Sharma",        role:"Operations Manager",     dept:"Operations", companyId:"c4", email:"p.sharma@gulfnav.ae",            phone:"+971 4 987 6543",  notes:"Main operational point of contact" },
  { id:"p9",  name:"Mr. Lars Eriksson",       role:"VP Operations",          dept:"Operations", companyId:"c5", email:"l.eriksson@nordicgroup.no",      phone:"+47 22 123 456",   notes:"Strategic discussions — exploratory stage" },
  { id:"p10", name:"Ms. Anna Lindqvist",      role:"Commercial Director",    dept:"Commercial", companyId:"c5", email:"a.lindqvist@nordicgroup.no",     phone:"+47 22 654 321",   notes:"Handles all contracts and negotiations" },
  { id:"p11", name:"Mr. David Chen",          role:"QHSE Manager",           dept:"QHSE",       companyId:"c1", email:"d.chen@pacificmaritime.sg",      phone:"+65 7345 6789",    notes:"Safety, compliance and audit queries" },
  { id:"p12", name:"Ms. Sophie Laurent",      role:"Finance Controller",     dept:"Finance",    companyId:"c2", email:"s.laurent@atlanticshipping.gr",  phone:"+30 210 234 5678", notes:"Invoice approvals and payment follow-up" }
];

const getCompany   = (id) => COMPANIES.find(c => c.id === id);
const getVessels   = (cid) => VESSELS.filter(v => v.companyId === cid);
const getPersonnel = (cid) => PERSONNEL.filter(p => p.companyId === cid);

const VESSEL_ICON = {
  "Bulk Carrier":"⚓","Container Ship":"🚢","Chemical Tanker":"⚗️",
  "Crude Tanker":"🛢️","LPG Carrier":"💨","General Cargo":"📦","Reefer":"❄️"
};
const STATUS_STYLE = {
  "Active":    { bg:"rgba(16,185,129,.12)",  color:"#10b981", border:"rgba(16,185,129,.25)" },
  "Pending":   { bg:"rgba(245,158,11,.12)",  color:"#f59e0b", border:"rgba(245,158,11,.25)" },
  "Follow-up": { bg:"rgba(99,102,241,.12)",  color:"#818cf8", border:"rgba(99,102,241,.25)" }
};

const DK = {
  bg:"#05101f",bgSec:"#081525",bgCard:"#0c1b2e",bgHov:"#102038",
  bdr:"#163050",bdrHi:"#1e4070",txt:"#dce8f5",mid:"#7a9bbf",dim:"#3d5a7a",
  acc:"#c8a45a",accD:"rgba(200,164,90,.15)",blu:"#3b82f6",bluD:"rgba(59,130,246,.15)",
  sb:"#040e1c",sh:"0 8px 40px rgba(0,0,0,.6)"
};
const LT = {
  bg:"#f0f5fc",bgSec:"#e5edf8",bgCard:"#fff",bgHov:"#f5f9ff",
  bdr:"#cddaec",bdrHi:"#b8cde0",txt:"#0c1d30",mid:"#5a7090",dim:"#a0b4c8",
  acc:"#a8782d",accD:"rgba(168,120,45,.10)",blu:"#1d6fdb",bluD:"rgba(29,111,219,.10)",
  sb:"#08162a",sh:"0 4px 24px rgba(0,0,0,.10)"
};

function exportCSV(rows, filename) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map(r => keys.map(k=>`"${r[k]??""}"` ).join(","))].join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv],{type:"text/csv"})), download: filename
  });
  a.click();
}

function ini(name) { return name.split(" ").map(n=>n[0]).join("").slice(0,2); }

export default function MaritimeCRM() {
  const [dark,    setDark]    = useState(true);
  const [auth,    setAuth]    = useState(false);
  const [user,    setUser]    = useState(null);
  const [page,    setPage]    = useState("dashboard");
  const [vessel,  setVessel]  = useState(null);
  const [company, setCompany] = useState(null);
  const [person,  setPerson]  = useState(null);
  const [sb,      setSb]      = useState(true);
  const [q,       setQ]       = useState("");
  const [foc,     setFoc]     = useState(false);
  const [copied,  setCopied]  = useState(null);
  const [uid,     setUid]     = useState("");
  const [pwd,     setPwd]     = useState("");
  const [showP,   setShowP]   = useState(false);
  const [rem,     setRem]     = useState(false);
  const [err,     setErr]     = useState("");
  const [vFilt,   setVFilt]   = useState("");
  const [cFilt,   setCFilt]   = useState("");

  const T = dark ? DK : LT;

  useEffect(() => {
    const s = localStorage.getItem("_mcrm");
    if (s) { const u = JSON.parse(s); setAuth(true); setUser(u); }
  }, []);

  const login = () => {
    const u = USERS.find(x => x.id===uid && x.password===pwd);
    if (u) { setAuth(true); setUser(u); setErr(""); if (rem) localStorage.setItem("_mcrm", JSON.stringify(u)); }
    else setErr("Invalid credentials. Please try again.");
  };
  const logout = () => { setAuth(false); setUser(null); localStorage.removeItem("_mcrm"); setPage("dashboard"); };

  const go = (p, data) => {
    setPage(p); setQ("");
    if (p==="vesselDetail")  setVessel(data);
    if (p==="companyDetail") setCompany(data);
    if (p==="personDetail")  setPerson(data);
  };
  const cp = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(()=>setCopied(null), 1800);
  };

  const hits = useMemo(() => {
    if (q.length < 2) return [];
    const lq = q.toLowerCase();
    return [
      ...VESSELS  .filter(v => v.imo.includes(lq)||v.name.toLowerCase().includes(lq))
                  .map(v => ({ k:"vessel",  d:v, lbl:v.name,  sub:`IMO ${v.imo} · ${v.type}` })),
      ...COMPANIES.filter(c => c.name.toLowerCase().includes(lq)||c.country.toLowerCase().includes(lq))
                  .map(c => ({ k:"company", d:c, lbl:c.name,  sub:`${c.country} · ${c.vessels} vessels` })),
      ...PERSONNEL.filter(p => p.name.toLowerCase().includes(lq)||p.role.toLowerCase().includes(lq)||p.email.toLowerCase().includes(lq))
                  .map(p => ({ k:"person",  d:p, lbl:p.name,  sub:`${p.role} · ${getCompany(p.companyId)?.name}` }))
    ].slice(0, 8);
  }, [q]);

  // ── CSS ──────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .crm{font-family:'Outfit',sans-serif;min-height:100vh;background:${T.bg};color:${T.txt};transition:background .3s,color .3s}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.bdr};border-radius:3px}

    /* LOGIN */
    .lw{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${T.bg};position:relative;overflow:hidden}
    .lg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% -5%,rgba(200,164,90,.14),transparent 60%),radial-gradient(ellipse 40% 40% at 85% 85%,rgba(59,130,246,.08),transparent 55%);pointer-events:none}
    .lgrid{position:absolute;inset:0;background-image:linear-gradient(${T.bdr}44 1px,transparent 1px),linear-gradient(90deg,${T.bdr}44 1px,transparent 1px);background-size:40px 40px;pointer-events:none;opacity:.35}
    .lcard{position:relative;z-index:1;width:420px;padding:48px;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:22px;box-shadow:${T.sh}}
    .llogo{display:flex;align-items:center;gap:14px;margin-bottom:36px}
    .licon{width:46px;height:46px;background:linear-gradient(135deg,${T.acc},${T.blu});border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
    .lname{font-size:21px;font-weight:800;letter-spacing:-.6px}
    .ltag{font-size:12px;color:${T.mid};margin-top:1px}
    .lbl{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${T.mid};margin-bottom:7px}
    .fw{margin-bottom:18px}
    .inp{width:100%;padding:12px 16px;background:${T.bgSec};border:1.5px solid ${T.bdr};border-radius:11px;color:${T.txt};font-family:'Outfit',sans-serif;font-size:14.5px;outline:none;transition:border-color .2s,box-shadow .2s}
    .inp:focus{border-color:${T.acc};box-shadow:0 0 0 3px ${T.accD}}
    .inp::placeholder{color:${T.mid}}
    .pw{position:relative}.ey{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:${T.mid};cursor:pointer;padding:4px;display:flex;align-items:center}.ey:hover{color:${T.txt}}
    .lbtn{width:100%;padding:14px;background:linear-gradient(135deg,${T.acc} 0%,#9a6e2a 100%);color:#0a0600;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;border:none;border-radius:11px;cursor:pointer;letter-spacing:.3px;transition:opacity .2s,transform .1s}
    .lbtn:hover{opacity:.88;transform:translateY(-1px)}
    .lerr{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;padding:10px 14px;border-radius:9px;font-size:13px;margin-bottom:18px;display:flex;align-items:center;gap:8px}
    .rrow{display:flex;align-items:center;gap:8px;margin-bottom:22px;cursor:pointer}
    .rbox{width:18px;height:18px;border:1.5px solid ${T.bdr};border-radius:5px;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
    .rbox.on{background:${T.acc};border-color:${T.acc}}
    .rtxt{font-size:13px;color:${T.mid}}
    .hint{margin-top:22px;padding:12px 14px;background:${T.bgSec};border-radius:9px;font-size:12px;color:${T.mid};line-height:1.7}
    .hint code{font-family:'JetBrains Mono',monospace;background:${T.bg};padding:2px 5px;border-radius:4px;font-size:11px;color:${T.acc}}

    /* LAYOUT */
    .layout{display:flex;min-height:100vh}
    .sidebar{width:${sb?"240px":"64px"};background:${T.sb};border-right:1px solid ${T.bdr};display:flex;flex-direction:column;transition:width .25s cubic-bezier(.4,0,.2,1);overflow:hidden;position:fixed;top:0;left:0;bottom:0;z-index:100}
    .sbh{padding:18px 14px;border-bottom:1px solid ${T.bdr}22;display:flex;align-items:center;gap:12px;min-height:64px}
    .sblogo{width:34px;height:34px;min-width:34px;background:linear-gradient(135deg,${T.acc},${T.blu});border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px}
    .sbbrand{font-size:15px;font-weight:800;white-space:nowrap;letter-spacing:-.4px;color:${T.txt}}
    .sbnav{flex:1;padding:14px 8px;display:flex;flex-direction:column;gap:3px}
    .nav{display:flex;align-items:center;gap:11px;padding:10px;border-radius:10px;cursor:pointer;color:${T.mid};white-space:nowrap;overflow:hidden;font-size:13.5px;font-weight:600;transition:all .15s;user-select:none}
    .nav:hover{background:${T.bgHov};color:${T.txt}}
    .nav.on{background:${T.accD};color:${T.acc};border:1px solid ${T.bdr}}
    .ni{min-width:20px;display:flex;align-items:center}
    .sbf{padding:14px 8px;border-top:1px solid ${T.bdr}22}

    /* TOPBAR */
    .main{flex:1;margin-left:${sb?"240px":"64px"};transition:margin-left .25s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;min-height:100vh}
    .bar{height:64px;background:${T.bgSec};border-bottom:1px solid ${T.bdr};display:flex;align-items:center;padding:0 22px;gap:14px;position:sticky;top:0;z-index:50}
    .ibtn{background:none;border:none;color:${T.mid};cursor:pointer;padding:7px;border-radius:8px;display:flex;align-items:center;transition:all .15s}
    .ibtn:hover{background:${T.bgHov};color:${T.txt}}

    /* SEARCH */
    .sw{flex:1;max-width:480px;position:relative}
    .sb2{display:flex;align-items:center;gap:9px;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:12px;padding:8px 13px;transition:all .2s}
    .sb2:focus-within{border-color:${T.acc};box-shadow:0 0 0 3px ${T.accD}}
    .si{flex:1;background:none;border:none;outline:none;color:${T.txt};font-family:'Outfit',sans-serif;font-size:13.5px}
    .si::placeholder{color:${T.mid}}
    .sd{position:absolute;top:calc(100% + 6px);left:0;right:0;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:13px;box-shadow:${T.sh};z-index:300;overflow:hidden}
    .sdi{display:flex;align-items:center;gap:11px;padding:11px 15px;cursor:pointer;transition:background .12s}
    .sdi:hover{background:${T.bgHov}}
    .sdic{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
    .sdl{font-size:13.5px;font-weight:600}
    .sds{font-size:11.5px;color:${T.mid};margin-top:1px}
    .sde{padding:22px;text-align:center;color:${T.mid};font-size:13px}
    .br{display:flex;align-items:center;gap:8px;margin-left:auto}
    .chip{display:flex;align-items:center;gap:8px;padding:6px 12px;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:10px}
    .av{width:28px;height:28px;background:linear-gradient(135deg,${T.acc},${T.blu});border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:800;color:white}

    /* PAGE */
    .page{flex:1;padding:26px 28px;overflow-y:auto}
    .pgt{font-size:24px;font-weight:800;letter-spacing:-.6px;margin-bottom:3px}
    .pgs{font-size:13px;color:${T.mid};margin-bottom:24px}

    /* STATS */
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;margin-bottom:24px}
    .sc{background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:16px;padding:22px;position:relative;overflow:hidden;transition:border-color .2s,transform .15s;cursor:default}
    .sc:hover{border-color:${T.bdrHi};transform:translateY(-2px)}
    .sl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:${T.mid};margin-bottom:10px}
    .sv{font-size:38px;font-weight:800;letter-spacing:-2px;font-family:'JetBrains Mono',monospace;line-height:1}
    .sch{font-size:11.5px;color:#10b981;margin-top:8px}
    .se{position:absolute;top:18px;right:18px;font-size:26px;opacity:.35}

    /* CARDS */
    .card{background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:16px;padding:22px}
    .csm{background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:13px;padding:18px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    @media(max-width:820px){.g2{grid-template-columns:1fr}}

    /* TABLE */
    .tbl{width:100%;border-collapse:collapse}
    .tbl th{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:${T.mid};padding:11px 16px;text-align:left;border-bottom:1.5px solid ${T.bdr}}
    .tbl td{padding:13px 16px;font-size:13.5px;border-bottom:1px solid ${T.bdr}22}
    .tbl tr:last-child td{border-bottom:none}
    .tbl tbody tr{cursor:pointer;transition:background .1s}
    .tbl tbody tr:hover td{background:${T.bgHov}}

    /* FILTERS */
    .fb{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;align-items:center}
    .fs{padding:8px 12px;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:9px;color:${T.txt};font-family:'Outfit',sans-serif;font-size:13px;outline:none;cursor:pointer}
    .fs:focus{border-color:${T.acc}}
    .eb{display:flex;align-items:center;gap:6px;padding:8px 13px;background:${T.bgCard};border:1.5px solid ${T.bdr};border-radius:9px;color:${T.mid};font-size:12.5px;font-family:'Outfit',sans-serif;cursor:pointer;transition:all .15s;margin-left:auto}
    .eb:hover{border-color:${T.acc};color:${T.acc}}

    /* BADGE */
    .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:6px;font-size:11.5px;font-weight:700;border:1px solid}

    /* DETAIL */
    .bc{display:flex;align-items:center;gap:6px;font-size:12.5px;color:${T.mid};margin-bottom:18px;flex-wrap:wrap}
    .bcl{color:${T.blu};cursor:pointer}.bcl:hover{text-decoration:underline}
    .dh{display:flex;align-items:flex-start;gap:18px;margin-bottom:26px;flex-wrap:wrap}
    .di{width:66px;height:66px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0}
    .dt{font-size:24px;font-weight:800;letter-spacing:-.6px}
    .ds{font-size:13px;color:${T.mid};margin-top:4px}
    .sect{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:${T.mid};margin:24px 0 14px;display:flex;align-items:center;gap:8px}
    .sect::after{content:'';flex:1;height:1px;background:${T.bdr}}
    .fg{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:13px}
    .fb2{background:${T.bgSec};border:1.5px solid ${T.bdr};border-radius:12px;padding:14px}
    .fbl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.9px;color:${T.mid};margin-bottom:6px}
    .fbv{font-size:13px;font-weight:500;font-family:'JetBrains Mono',monospace;color:${T.txt};word-break:break-all}
    .fa{display:flex;gap:5px;margin-top:9px}
    .act{display:flex;align-items:center;gap:4px;padding:4px 8px;background:${T.bgCard};border:1px solid ${T.bdr};border-radius:6px;font-size:11px;color:${T.mid};cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;text-decoration:none}
    .act:hover{border-color:${T.acc};color:${T.acc}}
    .act.ok{border-color:#10b981;color:#10b981}

    /* MINI CARDS */
    .pc{display:flex;align-items:center;gap:12px;padding:13px 15px;background:${T.bgSec};border:1.5px solid ${T.bdr};border-radius:12px;cursor:pointer;transition:all .15s}
    .pc:hover{border-color:${T.acc};background:${T.bgHov}}
    .pav{width:40px;height:40px;min-width:40px;border-radius:10px;background:linear-gradient(135deg,${T.accD},${T.bluD});display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${T.acc}}
    .vc{display:flex;align-items:center;gap:12px;padding:13px 15px;background:${T.bgSec};border:1.5px solid ${T.bdr};border-radius:12px;cursor:pointer;transition:all .15s}
    .vc:hover{border-color:${T.blu};background:${T.bgHov}}
    .cl{color:${T.blu};cursor:pointer}.cl:hover{text-decoration:underline}
    .mono{font-family:'JetBrains Mono',monospace}
  `;

  // ── SHARED COMPONENTS ────────────────────────────────────────────────────
  const Badge = ({ s }) => {
    const st = STATUS_STYLE[s] || STATUS_STYLE["Pending"];
    return <span className="badge" style={{ background:st.bg, color:st.color, borderColor:st.border }}>{s}</span>;
  };

  const Crumb = ({ items }) => (
    <div className="bc">
      {items.map((it, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
          {i > 0 && <ChevronRight size={11}/>}
          {it.fn ? <span className="bcl" onClick={it.fn}>{it.lbl}</span> : <span>{it.lbl}</span>}
        </span>
      ))}
    </div>
  );

  const EBox = ({ lbl, val, ck }) => (
    <div className="fb2">
      <div className="fbl">{lbl}</div>
      <div className="fbv">{val || "—"}</div>
      {val && (
        <div className="fa">
          <button className={`act ${copied===ck?"ok":""}`} onClick={() => cp(val, ck)}>
            {copied===ck ? <><Check size={11}/>Copied</> : <><Copy size={11}/>Copy</>}
          </button>
          <a className="act" href={`mailto:${val}`}><Mail size={11}/>Mail</a>
        </div>
      )}
    </div>
  );

  // ── PAGES ────────────────────────────────────────────────────────────────
  const DashPage = () => (
    <div>
      <div className="pgt">Dashboard</div>
      <div className="pgs">Maritime CRM — Fleet & Business Overview</div>
      <div className="stats">
        {[
          { lbl:"Total Companies", val:COMPANIES.length,                              icon:"🏢", color:T.blu,    chg:"+1 this month" },
          { lbl:"Total Vessels",   val:VESSELS.length,                                icon:"🚢", color:T.acc,    chg:"+2 this quarter" },
          { lbl:"Total Contacts",  val:PERSONNEL.length,                              icon:"👤", color:"#10b981",chg:"+3 this month" },
          { lbl:"Active Accounts", val:COMPANIES.filter(c=>c.status==="Active").length,icon:"✅",color:"#818cf8",chg:"Stable" }
        ].map((s,i) => (
          <div key={i} className="sc">
            <div className="sl">{s.lbl}</div>
            <div className="sv" style={{ color:s.color }}>{s.val}</div>
            <div className="sch">↑ {s.chg}</div>
            <div className="se">{s.icon}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{ gap:18 }}>
        <div className="card">
          <div style={{ fontSize:13,fontWeight:700,marginBottom:14 }}>Fleet at a Glance</div>
          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            {VESSELS.slice(0,6).map(v => (
              <div key={v.imo} className="vc" onClick={() => go("vesselDetail", v)}>
                <span style={{ fontSize:20 }}>{VESSEL_ICON[v.type]||"⚓"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600 }}>{v.name}</div>
                  <div style={{ fontSize:11.5,color:T.mid }}>IMO {v.imo} · {v.type} · {v.flag}</div>
                </div>
                <ChevronRight size={13} color={T.mid}/>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div style={{ fontSize:13,fontWeight:700,marginBottom:14 }}>Companies Overview</div>
          {COMPANIES.map(c => (
            <div key={c.id} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:`1px solid ${T.bdr}33`,cursor:"pointer" }}
              onClick={() => go("companyDetail", c)}>
              <div style={{ width:36,height:36,borderRadius:9,background:T.bluD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>🏢</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:600 }}>{c.name}</div>
                <div style={{ fontSize:11.5,color:T.mid }}>{c.country} · {c.vessels} vessels · {getPersonnel(c.id).length} contacts</div>
              </div>
              <Badge s={c.status}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const VesselsPage = () => {
    const types = [...new Set(VESSELS.map(v => v.type))];
    const rows  = VESSELS.filter(v => !vFilt || v.type===vFilt);
    return (
      <div>
        <div className="pgt">Vessels</div>
        <div className="pgs">{VESSELS.length} vessels · IMO-referenced fleet register</div>
        <div className="fb">
          <select className="fs" value={vFilt} onChange={e=>setVFilt(e.target.value)}>
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="eb" onClick={() => exportCSV(rows.map(v=>({ IMO:v.imo,Name:v.name,Type:v.type,Flag:v.flag,DWT:v.dwt,YearBuilt:v.yearBuilt,Company:getCompany(v.companyId)?.name,Dept:v.department })),"vessels.csv")}>
            <Download size={12}/>Export CSV
          </button>
        </div>
        <div className="card" style={{ padding:0,overflow:"hidden" }}>
          <table className="tbl">
            <thead><tr>
              <th>Vessel</th><th>IMO</th><th>Type</th><th>Flag</th><th>Company</th><th>Year</th><th>DWT</th>
            </tr></thead>
            <tbody>
              {rows.map(v => (
                <tr key={v.imo} onClick={() => go("vesselDetail", v)}>
                  <td><div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <span style={{ fontSize:18 }}>{VESSEL_ICON[v.type]||"⚓"}</span>
                    <span style={{ fontWeight:700 }}>{v.name}</span>
                  </div></td>
                  <td><span className="mono" style={{ fontSize:12,color:T.mid }}>{v.imo}</span></td>
                  <td>{v.type}</td>
                  <td>{v.flag}</td>
                  <td><span className="cl" onClick={e=>{e.stopPropagation();go("companyDetail",getCompany(v.companyId));}}>{getCompany(v.companyId)?.name}</span></td>
                  <td><span className="mono" style={{ fontSize:12 }}>{v.yearBuilt}</span></td>
                  <td><span style={{ fontSize:12,color:T.mid }}>{v.dwt}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const CompaniesPage = () => {
    const countries = [...new Set(COMPANIES.map(c => c.country))];
    const rows = COMPANIES.filter(c => !cFilt||c.country===cFilt);
    return (
      <div>
        <div className="pgt">Companies</div>
        <div className="pgs">{COMPANIES.length} companies · Ship managers & partners</div>
        <div className="fb">
          <select className="fs" value={cFilt} onChange={e=>setCFilt(e.target.value)}>
            <option value="">All Countries</option>
            {countries.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <button className="eb" onClick={() => exportCSV(rows,"companies.csv")}>
            <Download size={12}/>Export CSV
          </button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {rows.map(c => (
            <div key={c.id} className="csm" style={{ display:"flex",alignItems:"center",gap:16,cursor:"pointer",transition:"border-color .2s,transform .15s" }}
              onClick={() => go("companyDetail", c)}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;e.currentTarget.style.transform="translateY(-1px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.bdr;e.currentTarget.style.transform=""}}>
              <div style={{ width:50,height:50,borderRadius:13,background:T.bluD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>🏢</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15,fontWeight:700 }}>{c.name}</div>
                <div style={{ fontSize:12.5,color:T.mid,marginTop:3 }}>{c.country} · {c.vessels} vessels · {getPersonnel(c.id).length} contacts · {c.involvement}</div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:7 }}>
                <Badge s={c.status}/>
                <ChevronRight size={13} color={T.mid}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PersonnelPage = () => (
    <div>
      <div className="pgt">Personnel</div>
      <div className="pgs">{PERSONNEL.length} contacts across all companies</div>
      <div className="fb">
        <button className="eb" onClick={() => exportCSV(PERSONNEL.map(p=>({ Name:p.name,Role:p.role,Dept:p.dept,Email:p.email,Phone:p.phone,Company:getCompany(p.companyId)?.name,Notes:p.notes })),"personnel.csv")}>
          <Download size={12}/>Export CSV
        </button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(305px,1fr))",gap:11 }}>
        {PERSONNEL.map(p => (
          <div key={p.id} className="pc" onClick={() => go("personDetail", p)}>
            <div className="pav">{ini(p.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5,fontWeight:700 }}>{p.name}</div>
              <div style={{ fontSize:12,color:T.mid }}>{p.role}</div>
              <div style={{ fontSize:11.5,color:T.dim }}>{getCompany(p.companyId)?.name}</div>
            </div>
            <ChevronRight size={13} color={T.mid}/>
          </div>
        ))}
      </div>
    </div>
  );

  const VesselDetail = () => {
    const v = vessel; if (!v) return null;
    const co = getCompany(v.companyId);
    return (
      <div>
        <Crumb items={[{ lbl:"Vessels", fn:()=>setPage("vessels") },{ lbl:v.name }]}/>
        <div className="dh">
          <div className="di" style={{ background:T.accD, border:`1.5px solid ${T.bdr}` }}>{VESSEL_ICON[v.type]||"⚓"}</div>
          <div>
            <div className="dt">{v.name}</div>
            <div className="ds">IMO {v.imo} · {v.type} · {v.flag} · {v.dwt}</div>
            <div style={{ marginTop:9,fontSize:13 }}>
              <span style={{ color:T.mid }}>Ship Manager: </span>
              <span className="cl" style={{ fontWeight:700 }} onClick={() => go("companyDetail", co)}>{co?.name}</span>
            </div>
          </div>
        </div>
        <div className="sect">Vessel Information</div>
        <div className="fg">
          {[["Vessel Name",v.name],["Vessel Type",v.type],["IMO Number",v.imo],["Flag State",v.flag],["Year Built",String(v.yearBuilt)],["DWT",v.dwt],["Department",v.department]].map(([l,vl],i) => (
            <div key={i} className="fb2"><div className="fbl">{l}</div><div className="fbv">{vl}</div></div>
          ))}
        </div>
        <div className="sect">Communication Details</div>
        <div className="fg">
          <EBox lbl="Master Email ID"    val={v.masterEmail} ck={`me-${v.imo}`}/>
          <EBox lbl="TO (Cargo Gear)"    val={v.toCargo}     ck={`to-${v.imo}`}/>
          <EBox lbl="CC (Cargo Gear)"    val={v.ccCargo}     ck={`cc-${v.imo}`}/>
          <EBox lbl="Mail ID for Supply" val={v.supplyMail}  ck={`su-${v.imo}`}/>
          <EBox lbl="Mail ID for Gmail"  val={v.gmailId}     ck={`gm-${v.imo}`}/>
          <EBox lbl="Sludge Mail ID"     val={v.sludgeMail}  ck={`sl-${v.imo}`}/>
        </div>
      </div>
    );
  };

  const CompanyDetail = () => {
    const c = company; if (!c) return null;
    const vs = getVessels(c.id), ps = getPersonnel(c.id);
    return (
      <div>
        <Crumb items={[{ lbl:"Companies", fn:()=>setPage("companies") },{ lbl:c.name }]}/>
        <div className="dh">
          <div className="di" style={{ background:T.bluD, border:`1.5px solid ${T.bdr}` }}>🏢</div>
          <div>
            <div className="dt">{c.name}</div>
            <div className="ds">{c.country} · {c.involvement}</div>
            <div style={{ marginTop:8 }}><Badge s={c.status}/></div>
          </div>
        </div>
        <div className="fg">
          {[["Country",c.country],["Notification Status",c.status],["No. of Vessels",String(c.vessels)],["Involvement",c.involvement],["Remarks",c.remarks],["To-Do",c.todo]].map(([l,v],i) => (
            <div key={i} className="fb2"><div className="fbl">{l}</div><div className="fbv">{v}</div></div>
          ))}
        </div>
        <div className="sect">Linked Vessels ({vs.length})</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:10 }}>
          {vs.map(v => (
            <div key={v.imo} className="vc" onClick={() => go("vesselDetail", v)}>
              <span style={{ fontSize:20 }}>{VESSEL_ICON[v.type]||"⚓"}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:700 }}>{v.name}</div>
                <div style={{ fontSize:11.5,color:T.mid }}>IMO {v.imo} · {v.type}</div>
              </div>
              <ChevronRight size={13} color={T.mid}/>
            </div>
          ))}
        </div>
        <div className="sect">Personnel ({ps.length})</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:10 }}>
          {ps.map(p => (
            <div key={p.id} className="pc" onClick={() => go("personDetail", p)}>
              <div className="pav">{ini(p.name)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13,fontWeight:700 }}>{p.name}</div>
                <div style={{ fontSize:12,color:T.mid }}>{p.role}</div>
              </div>
              <ChevronRight size={13} color={T.mid}/>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PersonDetail = () => {
    const p = person; if (!p) return null;
    const co = getCompany(p.companyId);
    return (
      <div>
        <Crumb items={[{ lbl:"Personnel", fn:()=>setPage("personnel") },{ lbl:p.name }]}/>
        <div className="dh">
          <div className="di" style={{ background:T.accD,border:`1.5px solid ${T.bdr}`,fontSize:22,fontWeight:800,color:T.acc,fontFamily:"Outfit" }}>{ini(p.name)}</div>
          <div>
            <div className="dt">{p.name}</div>
            <div className="ds">{p.role} · {p.dept}</div>
            <div style={{ marginTop:9,fontSize:13 }}>
              <span style={{ color:T.mid }}>Company: </span>
              <span className="cl" style={{ fontWeight:700 }} onClick={() => go("companyDetail", co)}>{co?.name}</span>
            </div>
          </div>
        </div>
        <div className="fg">
          <div className="fb2"><div className="fbl">Full Name</div><div className="fbv">{p.name}</div></div>
          <div className="fb2"><div className="fbl">Role</div><div className="fbv">{p.role}</div></div>
          <div className="fb2"><div className="fbl">Department</div><div className="fbv">{p.dept}</div></div>
          <div className="fb2">
            <div className="fbl">Email Address</div>
            <div className="fbv">{p.email}</div>
            <div className="fa">
              <button className={`act ${copied===`pe-${p.id}`?"ok":""}`} onClick={() => cp(p.email,`pe-${p.id}`)}>
                {copied===`pe-${p.id}`?<><Check size={11}/>Copied</>:<><Copy size={11}/>Copy</>}
              </button>
              <a className="act" href={`mailto:${p.email}`}><Mail size={11}/>Mail</a>
            </div>
          </div>
          <div className="fb2">
            <div className="fbl">Phone Number</div>
            <div className="fbv">{p.phone}</div>
            <div className="fa">
              <button className={`act ${copied===`pp-${p.id}`?"ok":""}`} onClick={() => cp(p.phone,`pp-${p.id}`)}>
                {copied===`pp-${p.id}`?<><Check size={11}/>Copied</>:<><Copy size={11}/>Copy</>}
              </button>
              <a className="act" href={`tel:${p.phone}`}><Phone size={11}/>Call</a>
            </div>
          </div>
          <div className="fb2"><div className="fbl">Notes / Remarks</div><div className="fbv">{p.notes}</div></div>
        </div>
      </div>
    );
  };

  const renderPage = () => {
    if (page==="vesselDetail")  return vessel  ? <VesselDetail/>  : <VesselsPage/>;
    if (page==="companyDetail") return company ? <CompanyDetail/> : <CompaniesPage/>;
    if (page==="personDetail")  return person  ? <PersonDetail/>  : <PersonnelPage/>;
    if (page==="vessels")   return <VesselsPage/>;
    if (page==="companies") return <CompaniesPage/>;
    if (page==="personnel") return <PersonnelPage/>;
    return <DashPage/>;
  };

  const isOn = k => page===k||(page==="vesselDetail"&&k==="vessels")||(page==="companyDetail"&&k==="companies")||(page==="personDetail"&&k==="personnel");

  const navItems = [
    { key:"dashboard", lbl:"Dashboard", icon:<LayoutDashboard size={18}/> },
    { key:"vessels",   lbl:"Vessels",   icon:<Anchor size={18}/> },
    { key:"companies", lbl:"Companies", icon:<Building2 size={18}/> },
    { key:"personnel", lbl:"Personnel", icon:<Users size={18}/> }
  ];

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (!auth) return (
    <div className="crm">
      <style>{css}</style>
      <div className="lw">
        <div className="lg"/><div className="lgrid"/>
        <div className="lcard">
          <div className="llogo">
            <div className="licon">⚓</div>
            <div><div className="lname">MaritimeCRM</div><div className="ltag">Secure Operations Portal</div></div>
          </div>
          {err && <div className="lerr"><AlertCircle size={14}/>{err}</div>}
          <div className="fw">
            <div className="lbl">User ID</div>
            <input className="inp" placeholder="Enter your ID" value={uid} onChange={e=>setUid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          <div className="fw">
            <div className="lbl">Password</div>
            <div className="pw">
              <input className="inp" type={showP?"text":"password"} placeholder="Enter your password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} style={{ paddingRight:42 }}/>
              <button className="ey" onClick={()=>setShowP(!showP)}>{showP?<EyeOff size={15}/>:<Eye size={15}/>}</button>
            </div>
          </div>
          <div className="rrow" onClick={()=>setRem(!rem)}>
            <div className={`rbox ${rem?"on":""}`}>{rem&&<Check size={11} color="#0a0600"/>}</div>
            <span className="rtxt">Remember me on this device</span>
          </div>
          <button className="lbtn" onClick={login}>Sign In →</button>
          <div className="hint">
            <strong>Demo credentials —</strong><br/>
            ID: <code>admin</code>&nbsp;&nbsp;Password: <code>Maritime@2024</code><br/>
            ID: <code>hetul</code>&nbsp;&nbsp;Password: <code>VasPar@123</code>
          </div>
        </div>
      </div>
    </div>
  );

  // ── MAIN APP ─────────────────────────────────────────────────────────────
  return (
    <div className="crm">
      <style>{css}</style>
      <div className="layout">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sbh">
            <div className="sblogo">⚓</div>
            {sb && <div className="sbbrand">MaritimeCRM</div>}
          </div>
          <nav className="sbnav">
            {navItems.map(it => (
              <div key={it.key} className={`nav ${isOn(it.key)?"on":""}`} onClick={() => setPage(it.key)}>
                <span className="ni">{it.icon}</span>
                {sb && <span>{it.lbl}</span>}
              </div>
            ))}
          </nav>
          <div className="sbf">
            <div className="nav" style={{ color:"#f87171" }} onClick={logout}>
              <span className="ni"><LogOut size={18}/></span>
              {sb && <span>Logout</span>}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <div className="bar">
            <button className="ibtn" onClick={()=>setSb(!sb)}><Menu size={18}/></button>

            <div className="sw">
              <div className="sb2">
                <Search size={14} color={T.mid}/>
                <input className="si" placeholder="Search IMO, vessel, company, person…" value={q}
                  onChange={e=>setQ(e.target.value)}
                  onFocus={()=>setFoc(true)}
                  onBlur={()=>setTimeout(()=>setFoc(false),180)}/>
                {q && <button className="ibtn" style={{ padding:2 }} onClick={()=>setQ("")}><X size={13}/></button>}
              </div>
              {foc && q.length >= 2 && (
                <div className="sd">
                  {hits.length === 0
                    ? <div className="sde">No results for "{q}"</div>
                    : hits.map((h,i) => (
                      <div key={i} className="sdi" onMouseDown={() => {
                        if(h.k==="vessel")  go("vesselDetail",  h.d);
                        if(h.k==="company") go("companyDetail", h.d);
                        if(h.k==="person")  go("personDetail",  h.d);
                      }}>
                        <div className="sdic" style={{ background:h.k==="vessel"?T.accD:h.k==="company"?T.bluD:"rgba(16,185,129,.12)" }}>
                          {h.k==="vessel"?"🚢":h.k==="company"?"🏢":"👤"}
                        </div>
                        <div style={{ flex:1 }}>
                          <div className="sdl">{h.lbl}</div>
                          <div className="sds">{h.sub}</div>
                        </div>
                        <ChevronRight size={12} color={T.mid}/>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            <div className="br">
              <button className="ibtn" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
              <div className="chip">
                <div className="av">{user?.initials}</div>
                <span style={{ fontSize:13,fontWeight:600 }}>{user?.name}</span>
              </div>
            </div>
          </div>

          {/* PAGE */}
          <div className="page">{renderPage()}</div>
        </div>
      </div>
    </div>
  );
}
