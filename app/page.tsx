"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Leg = { flight: string; from: string; to: string; departL: string; arriveL: string; departZ: string; arriveZ: string; block: string };
type Duty = { date: string; type: "flight"|"standby"|"nda"|"off"|"sim"|"training"|"leave"; title: string; report?: string; reportZ?: string; reportPlace?: string; end?: string; endZ?: string; total?: string; note?: string; legs?: Leg[] };

const duties: Duty[] = [
  {date:"2025-06-27",type:"sim",title:"REC SIM",report:"03:15",reportZ:"06:15",reportPlace:"Cefepra AEP",end:"08:15",endZ:"11:15",total:"00:00",note:"Trainee - REC SIM, Cefepra AEP"},
  {date:"2025-06-28",type:"sim",title:"Eficiencia",report:"03:15",reportZ:"06:15",reportPlace:"Cefepra AEP",end:"08:15",endZ:"11:15",total:"00:00",note:"Trainee - Eficiencia, Cefepra AEP"},
  {date:"2025-06-29",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  {date:"2025-06-30",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  ...Array.from({length:15},(_,i)=>({date:`2025-07-${String(i+1).padStart(2,"0")}`,type:"leave" as const,title:"VAC15 AC",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59",note:"Licencia anual"})),
  ...[16,17,18].map(d=>({date:`2025-07-${d}`,type:"off" as const,title:"R-OFF",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"})),
  {date:"2025-07-19",type:"flight",title:"4 vuelos",report:"06:00",reportZ:"09:00",reportPlace:"EZE",end:"16:41",endZ:"19:41",total:"07:16",note:"OP - (RS)",legs:[
    {flight:"FO5300",from:"EZE",to:"NQN",departL:"06:54",arriveL:"08:43",departZ:"09:54",arriveZ:"11:43",block:"01:49"},
    {flight:"FO5301",from:"NQN",to:"AEP",departL:"09:17",arriveL:"11:11",departZ:"12:17",arriveZ:"14:11",block:"01:54"},
    {flight:"FO5230",from:"AEP",to:"SDE",departL:"12:38",arriveL:"14:22",departZ:"15:38",arriveZ:"17:22",block:"01:44"},
    {flight:"FO5231",from:"SDE",to:"AEP",departL:"14:52",arriveL:"16:41",departZ:"17:52",arriveZ:"19:41",block:"01:49"}]},
  {date:"2025-07-20",type:"flight",title:"2 vuelos",report:"18:30",reportZ:"21:30",reportPlace:"AEP",end:"01:05",endZ:"04:05",total:"04:18",note:"Finaliza el 21 de julio · OP - (RS)",legs:[
    {flight:"FO5250",from:"AEP",to:"BRC",departL:"20:10",arriveL:"22:34",departZ:"23:10",arriveZ:"01:34",block:"02:24"},
    {flight:"FO5251",from:"BRC",to:"EZE",departL:"23:11",arriveL:"01:05",departZ:"02:11",arriveZ:"04:05",block:"01:54"}]},
  {date:"2025-07-22",type:"flight",title:"2 vuelos",report:"05:30",reportZ:"08:30",reportPlace:"EZE",end:"11:41",endZ:"14:41",total:"04:39",note:"OP - (RS)",legs:[
    {flight:"FO5240",from:"EZE",to:"BRC",departL:"06:28",arriveL:"09:06",departZ:"09:28",arriveZ:"12:06",block:"02:38"},{flight:"FO5241",from:"BRC",to:"AEP",departL:"09:40",arriveL:"11:41",departZ:"12:40",arriveZ:"14:41",block:"02:01"}]},
  {date:"2025-07-23",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  {date:"2025-07-24",type:"flight",title:"2 vuelos",report:"08:50",reportZ:"11:50",reportPlace:"AEP",end:"14:03",endZ:"17:03",total:"03:33",note:"OP - (RS)",legs:[{flight:"FO5210",from:"AEP",to:"TUC",departL:"09:58",arriveL:"11:46",departZ:"12:58",arriveZ:"14:46",block:"01:48"},{flight:"FO5211",from:"TUC",to:"AEP",departL:"12:18",arriveL:"14:03",departZ:"15:18",arriveZ:"17:03",block:"01:45"}]},
  {date:"2025-07-25",type:"flight",title:"2 vuelos",report:"16:00",reportZ:"19:00",reportPlace:"AEP",end:"22:22",endZ:"01:22",total:"04:15",note:"OP - (RS)",legs:[{flight:"FO5180",from:"AEP",to:"JUJ",departL:"17:13",arriveL:"19:28",departZ:"20:13",arriveZ:"22:28",block:"02:15"},{flight:"FO5181",from:"JUJ",to:"EZE",departL:"20:22",arriveL:"22:22",departZ:"23:22",arriveZ:"01:22",block:"02:00"}]},
  {date:"2025-07-26",type:"flight",title:"4 vuelos",report:"12:05",reportZ:"15:05",reportPlace:"AEP",end:"22:52",endZ:"01:52",total:"07:14",note:"OP - (RS)",legs:[{flight:"FO5150",from:"AEP",to:"CNQ",departL:"13:10",arriveL:"14:43",departZ:"16:10",arriveZ:"17:43",block:"01:33"},{flight:"FO5151",from:"CNQ",to:"AEP",departL:"15:09",arriveL:"16:36",departZ:"18:09",arriveZ:"19:36",block:"01:27"},{flight:"FO5162",from:"AEP",to:"SLA",departL:"18:04",arriveL:"20:21",departZ:"21:04",arriveZ:"23:21",block:"02:17"},{flight:"FO5163",from:"SLA",to:"EZE",departL:"20:55",arriveL:"22:52",departZ:"23:55",arriveZ:"01:52",block:"01:57"}]},
  {date:"2025-07-27",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  {date:"2025-07-28",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  {date:"2025-07-29",type:"flight",title:"4 vuelos",report:"05:30",reportZ:"08:30",reportPlace:"AEP",end:"14:14",endZ:"17:14",total:"05:43",note:"OP - (RS)",legs:[{flight:"FO5000",from:"AEP",to:"COR",departL:"06:25",arriveL:"07:51",departZ:"09:25",arriveZ:"10:51",block:"01:26"},{flight:"FO5001",from:"COR",to:"AEP",departL:"08:29",arriveL:"09:40",departZ:"11:29",arriveZ:"12:40",block:"01:11"},{flight:"FO5150",from:"AEP",to:"CNQ",departL:"10:35",arriveL:"12:03",departZ:"13:35",arriveZ:"15:03",block:"01:28"},{flight:"FO5151",from:"CNQ",to:"AEP",departL:"12:36",arriveL:"14:14",departZ:"15:36",arriveZ:"17:14",block:"01:38"}]},
  {date:"2025-07-30",type:"nda",title:"NDA",report:"00:00",reportZ:"03:00",end:"23:59",endZ:"02:59"},
  {date:"2025-07-31",type:"flight",title:"2 vuelos",report:"07:00",reportZ:"10:00",reportPlace:"AEP",end:"12:53",endZ:"15:53",total:"04:11",note:"OP - (RS)",legs:[{flight:"FO5160",from:"AEP",to:"SLA",departL:"08:09",arriveL:"10:22",departZ:"11:09",arriveZ:"13:22",block:"02:13"},{flight:"FO5161",from:"SLA",to:"AEP",departL:"10:55",arriveL:"12:53",departZ:"13:55",arriveZ:"15:53",block:"01:58"}]},
];

const icon: Record<Duty["type"],string>={flight:"✈",standby:"⌂",nda:"⌂",off:"❄",sim:"◉",training:"▣",leave:"☀"};
const weekdays=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const months=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const pad=(n:number)=>String(n).padStart(2,"0");
const key=(y:number,m:number,d:number)=>`${y}-${pad(m+1)}-${pad(d)}`;
type ClockMode="local"|"zulu";
const shiftZulu=(value:string|undefined,offset:number)=>{if(!value)return "—";const [h,m]=value.split(":").map(Number);return `${pad((h+offset+24)%24)}:${pad(m)}`};
const zoneLabel=(offset:number)=>offset===0?"UTC / Zulu":`UTC ${offset>0?"+":""}${offset}`;

function DayDetail({duty,onClose,offset,clock}:{duty:Duty,onClose:()=>void,offset:number,clock:ClockMode}){
  const day=new Date(duty.date+"T12:00:00");
  const local=(z:string|undefined)=>shiftZulu(z,offset);
  return <div className="scrim" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="detail" role="dialog" aria-modal="true" aria-label={`Detalle del ${day.getDate()} de ${months[day.getMonth()]}`}>
    <button className="close" onClick={onClose} aria-label="Cerrar detalle">×</button>
    <p className="eyebrow">{day.toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"})}</p>
    <div className="detail-title"><span className={`big-icon ${duty.type}`}>{icon[duty.type]}</span><div><h2>{duty.type==="flight"?"Jornada de vuelo":duty.title}</h2><p>{duty.type==="flight"?`${duty.legs?.length} tramos · ${duty.total} de vuelo`:duty.note||"Actividad programada"}</p></div></div>
    <div className="time-head"><span>{clock==="local"?`TU HORA · ${zoneLabel(offset)}`:"HORA ZULU"}</span><span>{clock==="local"?"ZULU":"TU HORA"}</span></div>
    <div className="timeline">
      <div className="point"><i/><div><small>PRESENTACIÓN {duty.reportPlace&&`· ${duty.reportPlace}`}</small><strong>{clock==="local"?local(duty.reportZ):duty.reportZ}</strong></div><b>{clock==="local"?`${duty.reportZ||"—"} Z`:local(duty.reportZ)}</b></div>
      {duty.legs?.map((leg,i)=><div className="point leg" key={leg.flight}><i/><div><small>TRAMO {i+1} · {leg.flight}</small><strong>{leg.from} <em>→</em> {leg.to}</strong><p>{clock==="local"?`${local(leg.departZ)} — ${local(leg.arriveZ)}`:`${leg.departZ} — ${leg.arriveZ} Z`} · Bloque {leg.block}</p></div><b>{clock==="local"?`${leg.departZ} — ${leg.arriveZ} Z`:`${local(leg.departZ)} — ${local(leg.arriveZ)}`}</b></div>)}
      <div className="point end"><i/><div><small>FINALIZACIÓN</small><strong>{clock==="local"?local(duty.endZ):duty.endZ}</strong></div><b>{clock==="local"?`${duty.endZ||"—"} Z`:local(duty.endZ)}</b></div>
    </div>
    {duty.note&&<div className="note"><span>OBSERVACIONES</span><p>{duty.note}</p></div>}
  </section></div>
}

function SettingsModal({clock,offset,onSave,onClose}:{clock:ClockMode,offset:number,onSave:(c:ClockMode,o:number)=>void,onClose:()=>void}){
  const [draftClock,setDraftClock]=useState(clock);const [draftOffset,setDraftOffset]=useState(offset);
  return <div className="scrim settings-scrim" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="settings-card" role="dialog" aria-modal="true" aria-label="Configuración de horario"><button className="close" onClick={onClose}>×</button><p className="eyebrow">PREFERENCIAS</p><h2>Cómo querés ver la hora</h2><p className="settings-intro">La elección se guarda en este dispositivo y se aplica al calendario, la agenda y los detalles.</p><div className="clock-options"><button className={draftClock==="local"?"selected":""} onClick={()=>setDraftClock("local")}><span>◷</span><div><b>Hora local</b><small>Convertida al huso que elijas</small></div><i>{draftClock==="local"?"✓":""}</i></button><button className={draftClock==="zulu"?"selected":""} onClick={()=>setDraftClock("zulu")}><span>Z</span><div><b>Hora Zulu</b><small>UTC, estándar aeronáutico</small></div><i>{draftClock==="zulu"?"✓":""}</i></button></div><label className="offset-field"><span>DESFASE DE TU HORA LOCAL</span><select value={draftOffset} onChange={e=>setDraftOffset(Number(e.target.value))}>{Array.from({length:27},(_,i)=>i-12).map(o=><option key={o} value={o}>{zoneLabel(o)}{o===-3?" · Buenos Aires":""}</option>)}</select><small>Ejemplo: Buenos Aires es UTC -3.</small></label><button className="save-settings" onClick={()=>{onSave(draftClock,draftOffset);onClose()}}>Guardar configuración</button></section></div>
}

function ImportModal({onClose,onImported}:{onClose:()=>void,onImported:(name:string)=>void}){
  const [state,setState]=useState<"idle"|"reading"|"done"|"error">("idle"); const [name,setName]=useState("");
  const read=async(file?:File)=>{if(!file)return; setName(file.name);setState("reading");try{const buf=await file.arrayBuffer();const head=new TextDecoder("latin1").decode(buf.slice(0,1024));if(!head.includes("%PDF"))throw Error();await new Promise(r=>setTimeout(r,700));setState("done");onImported(file.name)}catch{setState("error")}};
  return <div className="scrim"><section className="import-card" role="dialog" aria-modal="true"><button className="close" onClick={onClose}>×</button><span className="import-mark">⇧</span><h2>Importar roster</h2><p>Tu PDF se procesa en este dispositivo. No se sube a ningún servidor.</p>
    {state==="idle"&&<label className="drop"><input type="file" accept="application/pdf,.pdf" onChange={e=>read(e.target.files?.[0])}/><strong>Elegir PDF</strong><span>Formato inicial: Crew Daily Roster · ARMS</span></label>}
    {state==="reading"&&<div className="processing"><span/><strong>Analizando {name}</strong><small>Reconociendo jornadas y horarios…</small></div>}
    {state==="done"&&<div className="success"><b>✓</b><strong>Roster reconocido</strong><span>Se cargaron 35 actividades de la demostración ARMS.</span><button onClick={onClose}>Ver calendario</button></div>}
    {state==="error"&&<div className="error">No pudimos leer ese archivo. Verificá que sea un PDF válido.<button onClick={()=>setState("idle")}>Intentar de nuevo</button></div>}
    <small className="adapter">ARMS v1 · Preparado para sumar nuevos adaptadores de roster</small>
  </section></div>
}

export default function Home(){
  const [view,setView]=useState<"month"|"agenda">("month"); const [selected,setSelected]=useState<Duty|null>(null); const [showImport,setShowImport]=useState(false); const [showSettings,setShowSettings]=useState(false); const [source,setSource]=useState("Demostración ARMS"); const [filter,setFilter]=useState("all"); const [clock,setClock]=useState<ClockMode>("local"); const [offset,setOffset]=useState(-3);
  const y=2025,m=6; const first=(new Date(y,m,1).getDay()+6)%7; const days=new Date(y,m+1,0).getDate();
  const cellCount=first+days<=35?35:42; const cells=Array.from({length:cellCount},(_,i)=>{const d=i-first+1; if(d<1){const prev=new Date(y,m,d);return {n:prev.getDate(),date:key(prev.getFullYear(),prev.getMonth(),prev.getDate()),muted:true}} if(d>days){return {n:d-days,date:key(y,m+1,d-days),muted:true}} return {n:d,date:key(y,m,d),muted:false}});
  const shown=filter==="all"?duties:duties.filter(d=>d.type===filter); const byDate=new Map(shown.map(d=>[d.date,d]));
  const agenda=shown.filter(d=>d.date>="2025-07-16"&&d.date<="2025-07-31"); const next=duties.find(d=>d.date==="2025-07-19")!;
  const time=(d:Duty,which:"report"|"end"="report")=>clock==="zulu"?(which==="report"?d.reportZ:d.endZ)||"—":shiftZulu(which==="report"?d.reportZ:d.endZ,offset);
  useEffect(()=>{if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});const saved=localStorage.getItem("rumbo-clock");if(saved){try{const p=JSON.parse(saved);setClock(p.clock);setOffset(p.offset)}catch{}}},[]);
  const saveSettings=(c:ClockMode,o:number)=>{setClock(c);setOffset(o);localStorage.setItem("rumbo-clock",JSON.stringify({clock:c,offset:o}))};
  return <main>
    <header><a className="brand" href="#"><span>R</span><div><b>Rumbo</b><small>MI ROSTER</small></div></a><nav><button className={view==="month"?"active":""} onClick={()=>setView("month")}>Calendario</button><button className={view==="agenda"?"active":""} onClick={()=>setView("agenda")}>Agenda</button></nav><button className="settings-button" onClick={()=>setShowSettings(true)} aria-label="Configuración">⚙ <span>{clock==="zulu"?"Zulu":zoneLabel(offset)}</span></button><button className="import" onClick={()=>setShowImport(true)}>⇧ <span>Importar roster</span></button></header>
    <div className="shell">
      <section className="hero"><div><p className="eyebrow">JULIO · 2025</p><h1>Hola, Leandro <span>👋</span></h1><p className="sub">Tu mes, listo para despegar.</p></div><div className="source"><span className="pulse"/><div><b>{source}</b><small>Disponible sin conexión</small></div><button aria-label="Opciones">•••</button></div></section>
      <section className="next-card" onClick={()=>setSelected(next)}><div className="date-box"><small>SÁB</small><strong>19</strong><span>JUL</span></div><div className="next-main"><p>PRÓXIMA ACTIVIDAD · EN 3 DÍAS</p><h2><span className="plane">✈</span> EZE <em>→</em> NQN <i/> NQN <em>→</em> AEP <i/> +2</h2><div><span>◷ Presentación <b>{time(next)} {clock==="zulu"?"Z":""}</b></span><span>⌖ Ezeiza</span><span>◴ 7 h 16 min de vuelo</span></div></div><button aria-label="Abrir detalle">›</button></section>
      <div className="toolbar"><div><button aria-label="Mes anterior">‹</button><h2>Julio 2025</h2><button aria-label="Mes siguiente">›</button><button className="today">Hoy</button></div><div className="filters"><button className={filter==="all"?"on":""} onClick={()=>setFilter("all")}>Todos</button><button className={filter==="flight"?"on":""} onClick={()=>setFilter("flight")}>Vuelos</button><button className={filter==="nda"?"on":""} onClick={()=>setFilter("nda")}>NDA</button><button className={filter==="off"?"on":""} onClick={()=>setFilter("off")}>Descanso</button></div></div>
      {view==="month"?<section className="calendar"><div className="weekdays">{weekdays.map(w=><span key={w}>{w}</span>)}</div><div className="grid">{cells.map(c=>{const d=byDate.get(c.date);return <button key={c.date} className={`day ${c.muted?"muted":""} ${d?`has ${d.type}`:""}`} onClick={()=>d&&setSelected(d)}><span className="num">{c.n}</span>{d&&<div className="activity"><span className="activity-icon">{icon[d.type]}</span><b>{d.type==="flight"?`${d.legs?.length} vuelos`:d.title}</b>{d.type==="flight"&&<small>{time(d)}{clock==="zulu"?" Z":""} · {d.reportPlace}</small>}</div>}</button>})}</div></section>:
      <section className="agenda"><div className="agenda-head"><span>Fecha</span><span>Actividad</span><span>Presentación</span><span>Final</span></div>{agenda.map(d=>{const dt=new Date(d.date+"T12:00");return <button key={d.date} onClick={()=>setSelected(d)}><div className="agenda-date"><strong>{dt.getDate()}</strong><span>{weekdays[(dt.getDay()+6)%7]}</span></div><span className={`agenda-icon ${d.type}`}>{icon[d.type]}</span><div><b>{d.type==="flight"?d.legs?.map(l=>`${l.from}–${l.to}`).join(" · "):d.title}</b><small>{d.note||`${d.legs?.length||0} tramos · ${d.total}`}</small></div><time>{time(d)} <small>{clock==="zulu"?"Z":d.reportPlace}</small></time><time>{time(d,"end")}</time><i>›</i></button>})}</section>}
      <div className="legend"><span><i className="flight">✈</i> Vuelo</span><span><i className="standby">⌂</i> Guardia / STBY</span><span><i className="nda">⌂</i> NDA</span><span><i className="off">❄</i> OFF / R-OFF</span><span><i className="sim">◉</i> Simulador</span><span><i className="training">▣</i> Capacitación</span></div>
    </div>
    {selected&&<DayDetail duty={selected} onClose={()=>setSelected(null)} offset={offset} clock={clock}/>} {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImported={setSource}/>} {showSettings&&<SettingsModal clock={clock} offset={offset} onSave={saveSettings} onClose={()=>setShowSettings(false)}/>}<div className="offline-badge">✓ Funciona offline</div>
  </main>
}
