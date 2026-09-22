import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import {
  Activity, AlertTriangle, Bell, Binary, BrainCircuit, ChevronRight, CircleDot,
  Clock3, Crosshair, Download, FileCheck2, FileSearch, Fingerprint, Globe2,
  Hexagon, LayoutDashboard, Link2, ListTree, LockKeyhole, MailSearch, MapPin,
  Menu, Network, Radar, ScanSearch, Search, Settings, Share2, ShieldAlert,
  ShieldCheck, Sparkles, UploadCloud, UserRound, X, Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ByteForce 6 — AI Email Threat Detection" },
    { name: "description", content: "AI-powered SOC workspace for email threat detection, geolocation, attack correlation, and forensic reporting." },
    { property: "og:title", content: "ByteForce 6 — AI Email Threat Detection" },
    { property: "og:description", content: "A complete forensic intelligence workspace for high-speed email investigations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ByteForceApp,
});

const nav = [
  ["Dashboard", LayoutDashboard], ["Analyze Email", MailSearch], ["Threat Intelligence", Radar],
  ["Email Forensics", FileSearch], ["Geolocation", Globe2], ["Attack Campaigns", Crosshair],
  ["Investigation Graph", Network], ["Alerts", ShieldAlert], ["Reports", FileCheck2], ["Settings", Settings],
] as const;

const stats = [
  ["Emails Analyzed", "24,891", "+12.4%", MailSearch], ["Threats Detected", "1,284", "+8.1%", ShieldAlert],
  ["Critical Threats", "47", "+3 today", AlertTriangle], ["Suspicious IPs", "318", "42 new", Globe2],
  ["Active Investigations", "12", "5 assigned", ScanSearch], ["Reports Generated", "386", "+18 this week", FileCheck2],
] as const;

const threatData = [
  { name: "Phishing", value: 42, color: "var(--destructive)" }, { name: "Malware", value: 21, color: "var(--warning)" },
  { name: "BEC", value: 14, color: "var(--primary)" }, { name: "Spam", value: 16, color: "var(--muted-foreground)" },
  { name: "Safe", value: 7, color: "var(--success)" },
];
const volumeData = [
  { time: "00:00", threats: 28 }, { time: "04:00", threats: 42 }, { time: "08:00", threats: 31 },
  { time: "12:00", threats: 67 }, { time: "16:00", threats: 52 }, { time: "20:00", threats: 81 }, { time: "24:00", threats: 59 },
];
const threats = [
  ["billing@micr0soft-secure.com", "Action required: Verify your account", "Credential Phishing", "94", "Bucharest, RO", "Blocked", "2m ago"],
  ["finance@vendor-payments.co", "Updated wire instructions", "BEC / Impersonation", "87", "Lagos, NG", "Quarantined", "18m ago"],
  ["notification@sharepoint-files.net", "Document shared with you", "Malware", "82", "Moscow, RU", "Sandboxed", "32m ago"],
  ["support@cloud-storage.cc", "Storage quota exceeded", "Phishing", "76", "Frankfurt, DE", "Review", "1h ago"],
];
const pipeline = ["Email Upload", "Header Parsing", "AI Threat Detection", "URL Analysis", "Attachment Analysis", "SPF / DKIM / DMARC", "IP Intelligence", "Geolocation", "Threat Correlation", "Risk Score"];

function Badge({ children, tone = "cyan" }: { children: React.ReactNode; tone?: "cyan" | "red" | "green" | "amber" }) {
  const map = { cyan: "border-primary/30 bg-cyan-muted text-cyan", red: "border-destructive/35 bg-danger-muted text-destructive", green: "border-success/30 bg-success/10 text-success", amber: "border-warning/30 bg-warning/10 text-warning" };
  return <span className={`inline-flex items-center rounded border px-2 py-1 font-mono text-[10px] font-semibold uppercase ${map[tone]}`}>{children}</span>;
}

function Panel({ title, icon: Icon, action, children, className = "" }: { title: string; icon?: ComponentType<{ className?: string }>; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`cyber-card rounded-md ${className}`}><div className="flex h-12 items-center justify-between border-b border-border px-4"><div className="flex items-center gap-2">{Icon && <Icon className="size-4 text-primary" />}<h2 className="text-sm font-semibold">{title}</h2></div>{action}</div>{children}</section>;
}

function ByteForceApp() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [complete, setComplete] = useState(false);

  const runAnalysis = () => { setActive("Analyze Email"); setComplete(false); setAnalysisStep(0); };
  useEffect(() => {
    if (analysisStep < 0 || analysisStep >= pipeline.length) return;
    const timer = window.setTimeout(() => {
      if (analysisStep === pipeline.length - 1) { setComplete(true); return; }
      setAnalysisStep((step) => step + 1);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [analysisStep]);

  return <div className="min-h-screen bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-background/95 backdrop-blur-xl transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded bg-primary text-primary-foreground"><Hexagon className="size-5" /></div><div><div className="text-sm font-bold">BYTEFORCE <span className="text-primary">6</span></div><div className="font-mono text-[9px] text-muted-foreground">THREAT INTELLIGENCE</div></div></div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X /></Button>
      </div>
      <nav className="space-y-1 p-3">{nav.map(([label, Icon]) => <Button key={label} variant="ghost" onClick={() => { setActive(label); setMobileOpen(false); }} className={`h-10 w-full justify-start px-3 ${active === label ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}><Icon className="size-4" />{label}{active === label && <ChevronRight className="ml-auto size-3" />}</Button>)}</nav>
      <div className="absolute bottom-4 left-3 right-3 rounded border border-primary/20 bg-cyan-muted p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan"><CircleDot className="size-3 signal-pulse" />AI ENGINE ONLINE</div><div className="font-mono text-[10px] text-muted-foreground">Models synced · 14ms latency</div></div>
    </aside>
    <main className="lg:pl-64">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-xl lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu /></Button>
        <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-9 border-border bg-muted/60 pl-9" placeholder="Search indicators, hashes, domains..." /></div>
        <div className="hidden items-center gap-2 rounded border border-success/25 bg-success/10 px-3 py-2 text-xs font-medium text-success md:flex"><span className="size-1.5 rounded-full bg-success signal-pulse" />All systems operational</div>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications"><Bell /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" /></Button>
        <div className="hidden items-center gap-3 border-l border-border pl-4 sm:flex"><div className="text-right"><div className="text-xs font-semibold">Arjun Mehta</div><div className="text-[10px] text-muted-foreground">SOC Analyst</div></div><div className="grid size-8 place-items-center rounded bg-secondary"><UserRound className="size-4" /></div></div>
      </header>
      <div className="mx-auto max-w-[1680px] p-4 lg:p-6">
        {active === "Dashboard" && <Dashboard runAnalysis={runAnalysis} onNavigate={setActive} />}
        {active === "Analyze Email" && <AnalyzeView runAnalysis={runAnalysis} step={analysisStep} complete={complete} />}
        {active === "Email Forensics" && <ForensicsView />}
        {active === "Geolocation" && <GeoView />}
        {active === "Threat Intelligence" && <IntelView />}
        {active === "Investigation Graph" || active === "Attack Campaigns" ? <GraphView /> : null}
        {active === "Alerts" && <AlertsView />}
        {active === "Reports" && <ReportsView />}
        {active === "Settings" && <SettingsView />}
      </div>
    </main>
  </div>;
}

function PageTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-1 font-mono text-[10px] uppercase text-primary">{eyebrow}</div><h1 className="text-2xl font-semibold">{title}</h1></div>{action}</div>;
}

function Dashboard({ runAnalysis, onNavigate }: { runAnalysis: () => void; onNavigate: (view: string) => void }) {
  return <><PageTitle eyebrow="Command Center / Live" title="Security Operations Overview" action={<Button onClick={runAnalysis} className="h-10 font-mono text-xs"><Zap />RUN FULL AI ANALYSIS</Button>} />
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{stats.map(([label, value, delta, Icon], i) => <div key={label} className="cyber-card rounded-md p-4"><div className="mb-5 flex items-start justify-between"><Icon className={`size-5 ${i === 2 ? "text-destructive" : "text-primary"}`} /><span className="font-mono text-[9px] text-muted-foreground">24H</span></div><div className="text-2xl font-semibold">{value}</div><div className="mt-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{label}</span><span className={i === 2 ? "text-destructive" : "text-success"}>{delta}</span></div></div>)}</div>
    <div className="grid gap-4 xl:grid-cols-[1.4fr_.8fr_.8fr]">
      <Panel title="Threat Activity" icon={Activity} action={<Badge>Live telemetry</Badge>}><div className="h-64 p-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={volumeData}><defs><linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/><stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false}/><XAxis dataKey="time" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false}/><YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false}/><Tooltip contentStyle={{ background: "var(--popover)", borderColor: "var(--border)", fontSize: 11 }}/><Area type="monotone" dataKey="threats" stroke="var(--primary)" fill="url(#threatFill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Panel>
      <Panel title="Threat Overview" icon={Radar}><div className="flex h-64 items-center p-3"><div className="h-full w-1/2"><ResponsiveContainer><PieChart><Pie data={threatData} dataKey="value" innerRadius={42} outerRadius={72} paddingAngle={3}>{threatData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="space-y-3">{threatData.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs"><span className="size-2 rounded-full" style={{ background: item.color }} /><span className="w-16 text-muted-foreground">{item.name}</span><span className="font-mono">{item.value}%</span></div>)}</div></div></Panel>
      <Panel title="Live Alerts" icon={Bell} action={<Button variant="ghost" size="sm" onClick={() => onNavigate("Alerts")}>VIEW ALL</Button>}><div className="divide-y divide-border">{[["CRITICAL","Credential phishing detected","2m"],["HIGH","Sender infrastructure flagged","8m"],["MEDIUM","Domain age below 14 days","19m"]].map(([level,text,time], i)=><div className="p-3" key={text}><div className="mb-1 flex items-center justify-between"><Badge tone={i===0?"red":i===1?"amber":"cyan"}>{level}</Badge><span className="font-mono text-[9px] text-muted-foreground">{time}</span></div><p className="mt-2 text-xs">{text}</p></div>)}</div></Panel>
    </div>
    <Panel title="Recent Threats" icon={ShieldAlert} className="mt-4" action={<Badge tone="red">47 critical</Badge>}><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-muted/50 font-mono text-[10px] uppercase text-muted-foreground"><tr>{["Sender","Subject","Threat Type","Risk","Location","Status","Date"].map(h=><th className="px-4 py-3 font-medium" key={h}>{h}</th>)}</tr></thead><tbody className="divide-y divide-border">{threats.map((row)=><tr key={row[0]} className="transition-colors hover:bg-muted/30">{row.map((cell,i)=><td className={`px-4 py-3 ${i===3?"font-mono font-semibold text-destructive":i===0?"font-mono text-cyan":""}`} key={cell}>{i===5?<Badge tone={cell==="Review"?"amber":"red"}>{cell}</Badge>:cell}</td>)}</tr>)}</tbody></table></div></Panel>
  </>;
}

function AnalyzeView({ runAnalysis, step, complete }: { runAnalysis: () => void; step: number; complete: boolean }) {
  return <><PageTitle eyebrow="Investigation / BF6-2026-0917" title="AI Email Threat Analysis" action={<Badge tone="red">Live sample · critical</Badge>} />
    <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
      <Panel title="Evidence Intake" icon={UploadCloud}><div className="p-5"><div className="rounded-md border border-dashed border-primary/40 bg-cyan-muted/30 p-7 text-center"><UploadCloud className="mx-auto mb-3 size-8 text-primary" /><p className="text-sm font-medium">Drop suspicious email evidence</p><p className="mt-1 text-xs text-muted-foreground">.EML · .MSG · or paste raw email content</p><div className="mt-4 flex justify-center gap-2"><Button variant="outline" size="sm">SELECT FILE</Button><Button variant="ghost" size="sm">PASTE CONTENT</Button></div></div><div className="mt-4 rounded border border-border bg-muted/30 p-3 font-mono text-[10px]"><div className="mb-2 flex justify-between"><span className="text-cyan">sample-invoice-notice.eml</span><span className="text-success">READY</span></div><div className="text-muted-foreground">18.4 KB · SHA-256 98d4...a71c · RFC 5322</div></div><Button className="mt-4 h-11 w-full font-mono text-xs" onClick={runAnalysis}><BrainCircuit />RUN FULL AI ANALYSIS</Button></div></Panel>
      <Panel title="Investigation Pipeline" icon={Binary} action={complete?<Badge tone="red">Threat confirmed</Badge>:step>=0?<Badge>Analyzing</Badge>:<Badge tone="green">Ready</Badge>}><div className="relative grid gap-2 p-5 sm:grid-cols-2">{step>=0&&!complete&&<div className="scan-line pointer-events-none absolute left-0 right-0 top-0 h-px bg-primary shadow-[0_0_16px_var(--primary)]" />}{pipeline.map((label,i)=><div key={label} className={`flex items-center gap-3 rounded border p-3 transition-all duration-300 ${i<step||complete?"border-success/25 bg-success/5":i===step?"border-primary/50 bg-cyan-muted":"border-border bg-muted/20"}`}><div className={`grid size-6 place-items-center rounded-full font-mono text-[10px] ${i<step||complete?"bg-success/15 text-success":i===step?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{i<step||complete?"✓":String(i+1).padStart(2,"0")}</div><span className="text-xs">{label}</span></div>)}</div></Panel>
    </div>
    {(complete || step < 0) && <AnalysisResults />}
  </>;
}

function AnalysisResults() {
  return <div className="mt-4 grid gap-4 xl:grid-cols-[.75fr_1.25fr]">
    <Panel title="AI Verdict" icon={BrainCircuit}><div className="p-5"><div className="flex items-center justify-between"><div><Badge tone="red">Critical threat</Badge><h3 className="mt-3 text-lg font-semibold">Credential Phishing + Impersonation</h3><p className="mt-1 text-xs text-muted-foreground">Microsoft 365 credential theft campaign</p></div><div className="grid size-24 place-items-center rounded-full border-4 border-destructive bg-danger-muted"><div className="text-center"><div className="font-mono text-3xl font-bold text-destructive">94</div><div className="text-[9px] text-muted-foreground">/ 100 RISK</div></div></div></div><div className="mt-5 space-y-3">{[["Phishing probability",97],["Malware probability",62],["BEC probability",88],["Spam probability",21],["AI confidence",96]].map(([n,v])=><div key={n as string}><div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{n}</span><span className="font-mono">{v}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${v}%`}} /></div></div>)}</div></div></Panel>
    <Panel title="Explainable AI Findings" icon={Sparkles}><div className="grid gap-3 p-5 sm:grid-cols-2">{[["Sender impersonation","Display name mimics Microsoft Security while the sending domain uses a zero substitution."],["Authentication failure","SPF and DMARC failed alignment. DKIM signature is absent."],["Malicious redirect","Three-hop redirect terminates at a known credential harvesting host."],["Infrastructure overlap","IP and TLS fingerprint match 18 emails in campaign PHISH-2026-042."]].map(([title,text],i)=><div key={title} className="rounded border border-border bg-muted/25 p-3"><div className="mb-2 flex items-center gap-2"><AlertTriangle className={`size-4 ${i<2?"text-destructive":"text-warning"}`} /><span className="text-xs font-semibold">{title}</span></div><p className="text-[11px] leading-5 text-muted-foreground">{text}</p></div>)}</div></Panel>
  </div>;
}

function ForensicsView() {
  const headers = [["From","Microsoft Security <billing@micr0soft-secure.com>"],["Reply-To","verify-account@secure-login.cc"],["Return-Path","bounce@relay-bulk.ru"],["Message-ID","<202609170844.8812@relay-bulk.ru>"],["Received","mx2.mail-east.net → mail.byteforce.local"],["Sending IP","185.220.101.42"],["Timestamp","17 Sep 2026 · 08:44:19 UTC"]];
  return <><PageTitle eyebrow="Evidence / Deep Inspection" title="Email Forensics" action={<Button variant="outline"><Download />EXPORT HEADERS</Button>} /><div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]"><Panel title="Header Analysis" icon={FileSearch}><div className="divide-y divide-border">{headers.map(([k,v])=><div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[140px_1fr]"><span className="font-mono text-[10px] uppercase text-muted-foreground">{k}</span><span className="break-all font-mono text-xs">{v}</span></div>)}</div></Panel><Panel title="Authentication" icon={LockKeyhole}><div className="space-y-3 p-4">{[["SPF","FAIL","IP not authorized","red"],["DKIM","SUSPICIOUS","Signature missing","amber"],["DMARC","FAIL","Alignment rejected","red"]].map(([a,b,c,t])=><div key={a} className="rounded border border-border p-4"><div className="flex justify-between"><span className="font-semibold">{a}</span><Badge tone={t as "red"|"amber"}>{b}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{c}</p></div>)}</div></Panel></div><UrlAnalysis /><Timeline /></>;
}

function UrlAnalysis() { return <Panel title="URL & Redirect Chain Analysis" icon={Link2} className="mt-4" action={<Badge tone="red">Malicious</Badge>}><div className="p-4"><div className="grid gap-3 text-xs md:grid-cols-3">{[["Original URL","hxxps://microsoft-billing[.]support/verify"],["Final destination","login-ms365.secure-auth.cc/session"],["Domain age","6 days"],["Reputation","Malicious · 18 engines"],["SSL status","Valid DV · Issued 2 days ago"],["Sandbox behavior","Credential form + exfiltration"]].map(([k,v])=><div className="rounded border border-border bg-muted/25 p-3" key={k}><div className="mb-2 font-mono text-[9px] uppercase text-muted-foreground">{k}</div><div className="break-all">{v}</div></div>)}</div><div className="mt-4 flex flex-col items-stretch gap-2 md:flex-row md:items-center">{["Short URL","Tracking Host","Cloud Proxy","Credential Kit"].map((n,i)=><div key={n} className="contents"><div className={`flex-1 rounded border p-3 text-center font-mono text-[10px] ${i===3?"border-destructive/40 bg-danger-muted text-destructive":"border-primary/25 bg-cyan-muted text-cyan"}`}>{n}<div className="mt-1 text-[9px] text-muted-foreground">{["bit.ly","click-route.net","cdn-edge.site","secure-auth.cc"][i]}</div></div>{i<3&&<ChevronRight className="mx-auto size-4 rotate-90 text-muted-foreground md:rotate-0" />}</div>)}</div></div></Panel> }

function GeoMap() { return <div className="relative h-[390px] overflow-hidden rounded border border-border bg-cyan-muted/30"><div className="absolute inset-0 opacity-40" style={{backgroundImage:"radial-gradient(circle at 15% 44%, var(--primary) 0 1px, transparent 2px), radial-gradient(circle at 53% 35%, var(--primary) 0 1px, transparent 2px), radial-gradient(circle at 78% 58%, var(--primary) 0 1px, transparent 2px)",backgroundSize:"18px 18px"}}/><div className="absolute left-[12%] top-[25%] h-[36%] w-[25%] rounded-[45%] border border-primary/25 bg-primary/5"/><div className="absolute left-[39%] top-[20%] h-[22%] w-[13%] rounded-[45%] border border-primary/25 bg-primary/5"/><div className="absolute left-[46%] top-[42%] h-[38%] w-[18%] rounded-[48%] border border-primary/25 bg-primary/5"/><div className="absolute left-[60%] top-[24%] h-[34%] w-[28%] rounded-[45%] border border-primary/25 bg-primary/5"/>{[["22%","41%","Bucharest · 94"],["48%","34%","Frankfurt · 76"],["70%","48%","Moscow · 82"],["78%","68%","Singapore · 68"]].map(([l,t,n],i)=><div key={n} className="absolute" style={{left:l,top:t}}><span className={`block size-3 rounded-full ${i===0?"bg-destructive":"bg-warning"} signal-pulse`} /><span className="absolute left-4 top-[-8px] whitespace-nowrap rounded border border-border bg-popover px-2 py-1 font-mono text-[9px]">{n}</span></div>)}</div> }
function GeoView() { return <><PageTitle eyebrow="Intelligence / Global Infrastructure" title="IP & Geolocation Intelligence" action={<Badge>4 active nodes</Badge>} /><div className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]"><Panel title="Suspicious Infrastructure Map" icon={Globe2}><div className="p-4"><GeoMap /></div></Panel><Panel title="Selected IP" icon={MapPin}><div className="p-5"><div className="mb-5 flex items-center justify-between"><span className="font-mono text-lg text-cyan">185.220.101.42</span><Badge tone="red">94 / 100</Badge></div>{[["Country","Romania"],["City","Bucharest"],["ISP","M247 Europe SRL"],["ASN","AS9009"],["Coordinates","44.4268, 26.1025"],["Reputation","Known phishing host"],["Last observed","2 minutes ago"]].map(([k,v])=><div className="flex justify-between border-b border-border py-3 text-xs" key={k}><span className="text-muted-foreground">{k}</span><span className="text-right font-mono">{v}</span></div>)}</div></Panel></div></> }

function IntelView() { return <><PageTitle eyebrow="External Signals / Correlation" title="Threat Intelligence" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["VirusTotal","18 / 92 engines","Malicious",ShieldAlert],["IP Intelligence","7 abuse reports","High risk",Globe2],["Domain Intelligence","Registered 6 days ago","Suspicious",Radar],["Threat Databases","4 exact matches","Confirmed",Binary]].map(([a,b,c,I])=><Panel key={a as string} title={a as string} icon={I as ComponentType<{className?:string}>}><div className="p-5"><div className="text-xl font-semibold">{b as string}</div><div className="mt-3"><Badge tone="red">{c as string}</Badge></div></div></Panel>)}</div><Panel title="Matched Indicators" icon={Fingerprint} className="mt-4"><div className="grid gap-3 p-4 md:grid-cols-3">{[["Malware indicator","HTML/Phish.MS365.A","Known credential kit"],["Infrastructure","AS9009 / M247 Europe","Bulletproof hosting overlap"],["Campaign match","PHISH-2026-042","94% fingerprint similarity"]].map(([a,b,c])=><div key={a} className="rounded border border-border p-4"><div className="font-mono text-[9px] uppercase text-primary">{a}</div><div className="mt-2 text-sm font-semibold">{b}</div><div className="mt-1 text-xs text-muted-foreground">{c}</div></div>)}</div></Panel></> }

function GraphView() { const nodes=[["EMAIL","7%","46%","red"],["SENDER","25%","20%","cyan"],["DOMAIN","27%","70%","cyan"],["URL","50%","44%","red"],["IP","70%","20%","amber"],["LOCATION","70%","70%","cyan"],["CAMPAIGN","88%","45%","red"]]; return <><PageTitle eyebrow="Attack DNA / PHISH-2026-042" title="Investigation Graph" action={<Badge tone="red">18 related emails</Badge>} /><Panel title="Interactive Relationship Graph" icon={Network} action={<div className="font-mono text-[9px] text-muted-foreground">SCROLL TO ZOOM · DRAG TO PAN</div>}><div className="relative h-[520px] overflow-hidden bg-cyan-muted/10"><svg className="absolute inset-0 h-full w-full" aria-hidden="true"><line x1="10%" y1="47%" x2="27%" y2="22%" stroke="var(--border)"/><line x1="10%" y1="47%" x2="28%" y2="71%" stroke="var(--border)"/><line x1="28%" y1="22%" x2="51%" y2="45%" stroke="var(--primary)"/><line x1="28%" y1="71%" x2="51%" y2="45%" stroke="var(--primary)"/><line x1="51%" y1="45%" x2="71%" y2="22%" stroke="var(--destructive)"/><line x1="71%" y1="22%" x2="71%" y2="71%" stroke="var(--border)"/><line x1="71%" y1="22%" x2="89%" y2="46%" stroke="var(--destructive)"/><line x1="71%" y1="71%" x2="89%" y2="46%" stroke="var(--destructive)"/></svg>{nodes.map(([n,l,t,tone])=><div key={n} className={`absolute grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-center font-mono text-[10px] shadow-xl ${tone==="red"?"border-destructive bg-danger-muted text-destructive":tone==="amber"?"border-warning bg-warning/10 text-warning":"border-primary bg-cyan-muted text-cyan"}`} style={{left:l,top:t}}><div><CircleDot className="mx-auto mb-1 size-4" />{n}</div></div>)}</div></Panel><Panel title="Attack DNA Fingerprint" icon={Fingerprint} className="mt-4"><div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-6">{["Sender pattern 96%","Domain kit 92%","IP cluster 88%","URL path 97%","TLS fingerprint 81%","Behavior 94%"].map(x=><div className="rounded border border-primary/20 bg-cyan-muted p-3 text-center font-mono text-[10px] text-cyan" key={x}>{x}</div>)}</div></Panel></> }

function AlertsView() { return <><PageTitle eyebrow="Detection Queue / Real Time" title="Security Alerts" action={<Badge tone="red">3 untriaged</Badge>} /><div className="space-y-3">{[["CRITICAL","Credential phishing website detected","Email gateway","Credential Phishing","94","Block domain, reset exposed credentials"],["HIGH","Suspicious sender infrastructure detected","IP Intelligence","Malicious Infrastructure","87","Quarantine related messages"],["MEDIUM","Domain reputation requires investigation","Domain Intelligence","Newly Registered Domain","64","Monitor and enrich indicator"]].map((r,i)=><div key={r[1]} className="cyber-card grid gap-4 rounded-md p-4 lg:grid-cols-[120px_1.6fr_1fr_1fr_70px_1.4fr]"><div><Badge tone={i===0?"red":i===1?"amber":"cyan"}>{r[0]}</Badge><div className="mt-2 font-mono text-[9px] text-muted-foreground">09:{String(4+i*7).padStart(2,"0")} UTC</div></div><div className="text-sm font-semibold">{r[1]}</div><div className="text-xs text-muted-foreground">{r[2]}</div><div className="text-xs">{r[3]}</div><div className="font-mono text-destructive">{r[4]}</div><div className="text-xs text-muted-foreground">{r[5]}</div></div>)}</div></> }

function Timeline() { const events=["Email Received","Header Parsed","Suspicious URL Detected","IP Resolved","Geolocation Identified","Threat Intelligence Match","Sandbox Execution","Attack Campaign Correlated","Investigation Completed"]; return <Panel title="Investigation Timeline" icon={Clock3} className="mt-4"><div className="flex overflow-x-auto p-5">{events.map((e,i)=><div className="flex min-w-[145px] items-center" key={e}><div><div className={`mb-2 size-3 rounded-full ${i===events.length-1?"bg-destructive":"bg-primary"}`} /><div className="max-w-28 text-[10px] font-medium">{e}</div><div className="mt-1 font-mono text-[9px] text-muted-foreground">+{i*0.42}s</div></div>{i<events.length-1&&<div className="mx-2 h-px flex-1 bg-border" />}</div>)}</div></Panel> }

function ReportsView() { return <><PageTitle eyebrow="Case BF6-2026-0917 / Final" title="Forensic Investigation Report" action={<div className="flex flex-wrap gap-2"><Button variant="outline"><FileCheck2 />GENERATE REPORT</Button><Button variant="outline"><Download />EXPORT PDF</Button><Button variant="outline"><Download />EVIDENCE</Button><Button><Share2 />SHARE</Button></div>} /><div className="grid gap-4 xl:grid-cols-[1.3fr_.7fr]"><Panel title="Report Contents" icon={FileCheck2}><div className="grid gap-2 p-4 sm:grid-cols-2">{["Executive Summary","Email Information","Threat Classification","Risk Score","Header Analysis","URL Analysis","Attachment Analysis","IP Intelligence","Geolocation","Threat Intelligence","Attack Timeline","Evidence","Recommendations"].map((x,i)=><div className="flex items-center gap-3 rounded border border-border p-3 text-xs" key={x}><span className="grid size-6 place-items-center rounded bg-primary/10 font-mono text-[9px] text-primary">{String(i+1).padStart(2,"0")}</span>{x}<ShieldCheck className="ml-auto size-3 text-success" /></div>)}</div></Panel><Panel title="Evidence Integrity" icon={Fingerprint}><div className="p-5"><div className="rounded border border-success/25 bg-success/5 p-4"><Badge tone="green">Verified</Badge><div className="mt-3 text-sm font-semibold">Chain of Custody Intact</div><p className="mt-2 text-xs leading-5 text-muted-foreground">All artifacts are timestamped, hashed, and independently verifiable.</p></div><div className="mt-4"><div className="font-mono text-[9px] uppercase text-muted-foreground">Evidence Hash · SHA-256</div><div className="mt-2 break-all rounded bg-muted p-3 font-mono text-[10px] text-cyan">98d4c7f5a2e81b29c042d5f778e64530fbde45710823a9de557d8f02b916a71c</div></div></div></Panel></div><Timeline /><Panel title="Intended Technology Stack" icon={Binary} className="mt-4"><div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-5">{[["Frontend","React.js · Tailwind CSS"],["Database","PostgreSQL · Neo4j"],["AI / ML","Python · Hugging Face · PyTorch"],["Geolocation","GeoLite2 · IPinfo API"],["Security","SPF · DKIM · DMARC · VirusTotal"]].map(([a,b])=><div key={a}><div className="font-mono text-[9px] uppercase text-primary">{a}</div><div className="mt-2 text-xs text-muted-foreground">{b}</div></div>)}</div></Panel></> }

function SettingsView() { return <><PageTitle eyebrow="Platform / Configuration" title="Security Controls" /><div className="grid gap-4 md:grid-cols-2">{[["AI detection sensitivity","Aggressive","Optimized for SOC triage"],["Automated quarantine","Enabled","Risk score ≥ 80"],["Threat feeds","4 connected","All sources synchronized"],["Evidence retention","365 days","Immutable archive policy"]].map(([a,b,c])=><div className="cyber-card rounded-md p-5" key={a}><div className="flex items-center justify-between"><div className="text-sm font-semibold">{a}</div><Badge tone="green">{b}</Badge></div><div className="mt-2 text-xs text-muted-foreground">{c}</div></div>)}</div><Panel title="Sandbox Analysis" icon={ScanSearch} className="mt-4" action={<Badge tone="red">Malicious</Badge>}><div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">{[["Browser behavior","Fake Microsoft login rendered"],["Redirects","3 chained redirects"],["Network requests","14 outbound connections"],["DNS requests","6 domains resolved"],["Downloaded files","payload.js · 48 KB"],["JavaScript behavior","Credential capture + exfiltration"]].map(([a,b])=><div className="rounded border border-border p-4" key={a}><div className="font-mono text-[9px] uppercase text-muted-foreground">{a}</div><div className="mt-2 text-xs">{b}</div></div>)}</div></Panel></> }
