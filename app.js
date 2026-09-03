(function(){
'use strict';
window.openModal=function(id){const el=document.getElementById(id);if(el){el.classList.add('open');document.body.style.overflow='hidden';}};
window.closeModal=function(id){const el=document.getElementById(id);if(el){el.classList.remove('open');document.body.style.overflow='';}};
document.addEventListener('click',function(e){const close=e.target.closest('[data-close]');if(close){closeModal(close.getAttribute('data-close'));} if(e.target.classList.contains('modal-backdrop')){e.target.classList.remove('open');document.body.style.overflow='';}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow='';}});

const dr=document.getElementById('dateRange'), df=document.getElementById('dateFrom'), dt=document.getElementById('dateTo');
function fmt(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
function rangeFor(label){const now=new Date(2026,7,26); let a=new Date(now),b=new Date(now); const day=now.getDay();
 switch(label){case'Today':break;case'Yesterday':a.setDate(a.getDate()-1);b=new Date(a);break;case'This Week':a.setDate(a.getDate()-day);b=new Date(a);b.setDate(a.getDate()+6);break;case'Last Week':a.setDate(a.getDate()-day-7);b=new Date(a);b.setDate(a.getDate()+6);break;case'This Month':a=new Date(2026,7,1);b=new Date(2026,8,0);break;case'Last Month':a=new Date(2026,6,1);b=new Date(2026,7,0);break;case'This Quarter':a=new Date(2026,6,1);b=new Date(2026,8,30);break;case'Last Quarter':a=new Date(2026,3,1);b=new Date(2026,5,30);break;case'This Year':a=new Date(2026,0,1);b=new Date(2026,11,31);break;case'Last Year':a=new Date(2025,0,1);b=new Date(2025,11,31);break;case'Custom':return null;} return [a,b];}
function syncDates(){if(!dr||!df||!dt)return;const r=rangeFor(dr.value);const custom=dr.value==='Custom';df.disabled=!custom;dt.disabled=!custom;if(r){df.value=fmt(r[0]);dt.value=fmt(r[1]);}}
if(dr){dr.addEventListener('change',syncDates);syncDates();}

const rt=document.getElementById('requestType'), cat=document.getElementById('category');
const cats={"All":["All"],"Member Ticket":["All","Job Search Assistance","Resume Assistance","Career Coaching/Program Support","Registration Assistance","Password/Login Support","Account/Profile Updates","Technical Issues","General Questions"],"Health Plan":["All","General Questions","Technical Issues","Other"],"Program Team":["All","Registration/Account Help","Technical Issues","General questions","Other"]};
function fillCategory(){if(!rt||!cat)return;cat.innerHTML='';(cats[rt.value]||['All']).forEach(v=>{const o=document.createElement('option');o.textContent=v;cat.appendChild(o);});}
if(rt){rt.addEventListener('change',fillCategory);fillCategory();}
const state=document.getElementById('state'), owner=document.getElementById('owner');const owners={All:['All'],Virginia:['All','Sarah Patel','Rangam Team','Jessica Davis'],Florida:['All','Mike Kumar','Alicia Johnson'],Texas:['All','Laura Bennett','Amit Shah']};
function fillOwners(){if(!state||!owner)return;owner.innerHTML='';(owners[state.value]||['All']).forEach(v=>{const o=document.createElement('option');o.textContent=v;owner.appendChild(o);});}
if(state){state.addEventListener('change',fillOwners);fillOwners();}

function toggleCheck(checkId,fieldId){const c=document.getElementById(checkId),f=document.getElementById(fieldId);if(!c||!f)return;const sync=()=>f.classList.toggle('hidden',!c.checked);c.addEventListener('change',sync);sync();}
toggleCheck('notifyProgramTeamCheck','notifyProgramTeamFields');toggleCheck('newNotifyProgramTeamCheck','newNotifyProgramTeamFields');

const ce=document.getElementById('commEmailTab'),cs=document.getElementById('commSmsTab'),ep=document.getElementById('emailCompose'),sp=document.getElementById('smsCompose');
if(ce&&cs&&ep&&sp){const set=t=>{const email=t==='e';ce.classList.toggle('active',email);cs.classList.toggle('active',!email);ep.classList.toggle('hidden',!email);sp.classList.toggle('hidden',email);};ce.addEventListener('click',()=>set('e'));cs.addEventListener('click',()=>set('s'));}

const dz=document.getElementById('dropzone'),fi=document.getElementById('fileInput'),ab=document.getElementById('attachBody');
function addFiles(files){if(!ab)return;Array.from(files).forEach(f=>{const tr=document.createElement('tr');tr.innerHTML=`<td><a href="#">${f.name}</a></td><td>Anne Fahey</td><td>Just now</td><td>${Math.max(1,Math.round(f.size/1024))} KB</td><td><a href="#" class="delete-attachment-link" aria-label="Delete ${f.name}" title="Delete attachment">🗑</a></td>`;ab.prepend(tr);if(window.addTicketAudit)window.addTicketAudit('Attachment Added',null,null,'Anne Fahey',`Attachment "${f.name}" uploaded (${Math.max(1,Math.round(f.size/1024))} KB).`);});}
if(dz&&fi){dz.addEventListener('click',()=>fi.click());fi.addEventListener('change',()=>addFiles(fi.files));['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.style.background='#eef5ff';}));['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.style.background='';}));dz.addEventListener('drop',e=>addFiles(e.dataTransfer.files));}

let editRow=null,deleteRow=null;const nt=document.getElementById('notesTable');
function updateNotesCount(){if(!nt)return;const n=nt.tBodies[0].rows.length;const c=document.getElementById('notesCount'),s=document.getElementById('notesShowing');if(c)c.textContent=n;if(s)s.textContent=`Showing 1 to ${n} of ${n} entries`;}
if(nt){nt.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-note]'),del=e.target.closest('[data-delete-note]');if(edit){editRow=edit.closest('tr');document.getElementById('editNoteText').value=editRow.dataset.note;document.getElementById('editNoteCreator').value=editRow.dataset.creator;document.getElementById('editNoteTime').value=editRow.dataset.time;openModal('editNoteModal');}if(del){deleteRow=del.closest('tr');openModal('deleteNoteModal');}});}
const se=document.getElementById('saveEditNote');if(se)se.addEventListener('click',()=>{if(editRow){const oldValue=editRow.dataset.note||'';const v=document.getElementById('editNoteText').value.trim();if(v){editRow.dataset.note=v;editRow.querySelector('.note-cell').textContent=v;if(window.addTicketAudit)window.addTicketAudit('Ticketing Note Edited',null,null,'Anne Fahey',`Note updated from "${oldValue}" to "${v}".`);closeModal('editNoteModal');}}});
const cd=document.getElementById('confirmDeleteNote');if(cd)cd.addEventListener('click',()=>{if(deleteRow){const deletedNote=deleteRow.dataset.note||'';deleteRow.remove();deleteRow=null;updateNotesCount();if(window.addTicketAudit)window.addTicketAudit('Ticketing Note Deleted',null,null,'Anne Fahey',`Deleted note: ${deletedNote}`);closeModal('deleteNoteModal');}});

['createRequestTop','createRequestBottom'].forEach(id=>{const b=document.getElementById(id);if(b)b.addEventListener('click',()=>openModal('createSuccessModal'));});
const submitted=document.getElementById('createSubmittedOn');if(submitted&&!submitted.value)submitted.value='2026-08-26T20:30';
const nwrt=document.getElementById('newWorkRequestType'),nwc=document.getElementById('newWorkCategory');
function fillNewCats(){if(!nwrt||!nwc)return;const key=nwrt.value==='Member'?'Member Ticket':nwrt.value;const arr=(cats[key]||['All']).filter(x=>x!=='All');nwc.innerHTML='';arr.forEach(v=>{const o=document.createElement('option');o.textContent=v;nwc.appendChild(o);});}
if(nwrt){nwrt.addEventListener('change',fillNewCats);fillNewCats();}
const ny=document.getElementById('newEscYes'),nn=document.getElementById('newEscNo'),nco=document.getElementById('newChooseOwner'),nnb=document.getElementById('newNotifyOwnerBtn');
if(ny&&nn&&nco){const sync=()=>{const on=ny.checked;nco.classList.toggle('hidden',!on);if(nnb)nnb.style.display=on?'inline-flex':'none';};ny.addEventListener('change',sync);nn.addEventListener('change',sync);sync();}
// Request List: role-aware Due Date column.
const accessRole=(document.body.dataset.accessRole||'').toLowerCase();
if(accessRole!=='program-team'){
  document.querySelectorAll('.program-team-only').forEach(el=>el.classList.add('hidden'));
}

// Request List: quick candidate lookup by name, email, or phone.
const candidateSearch=document.getElementById('candidateSearch');
const requestTable=document.getElementById('requestListTable');
if(candidateSearch&&requestTable){
  const rows=Array.from(requestTable.tBodies[0].rows);
  const filterRows=()=>{
    const q=candidateSearch.value.trim().toLowerCase();
    rows.forEach(row=>{
      const haystack=(row.dataset.candidateSearch||row.textContent||'').toLowerCase();
      row.style.display=!q||haystack.includes(q)?'':'none';
    });
  };
  candidateSearch.addEventListener('input',filterRows);
  const params=new URLSearchParams(window.location.search);
  const candidate=params.get('candidate');
  if(candidate){
    candidateSearch.value=candidate;
    filterRows();
    const heading=document.querySelector('.topbar h1');
    const sub=heading && heading.nextElementSibling;
    if(heading) heading.textContent='Other Tickets';
    if(sub) sub.textContent=`All tickets previously created for ${candidate}.`;
  }
}

// Request List: sortable column headings.
if(requestTable){
  const body=requestTable.tBodies[0];
  requestTable.querySelectorAll('.sort-head').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const col=Number(btn.dataset.sortCol);
      const type=btn.dataset.sortType||'text';
      const nextDir=btn.dataset.direction==='asc'?'desc':'asc';
      requestTable.querySelectorAll('.sort-head').forEach(b=>{
        b.dataset.direction='';
        const indicator=b.querySelector('span');
        if(indicator) indicator.textContent='↕';
        b.closest('th')?.removeAttribute('aria-sort');
      });
      btn.dataset.direction=nextDir;
      const indicator=btn.querySelector('span');
      if(indicator) indicator.textContent=nextDir==='asc'?'↑':'↓';
      btn.closest('th')?.setAttribute('aria-sort',nextDir==='asc'?'ascending':'descending');

      const rows=Array.from(body.rows);
      rows.sort((a,b)=>{
        const ac=a.cells[col], bc=b.cells[col];
        let av=(ac?.dataset.sortValue ?? ac?.textContent ?? '').trim();
        let bv=(bc?.dataset.sortValue ?? bc?.textContent ?? '').trim();
        let cmp=0;
        if(type==='date'){
          const at=av?Date.parse(av):NaN, bt=bv?Date.parse(bv):NaN;
          if(Number.isNaN(at)&&Number.isNaN(bt)) cmp=0;
          else if(Number.isNaN(at)) cmp=1;
          else if(Number.isNaN(bt)) cmp=-1;
          else cmp=at-bt;
        }else if(/^\d+$/.test(av)&&/^\d+$/.test(bv)){
          cmp=Number(av)-Number(bv);
        }else{
          cmp=av.localeCompare(bv,undefined,{numeric:true,sensitivity:'base'});
        }
        return nextDir==='asc'?cmp:-cmp;
      });
      rows.forEach(row=>body.appendChild(row));
    });
  });
}

// Create Ticket form submitted from the Contact Us-style page.
const createTicketForm=document.getElementById('createTicketForm');
if(createTicketForm){
  createTicketForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(createTicketForm.reportValidity()) openModal('ticketCreatedModal');
  });
}

// Ticket List status history: match popup state to each row's Current Status.
document.querySelectorAll('.dynamic-history-eye').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const ticketId=btn.dataset.ticketId||'';
    const member=btn.dataset.memberName||'';
    const rawStatus=(btn.dataset.currentStatus||'New').trim();
    const owner=btn.dataset.currentOwner||'Program Team';
    const normalized=rawStatus.toLowerCase().replace(/\s+/g,'-');
    const isClosed=normalized==='closed';
    const isInProgress=normalized==='in-progress'||normalized==='inprogress';
    const isOnHold=normalized==='on-hold'||normalized==='onhold';

    const title=document.getElementById('dynamicHistoryTitle');
    const subtitle=document.getElementById('dynamicHistorySubtitle');
    const steps=document.getElementById('dynamicStatusSteps');
    const timeline=document.getElementById('dynamicStatusTimeline');
    if(!title||!subtitle||!steps||!timeline)return;

    title.textContent=`Ticket #${ticketId} — Status Updates`;
    subtitle.textContent=`${member} · Current: ${rawStatus}`;

    const stepData=[
      {label:'Recognize Ticket · New',state:'done'},
      {label:'Accepted · In Progress',state:isInProgress||isOnHold||isClosed?'current':''},
      {label:'Resolved · Closed',state:isClosed?'current':''}
    ];
    if(isClosed) stepData[1].state='done';
    if(normalized==='new'){stepData[0].state='current';stepData[1].state='';stepData[2].state='';}
    if(isOnHold){stepData[1].label='Accepted · On Hold';}
    steps.innerHTML=stepData.map(s=>`<div class="status-step ${s.state}">${s.label}</div>`).join('');

    let events=[];
    if(isClosed){
      events=[
        {title:'Closed',meta:`Resolved · Updated by ${owner}`,body:'Ticket completed and moved to Closed.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Work on the ticket was in progress.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isInProgress){
      events=[
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket is actively being worked on.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isOnHold){
      events=[
        {title:'On-Hold',meta:`Accepted · Updated by ${owner}`,body:'Ticket is temporarily on hold pending the next action.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket work began before being placed on hold.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else{
      events=[{title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}];
    }
    timeline.innerHTML=events.map(ev=>`<div class="status-event"><span class="timeline-dot"></span><div><strong>${ev.title}</strong><div class="muted">${ev.meta}</div><p>${ev.body}</p></div></div>`).join('');
    openModal('ticketHistoryModal');
  });
});

})();

// Manage Request: slide-in action drawers for escalation, reassignment, and rejection.
(function(){
  const backdrop=document.getElementById('drawerBackdrop');
  if(!backdrop) return;
  let activeDrawer=null;
  let lastTrigger=null;
  const openDrawer=(id,trigger)=>{
    const drawer=document.getElementById(id);
    if(!drawer) return;
    activeDrawer=drawer;
    lastTrigger=trigger||document.activeElement;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden','false');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    const focusable=drawer.querySelector('textarea,select,input,button');
    if(focusable) setTimeout(()=>focusable.focus(),0);
  };
  const closeDrawer=()=>{
    if(activeDrawer){activeDrawer.classList.remove('open');activeDrawer.setAttribute('aria-hidden','true');}
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    activeDrawer=null;
    const referralCheck=document.getElementById('referToItCheck');
    if(referralCheck && lastTrigger===referralCheck) referralCheck.checked=false;
    if(lastTrigger&&typeof lastTrigger.focus==='function') lastTrigger.focus();
  };
  [['escalateTechBtn','escalateDrawer'],['reassignBtn','reassignDrawer'],['rejectBtn','rejectDrawer']].forEach(([btnId,drawerId])=>{
    const btn=document.getElementById(btnId);
    if(btn) btn.addEventListener('click',()=>openDrawer(drawerId,btn));
  });

  // Working Details: show the Refer to IT guidance for reasons that may require IT support.
  const reasonSelect=document.getElementById('manageCategory');
  const referralPrompt=document.getElementById('technicalReferralPrompt');
  const referToItCheck=document.getElementById('referToItCheck');
  const syncTechnicalReferralPrompt=()=>{
    const referralReasons=['technical issues','password/login support','other'];
    const selectedReason=reasonSelect?reasonSelect.value.trim().toLowerCase():'';
    const showReferral=referralReasons.includes(selectedReason);
    if(referralPrompt) referralPrompt.style.display=showReferral?'block':'none';
    if(!showReferral && referToItCheck) referToItCheck.checked=false;
  };
  if(reasonSelect){
    reasonSelect.addEventListener('change',syncTechnicalReferralPrompt);
    syncTechnicalReferralPrompt();
  }
  if(referToItCheck){
    referToItCheck.addEventListener('change',()=>{
      if(referToItCheck.checked) openDrawer('escalateDrawer',referToItCheck);
    });
  }
  document.querySelectorAll('[data-close-drawer]').forEach(btn=>btn.addEventListener('click',closeDrawer));
  backdrop.addEventListener('click',closeDrawer);
  document.querySelectorAll('[data-save-drawer]').forEach(btn=>btn.addEventListener('click',()=>{
    const drawer=document.getElementById(btn.dataset.saveDrawer);
    if(!drawer) return;
    const required=Array.from(drawer.querySelectorAll('textarea,select')).filter(el=>el.closest('.field')?.querySelector('label')?.textContent.includes('*'));
    const invalid=required.find(el=>!el.value.trim());
    if(invalid){invalid.focus();invalid.setCustomValidity('This field is required.');invalid.reportValidity();setTimeout(()=>invalid.setCustomValidity(''),0);return;}
    closeDrawer();
  }));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeDrawer) closeDrawer();});
// Create Ticket form submitted from the Contact Us-style page.
const createTicketForm=document.getElementById('createTicketForm');
if(createTicketForm){
  createTicketForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(createTicketForm.reportValidity()) openModal('ticketCreatedModal');
  });
}

// Ticket List status history: match popup state to each row's Current Status.
document.querySelectorAll('.dynamic-history-eye').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const ticketId=btn.dataset.ticketId||'';
    const member=btn.dataset.memberName||'';
    const rawStatus=(btn.dataset.currentStatus||'New').trim();
    const owner=btn.dataset.currentOwner||'Program Team';
    const normalized=rawStatus.toLowerCase().replace(/\s+/g,'-');
    const isClosed=normalized==='closed';
    const isInProgress=normalized==='in-progress'||normalized==='inprogress';
    const isOnHold=normalized==='on-hold'||normalized==='onhold';

    const title=document.getElementById('dynamicHistoryTitle');
    const subtitle=document.getElementById('dynamicHistorySubtitle');
    const steps=document.getElementById('dynamicStatusSteps');
    const timeline=document.getElementById('dynamicStatusTimeline');
    if(!title||!subtitle||!steps||!timeline)return;

    title.textContent=`Ticket #${ticketId} — Status Updates`;
    subtitle.textContent=`${member} · Current: ${rawStatus}`;

    const stepData=[
      {label:'Recognize Ticket · New',state:'done'},
      {label:'Accepted · In Progress',state:isInProgress||isOnHold||isClosed?'current':''},
      {label:'Resolved · Closed',state:isClosed?'current':''}
    ];
    if(isClosed) stepData[1].state='done';
    if(normalized==='new'){stepData[0].state='current';stepData[1].state='';stepData[2].state='';}
    if(isOnHold){stepData[1].label='Accepted · On Hold';}
    steps.innerHTML=stepData.map(s=>`<div class="status-step ${s.state}">${s.label}</div>`).join('');

    let events=[];
    if(isClosed){
      events=[
        {title:'Closed',meta:`Resolved · Updated by ${owner}`,body:'Ticket completed and moved to Closed.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Work on the ticket was in progress.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isInProgress){
      events=[
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket is actively being worked on.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isOnHold){
      events=[
        {title:'On-Hold',meta:`Accepted · Updated by ${owner}`,body:'Ticket is temporarily on hold pending the next action.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket work began before being placed on hold.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else{
      events=[{title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}];
    }
    timeline.innerHTML=events.map(ev=>`<div class="status-event"><span class="timeline-dot"></span><div><strong>${ev.title}</strong><div class="muted">${ev.meta}</div><p>${ev.body}</p></div></div>`).join('');
    openModal('ticketHistoryModal');
  });
});

})();

// Manage Request: dependent Category options based on Request Type.
(function(){
  const rt=document.getElementById('manageRequestType');
  const cat=document.getElementById('manageCategory');
  if(!rt||!cat) return;
  const options={
    'Member':['Job Search Assistance','Resume Assistance','Career Coaching/Program Support','Registration Assistance','Password/Login Support','Account/Profile Updates','Technical Issues','General Questions'],
    'Health Plan':['General Questions','Technical Issues','Other'],
    'Program Team':['Registration/Account Help','Technical Issues','General questions','Other']
  };
  const fill=()=>{
    const previous=cat.value;
    cat.innerHTML='';
    (options[rt.value]||[]).forEach(v=>{const o=document.createElement('option');o.textContent=v;o.value=v;cat.appendChild(o);});
    if((options[rt.value]||[]).includes(previous)) cat.value=previous;
    else if(rt.value==='Member' && (options[rt.value]||[]).includes('Technical Issues')) cat.value='Technical Issues';
  };
  rt.addEventListener('change',fill);
  fill();
// Create Ticket form submitted from the Contact Us-style page.
const createTicketForm=document.getElementById('createTicketForm');
if(createTicketForm){
  createTicketForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(createTicketForm.reportValidity()) openModal('ticketCreatedModal');
  });
}

// Ticket List status history: match popup state to each row's Current Status.
document.querySelectorAll('.dynamic-history-eye').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const ticketId=btn.dataset.ticketId||'';
    const member=btn.dataset.memberName||'';
    const rawStatus=(btn.dataset.currentStatus||'New').trim();
    const owner=btn.dataset.currentOwner||'Program Team';
    const normalized=rawStatus.toLowerCase().replace(/\s+/g,'-');
    const isClosed=normalized==='closed';
    const isInProgress=normalized==='in-progress'||normalized==='inprogress';
    const isOnHold=normalized==='on-hold'||normalized==='onhold';

    const title=document.getElementById('dynamicHistoryTitle');
    const subtitle=document.getElementById('dynamicHistorySubtitle');
    const steps=document.getElementById('dynamicStatusSteps');
    const timeline=document.getElementById('dynamicStatusTimeline');
    if(!title||!subtitle||!steps||!timeline)return;

    title.textContent=`Ticket #${ticketId} — Status Updates`;
    subtitle.textContent=`${member} · Current: ${rawStatus}`;

    const stepData=[
      {label:'Recognize Ticket · New',state:'done'},
      {label:'Accepted · In Progress',state:isInProgress||isOnHold||isClosed?'current':''},
      {label:'Resolved · Closed',state:isClosed?'current':''}
    ];
    if(isClosed) stepData[1].state='done';
    if(normalized==='new'){stepData[0].state='current';stepData[1].state='';stepData[2].state='';}
    if(isOnHold){stepData[1].label='Accepted · On Hold';}
    steps.innerHTML=stepData.map(s=>`<div class="status-step ${s.state}">${s.label}</div>`).join('');

    let events=[];
    if(isClosed){
      events=[
        {title:'Closed',meta:`Resolved · Updated by ${owner}`,body:'Ticket completed and moved to Closed.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Work on the ticket was in progress.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isInProgress){
      events=[
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket is actively being worked on.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else if(isOnHold){
      events=[
        {title:'On-Hold',meta:`Accepted · Updated by ${owner}`,body:'Ticket is temporarily on hold pending the next action.'},
        {title:'In-Progress',meta:`Accepted · Updated by ${owner}`,body:'Ticket work began before being placed on hold.'},
        {title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}
      ];
    }else{
      events=[{title:'New',meta:'Recognize Ticket · System',body:'Initial status assigned when the ticket was created.'}];
    }
    timeline.innerHTML=events.map(ev=>`<div class="status-event"><span class="timeline-dot"></span><div><strong>${ev.title}</strong><div class="muted">${ev.meta}</div><p>${ev.body}</p></div></div>`).join('');
    openModal('ticketHistoryModal');
  });
});

})();


// Manage Ticket: save Program Team Notes and display them on Notes History.
(function(){
  const STORAGE_KEY='rangamworks_ticket_6492_program_team_notes';
  const noteInput=document.getElementById('programTeamNoteText');
  const addNoteBtn=document.getElementById('addProgramTeamNote');
  const notifyCheck=document.getElementById('notifyProgramTeamCheck');
  const notifyUser=document.getElementById('notifyProgramTeamUser');

  function loadSavedNotes(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}catch(e){return [];}
  }
  function saveNotes(items){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}catch(e){}
  }

  if(noteInput&&addNoteBtn){
    addNoteBtn.addEventListener('click',()=>{
      const text=noteInput.value.trim();
      if(!text){noteInput.focus();return;}
      const shouldNotify=!!(notifyCheck&&notifyCheck.checked);
      const selectedUser=notifyUser&&notifyUser.value?notifyUser.value:'';
      if(shouldNotify&&!selectedUser){
        if(notifyUser){notifyUser.focus();notifyUser.setCustomValidity('Select a user to notify.');notifyUser.reportValidity();setTimeout(()=>notifyUser.setCustomValidity(''),0);}
        return;
      }
      const items=loadSavedNotes();
      items.unshift({
        text,
        creator:'Anne Fahey',
        time:new Date().toLocaleString('en-US'),
        notify:shouldNotify,
        notifyUser:selectedUser
      });
      saveNotes(items);
      noteInput.value='';
      if(notifyCheck) notifyCheck.checked=false;
      const notifyFields=document.getElementById('notifyProgramTeamFields');
      if(notifyFields) notifyFields.classList.add('hidden');
      addNoteBtn.textContent='Note Added';
      if(window.showTicketToast){
        if(shouldNotify&&selectedUser){
          window.showTicketToast(`Notes added successfully and notification send to ${selectedUser}!`,'success');
        }else{
          window.showTicketToast('Notes added successfully!','success');
        }
      }
      if(window.addTicketAudit){
        window.addTicketAudit('Ticketing Note Added',null,null,'Anne Fahey',`Ticketing note saved: ${text}`);
        if(shouldNotify&&selectedUser){
          window.addTicketAudit('User Notified from Ticketing Note',null,null,'Anne Fahey',`Notification sent to ${selectedUser} for the saved Ticketing Note.`);
        }
      }
      setTimeout(()=>{addNoteBtn.textContent='Save Note';},900);
    });
  }

  const historyBody=document.getElementById('notesHistoryBody');
  if(historyBody){
    const saved=loadSavedNotes();
    saved.slice().reverse().forEach(item=>{
      const tr=document.createElement('tr');
      tr.dataset.note=item.text;
      tr.dataset.creator=item.creator;
      tr.dataset.time=item.time;
      tr.innerHTML=`<td>${item.time}</td><td>${item.creator}</td><td class="note-cell"></td><td class="note-actions"><button type="button" data-edit-note aria-label="Edit note">✎</button></td><td class="note-actions"><button type="button" data-delete-note class="danger-text" aria-label="Delete note">🗑</button></td>`;
      tr.querySelector('.note-cell').textContent=item.text;
      historyBody.prepend(tr);
    });
    updateNotesCount();
  }
})();

// Manage Ticket: Email Option and Predefined Template behavior.
(function(){
  const option=document.getElementById('emailOption');
  const templateField=document.getElementById('predefinedTemplateField');
  const template=document.getElementById('predefinedEmailTemplate');
  const subject=document.getElementById('emailSubject');
  const message=document.getElementById('emailMessage');
  if(!option||!template||!subject||!message)return;

  const templates={
    'New':{
      subject:'Your RangamWorks ticket #6492 has been received',
      message:`Hello Eugene,

We have received your RangamWorks ticket and our Program Team will begin reviewing your request.

Thank you,
RangamWorks Program Team`
    },
    'Update Email':{
      subject:'Update on your RangamWorks ticket #6492',
      message:`Hello Eugene,

We are following up regarding your RangamWorks ticket. Your ticket is currently being reviewed by our Program Team, and we will share the next update as soon as possible.

Thank you,
RangamWorks Program Team`
    },
    'Closure Email':{
      subject:'Your RangamWorks ticket #6492 has been closed',
      message:`Hello Eugene,

Your RangamWorks ticket has been completed and is now closed. Please contact us again if you need additional assistance.

Thank you,
RangamWorks Program Team`
    },
    'Member Follow-Up':{
      subject:'',
      message:''
    }
  };

  function setTemplateOptions(values,selected){
    template.innerHTML='';
    values.forEach(value=>{
      const item=document.createElement('option');
      item.value=value;
      item.textContent=value;
      if(value===selected)item.selected=true;
      template.appendChild(item);
    });
  }

  function setReadOnly(el,on){
    el.readOnly=on;
    el.setAttribute('aria-readonly',on?'true':'false');
    el.classList.toggle('email-readonly',on);
  }

  function applyTemplate(){
    const data=templates[template.value]||{subject:'',message:''};
    subject.value=data.subject;
    message.value=data.message;
  }

  function syncEmailMode(){
    const custom=option.value==='Create My Own';
    if(templateField) templateField.classList.remove('hidden');

    if(custom){
      setTemplateOptions(['Member Follow-Up'],'Member Follow-Up');
      setReadOnly(subject,false);
      setReadOnly(message,false);
      subject.value='';
      message.value='';
      subject.placeholder='Enter email subject';
      message.placeholder='Enter new email message';
    }else{
      setTemplateOptions(['New','Update Email','Closure Email'],'New');
      setReadOnly(subject,true);
      setReadOnly(message,true);
      subject.placeholder='';
      message.placeholder='';
      applyTemplate();
    }
  }

  option.addEventListener('change',syncEmailMode);
  template.addEventListener('change',()=>{
    if(option.value==='Use a Standard Template')applyTemplate();
  });
  syncEmailMode();
})();

// Manage Ticket: accepting a ticket assigns the signed-in/current user as Current Owner.
(function(){
  const acceptBtn=document.getElementById('acceptTicketBtn');
  const ownerSelect=document.getElementById('currentOwnerSelect');
  if(!acceptBtn||!ownerSelect)return;

  // Demo signed-in user. In production this value should come from the authenticated user session.
  const currentUser='Anne Fahey';

  acceptBtn.addEventListener('click',()=>{
    let option=Array.from(ownerSelect.options).find(o=>o.text.trim()===currentUser);
    if(!option){
      option=document.createElement('option');
      option.textContent=currentUser;
      option.value=currentUser;
      ownerSelect.appendChild(option);
    }
    ownerSelect.value=option.value;
    ownerSelect.dispatchEvent(new Event('change',{bubbles:true}));
    acceptBtn.textContent='Accepted';
    acceptBtn.disabled=true;
    acceptBtn.setAttribute('aria-disabled','true');
  });
})();


// Manage Ticket: after reassignment, the new owner is selected and Accept Ticket becomes available again.
(function(){
  const acceptBtn=document.getElementById('acceptTicketBtn');
  const ownerSelect=document.getElementById('currentOwnerSelect');
  const reassignSave=document.querySelector('[data-save-drawer="reassignDrawer"]');
  const reassignOwner=document.getElementById('reassignOwner');
  if(!acceptBtn||!ownerSelect||!reassignSave||!reassignOwner)return;

  reassignSave.addEventListener('click',()=>{
    const selected=reassignOwner.value.trim();
    if(!selected)return;

    let ownerOption=Array.from(ownerSelect.options).find(o=>o.text.trim()===selected || o.value===selected);
    if(!ownerOption){
      ownerOption=document.createElement('option');
      ownerOption.textContent=selected;
      ownerOption.value=selected;
      ownerSelect.appendChild(ownerOption);
    }
    ownerSelect.value=ownerOption.value;

    // Reassignment means the current signed-in user may accept the ticket again.
    acceptBtn.disabled=false;
    acceptBtn.removeAttribute('aria-disabled');
    acceptBtn.textContent='Accept Ticket';
  });
})();




// Ticket audit trail support for demo interactions.
(function(){
  function currentTicketId(){
    const params=new URLSearchParams(window.location.search);
    const fromQuery=params.get('ticket');
    if(fromQuery)return fromQuery;
    const h1=document.querySelector('.ticket-head h1');
    const match=h1&&h1.textContent.match(/#(\d+)/);
    if(match)return match[1];
    return '6492';
  }
  const ticketId=currentTicketId();
  const AUDIT_KEY=`rangamworks_ticket_${ticketId}_audit`;

  function stageNow(){
    const el=document.getElementById('manageStage');
    return el?el.value:'Accepted';
  }
  function statusNow(){
    const el=document.getElementById('manageStatus');
    return el?el.value:'In-Progress';
  }
  function auditTime(item){
    if(item.iso)return new Date(item.iso).getTime();
    const parsed=Date.parse(item.time||'');
    return Number.isNaN(parsed)?0:parsed;
  }

  window.addTicketAudit=function(activity,stage,status,user,reason,meta){
    try{
      const items=JSON.parse(localStorage.getItem(AUDIT_KEY)||'[]');
      const now=new Date();
      items.unshift({
        iso:now.toISOString(),
        time:now.toLocaleString('en-US'),
        activity:activity||'Ticket Updated',
        stage:stage||stageNow(),
        status:status||statusNow(),
        user:user||'Anne Fahey',
        reason:reason||'',
        meta:meta||''
      });
      localStorage.setItem(AUDIT_KEY,JSON.stringify(items.slice(0,200)));
    }catch(e){}
  };

  const acceptBtn=document.getElementById('acceptTicketBtn');
  if(acceptBtn){
    acceptBtn.addEventListener('click',()=>{
      window.addTicketAudit('Ticket Accepted','Accepted','In-Progress','Anne Fahey','Ticket accepted; Current Owner updated to Anne Fahey.');
    });
  }

  const reassignSave=document.querySelector('[data-save-drawer="reassignDrawer"]');
  const reassignOwner=document.getElementById('reassignOwner');
  const reassignReason=document.getElementById('reassignReason');
  if(reassignSave){
    reassignSave.addEventListener('click',()=>{
      const owner=reassignOwner&&reassignOwner.value?reassignOwner.value:'Selected owner';
      const reason=reassignReason&&reassignReason.value?reassignReason.value:'No reassignment reason entered.';
      window.addTicketAudit('Ticket Reassigned',stageNow(),statusNow(),'Anne Fahey',`Current Owner changed to ${owner}. Reason: ${reason} Notification sent to ${owner}.`);
    });
  }

  const referSave=document.querySelector('[data-save-drawer="escalateDrawer"]');
  const referReason=document.getElementById('escalationReason');
  if(referSave){
    referSave.addEventListener('click',()=>{
      const reason=referReason&&referReason.value?referReason.value:'No referral reason entered.';
      window.addTicketAudit('Referred to IT',stageNow(),statusNow(),'Anne Fahey',`Referring Reason: ${reason} Rangam IT Owner: rangamworks@rangam.com. Notification sent.`);
    });
  }

  const rejectSave=document.querySelector('[data-save-drawer="rejectDrawer"]');
  const rejectReason=document.getElementById('rejectReason');
  if(rejectSave){
    rejectSave.addEventListener('click',()=>{
      const reason=rejectReason&&rejectReason.value?rejectReason.value:'No rejection reason entered.';
      window.addTicketAudit('Ticket Rejected','Rejected','Closed','Anne Fahey',`Ticket Stage changed to Rejected; Status changed to Closed. Reason: ${reason}`);
    });
  }

  // Capture every editable Working Details field change when the user explicitly saves the ticket.
  const saveBtn=document.getElementById('manageTicketSaveBtn');

  // Known business fields plus automatic discovery so future editable fields are also audited.
  const knownTracked=[
    ['manageRequestType','Ticket Type'],
    ['manageCategory','Reason'],
    ['managePriority','Priority'],
    ['manageStage','Ticket Stage'],
    ['manageStatus','Ticket Status'],
    ['currentOwnerSelect','Current Owner']
  ];

  const trackedMap=new Map(knownTracked);
  document.querySelectorAll('.manage-main-card.working-row .field').forEach((field,index)=>{
    const control=field.querySelector('select,input:not([type="checkbox"]):not([type="radio"]),textarea');
    const label=field.querySelector('label');
    if(!control||control.disabled||control.readOnly)return;
    if(!control.id)control.id=`auditedWorkingField${index+1}`;
    if(!trackedMap.has(control.id)){
      trackedMap.set(control.id,(label?label.textContent:'Field').replace(/\s*\*\s*$/,'').trim());
    }
  });

  const tracked=Array.from(trackedMap.entries());
  let snapshot={};
  tracked.forEach(([id])=>{
    const el=document.getElementById(id);
    if(el)snapshot[id]=el.value;
  });

  function displayValue(value){
    const v=(value===null||value===undefined||String(value).trim()==='')?'Blank':String(value).trim();
    return `"${v}"`;
  }

  if(saveBtn){
    saveBtn.addEventListener('click',()=>{
      const changedFields=[];
      tracked.forEach(([id,label])=>{
        const el=document.getElementById(id);
        if(!el)return;
        const before=snapshot[id];
        const after=el.value;
        if(before!==undefined && before!==after){
          changedFields.push({id,label,before,after});
        }
      });

      // Add one history row per field so the audit trail clearly identifies what changed.
      changedFields.forEach(change=>{
        let activity=`${change.label} Updated`;
        if(change.id==='manageStage')activity='Ticket Stage Updated';
        if(change.id==='manageStatus')activity='Ticket Status Updated';
        window.addTicketAudit(
          activity,
          stageNow(),
          statusNow(),
          'Anne Fahey',
          `Field: ${change.label} | Previous Value: ${displayValue(change.before)} | New Value: ${displayValue(change.after)} | Saved successfully.`
        );
        snapshot[change.id]=change.after;
      });

      const summary=changedFields.length
        ? `Ticket saved successfully. ${changedFields.length} field${changedFields.length===1?' was':'s were'} updated: ${changedFields.map(c=>c.label).join(', ')}.`
        : 'Ticket saved successfully. No field values were changed.';
      window.addTicketAudit('Ticket Saved',stageNow(),statusNow(),'Anne Fahey',summary);
    });
  }

  // Seeded history represents prior events for the selected ticket.
  const histories={
    '6492':[
      {time:'09/02/2026 09:18 AM',activity:'Ticket Accepted',stage:'Accepted',status:'In-Progress',user:'Anne Fahey',reason:'Accepted by current user; Current Owner updated to Anne Fahey.'},
      {time:'09/02/2026 09:12 AM',activity:'Reassigned',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Reassigned to Anne Fahey. Notification sent.'},
      {time:'09/02/2026 09:05 AM',activity:'Referred to IT',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Referring Reason: Portal access assistance required. Rangam IT Owner: rangamworks@rangam.com. Notification sent.'},
      {time:'09/02/2026 08:58 AM',activity:'Program Team Note Added',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Follow-up action documented in Notes History.'},
      {time:'09/02/2026 08:54 AM',activity:'Program Team User Notified',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Action-required note notification sent to selected Program Team user.'},
      {time:'09/02/2026 08:48 AM',activity:'Email Sent - Update Email',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Email Outbox updated for Ticket #6492.'},
      {time:'09/02/2026 08:43 AM',activity:'Email Received',stage:'Accepted',status:'In-Progress',user:'Eugene Hubbard',reason:'Email Inbox updated with requester response.'},
      {time:'09/01/2026 04:20 PM',activity:'Attachment Added',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Supporting document uploaded to Attachments.'},
      {time:'09/01/2026 03:45 PM',activity:'Working Details Updated',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Field: Reason | Previous Value: "General Questions" | New Value: "Job Search Assistance" | Saved successfully.'},
      {time:'09/01/2026 03:30 PM',activity:'Ticket Viewed',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Ticket details opened.'},
      {time:'08/30/2026 11:10 AM',activity:'Status Updated',stage:'Accepted',status:'In-Progress',user:'Program Team',reason:'Field: Current Status | Previous Value: "New" | New Value: "In-Progress" | Saved successfully.'},
      {time:'08/30/2026 10:55 AM',activity:'Owner Assigned',stage:'Accepted',status:'New',user:'Program Team',reason:'Field: Current Owner | Previous Value: "Unassigned" | New Value: "Program Team" | Saved successfully.'},
      {time:'08/30/2026 10:40 AM',activity:'Ticket Accepted',stage:'Accepted',status:'New',user:'Program Team',reason:'Ticket accepted for processing.'},
      {time:'08/30/2026 10:20 AM',activity:'Ticket Created',stage:'New',status:'New',user:'System',reason:'Ticket created and initial status assigned.'},
      {time:'08/30/2026 10:20 AM',activity:'Auto Generated',stage:'New',status:'New',user:'System',reason:'Ticket ID generated automatically.'},
      {time:'08/29/2026 04:16 PM',activity:'SMS Sent',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'SMS sent to member and recorded in Communication history.'},
      {time:'08/29/2026 04:10 PM',activity:'SMS Received',stage:'Accepted',status:'In-Progress',user:'Eugene Hubbard',reason:'SMS received from member and recorded in Communication history.'}
    ],
    '6299':[
      {time:'06/17/2026 02:20 PM',activity:'Ticket Status Updated',stage:'Accepted',status:'In-Progress',user:'Sarah Patel',reason:'Status changed to In-Progress.'},
      {time:'06/12/2026 10:30 AM',activity:'Ticket Accepted',stage:'Accepted',status:'New',user:'Sarah Patel',reason:'Ticket accepted for processing.'},
      {time:'06/12/2026 10:05 AM',activity:'Ticket Created',stage:'New',status:'New',user:'System',reason:'Ticket #6299 created.'}
    ],
    '6128':[
      {time:'05/10/2026 11:15 AM',activity:'Ticket Status Updated',stage:'Accepted',status:'On-Hold',user:'Program Team',reason:'Status changed to On-Hold pending member response.'},
      {time:'05/07/2026 09:45 AM',activity:'Ticket Accepted',stage:'Accepted',status:'In-Progress',user:'Program Team',reason:'Ticket accepted and work started.'},
      {time:'05/06/2026 09:15 AM',activity:'Ticket Created',stage:'New',status:'New',user:'System',reason:'Ticket #6128 created.'}
    ],
    '6032':[
      {time:'04/22/2026 04:30 PM',activity:'Ticket Closed',stage:'Resolved',status:'Closed',user:'Jessica Davis',reason:'Ticket resolved and closed.'},
      {time:'04/20/2026 01:10 PM',activity:'Ticket Status Updated',stage:'Accepted',status:'In-Progress',user:'Jessica Davis',reason:'Status changed to In-Progress.'},
      {time:'04/18/2026 08:50 AM',activity:'Ticket Created',stage:'New',status:'New',user:'System',reason:'Ticket #6032 created.'}
    ],
    '6491':[
      {time:'07/21/2026 08:10 AM',activity:'Ticket Created',stage:'New',status:'New',user:'System',reason:'Ticket #6491 created and initial status assigned.'}
    ]
  };

  const auditBody=document.getElementById('viewHistoryAuditBody');
  if(auditBody){
    const heading=document.getElementById('historyTicketId');
    if(heading)heading.textContent=ticketId;

    let saved=[];
    try{saved=JSON.parse(localStorage.getItem(AUDIT_KEY)||'[]');}catch(e){}
    const base=(histories[ticketId]||[
      {time:new Date().toLocaleString('en-US'),activity:'Ticket History Opened',stage:'New',status:'New',user:'System',reason:`No seeded history is available for Ticket #${ticketId}. New activity will appear here as it occurs.`}
    ]).map(item=>Object.assign({iso:null},item));

    const signature=item=>[
      item.activity||'',
      item.stage||'',
      item.status||'',
      item.user||'',
      item.reason||''
    ].join('|').toLowerCase();
    const seen=new Set();
    const combined=[...saved,...base]
      .sort((a,b)=>auditTime(b)-auditTime(a))
      .filter(item=>{
        const key=signature(item);
        if(seen.has(key))return false;
        seen.add(key);
        return true;
      });
    auditBody.innerHTML='';

    const badgeClass=value=>{
      const v=(value||'').toLowerCase();
      if(v==='in-progress'||v==='on-hold')return 'orange';
      if(v==='closed'||v==='resolved')return 'green';
      if(v==='rejected')return 'red';
      return 'blue';
    };

    combined.forEach(item=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td></td><td></td><td><span class="badge ${badgeClass(item.stage)}"></span></td><td><span class="badge ${badgeClass(item.status)}"></span></td><td></td><td></td>`;
      tr.cells[0].textContent=item.time||'—';
      tr.cells[1].textContent=item.activity||'Updated';
      tr.cells[2].querySelector('span').textContent=item.stage||'—';
      tr.cells[3].querySelector('span').textContent=item.status||'—';
      tr.cells[4].textContent=item.user||'—';
      tr.cells[5].textContent=item.reason||'—';
      auditBody.appendChild(tr);
    });

    const showing=document.getElementById('historyShowing');
    if(showing)showing.textContent=`${combined.length} items   Showing 1 to ${combined.length} of ${combined.length} entries`;
  }
})();


// Communication > Email: secondary Email Inbox / Email Outbox menu.
(function(){
  const inbox=document.getElementById('emailInboxTab');
  const outbox=document.getElementById('emailOutboxTab');
  if(!inbox||!outbox)return;
  function select(which){
    const isInbox=which==='inbox';
    inbox.classList.toggle('active',isInbox);
    outbox.classList.toggle('active',!isInbox);
    inbox.setAttribute('aria-selected',isInbox?'true':'false');
    outbox.setAttribute('aria-selected',isInbox?'false':'true');
    document.querySelectorAll('.email-inbox-action').forEach(el=>el.classList.toggle('hidden',!isInbox));
  }
  inbox.addEventListener('click',()=>select('inbox'));
  outbox.addEventListener('click',()=>select('outbox'));
})();


// Communication history eye icon: open the sent/received Email or SMS content.
(function(){
  const modal=document.getElementById('communicationDetailModal');
  if(!modal)return;

  const title=document.getElementById('communicationDetailTitle');
  const directionEl=document.getElementById('communicationDirection');
  const dateEl=document.getElementById('communicationDate');
  const addressEl=document.getElementById('communicationAddress');
  const addressLabel=document.getElementById('communicationAddressLabel');
  const subjectEl=document.getElementById('communicationSubject');
  const messageEl=document.getElementById('communicationMessage');

  document.querySelectorAll('.communication-view-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const channel=btn.dataset.channel||'Communication';
      let direction=btn.dataset.direction||'';

      // Email direction follows the currently selected Inbox / Outbox tab.
      if(channel==='Email'){
        const inbox=document.getElementById('emailInboxTab');
        direction=inbox&&inbox.classList.contains('active')?'Received':'Sent';
      }
      if(!direction) direction='Sent';

      title.textContent=`${direction} ${channel}`;
      if(directionEl) directionEl.textContent=direction;
      if(dateEl) dateEl.textContent=btn.dataset.date||'—';
      if(addressEl) addressEl.textContent=btn.dataset.address||'—';
      if(addressLabel) addressLabel.textContent=direction==='Received'?'From':'To';
      if(subjectEl){
        const parent=subjectEl.parentElement;
        if(channel==='Email'){
          parent.style.display='';
          subjectEl.textContent=btn.dataset.subject||'—';
        }else{
          parent.style.display='none';
        }
      }
      if(messageEl) messageEl.textContent=btn.dataset.message||'No message content available.';
      if(window.addTicketAudit){
        window.addTicketAudit(`${channel} ${direction} Viewed`,null,null,'Anne Fahey',`${direction} ${channel} communication dated ${btn.dataset.date||'—'} opened from Communication history.`);
      }
      openModal('communicationDetailModal');
    });
  });
})();
// Ticket List history flow: Status Updates popup -> ticket-specific View Full History page.
document.querySelectorAll('.dynamic-history-eye').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const fullHistory=document.getElementById('dynamicViewFullHistory');
    if(fullHistory) fullHistory.href=`view-history.html?ticket=${encodeURIComponent(btn.dataset.ticketId||'')}`;
  });
});



// Ticketing demo toast notifications and attachment delete confirmation.
(function(){
  let toastTimer=null;
  function ensureToast(){
    let toast=document.getElementById('appToast');
    if(!toast){
      toast=document.createElement('div');
      toast.id='appToast';
      toast.className='app-toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    return toast;
  }
  window.showTicketToast=function(message,type){
    const toast=ensureToast();
    toast.textContent=message;
    toast.className='app-toast show '+(type==='error'?'error':'success');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>{toast.classList.remove('show');},3200);
  };

  const attachBody=document.getElementById('attachBody');
  if(attachBody){
    attachBody.addEventListener('click',function(e){
      const link=e.target.closest('.delete-attachment-link');
      if(!link) return;
      e.preventDefault();
      const row=link.closest('tr');
      const fileName=row&&row.cells&&row.cells[0]?row.cells[0].textContent.trim():'this attachment';
      if(window.confirm(`Are you sure you want to delete ${fileName}?`)){
        if(row) row.remove();
        if(window.addTicketAudit)window.addTicketAudit('Attachment Deleted',null,null,'Anne Fahey',`Attachment "${fileName}" deleted after confirmation.`);
      }
    });
  }

  const sendEmailBtn=document.getElementById('sendEmailBtn');
  if(sendEmailBtn){
    sendEmailBtn.addEventListener('click',function(){
      const to=document.getElementById('emailTo');
      const subject=document.getElementById('emailSubject');
      const message=document.getElementById('emailMessage');
      const emailValue=to?to.value.trim():'';
      const subjectValue=subject?subject.value.trim():'';
      const messageValue=message?message.value.trim():'';
      const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      if(!validEmail||!subjectValue||!messageValue){
        window.showTicketToast('Something went wrong, resend email again.','error');
        if(window.addTicketAudit)window.addTicketAudit('Email Send Failed',null,null,'Anne Fahey',`Email could not be sent. To: ${emailValue||'missing'}; Subject: ${subjectValue||'missing'}.`);
        if(!validEmail&&to) to.focus();
        else if(!subjectValue&&subject) subject.focus();
        else if(message) message.focus();
        return;
      }
      window.showTicketToast('Email sent successfully','success');
      if(window.addTicketAudit){
        window.addTicketAudit('Email Sent',null,null,'Anne Fahey',`Email sent successfully to ${emailValue}. Subject: "${subjectValue}".`);
      }
    });
  }

  const saveBtn=document.getElementById('manageTicketSaveBtn');
  if(saveBtn){
    saveBtn.addEventListener('click',function(){
      window.showTicketToast('Saved Successfully!','success');
    });
  }
})();


// Requester Communication tooltip: open on hover/focus/click; close on outside click or Escape.
(function(){
  const btn=document.getElementById('requesterCommTooltipBtn');
  const tip=document.getElementById('requesterCommTooltipText');
  if(!btn||!tip)return;

  let pinned=false;
  const openTip=()=>{
    tip.classList.add('show');
    btn.setAttribute('aria-expanded','true');
  };
  const closeTip=()=>{
    if(pinned)return;
    tip.classList.remove('show');
    btn.setAttribute('aria-expanded','false');
  };
  const forceClose=()=>{
    pinned=false;
    tip.classList.remove('show');
    btn.setAttribute('aria-expanded','false');
  };

  btn.addEventListener('mouseenter',openTip);
  btn.addEventListener('mouseleave',closeTip);
  btn.addEventListener('focus',openTip);
  btn.addEventListener('blur',closeTip);
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    pinned=!pinned;
    if(pinned)openTip(); else forceClose();
  });

  tip.addEventListener('mouseenter',openTip);
  tip.addEventListener('mouseleave',closeTip);

  document.addEventListener('click',e=>{
    if(!btn.contains(e.target)&&!tip.contains(e.target))forceClose();
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')forceClose();
  });
})();


// Communication > Email Inbox: reply to a received email.
(function(){
  const modal=document.getElementById('emailReplyModal');
  if(!modal)return;
  const to=document.getElementById('replyEmailTo');
  const subject=document.getElementById('replyEmailSubject');
  const message=document.getElementById('replyEmailMessage');
  const original=document.getElementById('replyOriginalMessage');
  const send=document.getElementById('sendReplyEmailBtn');

  document.querySelectorAll('.email-reply-link').forEach(link=>{
    link.addEventListener('click',e=>{
      e.preventDefault();
      const incomingSubject=link.dataset.subject||'';
      if(to)to.value=link.dataset.address||'';
      if(subject)subject.value=/^\s*re:/i.test(incomingSubject)?incomingSubject:`Re: ${incomingSubject}`;
      if(message)message.value='';
      if(original)original.textContent=link.dataset.message||'No original message available.';
      openModal('emailReplyModal');
      setTimeout(()=>{if(message)message.focus();},0);
    });
  });

  if(send){
    send.addEventListener('click',()=>{
      const emailValue=to?to.value.trim():'';
      const subjectValue=subject?subject.value.trim():'';
      const messageValue=message?message.value.trim():'';
      if(!emailValue||!subjectValue||!messageValue){
        if(window.showTicketToast)window.showTicketToast('Something went wrong, resend email again.','error');
        if(!subjectValue&&subject)subject.focus();
        else if(!messageValue&&message)message.focus();
        return;
      }
      if(window.addTicketAudit){
        window.addTicketAudit('Email Reply Sent',null,null,'Anne Fahey',`Reply sent to ${emailValue}. Subject: "${subjectValue}".`);
      }
      if(window.showTicketToast)window.showTicketToast('Email sent successfully','success');
      closeModal('emailReplyModal');
    });
  }
})();


// Create Ticket: optional attachment upload flow.
(function(){
  const dropzone=document.getElementById('createTicketDropzone');
  const input=document.getElementById('createTicketFileInput');
  const body=document.getElementById('createTicketAttachmentBody');
  const list=document.getElementById('createTicketAttachmentList');
  if(!dropzone||!input||!body||!list)return;

  const MAX_SIZE=20*1024*1024;
  const allowedExtensions=['pdf','doc','docx','png','jpg','jpeg'];
  let files=[];

  const render=()=>{
    body.innerHTML='';
    files.forEach((file,index)=>{
      const tr=document.createElement('tr');
      const size=Math.max(1,Math.round(file.size/1024));
      tr.innerHTML=`<td></td><td>${size} KB</td><td><a href="#" class="delete-create-ticket-attachment" data-index="${index}" aria-label="Delete ${file.name}" title="Delete attachment">🗑</a></td>`;
      tr.cells[0].textContent=file.name;
      body.appendChild(tr);
    });
    list.classList.toggle('hidden',files.length===0);
  };

  const addFiles=incoming=>{
    Array.from(incoming).forEach(file=>{
      const ext=(file.name.split('.').pop()||'').toLowerCase();
      if(!allowedExtensions.includes(ext)){
        if(window.showTicketToast)window.showTicketToast(`Unsupported file type: ${file.name}`,'error');
        return;
      }
      if(file.size>MAX_SIZE){
        if(window.showTicketToast)window.showTicketToast(`${file.name} exceeds the 20MB file-size limit.`,'error');
        return;
      }
      const duplicate=files.some(existing=>existing.name===file.name&&existing.size===file.size);
      if(!duplicate)files.push(file);
    });
    render();
  };

  dropzone.addEventListener('click',()=>input.click());
  dropzone.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}
  });
  input.addEventListener('change',()=>{
    addFiles(input.files);
    input.value='';
  });

  ['dragenter','dragover'].forEach(eventName=>{
    dropzone.addEventListener(eventName,e=>{
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
  });
  ['dragleave','drop'].forEach(eventName=>{
    dropzone.addEventListener(eventName,e=>{
      e.preventDefault();
      dropzone.classList.remove('drag-active');
    });
  });
  dropzone.addEventListener('drop',e=>addFiles(e.dataTransfer.files));

  body.addEventListener('click',e=>{
    const link=e.target.closest('.delete-create-ticket-attachment');
    if(!link)return;
    e.preventDefault();
    const index=Number(link.dataset.index);
    const file=files[index];
    if(!file)return;
    if(window.confirm(`Are you sure you want to delete ${file.name}?`)){
      files.splice(index,1);
      render();
    }
  });

  const form=document.getElementById('createTicketForm');
  if(form){
    form.addEventListener('submit',()=>{
      try{
        sessionStorage.setItem('rangamworks_new_ticket_attachments',JSON.stringify(files.map(file=>({
          name:file.name,
          size:file.size,
          type:file.type
        }))));
      }catch(e){}
    });
  }
})();
