/* Árbol botánico procedural con renderizado WebGL local. Sin recursos externos. */
(() => {
'use strict';
const canvas=document.getElementById('tree');
const gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power',premultipliedAlpha:false});
if(!gl){startCanvasTree(canvas);return}
try {
const vs=`
precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
attribute vec2 aUV;
attribute float aKind;
uniform mat4 uMatrix;
uniform float uTime;
uniform float uWind;
uniform float uDepth;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorld;
varying vec2 vUV;
varying float vKind;
void main(){
 vec3 p=aPosition;
 float h=max(0.,p.y);
 if(p.y<0.)p.y*=uDepth;
 float bend=h*h*.035;
 float gust=sin(uTime*.92)+.38*sin(uTime*1.71+.6);
 p.x+=gust*bend*uWind;
 p.z+=sin(uTime*.7+p.y*.8)*bend*uWind*.35;
 if(aKind>.5){
  float flutter=sin(uTime*3.1+p.x*7.3+p.z*8.7)*sin(uTime*1.7+p.y*5.);
  p.x+=flutter*.012*(.3+uWind)*aUV.y;
  p.y+=cos(uTime*2.4+p.z*11.+p.x*5.)*.012*(.3+uWind)*aUV.y;
 }
 vWorld=p;vNormal=aNormal;vColor=aColor;vUV=aUV;vKind=aKind;
 gl_Position=uMatrix*vec4(p,1.);
}`;
const fs=`
precision mediump float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vWorld;
varying vec2 vUV;
varying float vKind;
uniform vec3 uSun;
void main(){
 vec3 n=normalize(vNormal);
 if(!gl_FrontFacing)n=-n;
 float diffuse=max(dot(n,uSun),0.);
 float hemi=.5+.5*n.y;
 vec3 color=vColor;
 if(vKind>.5){
  float vein=1.-smoothstep(.015,.06,abs(vUV.x));
  float sideVeins=pow(.5+.5*cos((abs(vUV.x)*3.4-vUV.y)*32.),15.);
  color*=1.-vein*.12-sideVeins*.035;
  float back=max(dot(-n,uSun),0.);
  float canopyShade=smoothstep(1.6,3.7,vWorld.y)*.15;
  color*=.53+hemi*.17+diffuse*.47+back*.18+canopyShade;
  color+=vec3(.09,.12,.025)*pow(diffuse,8.);
 }else{
  float grain=sin(vUV.x*112.+sin(vUV.y*22.)*2.3)+.45*sin(vUV.x*257.+vUV.y*8.);
  float grooves=pow(.5+.5*sin(vUV.x*153.+sin(vUV.y*14.)*2.),8.);
  color*=.84+grain*.07-grooves*.16;
  color*=.53+hemi*.24+diffuse*.55;
 }
 // Luz cálida, sombras suaves y corrección de gamma.
 color*=vec3(1.06,1.025,.94);
 color=pow(max(color,vec3(0.)),vec3(.88));
 gl_FragColor=vec4(color,1.);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const V=(x,y,z)=>[x,y,z],add=(a,b)=>a.map((n,i)=>n+b[i]),sub=(a,b)=>a.map((n,i)=>n-b[i]),mul=(a,s)=>a.map(n=>n*s),dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=a=>mul(a,1/(Math.hypot(...a)||1));
let seed=19231;const rand=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646};
const vertices=[];
function vertex(p,n,c,uv,k){vertices.push(...p,...n,...c,...uv,k)}
function tri(a,b,c){for(const q of [a,b,c])vertex(...q)}
function bezier(ps,t){const u=1-t;return add(add(mul(ps[0],u*u*u),mul(ps[1],3*u*u*t)),add(mul(ps[2],3*u*t*t),mul(ps[3],t*t*t)))}
function tube(ps,r0,r1,color,segments=22,sides=12){const rings=[];for(let i=0;i<=segments;i++){const t=i/segments,p=bezier(ps,t),tangent=unit(sub(bezier(ps,Math.min(1,t+.003)),bezier(ps,Math.max(0,t-.003)))),right=unit(cross(tangent,Math.abs(tangent[1])>.92?[1,0,0]:[0,1,0])),up=unit(cross(right,tangent)),r=r1+(r0-r1)*Math.pow(1-t,1.15);const ring=[];for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,normal=add(mul(right,Math.cos(a)),mul(up,Math.sin(a))),ridge=1+.045*Math.sin(a*5+t*8);ring.push([add(p,mul(normal,r*ridge)),normal,color,[j/sides,t*4],0])}rings.push(ring)}for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=rings[i][j],b=rings[i][j+1],c=rings[i+1][j],d=rings[i+1][j+1];tri(a,c,b);tri(b,c,d)}}
function leaf(center,length,width,tint){const yaw=rand()*Math.PI*2,pitch=(rand()-.5)*2.2,axis=unit([Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch),Math.sin(yaw)*Math.cos(pitch)]),side=unit(cross(axis,[Math.sin(yaw)*.45,1,Math.cos(yaw)*.45])),normal=unit(cross(side,axis)),n=unit(add(mul(normal,.6),[0,.7,0]));const points=[];const shape=[[-0,0],[-.7,.18],[-1,.45],[-.65,.76],[0,1],[.65,.76],[1,.45],[.7,.18]];for(const [x,y]of shape){const p=add(center,add(mul(axis,y*length),add(mul(side,x*width),mul(normal,(Math.sin(y*Math.PI)*.14+Math.abs(x)*-.12)*length))));points.push([p,n,tint,[x,y],1])}const mid=[add(center,add(mul(axis,length*.46),mul(normal,length*.12))),n,tint,[0,.46],1];for(let i=0;i<points.length;i++)tri(mid,points[i],points[(i+1)%points.length])}
function cluster(center,radii,count){for(let i=0;i<count;i++){let p;do{p=[rand()*2-1,rand()*2-1,rand()*2-1]}while(dot(p,p)>1);const pos=add(center,p.map((n,j)=>n*radii[j])),light=.68+rand()*.62;leaf(pos,.075+rand()*.085,.024+rand()*.025,[.21*light,.36*light,.105*light])}}
const wood=[.37,.25,.135],rootColor=[.43,.305,.17];
// Un tronc continu, légèrement torsadé, avec base élargie.
tube([[0,-.07,0],[-.14,.55,.03],[.14,1.35,-.09],[.04,2.45,.015]],.19,.024,wood,36,18);
// Grosses racines qui se ramifient progressivement en radicelles.
for(let i=0;i<9;i++){const a=i/9*Math.PI*2+.12,r=1.05+rand()*.5,end=[Math.cos(a)*r,-.82-rand()*.43,Math.sin(a)*r],ps=[[Math.cos(a)*.075,0,Math.sin(a)*.075],[Math.cos(a)*.5,-.08,Math.sin(a)*.5],[end[0]*.78,end[1]*.63,end[2]*.78],end];tube(ps,.115,.003,rootColor,24,10);for(let j=0;j<3;j++){const t=.28+j*.22,start=bezier(ps,t),b=a+(j%2?.55:-.6),tip=add(start,[Math.cos(b)*(.38+rand()*.25),-.24-rand()*.33,Math.sin(b)*.5]);tube([start,add(start,[Math.cos(b)*.17,-.06,Math.sin(b)*.17]),add(tip,[0,.12,0]),tip],.033*(1-t),.0015,rootColor,14,7);if(j>0){const p=add(start,mul(sub(tip,start),.55)),q=add(p,[Math.cos(b+.5)*.25,-.22,Math.sin(b+.5)*.25]);tube([p,add(p,[0,-.06,0]),add(q,[0,.08,0]),q],.008,.0008,rootColor,9,5)}}}
// Branches étagées en spirale, avec ramifications secondaires et feuilles fines.
for(let i=0;i<10;i++){const a=i*2.39996,r=.72+rand()*.36,level=1.01+(i%4)*.19,end=[Math.cos(a)*r,2.14+(i%3)*.17+rand()*.15,Math.sin(a)*r],ps=[[.02,level,0],[Math.cos(a)*.25,level+.18,Math.sin(a)*.25],[end[0]*.85,end[1]-.35,end[2]*.85],end];tube(ps,.067-(i%3)*.006,.009,wood,23,11);for(let j=0;j<3;j++){const start=bezier(ps,.48+j*.17),b=a+(j-1)*.7,tip=add(start,[Math.cos(b)*(.25+rand()*.27),.37+rand()*.25,Math.sin(b)*(.25+rand()*.27)]);tube([start,add(start,[Math.cos(b)*.13,.12,Math.sin(b)*.13]),add(tip,[0,-.14,0]),tip],.021,.0015,wood,13,7);cluster(add(tip,[0,.06,0]),[.34,.33,.34],130);for(let k=0;k<2;k++){const p=add(start,mul(sub(tip,start),.52+k*.2)),q=add(p,[Math.cos(b+k)*.18,.12,Math.sin(b+k)*.18]);tube([p,add(p,[0,.04,0]),q,add(q,[0,.05,0])],.006,.0008,wood,6,5);cluster(q,[.17,.16,.17],28)}}cluster(end,[.27,.32,.27],85)}
cluster([.02,3.03,.015],[.53,.47,.5],500);cluster([-.25,2.68,.08],[.45,.38,.45],250);
// Un seul tampon graphique pour limiter les allocations pendant l'animation.
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);const stride=12*4;for(const[name,n,offset]of[['aPosition',3,0],['aNormal',3,3],['aColor',3,6],['aUV',2,9],['aKind',1,11]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,stride,offset*4)}const count=vertices.length/12;vertices.length=0;
const U={};for(const name of ['uMatrix','uTime','uWind','uDepth','uSun'])U[name]=gl.getUniformLocation(program,name);
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(0,0,0,0);gl.uniform3fv(U.uSun,unit([-1,1.4,1]));
function multiply(a,b){const out=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=a[k*4+r]*b[c*4+k];return out}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0])}
function lookAt(eye,target){const z=unit(sub(eye,target)),x=unit(cross([0,1,0],z)),y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1])}
let width=1,height=1,angle=.3,targetAngle=.3,dragging=false,lastX=0,phase=0,wind=.13,targetWind=.13,rootDepth=.85,targetDepth=.85;
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,dirty=true;
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,matchMedia('(max-width:760px)').matches?1.6:2);width=Math.max(1,r.width);height=Math.max(1,r.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);gl.viewport(0,0,canvas.width,canvas.height);dirty=true}new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(es=>{visible=es[0].isIntersecting;dirty=true},{threshold:0}).observe(canvas);
canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;targetAngle+=(e.clientX-lastX)*.009;lastX=e.clientX;dirty=true});for(const e of ['pointerup','pointercancel'])canvas.addEventListener(e,()=>dragging=false);
const storm=document.getElementById('storm'),motion=document.getElementById('motion');storm.onclick=()=>{const active=targetWind<.5;targetWind=active?1.2:.13;storm.textContent=active?'☀ Calmar el viento':'☁ Activar viento';storm.setAttribute('aria-pressed',String(active));dirty=true};
document.getElementById('depth').oninput=e=>{targetDepth=Number(e.target.value)/100;document.getElementById('depth-label').textContent=targetDepth>.6?'PROFUNDAS':'SUPERFICIALES';dirty=true};
function motionLabel(){motion.textContent=paused?'▷':'Ⅱ';motion.setAttribute('aria-label',paused?'Reanudar animación':'Pausar animación');motion.title=paused?'Reanudar animación':'Pausar animación'}motion.onclick=()=>{paused=!paused;motionLabel();dirty=true};motionLabel();
let previous=0,lastDraw=0;
function render(now){requestAnimationFrame(render);if(!visible||document.hidden){previous=now;return}if(now-lastDraw<32)return;const dt=Math.min((now-previous)/1000,.05)||0;previous=now;lastDraw=now;if(!paused){phase+=dt;if(!dragging)targetAngle+=dt*.045;dirty=true}if(Math.abs(angle-targetAngle)>.0001||Math.abs(wind-targetWind)>.001||Math.abs(rootDepth-targetDepth)>.001)dirty=true;if(!dirty)return;dirty=false;angle+=(targetAngle-angle)*.12;wind+=(targetWind-wind)*.07;rootDepth+=(targetDepth-rootDepth)*.12;
const aspect=width/height,compact=matchMedia('(max-width:760px)').matches,fov=.49,dist=Math.max(9.9,5.1/aspect),target=[0,1.04,0],eye=[Math.sin(angle)*dist,2.35,Math.cos(angle)*dist];
const m=multiply(perspective(fov,aspect,.1,50),lookAt(eye,target));gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniformMatrix4fv(U.uMatrix,false,m);gl.uniform1f(U.uTime,phase);gl.uniform1f(U.uWind,wind);gl.uniform1f(U.uDepth,rootDepth);gl.drawArrays(gl.TRIANGLES,0,count)}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;motionLabel()});canvas.addEventListener('webglcontextrestored',()=>location.reload());requestAnimationFrame(render);
} catch (error) {
 const replacement=canvas.cloneNode(true);canvas.replaceWith(replacement);startCanvasTree(replacement);
}
})();
