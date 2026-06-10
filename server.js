const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const root = __dirname;
const dataDir = path.join(root, 'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

function send(res, code, data, type='text/plain'){
  res.writeHead(code, {'Content-Type': type});
  res.end(data);
}
function safeName(name){return String(name || 'system').replace(/[^a-zA-Z0-9_-]/g,'_')}
function saveData(body){
  const {type,user,data} = JSON.parse(body || '{}');
  const file = path.join(dataDir, `${safeName(user)}_${safeName(type)}.txt`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
const server = http.createServer((req,res)=>{
  if(req.method === 'POST' && req.url === '/save'){
    let body='';
    req.on('data', chunk => body += chunk);
    req.on('end',()=>{try{saveData(body);send(res,200,'OK')}catch(e){send(res,500,'ERROR')}});
    return;
  }
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(root, filePath.split('?')[0]);
  if(!filePath.startsWith(root)) return send(res,403,'Forbidden');
  fs.readFile(filePath,(err,data)=>{
    if(err) return send(res,404,'Not found');
    const ext = path.extname(filePath);
    const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.txt':'text/plain'};
    send(res,200,data,types[ext] || 'text/plain');
  });
});
server.listen(PORT,()=>console.log(`Projekt działa: http://localhost:${PORT}`));
