/* Ibadah harian: tanggal Hijriah, salat, puasa, khatam, syukur, doa, kiblat, jadwal salat */
const BLN=['Muharram','Safar','Rabiul Awal','Rabiul Akhir','Jumadil Awal','Jumadil Akhir','Rajab','Syakban','Ramadan','Syawal','Zulkaidah','Zulhijah'];
const SL=['Subuh','Zuhur','Asar','Magrib','Isya'],TK=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
const DO=[
['Bangun tidur','الْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ','Segala puji bagi Allah yang menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dibangkitkan.'],
['Sebelum tidur','بِاسْمِكَ اللّٰهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ','Dengan nama-Mu ya Allah aku hidup dan aku mati.'],
['Sebelum makan','بِسْمِ اللّٰهِ','Dengan nama Allah.'],
['Sesudah makan','الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ','Segala puji bagi Allah yang memberi kami makan dan minum serta menjadikan kami muslim.'],
['Masuk masjid','اللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ','Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.'],
['Naik kendaraan','سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ','Maha Suci Allah yang menundukkan ini bagi kami, padahal kami tidak mampu menguasainya, dan kepada Tuhan kami kami akan kembali.'],
['Doa sapu jagat','رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ','Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.']];

/* Hijriah dan penanda puasa */
function hp(d){const p=Object.fromEntries(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(d).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return{d:+p.day,m:+p.month,y:parseInt(p.year||p.relatedYear)}}
const hs=d=>{const h=hp(d);return`${h.d} ${BLN[h.m-1]} ${h.y} H`};
function ph(d){const{d:x,m}=hp(d),w=d.getDay();
 if(m===9)return'Bulan Ramadan';if(m===10&&x===1)return'Idulfitri (haram berpuasa)';if(m===12&&x===10)return'Iduladha (haram berpuasa)';
 if(m===12&&x>=11&&x<=13)return'Hari tasyrik (dilarang berpuasa)';if(m===12&&x===9)return'Puasa Arafah';
 if(m===1&&x===9)return'Puasa Tasua';if(m===1&&x===10)return'Puasa Asyura';if(x>=13&&x<=15)return'Ayyamul Bidh (puasa sunnah)';
 return w===1?'Puasa sunnah Senin':w===4?'Puasa sunnah Kamis':''}
function slStreak(){let k=0,d=new Date();const f=x=>(S.sal?.[fmt(x)]||[]).filter(Boolean).length===5;if(!f(d))d.setDate(d.getDate()-1);while(f(d)){k++;d.setDate(d.getDate()-1)}return k}

/* Isi tiap tab */
let tb='sal',qBr=null,qOn=0;
const T={
sal:()=>{const a=S.sal?.[today()]||[0,0,0,0,0],jd=S.jd?.d===today()?S.jd.t:{};
 return`<ul>${SL.map((n,i)=>`<li data-sl="${i}" class="${a[i]?'on':''}"><span>${n}</span><b>${jd[TK[i]]||''}</b><span>${a[i]?'✓ sudah':'belum'}</span></li>`).join('')}</ul>
<p class="hint">Hari ini ${a.filter(Boolean).length}/5. Salat lengkap beruntun: ${slStreak()} hari.</p>
<button class="btn2" id="jdBtn">Ambil jadwal salat hari ini</button><p class="hint">Jadwal dari aladhan.com, butuh internet dan izin lokasi.</p>`},
pz:()=>{const d=today(),n=new Date(),t=new Date(n);t.setDate(n.getDate()+1);const mo=Object.keys(S.pz||{}).filter(k=>k.slice(0,7)===d.slice(0,7)).length;
 return`<ul><li data-pz class="${S.pz?.[d]?'on':''}"><span>Puasa hari ini</span><span>${S.pz?.[d]?'✓ berpuasa':'tidak'}</span></li></ul>
<p class="hint">Hari ini: ${ph(n)||'tidak ada penanda'}<br>Besok: ${ph(t)||'tidak ada penanda'}</p>
<ul><li><span>Utang puasa (qadha)</span><span><button class="x" data-qd="-1">−</button> <b>${S.qd||0}</b> <button class="x" data-qd="1">+</button></span></li><li><span>Puasa bulan ini</span><b>${mo}</b></li></ul>
<p class="hint">Tanggal Hijriah dihitung otomatis (Umm al-Qura) dan bisa berbeda sehari dari penetapan resmi di Indonesia.</p>`},
kh:()=>{const k=S.kh||(S.kh={n:0,days:30,start:today()}),left=604-k.n,el=Math.floor((new Date()-new Date(k.start+'T00:00'))/864e5),rem=Math.max(1,k.days-el);
 return`<div class="goal glass"><i style="width:${k.n/604*100}%"></i><span>${k.n}/604 halaman, ${(k.n/20).toFixed(1)} juz</span></div>
<p class="hint">Target khatam ${k.days} hari. Sisa ${left} halaman, sekitar ${Math.ceil(left/rem)} halaman per hari selama ${rem} hari lagi.</p>
<div class="chs"><button data-kh="1">+1 halaman</button><button data-kh="5">+5</button><button data-kh="20">+1 juz</button><button data-kh="-1">−1</button></div>
<button class="btn2" id="khSet">Atur target hari atau mulai ulang</button>`},
sy:()=>{const a=S.sy?.[today()]||['','',''];
 return`<p class="hint">Tiga hal yang kamu syukuri hari ini</p><div class="add">${[0,1,2].map(i=>`<input data-sy="${i}" value="${esc(a[i])}" placeholder="${i+1}.">`).join('')}</div>
<p class="hint">Sudah menulis ${Object.values(S.sy||{}).filter(x=>x.some(Boolean)).length} hari. Catatan hanya tersimpan di HP ini.</p>`},
dd:()=>`<ul>${DO.map(([t,a,m])=>`<li><div><strong>${t}</strong><div class="ar">${a}</div><small>${m}</small></div></li>`).join('')}</ul><p class="hint">Periksa kembali bacaan dengan guru atau ustaz.</p>`,
kb:()=>`<div class="qb"><div id="qAr">▲</div></div><p class="hint" id="qTxt">${qBr==null?'Tekan tombol untuk mencari arah kiblat.':'Arah kiblat '+Math.round(qBr)+'° dari utara.'}</p>
<button class="btn2" id="qBtn">Cari arah kiblat</button><p class="hint">Letakkan HP mendatar dan jauhkan dari benda logam atau magnet. Jika panah tidak stabil, kalibrasi kompas dengan gerakan angka 8.</p>`};

function draw(){$$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.t===tb));$('#ibp').innerHTML=T[tb]()}

/* Kiblat dan jadwal salat */
function qibla(){navigator.geolocation.getCurrentPosition(p=>{
 const r=Math.PI/180,la=p.coords.latitude*r,lo=p.coords.longitude*r,ka=21.4225*r,ko=39.8262*r;
 qBr=(Math.atan2(Math.sin(ko-lo)*Math.cos(ka),Math.cos(la)*Math.sin(ka)-Math.sin(la)*Math.cos(ka)*Math.cos(ko-lo))/r+360)%360;
 $('#qTxt').textContent='Arah kiblat '+Math.round(qBr)+'° dari utara.';
 const on=e=>{const h=e.webkitCompassHeading??(e.absolute?360-e.alpha:null),q=$('#qAr');if(h==null||!q)return;q.style.transform=`rotate(${qBr-h}deg)`};
 if(qOn)return;qOn=1;
 (async()=>{try{if(DeviceOrientationEvent.requestPermission&&await DeviceOrientationEvent.requestPermission()!=='granted')return}catch{}
  addEventListener('deviceorientationabsolute',on,true);addEventListener('deviceorientation',on,true)})();
},()=>toast('Izin lokasi diperlukan'))}
function jadwal(){toast('Mengambil lokasi...');navigator.geolocation.getCurrentPosition(async p=>{try{
 const j=await(await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}`)).json(),t=j.data.timings;
 S.jd={d:today(),t:Object.fromEntries(TK.map(k=>[k,String(t[k]).slice(0,5)]))};save();draw()}catch{toast('Gagal mengambil jadwal. Cek internet.')}},()=>toast('Izin lokasi diperlukan'))}

/* Pasang UI dan aksi */
document.body.insertAdjacentHTML('beforeend','<aside class="sheet" id="sh-ib"><h2>Ibadah harian</h2><div class="chs" id="seg">'+[['sal','Salat'],['pz','Puasa'],['kh','Quran'],['sy','Syukur'],['dd','Doa'],['kb','Kiblat']].map(([k,l])=>`<button data-t="${k}">${l}</button>`).join('')+'</div><div id="ibp"></div></aside>');
sheets.ib=draw;
$('#bIb').onclick=()=>open('ib');
$('#seg').onclick=e=>{const b=e.target.closest('[data-t]');if(b){tb=b.dataset.t;draw()}};
$('#ibp').onclick=e=>{const g=s=>e.target.closest(s);let x;
 if(x=g('[data-sl]')){const a=(S.sal??={})[today()]??=[0,0,0,0,0];a[x.dataset.sl]^=1;vib(10)}
 else if(g('[data-pz]')){const p=S.pz??={},d=today();p[d]?delete p[d]:p[d]=1}
 else if(x=g('[data-qd]'))S.qd=Math.max(0,(S.qd||0)+ +x.dataset.qd);
 else if(x=g('[data-kh]'))S.kh.n=Math.min(604,Math.max(0,S.kh.n+ +x.dataset.kh));
 else if(g('#khSet')){const k=S.kh,v=parseInt(prompt('Khatam dalam berapa hari?',k.days),10);if(v>0){k.days=v;k.start=today();if(confirm('Mulai ulang halaman dari 0?'))k.n=0}}
 else if(g('#jdBtn'))return jadwal();
 else if(g('#qBtn'))return qibla();
 else return;
 save();draw()};
$('#ibp').oninput=e=>{const i=e.target.dataset.sy;if(i==null)return;((S.sy??={})[today()]??=['','',''])[i]=e.target.value;save()};
$('#date').textContent=new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short'})+' · '+hs(new Date());
