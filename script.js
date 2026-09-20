const emojis=['👍','❤️','🔥','😂','😮','😢','🙏','👏','😍','💯','🎉','🤯'];
const selected=new Set();
const grid=document.querySelector('#emojiGrid');
const resultList=document.querySelector('#resultList');
let seconds=0;

emojis.forEach(e=>{const b=document.createElement('button');b.className='emoji-btn';b.textContent=e;b.title='Pilih '+e;b.type='button';b.onclick=()=>{if(selected.has(e))selected.delete(e);else if(selected.size<5)selected.add(e);else return; b.classList.toggle('selected',selected.has(e));};grid.appendChild(b)});
setInterval(()=>{seconds++;document.querySelector('#timer').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')},1000);

function setNotice(message, bad=false){const n=document.querySelector('#notice');n.textContent=message;n.classList.toggle('error',bad)}
function renderResults(data){
  const d=data?.data || {};
  const requested=Number(d.requested ?? 0), succeeded=Number(d.succeeded ?? 0), failed=Number(d.failed ?? 0);
  document.querySelector('#total').textContent=succeeded;
  resultList.innerHTML=`<div class="result-row"><span class="reaction">✅</span><span>Requested</span><span class="count">${requested}</span></div><div class="result-row"><span class="reaction">🎯</span><span>Succeeded</span><span class="count">${succeeded}</span></div><div class="result-row"><span class="reaction">⚠️</span><span>Failed</span><span class="count">${failed}</span></div>`;
}

document.querySelector('#execute').onclick=async()=>{
 const button=document.querySelector('#execute');
 const url=document.querySelector('#channel').value.trim();
 const manual=document.querySelector('#manual').value.trim();
 let chosen=[...selected]; if(manual) chosen.push(...[...manual].filter(x=>![' ','\n'].includes(x)));
 chosen=[...new Set(chosen)].slice(0,5);
 if(!/^https?:\/\/((www\.)?whatsapp\.com|wa\.me)\/channel\//i.test(url)){setNotice('Masukkan URL WhatsApp Channel yang valid.',true);return}
 if(!chosen.length){setNotice('Pilih minimal satu emoji.',true);return}
 button.disabled=true;button.classList.add('loading');button.innerHTML='Sending… <span>↗</span>';
 document.querySelector('#progressBar').style.width='35%';document.querySelector('#progressText').textContent='35%';setNotice('Menghubungkan ke BotWA API…');
 try{
  const response=await fetch('/.netlify/functions/react',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url,emojis:chosen})});
  const data=await response.json();
  if(!response.ok || data.status===false){throw new Error(data.error || 'Permintaan ditolak API.');}
  renderResults(data);document.querySelector('#progressBar').style.width='100%';document.querySelector('#progressText').textContent='100%';setNotice('Berhasil menerima respons dari BotWA API.');
 }catch(err){document.querySelector('#progressBar').style.width='0%';document.querySelector('#progressText').textContent='0%';setNotice(err.message,true);resultList.innerHTML='<p class="empty">Permintaan gagal. Periksa API key, URL, atau status layanan.</p>';}
 finally{button.disabled=false;button.classList.remove('loading');button.innerHTML='Execute reaction <span>↗</span>';}
};

document.querySelector('#reset').onclick=()=>{selected.clear();document.querySelectorAll('.emoji-btn').forEach(b=>b.classList.remove('selected'));document.querySelector('#channel').value='';document.querySelector('#manual').value='';document.querySelector('#total').textContent='0';document.querySelector('#progressBar').style.width='0%';document.querySelector('#progressText').textContent='0%';resultList.innerHTML='<p class="empty">Belum ada permintaan.<br>Pilih emoji lalu tekan Execute.</p>';setNotice('Siap menerima permintaan baru.');};
