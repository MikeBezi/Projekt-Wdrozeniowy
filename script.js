let currentUser = null;
let editingCvId = null;
let jobIndex = 0;

const $ = id => document.getElementById(id);

const jobs = [
  {title:'Frontend Developer', company:'SoftLine', tags:['HTML','CSS','JavaScript'], match:92},
  {title:'Junior Web Developer', company:'CodeWorks', tags:['HTML','CSS','Git'], match:84},
  {title:'UI Developer', company:'DesignHub', tags:['CSS','RWD','JavaScript'], match:78},
  {title:'Web Support Specialist', company:'TechCare', tags:['HTML','Helpdesk','CSS'], match:69}
];

window.addEventListener('load', () => {
  sessionStorage.clear();
  currentUser = null;
  showLoggedOut();
  bindEvents();
});

function bindEvents(){
  $('registerBtn').onclick = registerUser;
  $('loginBtn').onclick = loginUser;
  $('logoutBtn').onclick = logoutUser;
  $('saveCvBtn').onclick = saveCv;
  $('saveNotesBtn').onclick = saveNote;
  $('acceptJobBtn').onclick = () => swipeJob(true);
  $('rejectJobBtn').onclick = () => swipeJob(false);
}

function getUsers(){return JSON.parse(localStorage.getItem('users') || '[]')}
function setUsers(users){localStorage.setItem('users', JSON.stringify(users)); saveTxt('users', users)}
function userKey(type){return `${currentUser.login}_${type}`}
function getUserData(type){return JSON.parse(localStorage.getItem(userKey(type)) || '[]')}
function setUserData(type,data){localStorage.setItem(userKey(type), JSON.stringify(data)); saveTxt(type, data)}

async function saveTxt(type, data){
  try{
    await fetch('/save', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,user:currentUser?.login || 'system',data})});
  }catch(e){
    // Gdy projekt jest otwarty bez serwera Node.js, dane zostają w localStorage.
  }
}

function registerUser(){
  const login = $('loginInput').value.trim();
  const password = $('passwordInput').value.trim();
  if(!login || !password){return msg('Uzupełnij login i hasło.')}
  const users = getUsers();
  if(users.some(u => u.login === login)){return msg('Taki użytkownik już istnieje.')}
  users.push({login,password,createdAt:new Date().toLocaleString()});
  setUsers(users);
  msg('Konto utworzone. Możesz się zalogować.');
}

function loginUser(){
  const login = $('loginInput').value.trim();
  const password = $('passwordInput').value.trim();
  const users = getUsers();
  if(users.length === 0){return msg('Zarejestruj się.')}
  const user = users.find(u => u.login === login && u.password === password);
  if(!user){return msg('Nieprawidłowy login lub hasło.')}
  currentUser = user;
  showLoggedIn();
}

function logoutUser(){
  currentUser = null;
  editingCvId = null;
  showLoggedOut();
}

function showLoggedOut(){
  $('authSection').classList.remove('hidden');
  $('dashboard').classList.add('hidden');
  $('topbar').classList.add('hidden');
  $('loginInput').value = '';
  $('passwordInput').value = '';
  msg('');
}

function showLoggedIn(){
  $('authSection').classList.add('hidden');
  $('dashboard').classList.remove('hidden');
  $('topbar').classList.remove('hidden');
  $('loggedUserText').textContent = `Zalogowano: ${currentUser.login}`;
  $('welcomeTitle').textContent = `Witaj, ${currentUser.login}`;
  clearCvForm();
  renderAll();
}

function saveCv(){
  if(!currentUser) return;
  const cv = {
    id: editingCvId || Date.now(),
    name:$('cvName').value.trim(),
    position:$('cvPosition').value.trim(),
    skills:$('cvSkills').value.trim(),
    description:$('cvDescription').value.trim(),
    updatedAt:new Date().toLocaleString()
  };
  if(!cv.name || !cv.position){return alert('Uzupełnij nazwę CV i stanowisko.')}
  let cvs = getUserData('cv');
  if(editingCvId){
    cvs = cvs.map(item => item.id === editingCvId ? cv : item);
  }else{
    cvs.push(cv);
  }
  setUserData('cv', cvs);
  clearCvForm();
  renderAll();
}

function editCv(id){
  const cv = getUserData('cv').find(item => item.id === id);
  if(!cv) return;
  editingCvId = id;
  $('cvName').value = cv.name;
  $('cvPosition').value = cv.position;
  $('cvSkills').value = cv.skills;
  $('cvDescription').value = cv.description;
  $('saveCvBtn').textContent = 'Zapisz zmiany';
  document.querySelector('.cv-card').scrollIntoView({behavior:'smooth'});
}

function deleteCv(id){
  let cvs = getUserData('cv').filter(item => item.id !== id);
  setUserData('cv', cvs);
  editingCvId = null;
  clearCvForm();
  renderAll();
}

function clearCvForm(){
  editingCvId = null;
  $('cvName').value = '';
  $('cvPosition').value = '';
  $('cvSkills').value = '';
  $('cvDescription').value = '';
  $('saveCvBtn').textContent = 'Zapisz CV';
}

function saveNote(){
  const text = $('notesArea').value.trim();
  if(!text) return;
  const notes = getUserData('notes');
  notes.unshift({id:Date.now(),text,createdAt:new Date().toLocaleString()});
  setUserData('notes', notes);
  $('notesArea').value = '';
  renderAll();
}

function deleteNote(id){
  setUserData('notes', getUserData('notes').filter(n => n.id !== id));
  renderAll();
}

function renderAll(){
  renderCv();
  renderNotes();
  renderJob();
  $('cvCount').textContent = getUserData('cv').length;
  $('noteCount').textContent = getUserData('notes').length;
  $('matchCount').textContent = getUserData('matches').length;
}

function renderCv(){
  const cvs = getUserData('cv');
  $('cvList').innerHTML = cvs.length ? cvs.map(cv => `
    <div class="list-item">
      <div><strong>${cv.name}</strong><small>${cv.position} | ${cv.updatedAt}</small><small>${cv.skills}</small></div>
      <div class="item-actions"><button class="btn btn-secondary" onclick="editCv(${cv.id})">Edytuj</button><button class="btn btn-danger" onclick="deleteCv(${cv.id})">Usuń</button></div>
    </div>`).join('') : '<p class="muted">Brak zapisanych CV.</p>';
}

function renderNotes(){
  const notes = getUserData('notes');
  $('notesList').innerHTML = notes.length ? notes.map(n => `
    <div class="list-item">
      <div><strong>${n.text}</strong><small>${n.createdAt}</small></div>
      <div class="item-actions"><button class="btn btn-danger" onclick="deleteNote(${n.id})">Usuń</button></div>
    </div>`).join('') : '<p class="muted">Brak zapisanych notatek.</p>';
}

function renderJob(){
  const job = jobs[jobIndex % jobs.length];
  $('jobCard').className = 'job-card';
  $('jobCard').innerHTML = `<h3>${job.title}</h3><p>${job.company}</p><div class="tags">${job.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><strong>Dopasowanie: ${job.match}%</strong><div class="bar"><span style="width:${job.match}%"></span></div>`;
}

function swipeJob(accepted){
  const card = $('jobCard');
  card.classList.add(accepted ? 'swipe-right' : 'swipe-left');
  if(accepted){
    const matches = getUserData('matches');
    matches.push({...jobs[jobIndex % jobs.length], date:new Date().toLocaleString()});
    setUserData('matches', matches);
  }
  setTimeout(()=>{jobIndex++; renderAll()}, 300);
}

function msg(text){$('authMessage').textContent = text}
