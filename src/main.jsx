import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Upload, Download, RotateCcw, Image as ImageIcon, UserRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import './style.css';

const SIZE = 1254;
const initial = { name: 'Your Name', role: 'Your Role / Title', company: 'Your Company' };
function roundedTopRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
function fitText(ctx, text, maxWidth, start, min=18, weight=700) {
  let size=start; do { ctx.font=`${weight} ${size}px Arial, Helvetica, sans-serif`; if(ctx.measureText(text).width<=maxWidth) break; size-=1; } while(size>min); return size;
}
function App() {
  const canvasRef = useRef(null); const baseRef = useRef(null); const photoRef = useRef(null);
  const [details,setDetails] = useState(initial); const [photo,setPhoto] = useState(null); const [zoom,setZoom] = useState(1); const [positionY,setPositionY] = useState(48); const [ready,setReady] = useState(false);
  const update=(key,value)=>setDetails(old=>({...old,[key]:value}));
  useEffect(()=>{ const img=new Image(); img.onload=()=>{baseRef.current=img;setReady(true)}; img.onerror=()=>setReady(false); img.src='/base-poster.png'; },[]);
  useEffect(()=>{ if(!ready || !canvasRef.current || !baseRef.current) return; const canvas=canvasRef.current; canvas.width=SIZE;canvas.height=SIZE; const ctx=canvas.getContext('2d'); ctx.clearRect(0,0,SIZE,SIZE);ctx.drawImage(baseRef.current,0,0,SIZE,SIZE);
    // Always cover the template portrait first, so the original model never appears on page load.
    // The uploaded mentor photo is drawn on top only after a photo has been selected.
    const x=718, y=245, w=428, h=516;
    ctx.save();
    roundedTopRect(ctx,x,y,w,h,28);
    ctx.clip();
    ctx.fillStyle='#c8d8c4';
    ctx.fillRect(x,y,w,h);
    if(photoRef.current){
      const img=photoRef.current;
      const scale=Math.max(w/img.width,h/img.height)*zoom;
      const dw=img.width*scale, dh=img.height*scale;
      const dx=x+(w-dw)/2;
      const dy=y+(h-dh)*(positionY/100);
      ctx.drawImage(img,dx,dy,dw,dh);
    }
    ctx.restore();
    // Clean card overlay keeps editable text crisp and prevents the template placeholder from showing through.
    ctx.save(); roundRect(ctx,713,755,437,171,30);ctx.fillStyle='#fffaf0';ctx.fill();ctx.restore();
    ctx.fillStyle='#064633'; const name=(details.name||'Your Name').trim(); fitText(ctx,name,380,38,20,700); ctx.font=`700 ${fitText(ctx,name,380,38,20,700)}px Arial, Helvetica, sans-serif`;ctx.fillText(name,746,809);
    const role=(details.role||'Your Role / Title').trim();ctx.font=`400 ${fitText(ctx,role,380,26,17,400)}px Arial, Helvetica, sans-serif`;ctx.fillText(role,747,850);
    // Simple building mark and company name, aligned to the original card.
    ctx.save();ctx.fillStyle='#064633';ctx.fillRect(748,872,9,25);ctx.fillRect(760,866,10,31);ctx.fillRect(773,875,8,22);ctx.fillStyle='#fffaf0';ctx.fillRect(751,877,3,4);ctx.fillRect(751,885,3,4);ctx.fillRect(763,872,3,4);ctx.fillRect(769,872,3,4);ctx.fillRect(763,881,3,4);ctx.fillRect(769,881,3,4);ctx.restore();
    const company=(details.company||'Your Company').trim();ctx.font=`400 ${fitText(ctx,company,335,25,16,400)}px Arial, Helvetica, sans-serif`;ctx.fillStyle='#064633';ctx.fillText(company,798,895);
  },[ready,details,photo,zoom,positionY]);
  const uploadPhoto=e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){alert('Please choose a PNG or JPG image.');return;}if(file.size>12*1024*1024){alert('Please choose an image smaller than 12 MB.');return;}const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{if(photoRef.current?.src?.startsWith('blob:'))URL.revokeObjectURL(photoRef.current.src);photoRef.current=img;setPhoto(url)};img.src=url;};
  const download=()=>{const canvas=canvasRef.current;if(!canvas)return;canvas.toBlob(blob=>{if(!blob){alert('Could not export. Please try again.');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${(details.name||'mentor').trim().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'mentor'}-hacktoberfest-2026.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');};
  const reset=()=>{setDetails(initial);setPhoto(null);photoRef.current=null;setZoom(1);setPositionY(48);};
  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">H</span><span><strong>Mentor Poster Studio</strong><small>Hacktoberfest Hack Day · Hyderabad</small></span></a><div className="top-tag"><span className="status-dot"/> 2026 EVENT TEMPLATE</div></header>
    <section className="intro" id="top"><div><p className="eyebrow">YOUR POSTER. YOUR STORY.</p><h1>Make it <em>yours.</em></h1><p className="intro-copy">Upload your portrait, add your details, and download a share-ready mentor poster.</p></div><div className="step-pill"><CheckCircle2 size={17}/> Live preview <span>·</span> PNG export</div></section>
    <section className="workspace">
      <aside className="editor panel"><div className="panel-heading"><span className="heading-icon"><UserRound size={18}/></span><div><h2>Personalize your poster</h2><p>Changes update instantly in the preview.</p></div></div>
        <label className="upload-box"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadPhoto}/><span className="upload-icon"><Upload size={21}/></span><strong>{photo?'Photo uploaded — change it':'Upload your portrait'}</strong><small>JPG, PNG or WEBP · Up to 12 MB</small><span className="choose-file">Choose photo</span></label>
        {photo&&<div className="crop-controls"><label>Photo zoom <b>{zoom.toFixed(2)}×</b><input type="range" min="1" max="2.3" step="0.05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><label>Vertical position <b>{positionY}%</b><input type="range" min="0" max="100" value={positionY} onChange={e=>setPositionY(Number(e.target.value))}/></label></div>}
        <div className="form-heading"><span>01</span><div><strong>Mentor details</strong><small>These appear on your profile card.</small></div></div>
        <div className="form-grid"><label className="full">Full name<input value={details.name} onChange={e=>update('name',e.target.value)} placeholder="e.g. Harshitha Renati" maxLength={42}/></label><label className="full">Role / title<input value={details.role} onChange={e=>update('role',e.target.value)} placeholder="e.g. Software Engineer" maxLength={48}/></label><label className="full">Company / organization<input value={details.company} onChange={e=>update('company',e.target.value)} placeholder="e.g. Your company" maxLength={42}/></label></div>
        <div className="fixed-note"><ShieldCheck size={17}/><span><b>Event artwork stays unchanged.</b><br/>Only your portrait and profile-card details are replaced.</span></div>
        <div className="actions"><button className="reset-btn" onClick={reset}><RotateCcw size={16}/> Reset</button><button className="download-btn" onClick={download} disabled={!ready}><Download size={17}/> Download poster</button></div><p className="privacy-note"><ShieldCheck size={14}/> Your photo stays in your browser; it is not uploaded.</p>
      </aside>
      <section className="preview-section"><div className="preview-head"><div className="panel-heading"><span className="heading-icon preview-icon"><ImageIcon size={18}/></span><div><h2>Poster preview</h2><p>Original square artwork · 1254 × 1254 px</p></div></div><span className="live-pill"><i/> LIVE</span></div>
        <div className="canvas-frame">{ready?<canvas ref={canvasRef} className="poster-canvas" aria-label="Live mentor poster preview"/>:<div className="loading">Loading poster artwork…</div>}</div><div className="preview-footer"><span><CheckCircle2 size={15}/> High-resolution PNG</span><span>1:1 square format</span></div>
      </section>
    </section><footer className="footer">Made for the people who help builders grow <span>♥</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
