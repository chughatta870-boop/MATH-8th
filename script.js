const $=s=>document.querySelector(s),W="M Ijaz · GHS 124/NB",PASS=33;
const nm=$('#sname');nm.value=localStorage.sname||'';nm.oninput=()=>localStorage.sname=nm.value;
function show(id){document.querySelectorAll('main>section').forEach(s=>s.hidden=s.id!=id);document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==id||(id=='quiz'&&b.dataset.t=='tests')));if(id=='results')hist();scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>show(b.dataset.t));
$('#mcq').innerHTML='<div class=card>30 MCQs – option tap karein</div>'+MCQ.map((m,i)=>`<div class=card><b>${i+1}. ${m[0]}</b>`+m[1].map((o,j)=>`<button class=opt data-i=${i} data-j=${j}>${'ABCD'[j]}) ${o}</button>`).join('')+'</div>').join('');
$('#mcq').onclick=e=>{const b=e.target.closest('.opt');if(!b)return;const p=b.parentNode;if(p.dataset.d)return;p.dataset.d=1;const a=MCQ[b.dataset.i][2];p.querySelectorAll('.opt').forEach((x,j)=>{if(j==a)x.classList.add('ok');else if(x==b)x.classList.add('bad')})};
const qa=(a,t)=>`<div class=card>${t} (tap question for answer)</div>`+a.map((x,i)=>`<details><summary>${i+1}. ${x[0]}</summary><div class=ans>${x[1]}</div></details>`).join('');
$('#short').innerHTML=qa(SHORT,'20 Short Questions');$('#long').innerHTML=qa(LONG,'15 Long Questions');
$('#tests').innerHTML='<div class=card>5 Test Papers · 30 marks each · Pass 33%</div>'+TESTS.map((t,i)=>`<button class=btn data-k=${i}>📝 Test Paper ${i+1}</button>`).join('');
$('#tests').onclick=e=>{const b=e.target.closest('[data-k]');if(b)start(+b.dataset.k)};
function start(k){if(!nm.value.trim()){alert('Pehle Student Name likhein');nm.focus();scrollTo(0,0);return}
const t=TESTS[k];let h=`<div class=card><b>Test Paper ${k+1}</b> – ${nm.value}<br>Part A: 10 MCQs (1 mark) · Part B: 5 Short (2 marks) · Part C: 2 Long (5 marks)</div>`;
t.m.forEach((q,i)=>h+=`<div class=card><b>${i+1}. ${MCQ[q][0]}</b>`+MCQ[q][1].map((o,j)=>`<label class=opt><input type=radio name=m${i} value=${j}> ${o}</label>`).join('')+'</div>');
[['s',t.s,SHORT,2],['l',t.l,LONG,5]].forEach(([c,ix,B,mx])=>ix.forEach((q,i)=>{let o='';for(let n=0;n<=mx;n++)o+=`<option>${n}</option>`;h+=`<details class=card><summary>${c=='s'?'Short':'Long'} ${i+1} (${mx} marks): ${B[q][0]}</summary><textarea rows=3 placeholder="Apna jawab (optional)"></textarea><div class=ans>${B[q][1]}</div>Apni marks / Marks given (0–${mx}): <select id=${c}${i}>${o}</select></details>`}));
$('#quiz').innerHTML=h+`<button class=btn id=sub>✅ Submit & Result Card</button>`;show('quiz');$('#sub').onclick=()=>fin(k)}
function fin(k){const t=TESTS[k];let sc=0;
t.m.forEach((q,i)=>{const c=document.querySelector(`input[name=m${i}]:checked`);if(c&&+c.value==MCQ[q][2])sc++});
t.s.forEach((q,i)=>sc+=+$('#s'+i).value);t.l.forEach((q,i)=>sc+=+$('#l'+i).value);
const tot=30,pct=Math.round(sc/tot*1000)/10,r={n:nm.value.trim(),t:k+1,sc,tot,pct,pass:pct>=PASS,d:new Date().toLocaleString()};
const a=JSON.parse(localStorage.res||'[]');a.unshift(r);localStorage.res=JSON.stringify(a.slice(0,50));card(r);$('#quiz').insertAdjacentHTML('beforeend',keyHTML(k))}
function card(r,box){const c=document.createElement('canvas');c.width=600;c.height=800;const x=c.getContext('2d');
x.fillStyle='#fff';x.fillRect(0,0,600,800);x.fillStyle='#0b6b3a';x.fillRect(0,0,600,130);x.fillRect(0,740,600,60);
x.fillStyle='#fff';x.textAlign='center';x.font='bold 34px sans-serif';x.fillText('RESULT CARD',300,60);x.font='22px sans-serif';x.fillText('Math 8 · Ch 5 Information Handling',300,100);
x.fillStyle='#172';x.font='bold 36px sans-serif';x.fillText(r.n,300,210);x.font='26px sans-serif';x.fillText('Test Paper '+r.t,300,260);
x.font='bold 90px sans-serif';x.fillText(r.sc+' / '+r.tot,300,400);x.font='bold 48px sans-serif';x.fillText(r.pct+'%',300,470);
x.fillStyle=r.pass?'#0a8a2f':'#d22';x.font='bold 70px sans-serif';x.fillText(r.pass?'PASS ✔':'FAIL ✘',300,590);
x.fillStyle='#555';x.font='22px sans-serif';x.fillText('Passing marks: '+PASS+'%',300,640);x.fillText(r.d,300,680);
x.fillStyle='#ffd';x.font='bold 26px sans-serif';x.fillText(W,300,780);
const q=$('#quiz'),d=box||q;if(!box)q.innerHTML='';const w=document.createElement('div');w.className='card';w.append(c);
const mk=(t,f,cl)=>{const b=document.createElement('button');b.className='btn '+(cl||'');b.textContent=t;b.onclick=f;w.append(b)};
const blob=()=>new Promise(o=>c.toBlob(o,'image/png')),fn=`result_${r.n.replace(/\W+/g,'_')}_T${r.t}.png`;
mk('⬇ Download',async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(await blob());a.download=fn;a.click()});
mk('📤 Share',async()=>{const f=new File([await blob()],fn,{type:'image/png'}),tx=`${r.n} – Math 8 Ch5 Test ${r.t}: ${r.sc}/${r.tot} (${r.pct}%) ${r.pass?'PASS':'FAIL'} · ${W}`;
try{if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text:tx});else if(navigator.share)await navigator.share({text:tx});else{await navigator.clipboard.writeText(tx);alert('Copied')}}catch(e){}},'alt');
d.prepend(w);if(!box)show('quiz')}
function hist(){const a=JSON.parse(localStorage.res||'[]');$('#results').innerHTML='<div class=card>Saved Results</div>'+(a.length?a.map((r,i)=>`<div class=card><b>${r.n}</b> · Test ${r.t}<br>${r.sc}/${r.tot} (${r.pct}%) <b class=${r.pass?'pass':'fail'}>${r.pass?'PASS':'FAIL'}</b><br><small>${r.d}</small><br><button class=btn data-i=${i}>Result Card</button></div>`).join(''):'<div class=card>Abhi koi result nahi.</div>');}
$('#results').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;const p=b.parentNode;if(p.querySelector('canvas'))return;card(JSON.parse(localStorage.res)[b.dataset.i],p)};
const L='ABCD',ak=m=>`${L[m[2]]}) ${m[1][m[2]]}`;
function keyHTML(k){const t=TESTS[k],c=(a,b)=>`<div class=card><b>${a}</b><div class=ans>${b}</div></div>`;
return c(`✅ Part A – MCQs Answer Key (Test ${k+1})`,t.m.map((q,i)=>`${i+1}. ${ak(MCQ[q])}`).join('\n'))+t.s.map((q,i)=>c(`Short ${i+1}: ${SHORT[q][0]}`,SHORT[q][1])).join('')+t.l.map((q,i)=>c(`Long ${i+1}: ${LONG[q][0]}`,LONG[q][1])).join('')}
function keyTxt(){let o='MATH 8 CH 5 – SOLVED ANSWER KEY\n'+W+'\n\nMCQs\n'+MCQ.map((m,i)=>`${i+1}. ${m[0]}\n   Ans: ${ak(m)}`).join('\n')+'\n\nSHORT QUESTIONS\n'+SHORT.map((x,i)=>`${i+1}. ${x[0]}\n   ${x[1]}`).join('\n')+'\n\nLONG QUESTIONS\n'+LONG.map((x,i)=>`${i+1}. ${x[0]}\n${x[1]}\n`).join('\n');return o}
$('#key').innerHTML='<div class=card><b>Solved Answer Key</b><br><button class=btn id=kd>⬇ Download Key (.txt)</button><button class="btn alt" id=ks>📤 Share</button></div><details open><summary>30 MCQs – Answer Key</summary><div class=ans>'+MCQ.map((m,i)=>`${i+1}. ${ak(m)}`).join('\n')+'</div></details><details><summary>20 Short Questions – Solved</summary><div class=ans>'+SHORT.map((x,i)=>`${i+1}. ${x[0]}\n→ ${x[1]}`).join('\n\n')+'</div></details><details><summary>15 Long Questions – Solved</summary><div class=ans>'+LONG.map((x,i)=>`${i+1}. ${x[0]}\n${x[1]}`).join('\n\n')+'</div></details>'+TESTS.map((t,i)=>`<details><summary>Test Paper ${i+1} – Answer Key</summary>${keyHTML(i)}</details>`).join('');
$('#kd').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([keyTxt()],{type:'text/plain'}));a.download='Math8_Ch5_Answer_Key.txt';a.click()};
$('#ks').onclick=async()=>{try{if(navigator.share)await navigator.share({title:'Math 8 Ch5 Answer Key',text:keyTxt()});else{await navigator.clipboard.writeText(keyTxt());alert('Copied')}}catch(e){}};
show(({mcq:1,short:1,long:1,tests:1,results:1})[new URLSearchParams(location.search).get('action')]?new URLSearchParams(location.search).get('action'):'mcq');
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
