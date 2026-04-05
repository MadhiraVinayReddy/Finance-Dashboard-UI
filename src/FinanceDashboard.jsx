import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";
import { Search, Plus, CreditCard as Edit2, Trash2, Download, ChevronUp, ChevronDown, Eye, Shield, X, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, ChartBar as BarChart2, List, Lightbulb, CircleAlert as AlertCircle, Sun, Moon } from "lucide-react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#0d1117", surface: "#161b22", surface2: "#21262d",
  border: "#30363d", text: "#e6edf3", muted: "#7d8590",
  green: "#3fb950", red: "#f85149", blue: "#58a6ff",
  amber: "#ffa657", purple: "#bc8cff",
};
const LIGHT = {
  bg: "#f6f8fa", surface: "#ffffff", surface2: "#f6f8fa",
  border: "#d0d7de", text: "#1f2328", muted: "#656d76",
  green: "#1a7f37", red: "#cf222e", blue: "#0969da",
  amber: "#9a6700", purple: "#8250df",
};
const PIE_COLORS = ["#58a6ff","#3fb950","#ffa657","#f85149","#bc8cff","#39d353","#ff7b72"];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const EXP_CATS = ["Food & Dining","Transport","Shopping","Entertainment","Health","Utilities","Education"];
const INC_CATS = ["Salary","Freelance","Investment Returns","Other Income"];

const INIT_TX = [
  {id:1, date:"2026-04-02",description:"Zepto Groceries",       category:"Food & Dining",     type:"expense",amount:1840},
  {id:2, date:"2026-04-01",description:"Monthly Salary",         category:"Salary",            type:"income", amount:85000},
  {id:3, date:"2026-03-31",description:"Swiggy Dinner",          category:"Food & Dining",     type:"expense",amount:620},
  {id:4, date:"2026-03-28",description:"Rapido Auto",            category:"Transport",         type:"expense",amount:180},
  {id:5, date:"2026-03-27",description:"Freelance Project",      category:"Freelance",         type:"income", amount:25000},
  {id:6, date:"2026-03-25",description:"Amazon Shopping",        category:"Shopping",          type:"expense",amount:4350},
  {id:7, date:"2026-03-22",description:"TSRTC Bus Pass",         category:"Transport",         type:"expense",amount:500},
  {id:8, date:"2026-03-20",description:"Netflix Subscription",   category:"Entertainment",     type:"expense",amount:649},
  {id:9, date:"2026-03-18",description:"Apollo Pharmacy",        category:"Health",            type:"expense",amount:890},
  {id:10,date:"2026-03-15",description:"Electricity Bill",       category:"Utilities",         type:"expense",amount:1200},
  {id:11,date:"2026-03-12",description:"Udemy Course",           category:"Education",         type:"expense",amount:399},
  {id:12,date:"2026-03-10",description:"Salary – March",         category:"Salary",            type:"income", amount:85000},
  {id:13,date:"2026-03-08",description:"Zomato Order",           category:"Food & Dining",     type:"expense",amount:480},
  {id:14,date:"2026-03-05",description:"Nykaa Shopping",         category:"Shopping",          type:"expense",amount:1650},
  {id:15,date:"2026-03-03",description:"Dividend Income",        category:"Investment Returns",type:"income", amount:3200},
  {id:16,date:"2026-02-28",description:"Salary – February",      category:"Salary",            type:"income", amount:85000},
  {id:17,date:"2026-02-25",description:"Myntra Clothes",         category:"Shopping",          type:"expense",amount:2800},
  {id:18,date:"2026-02-22",description:"Petrol",                 category:"Transport",         type:"expense",amount:2000},
  {id:19,date:"2026-02-20",description:"Doctor Consultation",    category:"Health",            type:"expense",amount:500},
  {id:20,date:"2026-02-18",description:"Inox Movies",            category:"Entertainment",     type:"expense",amount:750},
  {id:21,date:"2026-02-15",description:"Water Bill",             category:"Utilities",         type:"expense",amount:300},
  {id:22,date:"2026-02-12",description:"Freelance Design",       category:"Freelance",         type:"income", amount:18000},
  {id:23,date:"2026-02-10",description:"Grocery Store",          category:"Food & Dining",     type:"expense",amount:2100},
  {id:24,date:"2026-01-31",description:"Salary – January",       category:"Salary",            type:"income", amount:85000},
  {id:25,date:"2026-01-28",description:"Flipkart Order",         category:"Shopping",          type:"expense",amount:5600},
  {id:26,date:"2026-01-25",description:"Gym Membership",         category:"Health",            type:"expense",amount:2000},
  {id:27,date:"2026-01-20",description:"Uber Ride",              category:"Transport",         type:"expense",amount:350},
  {id:28,date:"2026-01-15",description:"Swiggy Instamart",       category:"Food & Dining",     type:"expense",amount:950},
  {id:29,date:"2026-01-10",description:"Coursera Subscription",  category:"Education",         type:"expense",amount:1200},
  {id:30,date:"2026-01-05",description:"Mutual Fund Returns",    category:"Investment Returns",type:"income", amount:5500},
  {id:31,date:"2025-12-31",description:"Salary – December",      category:"Salary",            type:"income", amount:85000},
  {id:32,date:"2025-12-25",description:"Christmas Shopping",     category:"Shopping",          type:"expense",amount:6500},
  {id:33,date:"2025-12-20",description:"Restaurant Dinner",      category:"Food & Dining",     type:"expense",amount:1800},
  {id:34,date:"2025-12-15",description:"Spotify Premium",        category:"Entertainment",     type:"expense",amount:119},
  {id:35,date:"2025-11-30",description:"Salary – November",      category:"Salary",            type:"income", amount:85000},
  {id:36,date:"2025-11-25",description:"Medical Tests",          category:"Health",            type:"expense",amount:1500},
  {id:37,date:"2025-11-20",description:"Freelance Writing",      category:"Freelance",         type:"income", amount:12000},
  {id:38,date:"2025-11-15",description:"Internet Bill",          category:"Utilities",         type:"expense",amount:999},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt    = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const fmtD   = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const cap    = s => s.charAt(0).toUpperCase() + s.slice(1);

function exportCSV(txs) {
  const header = "Date,Description,Category,Type,Amount\n";
  const rows   = txs.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([header + rows],{type:"text/csv"}));
  a.download = "transactions.csv";
  a.click();
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function SummaryCard({ title, amount, icon, accent, sub, subUp }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"var(--surface)", border:"1px solid var(--border)",
        borderLeft:`3px solid ${accent}`, borderRadius:12,
        padding:"20px 24px", transition:"transform .2s, box-shadow .2s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 24px rgba(0,0,0,.15)` : "none",
      }}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{color:"var(--muted)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{title}</p>
          <p style={{color:"var(--text)",fontSize:26,fontWeight:700,fontFamily:"'DM Mono',monospace",letterSpacing:"-.02em"}}>{fmt(amount)}</p>
          {sub && (
            <p style={{fontSize:12,color:subUp?"var(--green)":"var(--red)",marginTop:6,display:"flex",alignItems:"center",gap:4}}>
              {subUp ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>} {sub}
            </p>
          )}
        </div>
        <div style={{background:accent+"22",borderRadius:8,padding:10,color:accent}}>{icon}</div>
      </div>
    </div>
  );
}

function Badge({ type }) {
  const col = type === "income" ? "var(--green)" : "var(--red)";
  return <span style={{background:col+"22",color:col,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600}}>{cap(type)}</span>;
}
function CatBadge({ label }) {
  return <span style={{background:"var(--blue)18",color:"var(--blue)",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:500}}>{label}</span>;
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px"}}>
      {label && <p style={{color:"var(--muted)",fontSize:12,marginBottom:6}}>{label}</p>}
      {payload.map(p => (
        <p key={p.name} style={{color:p.color||"var(--text)",fontSize:13,fontWeight:600}}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
}

function Modal({ tx, onClose, onSave }) {
  const blank = { date: new Date().toISOString().split("T")[0], description:"", category:"Salary", type:"income", amount:"" };
  const [form, setForm] = useState(tx || blank);
  const cats = form.type === "income" ? INC_CATS : EXP_CATS;

  const inp = {
    background:"var(--surface2)", border:"1px solid var(--border)", color:"var(--text)",
    borderRadius:8, padding:"10px 12px", fontSize:14, width:"100%", outline:"none", boxSizing:"border-box",
  };

  const submit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    onSave({ ...form, amount: Number(form.amount), id: tx?.id ?? Date.now() });
    onClose();
  };

  return (
    <div style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:9999,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,
    }}>
      <div style={{
        background:"var(--surface)",border:"1px solid var(--border)",
        borderRadius:16,padding:28,width:"100%",maxWidth:460,
        animation:"fadeIn .15s ease",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h3 style={{color:"var(--text)",fontSize:18,fontWeight:700}}>{tx ? "Edit Transaction" : "Add Transaction"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer"}}><X size={20}/></button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* Type toggle */}
          <div>
            <label style={{color:"var(--muted)",fontSize:11,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Type</label>
            <div style={{display:"flex",gap:8}}>
              {["income","expense"].map(t => {
                const col = t === "income" ? "var(--green)" : "var(--red)";
                const active = form.type === t;
                return (
                  <button key={t} onClick={() => setForm(f=>({...f,type:t,category:t==="income"?"Salary":"Food & Dining"}))}
                    style={{flex:1,padding:"9px",borderRadius:8,border:`1px solid ${active?col:"var(--border)"}`,
                      background:active?col+"22":"transparent",color:active?col:"var(--muted)",
                      cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"inherit"}}>
                    {cap(t)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{color:"var(--muted)",fontSize:11,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Description</label>
            <input style={inp} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. Grocery Shopping"/>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{color:"var(--muted)",fontSize:11,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Date</label>
              <input style={inp} type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
            </div>
            <div>
              <label style={{color:"var(--muted)",fontSize:11,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Amount (₹)</label>
              <input style={inp} type="number" min="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0"/>
            </div>
          </div>

          <div>
            <label style={{color:"var(--muted)",fontSize:11,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Category</label>
            <select style={{...inp,cursor:"pointer"}} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button onClick={submit}
            style={{background:"var(--blue)",color:"#fff",border:"none",borderRadius:8,padding:"12px",
              fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
            {tx ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [dark,  setDark]  = useState(() => {
    const saved = localStorage.getItem("fintrack_dark");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [role,  setRole]  = useState(() => localStorage.getItem("fintrack_role") || "viewer");
  const [tab,   setTab]   = useState("dashboard");
  const [txs,   setTxs]   = useState(() => {
    const saved = localStorage.getItem("fintrack_transactions");
    return saved ? JSON.parse(saved) : INIT_TX;
  });
  const [search,setSearch]= useState("");
  const [tFilt, setTFilt] = useState("all");
  const [cFilt, setCFilt] = useState("all");
  const [sortBy,setSortBy]= useState("date");
  const [sortDir,setSort] = useState("desc");
  const [modal, setModal] = useState(null);

  const saveTxToStorage = (newTxs) => {
    setTxs(newTxs);
    localStorage.setItem("fintrack_transactions", JSON.stringify(newTxs));
  };

  const saveDarkMode = (isDark) => {
    setDark(isDark);
    localStorage.setItem("fintrack_dark", JSON.stringify(isDark));
  };

  const saveRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("fintrack_role", newRole);
  };

  const C = dark ? DARK : LIGHT;
  const isAdmin = role === "admin";

  // ── Computed ────────────────────────────────────────────────────────────────
  const totalInc = useMemo(()=>txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),[txs]);
  const totalExp = useMemo(()=>txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0),[txs]);
  const balance  = totalInc - totalExp;

  const monthlyData = useMemo(()=>{
    const m = {};
    [...txs].sort((a,b)=>a.date.localeCompare(b.date)).forEach(t=>{
      const k = t.date.slice(0,7);
      if(!m[k]) m[k]={Income:0,Expenses:0};
      if(t.type==="income") m[k].Income+=t.amount; else m[k].Expenses+=t.amount;
    });
    return Object.entries(m).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>({
      month: new Date(k+"-01").toLocaleDateString("en-IN",{month:"short",year:"2-digit"}),
      ...v, Net: v.Income - v.Expenses,
    }));
  },[txs]);

  const catData = useMemo(()=>{
    const c={};
    txs.filter(t=>t.type==="expense").forEach(t=>{c[t.category]=(c[t.category]||0)+t.amount;});
    return Object.entries(c).sort(([,a],[,b])=>b-a).map(([name,value])=>({name,value}));
  },[txs]);

  const allCats = useMemo(()=>[...new Set(txs.map(t=>t.category))].sort(),[txs]);

  const filtered = useMemo(()=>{
    let r=[...txs];
    if(search) r=r.filter(t=>t.description.toLowerCase().includes(search.toLowerCase())||t.category.toLowerCase().includes(search.toLowerCase()));
    if(tFilt!=="all") r=r.filter(t=>t.type===tFilt);
    if(cFilt!=="all") r=r.filter(t=>t.category===cFilt);
    r.sort((a,b)=>{
      const va=sortBy==="date"?a.date:a.amount, vb=sortBy==="date"?b.date:b.amount;
      return sortDir==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0);
    });
    return r;
  },[txs,search,tFilt,cFilt,sortBy,sortDir]);

  const savingsRate = totalInc>0 ? ((balance/totalInc)*100).toFixed(1) : "0.0";
  const topCat      = catData[0];
  const curr        = monthlyData[monthlyData.length-1];
  const prev        = monthlyData[monthlyData.length-2];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const saveTx = tx => saveTxToStorage(p=>p.some(t=>t.id===tx.id)?p.map(t=>t.id===tx.id?tx:t):[tx,...p]);
  const delTx  = id => saveTxToStorage(p=>p.filter(t=>t.id!==id));
  const toggleSort = col => { if(sortBy===col) setSort(d=>d==="asc"?"desc":"asc"); else {setSortBy(col);setSort("desc");} };

  // ── CSS vars via style tag ───────────────────────────────────────────────────
  const cssVars = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:${C.bg}; --surface:${C.surface}; --surface2:${C.surface2};
      --border:${C.border}; --text:${C.text}; --muted:${C.muted};
      --green:${C.green}; --red:${C.red}; --blue:${C.blue};
      --amber:${C.amber}; --purple:${C.purple};
    }
    body { background: var(--bg); }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:var(--bg); }
    ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter:${dark?"invert(1)":"none"}; }
    select option { background:var(--surface2); color:var(--text); }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  `;

  // ── Style helpers ────────────────────────────────────────────────────────────
  const card   = { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12 };
  const th     = { color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",padding:"0 16px 12px",textAlign:"left" };
  const td     = { color:"var(--text)",fontSize:14,padding:"12px 16px",borderTop:"1px solid var(--border)" };
  const inp    = { background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:8,padding:"9px 12px",fontSize:14,outline:"none",fontFamily:"inherit" };
  const navBtn = active => ({
    background:"none",border:"none",color:active?"var(--blue)":"var(--muted)",cursor:"pointer",
    padding:"14px 16px",fontSize:14,fontWeight:600,borderBottom:`2px solid ${active?"var(--blue)":"transparent"}`,
    display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",transition:"color .15s",
  });
  const btn = (bg="var(--surface2)", col="var(--muted)") => ({
    background:bg,color:col,border:"none",borderRadius:8,padding:"8px 14px",
    fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",
  });

  const SortIcon = ({col}) => sortBy===col ? (sortDir==="desc"?<ChevronDown size={13}/>:<ChevronUp size={13}/>) : null;

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",fontFamily:"'Sora',-apple-system,sans-serif",color:"var(--text)"}}>
      <style>{cssVars}</style>

      {/* ── HEADER ── */}
      <header style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 24px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"var(--blue)22",borderRadius:8,padding:8,color:"var(--blue)"}}><Wallet size={18}/></div>
          <span style={{fontWeight:700,fontSize:16,letterSpacing:"-.02em"}}>FinTrack</span>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {/* Role switcher */}
          <div style={{display:"flex",gap:4,background:"var(--surface2)",borderRadius:20,padding:"4px 6px",border:"1px solid var(--border)"}}>
            {[["viewer","Viewer",Eye],["admin","Admin",Shield]].map(([r,label,Icon])=>(
              <button key={r} onClick={()=>saveRole(r)} style={{
                background:role===r?(r==="admin"?"var(--amber)33":"var(--blue)33"):"transparent",
                color:role===r?(r==="admin"?"var(--amber)":"var(--blue)"):"var(--muted)",
                border:"none",borderRadius:16,padding:"5px 12px",cursor:"pointer",
                fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:5,
                fontFamily:"inherit",transition:"all .2s",
              }}>
                <Icon size={13}/> {label}
              </button>
            ))}
          </div>
          {/* Dark mode */}
          <button onClick={()=>saveDarkMode(!dark)} style={{...btn(),border:"1px solid var(--border)",padding:"8px"}}>
            {dark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:"0 24px",display:"flex",gap:4}}>
        {[["dashboard",BarChart2,"Dashboard"],["transactions",List,"Transactions"],["insights",Lightbulb,"Insights"]].map(([id,Icon,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={navBtn(tab===id)}>
            <Icon size={15}/>{label}
          </button>
        ))}
      </nav>

      <main style={{padding:"24px",maxWidth:1200,margin:"0 auto"}}>

        {/* ══════════════════════ DASHBOARD ══════════════════════ */}
        {tab==="dashboard" && <>
          {/* Summary Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:24}}>
            <SummaryCard title="Total Balance" amount={balance}   icon={<Wallet size={20}/>}      accent={C.blue}  sub={`${savingsRate}% savings rate`} subUp={Number(savingsRate)>20}/>
            <SummaryCard title="Total Income"  amount={totalInc}  icon={<TrendingUp size={20}/>}  accent={C.green} sub={`${txs.filter(t=>t.type==="income").length} transactions`} subUp/>
            <SummaryCard title="Total Expenses"amount={totalExp}  icon={<TrendingDown size={20}/>}accent={C.red}   sub={`${txs.filter(t=>t.type==="expense").length} transactions`} subUp={false}/>
          </div>

          {/* Charts */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16,marginBottom:24}}>
            {/* Area Chart */}
            <div style={{...card,padding:20}}>
              <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>Monthly Income vs Expenses</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyData} margin={{top:5,right:10,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.3}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
                    <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={.3}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid stroke={C.border} strokeDasharray="3 3"/>
                  <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<ChartTip/>}/>
                  <Area type="monotone" dataKey="Income"   stroke={C.green} strokeWidth={2} fill="url(#gi)"/>
                  <Area type="monotone" dataKey="Expenses" stroke={C.red}   strokeWidth={2} fill="url(#ge)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut Chart */}
            <div style={{...card,padding:20}}>
              <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>Spending by Category</p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                      {catData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip content={<ChartTip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                  {catData.slice(0,6).map((d,i)=>(
                    <div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}}/>
                        <span style={{color:"var(--muted)",fontSize:11,whiteSpace:"nowrap"}}>{d.name.split(" ")[0]}</span>
                      </div>
                      <span style={{color:"var(--text)",fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>₹{(d.value/1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div style={{...card,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Recent Transactions</p>
              <button onClick={()=>setTab("transactions")} style={{background:"none",border:"none",color:"var(--blue)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>View All →</button>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  {txs.slice(0,5).map(t=>(
                    <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{transition:"background .1s"}}>
                      <td style={{...td,color:"var(--muted)",fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtD(t.date)}</td>
                      <td style={td}>{t.description}</td>
                      <td style={td}><CatBadge label={t.category}/></td>
                      <td style={{...td,textAlign:"right",fontFamily:"'DM Mono',monospace",color:t.type==="income"?"var(--green)":"var(--red)",fontWeight:700}}>
                        {t.type==="income"?"+":"-"}{fmt(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>}

        {/* ══════════════════════ TRANSACTIONS ══════════════════════ */}
        {tab==="transactions" && <>
          {/* Toolbar */}
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16,alignItems:"center"}}>
            <div style={{position:"relative",flex:"1 1 200px"}}>
              <Search size={14} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--muted)"}}/>
              <input style={{...inp,width:"100%",paddingLeft:36}} placeholder="Search transactions…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select style={{...inp,cursor:"pointer"}} value={tFilt} onChange={e=>setTFilt(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select style={{...inp,cursor:"pointer"}} value={cFilt} onChange={e=>setCFilt(e.target.value)}>
              <option value="all">All Categories</option>
              {allCats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{display:"flex",gap:8,marginLeft:"auto"}}>
              <button onClick={()=>exportCSV(filtered)} style={{...btn(),border:"1px solid var(--border)"}}>
                <Download size={14}/> Export CSV
              </button>
              {isAdmin && (
                <button onClick={()=>setModal("add")} style={{...btn("var(--blue)","#fff")}}>
                  <Plus size={14}/> Add
                </button>
              )}
            </div>
          </div>

          <p style={{color:"var(--muted)",fontSize:13,marginBottom:12}}>{filtered.length} result{filtered.length!==1?"s":""}</p>

          {/* Table */}
          <div style={{...card,padding:0,overflowX:"auto"}}>
            {filtered.length===0 ? (
              <div style={{padding:48,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                <AlertCircle size={32} color="var(--muted)"/>
                <p style={{color:"var(--muted)"}}>No transactions match your filters</p>
              </div>
            ) : (
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
                <thead>
                  <tr>
                    <th style={th}>
                      <button onClick={()=>toggleSort("date")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,letterSpacing:".06em",fontFamily:"inherit"}}>
                        Date <SortIcon col="date"/>
                      </button>
                    </th>
                    <th style={th}>Description</th>
                    <th style={th}>Category</th>
                    <th style={th}>Type</th>
                    <th style={{...th,textAlign:"right"}}>
                      <button onClick={()=>toggleSort("amount")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,letterSpacing:".06em",fontFamily:"inherit",marginLeft:"auto"}}>
                        Amount <SortIcon col="amount"/>
                      </button>
                    </th>
                    {isAdmin && <th style={th}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t=>(
                    <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{transition:"background .1s"}}>
                      <td style={{...td,color:"var(--muted)",fontFamily:"'DM Mono',monospace",fontSize:13}}>{fmtD(t.date)}</td>
                      <td style={td}>{t.description}</td>
                      <td style={td}><CatBadge label={t.category}/></td>
                      <td style={td}><Badge type={t.type}/></td>
                      <td style={{...td,textAlign:"right",fontFamily:"'DM Mono',monospace",color:t.type==="income"?"var(--green)":"var(--red)",fontWeight:700}}>
                        {t.type==="income"?"+":"-"}{fmt(t.amount)}
                      </td>
                      {isAdmin && (
                        <td style={td}>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>setModal(t)} style={{background:"var(--blue)22",color:"var(--blue)",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer"}}><Edit2 size={13}/></button>
                            <button onClick={()=>delTx(t.id)} style={{background:"var(--red)22",color:"var(--red)",border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer"}}><Trash2 size={13}/></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>}

        {/* ══════════════════════ INSIGHTS ══════════════════════ */}
        {tab==="insights" && <>
          {/* Insight Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
            {[
              {label:"Top Spending Category",value:topCat?.name||"—",sub:topCat?fmt(topCat.value):"—",accent:C.amber},
              {label:"Savings Rate",         value:`${savingsRate}%`,  sub:`of ${fmt(totalInc)} saved`,accent:C.green},
              {label:"Total Transactions",   value:txs.length,         sub:`${txs.filter(t=>t.type==="income").length} income · ${txs.filter(t=>t.type==="expense").length} expense`,accent:C.purple},
            ].map(({label,value,sub,accent})=>(
              <div key={label} style={{...card,padding:"20px 24px",borderLeft:`3px solid ${accent}`}}>
                <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{label}</p>
                <p style={{color:"var(--text)",fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{value}</p>
                <p style={{color:accent,fontSize:13,marginTop:6}}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Monthly Bar Chart */}
          <div style={{...card,padding:20,marginBottom:24}}>
            <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>Monthly Comparison — Income vs Expenses</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} margin={{top:5,right:10,left:0,bottom:0}} barCategoryGap="30%">
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<ChartTip/>}/>
                <Legend formatter={v=><span style={{color:"var(--muted)",fontSize:12}}>{v}</span>}/>
                <Bar dataKey="Income"   fill={C.green} radius={[4,4,0,0]}/>
                <Bar dataKey="Expenses" fill={C.red}   radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div style={{...card,padding:20,marginBottom:24}}>
            <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>Spending Breakdown</p>
            {catData.map((d,i)=>{
              const pct = ((d.value/totalExp)*100).toFixed(1);
              return (
                <div key={d.name} style={{padding:"10px 0",borderTop:i>0?"1px solid var(--border)":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:9,height:9,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length]}}/>
                      <span style={{color:"var(--text)",fontSize:14,fontWeight:500}}>{d.name}</span>
                    </div>
                    <div style={{display:"flex",gap:16}}>
                      <span style={{color:"var(--muted)",fontSize:13}}>{pct}%</span>
                      <span style={{color:"var(--text)",fontSize:14,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{fmt(d.value)}</span>
                    </div>
                  </div>
                  <div style={{background:"var(--surface2)",borderRadius:4,height:4}}>
                    <div style={{background:PIE_COLORS[i%PIE_COLORS.length],borderRadius:4,height:4,width:`${pct}%`,transition:"width .8s ease"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Observations */}
          <div style={{...card,padding:20}}>
            <p style={{color:"var(--muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:16}}>Key Observations</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                topCat && `Your highest spending category is <b>${topCat.name}</b> at ${fmt(topCat.value)} — consider setting a monthly budget for it.`,
                `Your savings rate is <b>${savingsRate}%</b>, which is ${Number(savingsRate)>=20?"above":"below"} the recommended 20% threshold.`,
                curr && prev && `This month's expenses are <b>${curr.Expenses>prev.Expenses?"higher":"lower"}</b> than last month by ${fmt(Math.abs(curr.Expenses-prev.Expenses))}.`,
                catData[1] && `<b>${catData[1].name}</b> is your second-largest expense at ${fmt(catData[1].value)} — tracking it closely can help save significantly.`,
                `You have <b>${txs.filter(t=>t.type==="income").length} income</b> transactions totalling ${fmt(totalInc)} across all time.`,
              ].filter(Boolean).map((obs,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",background:"var(--surface2)",borderRadius:8}}>
                  <span style={{color:"var(--blue)",flexShrink:0,marginTop:1,fontWeight:700}}>→</span>
                  <p style={{color:"var(--text)",fontSize:14,lineHeight:1.6}} dangerouslySetInnerHTML={{__html:obs}}/>
                </div>
              ))}
            </div>
          </div>
        </>}
      </main>

      {/* ── MODAL ── */}
      {modal && <Modal tx={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={saveTx}/>}
    </div>
  );
}