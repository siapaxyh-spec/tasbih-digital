const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const PRE=[
{id:'sub',ar:'سُبْحَانَ اللّٰه',lat:'Subhanallah',mean:'Maha Suci Allah',t:33},
{id:'ham',ar:'الْحَمْدُ لِلّٰه',lat:'Alhamdulillah',mean:'Segala puji bagi Allah',t:33},
{id:'akb',ar:'اللّٰهُ أَكْبَر',lat:'Allahu Akbar',mean:'Allah Maha Besar',t:33},
{id:'ist',ar:'أَسْتَغْفِرُ اللّٰه',lat:'Astaghfirullah',mean:'Aku memohon ampun kepada Allah',t:100},
{id:'tah',ar:'لَا إِلٰهَ إِلَّا اللّٰه',lat:'La ilaha illallah',mean:'Tiada tuhan selain Allah',t:100},
{id:'sha',ar:'اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّد',lat:'Shalawat Nabi',mean:'Ya Allah, limpahkan shalawat kepada Nabi Muhammad',t:100},
{id:'haw',ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰه',lat:'Hawqalah',mean:'Tiada daya dan kekuatan kecuali dengan Allah',t:100},
{id:'free',ar:'∞',lat:'Zikir bebas',mean:'Tanpa target',t:0}];
const KEY='tasbih.v1',CIRC=578.05;
const fmt=d=>d.toLocaleDateString('sv'),today=()=>fmt(new Date());
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S={active:'sub',custom:[],tg:{},c:{},r:{},tot:{},log:{},life:0,saved:[],set:{sound:1,vib:1,wake:0,any:0,theme:'zamrud'}};
try{S=Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
const items=()=>[...PRE,...S.custom],cur=()=>items().find(i=>i.id===S.active)||PRE[0],tgt=i=>S.tg[i.id]??i.t;

let ac;
function beep(f,d,v=.08,at=0){if(!S.set.sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+at;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d+.02)}catch{}}
const vib=p=>S.set.vib&&navigator.vibrate&&navigator.vibrate(p);
let tt;function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('show'),2200)}

function streak(){let k=0,d=new Date();if(!S.log[fmt(d)])d.setDate(d.getDate()-1);while(S.log[fmt(d)]>0){k++;d.setDate(d.getDate()-1)}return k}

function render(pop,full){const i=cur(),t=tgt(i),c=S.c[i.id]||0;
 $('#ar').textContent=i.ar;$('#lat').textContent=i.lat;$('#mean').textContent=i.mean;
 $('#num').innerHTML=String(c).padStart(4,'0').replace(/^0+(?=\d)/,m=>`<i>${m}</i>`);
 $('#ring').style.strokeDashoffset=full?0:t?CIRC*(1-c/t):CIRC;
 $('#tgt').textContent=t?'Target '+t:'Tanpa target';
 $('#sRound').textContent=S.r[i.id]||0;$('#sToday').textContent=S.log[today()]||0;$('#sLife').textContent=S.life;$('#sStreak').textContent=streak();
 $$('.tchip').forEach(b=>b.classList.toggle('on',+b.dataset.t===t));
 if(pop){const b=$('#btn');b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}}

function tap(){const i=cur(),t=tgt(i),d=today();
 S.c[i.id]=(S.c[i.id]||0)+1;S.tot[i.id]=(S.tot[i.id]||0)+1;S.log[d]=(S.log[d]||0)+1;S.life++;
 if(t&&S.c[i.id]>=t){S.c[i.id]=0;S.r[i.id]=(S.r[i.id]||0)+1;
  vib([60,40,140]);beep(660,.15,.12);beep(990,.35,.12,.15);toast('Satu putaran selesai ('+t+'×)');
  const w=$('#rw');w.classList.add('done');render(true,true);setTimeout(()=>{w.classList.remove('done');render()},600)}
 else{vib(12);beep(1000,.03);render(true)}
 save()}

function undo(){const i=cur(),t=tgt(i),d=today();
 if(S.c[i.id]>0)S.c[i.id]--;else if(S.r[i.id]>0&&t){S.r[i.id]--;S.c[i.id]=t-1}else return;
 S.tot[i.id]=Math.max(0,(S.tot[i.id]||0)-1);if(S.log[d]>0)S.log[d]--;S.life=Math.max(0,S.life-1);vib(8);render();save()}

const sheets={zk:list,st:stats,my:mine};
function open(id){(sheets[id]||(()=>0))();$$('.sheet').forEach(s=>s.classList.toggle('open',s.id==='sh-'+id));document.body.classList.add('sh')}
function close(){$$('.sheet').forEach(s=>s.classList.remove('open'));document.body.classList.remove('sh')}

function list(){$('#zl').innerHTML=items().map(i=>`<li data-id="${i.id}" class="${i.id===S.active?'on':''}"><div><div class="ar">${esc(i.ar)}</div><strong>${esc(i.lat)}</strong><small>${esc(i.mean)}</small></div>${i.custom?`<button class="x" data-del="${i.id}" aria-label="Hapus">✕</button>`:''}</li>`).join('')}
function stats(){const days=[...Array(7)].map((_,k)=>{const d=new Date();d.setDate(d.getDate()-6+k);return{l:d.toLocaleDateString('id-ID',{weekday:'short'}),n:S.log[fmt(d)]||0}}),mx=Math.max(1,...days.map(x=>x.n));
 $('#bars').innerHTML=days.map(x=>`<div class="bar"><span>${x.n}</span><b style="height:${Math.round(x.n/mx*90)}px"></b><span>${x.l}</span></div>`).join('');
 $('#per').innerHTML=items().filter(i=>S.tot[i.id]).map(i=>`<li><span>${esc(i.lat)}</span><b>${S.tot[i.id]}</b></li>`).join('')||'<li><small>Belum ada hitungan. Ketuk tombol besar untuk mulai.</small></li>'}
function mine(){$('#my').innerHTML=S.saved.map((s,k)=>`<li><div><strong>${esc(s.lat)}: ${s.n}×</strong><small>${esc(s.d)}</small></div><span><button class="x" data-load="${k}">Muat</button><button class="x" data-rm="${k}" aria-label="Hapus">✕</button></span></li>`).join('')||'<li><small>Belum ada sesi tersimpan. Tekan Simpan untuk menyimpan hitungan saat ini.</small></li>'}

function theme(){document.body.dataset.theme=S.set.theme;$$('[data-th]').forEach(b=>b.classList.toggle('on',b.dataset.th===S.set.theme));$('meta[name=theme-color]').content=getComputedStyle(document.body).getPropertyValue('--bg1').trim()}
let wl;async function wake(){try{if(S.set.wake&&'wakeLock'in navigator)wl=await navigator.wakeLock.request('screen');else if(wl){wl.release();wl=null}}catch{}}

$('.app').addEventListener('pointerdown',e=>{if(e.target.closest('#btn')||(S.set.any&&!e.target.closest('button,header,.zk')))tap()});
addEventListener('keydown',e=>{if(e.target.matches('input')||document.body.classList.contains('sh')){if(e.key==='Escape')close();return}
 if(e.code==='Space'||e.key==='Enter'){e.preventDefault();tap()}else if(e.key==='Backspace')undo()});
$('#ov').onclick=close;
$('#zk').onclick=()=>open('zk');$('#bSt').onclick=()=>open('st');$('#bSe').onclick=()=>open('se');$('#bMy').onclick=()=>open('my');
$('#bUndo').onclick=undo;
$('#bReset').onclick=()=>{if(confirm('Ulang hitungan zikir ini dari nol?')){const i=cur();S.c[i.id]=0;S.r[i.id]=0;render();save()}};
$('#bSave').onclick=()=>{const i=cur(),t=tgt(i),n=(t?(S.r[i.id]||0)*t:0)+(S.c[i.id]||0);if(!n)return toast('Belum ada hitungan');
 S.saved.unshift({id:i.id,lat:i.lat,n,d:new Date().toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})});save();toast('Tersimpan di Zikir saya')};
$$('.tchip').forEach(b=>b.onclick=()=>{S.tg[S.active]=+b.dataset.t;render();save()});
$('#tCus').onclick=()=>{const v=parseInt(prompt('Target hitungan (0 = tanpa target):',tgt(cur())),10);if(v>=0){S.tg[S.active]=v;render();save()}};
$('#zl').onclick=e=>{const x=e.target.closest('[data-del]'),li=e.target.closest('li');
 if(x){S.custom=S.custom.filter(i=>i.id!==x.dataset.del);if(S.active===x.dataset.del)S.active='sub';save();list();render()}
 else if(li){S.active=li.dataset.id;save();render();close()}};
$('#addZ').onclick=()=>{const lat=$('#nLat').value.trim();if(!lat)return toast('Isi nama zikir dulu');
 const t=parseInt($('#nT').value,10);S.custom.push({id:'c'+Date.now(),custom:1,lat,ar:$('#nAr').value.trim()||'﷽',mean:'Zikir buatan sendiri',t:t>=0?t:33});
 S.active=S.custom.at(-1).id;['#nLat','#nAr','#nT'].forEach(s=>$(s).value='');save();render();close()};
$('#my').onclick=e=>{const l=e.target.closest('[data-load]'),r=e.target.closest('[data-rm]');
 if(r){S.saved.splice(+r.dataset.rm,1);save();mine()}
 else if(l){const s=S.saved[+l.dataset.load],i=items().find(x=>x.id===s.id);if(!i)return toast('Zikir sudah dihapus');
  const t=tgt(i);S.active=i.id;S.c[i.id]=t?s.n%t:s.n;S.r[i.id]=t?Math.floor(s.n/t):0;save();render();close()}};
$$('[data-k]').forEach(el=>{el.checked=!!S.set[el.dataset.k];el.onchange=()=>{S.set[el.dataset.k]=+el.checked;save();wake()}});
$$('[data-th]').forEach(b=>b.onclick=()=>{S.set.theme=b.dataset.th;theme();save()});
$('#wipe').onclick=()=>{if(confirm('Hapus semua hitungan, riwayat, dan pengaturan?')){localStorage.removeItem(KEY);location.reload()}};
document.addEventListener('visibilitychange',()=>document.visibilityState==='visible'&&wake());

$('#date').textContent=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'});
theme();render();wake();
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
