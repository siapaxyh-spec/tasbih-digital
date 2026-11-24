/* Fitur tambahan: rangkaian zikir, target harian, kalender, lencana, tantangan 40 hari, kunci, layar gelap, backup, tema otomatis, bagikan */
PRE.splice(PRE.length-1,0,
{id:'sbh',ar:'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ',lat:'Subhanallahi wa bihamdih',mean:'Maha Suci Allah dan segala puji bagi-Nya',t:100},
{id:'bsm',ar:'بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',lat:'Bismillahilladzi la yadhurru',mean:'Dengan nama Allah yang tiada sesuatu pun membahayakan bersama nama-Nya',t:3},
{id:'rdh',ar:'رَضِيتُ بِاللّٰهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا',lat:'Radhitu billahi rabba',mean:'Aku ridha Allah sebagai Rabb, Islam sebagai agama, Muhammad sebagai nabi',t:3});
const CH=[{n:'Setelah salat',s:[['sub',33],['ham',33],['akb',33]]},{n:'Pagi dan petang',s:[['sbh',100],['bsm',3],['rdh',3]]},{n:'Istighfar dan shalawat',s:[['ist',100],['sha',100]]}];
const row=(k,l)=>`<label class="row"><span>${l}</span><input type="checkbox" data-x="${k}"></label>`;

/* Sisipkan UI */
$('.kpi').insertAdjacentHTML('beforebegin','<div class="goal glass" id="goal"><i id="gBar"></i><span id="gTxt"></span></div>');
$('.ic').insertAdjacentHTML('afterbegin','<button id="bBk" aria-label="Layar gelap">◐</button><button id="bLk" aria-label="Kunci"></button>');
document.body.insertAdjacentHTML('beforeend','<div id="blk"><small>Tahan lama untuk keluar</small></div>');
$('#sh-zk h2').insertAdjacentHTML('afterend','<h3>Rangkaian zikir</h3><div class="chs" id="chs">'+CH.map((c,k)=>`<button data-ch="${k}">${c.n}</button>`).join('')+'<button data-ch="-1">Berhenti</button></div><h3>Daftar zikir</h3>');
$('#sh-st h3').insertAdjacentHTML('beforebegin','<h3>35 hari terakhir</h3><div class="cal" id="cal"></div><h3>Lencana</h3><div id="bdg"></div><h3>Tantangan 40 hari</h3><div class="goal glass" id="cg"><i></i><span></span></div><button class="btn2" id="bShare">Bagikan pencapaian</button>');
$('#sh-se h3').insertAdjacentHTML('beforebegin',row('nolat','Sembunyikan latin dan arti')+'<label class="row"><span>Ukuran teks Arab</span><input type="range" id="sz" min="22" max="44"></label>');
$('.hint').insertAdjacentHTML('beforebegin','<button class="btn2" id="bIns" hidden>Pasang aplikasi</button><button class="btn2" id="bExp">Cadangkan data</button><button class="btn2" id="bImp">Pulihkan data</button><input type="file" id="fImp" accept=".json,application/json" hidden>');
$('.themes').insertAdjacentHTML('beforeend','<button data-th="kontras" aria-label="Kontras tinggi"></button><button data-th="auto" aria-label="Otomatis"></button>');

/* Target harian dan langkah rangkaian */
function xr(){const n=S.log[today()]||0,g=S.dg??1000;
 $('#gBar').style.width=g?Math.min(100,n/g*100)+'%':'0';$('#gTxt').textContent=g?`Target harian ${n}/${g}`:'Atur target harian';
 if(g&&n>=g&&S.gd!==today()){S.gd=today();save();toast('Target harian tercapai')}
 if(S.ch)$('#tgt').textContent+=` · Langkah ${S.ch.s+1}/${CH[S.ch.k].s.length}`}
const r0=render;render=(...a)=>{r0(...a);xr()};
$('#goal').onclick=()=>{const v=parseInt(prompt('Target zikir per hari (0 = nonaktif):',S.dg??1000),10);if(v>=0){S.dg=v;save();render()}};

/* Rangkaian zikir */
function go(s){const[id,n]=CH[S.ch.k].s[s];S.active=id;S.tg[id]=n;S.c[id]=0;save();render()}
const t0=tap;tap=()=>{const i=cur(),b=S.r[i.id]||0;t0();
 if(S.ch&&i.id===CH[S.ch.k].s[S.ch.s][0]&&(S.r[i.id]||0)>b)setTimeout(()=>{const c=S.ch;if(!c)return;
  if(++c.s>=CH[c.k].s.length){S.ch=null;save();render();toast('Rangkaian selesai')}else{go(c.s);toast('Lanjut: '+cur().lat)}},650)};
$('#chs').onclick=e=>{const b=e.target.closest('[data-ch]');if(!b)return;const k=+b.dataset.ch;
 if(k<0){S.ch=null;save();render();toast('Rangkaian dihentikan')}else{S.ch={k,s:0};go(0);toast('Mulai: '+CH[k].n)}close()};

/* Statistik: kalender, lencana, tantangan */
function best(){const ks=Object.keys(S.log).filter(k=>S.log[k]>0).sort();if(!ks.length)return 0;let m=0,r=0,d=new Date(ks[0]+'T00:00');const e=new Date();while(d<=e){r=S.log[fmt(d)]>0?r+1:0;m=Math.max(m,r);d.setDate(d.getDate()+1)}return m}
function cal(){const D=[...Array(35)].map((_,k)=>{const d=new Date();d.setDate(d.getDate()-34+k);return S.log[fmt(d)]||0}),mx=Math.max(1,...D),b=best();
 $('#cal').innerHTML=D.map(n=>`<u style="opacity:${n?.25+.75*n/mx:.12}"></u>`).join('');
 $('#bdg').innerHTML=[['7 hari beruntun',b>=7],['30 hari beruntun',b>=30],['100 hari beruntun',b>=100],['1.000 zikir',S.life>=1000],['10.000 zikir',S.life>=10000]].map(([l,o])=>`<span class="b${o?' on':''}">${l}</span>`).join('');
 let n=0;if(S.cg){const d=new Date(S.cg+'T00:00'),e=new Date();for(let k=0;k<40&&d<=e;k++,d.setDate(d.getDate()+1))if(S.log[fmt(d)]>0)n++}
 $('#cg i').style.width=n/40*100+'%';$('#cg span').textContent=S.cg?`Tantangan: ${n}/40 hari (ketuk untuk ulang)`:'Mulai tantangan 40 hari (ketuk)'}
const s0=sheets.st;sheets.st=()=>{s0();cal()};
$('#cg').onclick=()=>{if(!S.cg||confirm('Mulai ulang tantangan dari hari ini?')){S.cg=today();save();cal()}};
$('#bShare').onclick=()=>{const c=document.createElement('canvas');c.width=c.height=1080;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,1080);
 g.addColorStop(0,'#0a4a35');g.addColorStop(1,'#021510');x.fillStyle=g;x.fillRect(0,0,1080,1080);x.textAlign='center';
 x.fillStyle='#e9c46a';x.font='600 64px Outfit,sans-serif';x.fillText('Tasbih Digital',540,200);x.font='800 260px Orbitron,monospace';x.fillText(S.log[today()]||0,540,560);
 x.fillStyle='#f1fbf5';x.font='48px Outfit,sans-serif';x.fillText('zikir hari ini',540,650);x.fillText(`${streak()} hari beruntun, total ${S.life}`,540,780);
 c.toBlob(async b=>{const f=new File([b],'tasbih.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]})}catch{}}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tasbih.png';a.click()}})};

/* Kunci dan layar gelap */
const lk=()=>{$('#bLk').textContent=S.lk?'🔒':'🔓'};
$('#bLk').onclick=()=>{S.lk=!S.lk;save();lk();toast(S.lk?'Terkunci':'Terbuka')};
document.addEventListener('click',e=>{if(S.lk&&e.target.closest('#bUndo,#bReset,#bSave,#bSe,.chips,#zk')){e.stopPropagation();e.preventDefault();toast('Terkunci. Ketuk ikon gembok untuk membuka')}},true);
const u0=undo;undo=()=>S.lk?toast('Terkunci'):u0();
let ht,lng;const blk=$('#blk');
$('#bBk').onclick=()=>blk.classList.add('on');
blk.onpointerdown=()=>{lng=0;ht=setTimeout(()=>{lng=1;blk.classList.remove('on');vib(40)},1000)};
blk.onpointerup=()=>{clearTimeout(ht);if(!lng)tap()};
blk.onpointercancel=blk.onpointerleave=()=>clearTimeout(ht);

/* Tampilan, tema otomatis, pengaturan */
function view(){document.documentElement.style.setProperty('--sz',(S.set.sz||30)+'px');document.body.classList.toggle('nolat',!!S.set.nolat)}
$$('[data-x]').forEach(el=>{el.checked=!!S.set[el.dataset.x];el.onchange=()=>{S.set[el.dataset.x]=+el.checked;save();view()}});
$('#sz').value=S.set.sz||30;$('#sz').oninput=e=>{S.set.sz=+e.target.value;save();view()};
theme=function(){const t=S.set.theme==='auto'?(matchMedia('(prefers-color-scheme:light)').matches?'gading':'zamrud'):S.set.theme;document.body.dataset.theme=t;
 $$('[data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===S.set.theme));$('meta[name=theme-color]').content=getComputedStyle(document.body).getPropertyValue('--bg1').trim()};
matchMedia('(prefers-color-scheme:light)').onchange=()=>S.set.theme==='auto'&&theme();
$$('[data-th=kontras],[data-th=auto]').forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.th;theme();save()});

/* Pasang aplikasi, cadangan, pembaruan */
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#bIns').hidden=false});
$('#bIns').onclick=async()=>{dp.prompt();await dp.userChoice;dp=null;$('#bIns').hidden=true};
$('#bExp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='tasbih-backup-'+today()+'.json';a.click()};
$('#bImp').onclick=()=>$('#fImp').click();
$('#fImp').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(!o||typeof o.log!=='object'||!o.set)throw 0;
 if(!confirm('Timpa data sekarang dengan cadangan ini?'))return;localStorage.setItem(KEY,JSON.stringify(o));location.reload()}catch{toast('File cadangan tidak valid')}})};
if(navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.addEventListener('updatefound',()=>{const w=r.installing;w.onstatechange=()=>{if(w.state==='installed'&&navigator.serviceWorker.controller){toast('Versi baru tersedia. Ketuk untuk memuat ulang');$('#toast').onclick=()=>location.reload()}}}));

/* Mulai */
const zq=new URLSearchParams(location.search).get('z');if(zq&&items().some(i=>i.id===zq)){S.active=zq;save()}
view();theme();lk();render();
