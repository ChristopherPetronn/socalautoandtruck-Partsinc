const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:false,limit:'1mb'}));
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  const safePath = path.normalize(decodeURIComponent(req.path).replace(/^\/+/, ''));
  const candidate = path.resolve(__dirname, 'public', safePath === '.' ? 'index.html' : `${safePath}.html`);
  const publicRoot = path.resolve(__dirname, 'public') + path.sep;
  if (!candidate.startsWith(publicRoot) && candidate !== path.resolve(__dirname, 'public', 'index.html')) return next();
  if (require('fs').existsSync(candidate) && require('fs').statSync(candidate).isFile()) return res.sendFile(candidate);
  next();
});
const hits = new Map();
function rateLimit(req,res,next){const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').toString().split(',')[0].trim();const now=Date.now();const item=hits.get(ip)||{count:0,start:now};if(now-item.start>15*60*1000){item.count=0;item.start=now;}item.count++;hits.set(ip,item);if(item.count>8)return res.status(429).json({error:'Too many requests. Please try again later or contact us by phone or email.'});next();}
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.post('/api/contact',rateLimit,async(req,res)=>{
 try{
  const b=req.body||{};
  if(b.website)return res.status(200).json({ok:true});
  const name=String(b.name||'').trim(),email=String(b.email||'').trim(),message=String(b.message||'').trim();
  if(!name||!email||!message||!String(b.consent||''))return res.status(400).json({error:'Please complete the required fields and consent checkbox.'});
  if(name.length>150||email.length>254||message.length>5000)return res.status(400).json({error:'One or more fields exceed the allowed length.'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Please enter a valid email address.'});
  const required=['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_FROM'];
  const missing=required.filter(k=>!process.env[k]);
  if(missing.length)return res.status(503).json({error:'Email delivery is not configured yet. Please call (657) 274-3661 or email contact@socalautoandtruckpartsinc.com.'});
  const port=Number(process.env.SMTP_PORT)||587;
  const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},requireTLS:process.env.SMTP_REQUIRE_TLS==='true'});
  const details=Object.entries(b).filter(([k,v])=>!['website','consent'].includes(k)&&typeof v==='string'&&v.trim()).map(([k,v])=>`${k.replace(/_/g,' ')}: ${v}`).join('\n');
  const info=await transporter.sendMail({from:process.env.MAIL_FROM,to:process.env.CONTACT_TO||'contact@socalautoandtruckpartsinc.com',replyTo:email,subject:`Website inquiry — ${String(b.request_type||'General inquiry').slice(0,80)}`,text:`New website inquiry\n\n${details}\n\nConsent: ${b.consent}`});
  if(!info.messageId)return res.status(502).json({error:'The email provider did not confirm acceptance. Please contact us directly.'});
  return res.json({ok:true});
 }catch(err){console.error('Contact form error:',err&&err.message?err.message:'Unknown error');return res.status(502).json({error:'We could not send your request right now. Please call (657) 274-3661 or email contact@socalautoandtruckpartsinc.com.'});}
});
module.exports=app;
