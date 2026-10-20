import {FORM_NAMES,FORM_SPANS,FORM_STRIDE,createFormTargets,sampleFormPoint} from './particle-forms.js';

// Kept separate from React so animation frames never trigger component renders.
export async function createParticleScene(canvas, options) {
  const {signal}=options;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  // Fetch before allocating graphics resources; unmounting cancels this request.
  const response=await fetch('/portrait/portrait.bin',{signal});
  if(!response.ok)throw Error('Portrait could not load.');
  const raw=new Float32Array(await response.arrayBuffer());
  signal.throwIfAborted();
  if(raw.length%6)throw Error('Portrait data is incomplete.');
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'high-performance'});
  if(!gl)throw Error('WebGL 2 unavailable');
  const listen=(target,name,handler,settings={})=>target.addEventListener(name,handler,{...settings,signal});
  const simulationSource = `#version 300 es
  precision highp float;
  layout(location=0) in vec3 home;
  layout(location=2) in float seed;
  layout(location=3) in vec3 position;
  layout(location=4) in vec3 velocity;
  layout(location=5) in vec3 orbitPoint;
  layout(location=6) in vec3 spherePoint;
  layout(location=7) in vec3 helixPoint;
  layout(location=8) in vec3 torusPoint;
  layout(location=9) in vec3 heartPoint;
  layout(location=10) in vec3 wavePoint;
  layout(location=11) in vec3 galaxyPoint;
  uniform float dt,time,tilt,brush,kick,reduced,scatterLimit;
  uniform vec4 formWeightsA,formWeightsB;
  uniform vec2 cursor,previous,cursorVelocity;
  out vec3 nextPosition;
  out vec3 nextVelocity;
  vec3 turn(vec3 p,float angle) {
    p.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p.xz;return p;
  }
  vec3 flow(vec3 p) {
    return vec3(sin(p.y*1.7+time*.4)-cos(p.z*1.3-time*.2),
                sin(p.z*1.6+time*.3)-cos(p.x*1.4+time*.2),
                sin(p.x*1.5-time*.3)-cos(p.y*1.6+time*.2));
  }
  void main() {
    float phi=seed*6.2831853,z=1.-2.*fract(seed*93.71),r=sqrt(max(0.,1.-z*z));
    vec3 orbit=turn(orbitPoint,time*.16),sphere=turn(spherePoint,time*.10);
    vec3 helix=turn(helixPoint,time*.17);
    vec3 torus=turn(vec3(torusPoint.x,torusPoint.y*.82-torusPoint.z*.57,torusPoint.y*.57+torusPoint.z*.82),sin(time*.19)*.35);
    vec3 heart=heartPoint*(1.+sin(time*1.3)*.025);
    vec3 wave=wavePoint;
    wave.y=wave.z*.6+sin(wave.x*2.1+time*.9)*.38+cos(wave.z*2.4-time*.7)*.19;
    vec3 galaxy=galaxyPoint;
    float spin=time*.12;
    galaxy.xy=mat2(cos(spin),sin(spin),-sin(spin),cos(spin))*galaxy.xy;galaxy.y*=.62;
    vec3 target=home*formWeightsA.x+orbit*formWeightsA.y+sphere*formWeightsA.z+helix*formWeightsA.w
      +torus*formWeightsB.x+heart*formWeightsB.y+wave*formWeightsB.z+galaxy*formWeightsB.w;
    float angle=tilt+sin(time*.22)*.045*(1.-reduced);
    target.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*target.xz;
    target.y+=sin(time*.7)*.025*(1.-reduced);
    if(reduced>.5) {nextPosition=target;nextVelocity=vec3(0.);return;}
    vec3 p=position,v=velocity;
    // A swept brush catches particles even during a fast cursor pass.
    vec2 segment=cursor-previous;
    float along=clamp(dot(p.xy-previous,segment)/(dot(segment,segment)+.00001),0.,1.);
    vec2 delta=p.xy-(previous+segment*along);
    float influence=pow(1.-smoothstep(.035,.24,length(delta)),2.)*brush;
    vec2 direction=normalize(delta+vec2(cos(phi),sin(phi))*.025);
    float swipe=min(length(cursorVelocity),18.);
    vec2 push=direction*(22.+swipe*3.)+cursorVelocity*3.5;
    v.xy+=(push+vec2(-direction.y,direction.x)*12.)*influence*dt;
    v.z+=(sin(phi)*15.+6.)*influence*dt;
    v+=normalize(vec3(cos(phi)*r,z,sin(phi)*r)+.001)*kick*(2.6+seed*2.4);
    float activity=smoothstep(.05,2.5,length(v));
    v+=((target-p)*3.6+flow(p)*(.025+activity*1.8))*dt;
    v*=exp(-dt*1.5);
    v=clamp(v,vec3(-18.),vec3(18.));
    p+=v*dt;
    // Each form keeps the same limited scatter, even after repeated clicks.
    vec3 displacement=p-target;
    float distanceFromHome=length(displacement);
    if(distanceFromHome>scatterLimit) {
      vec3 normal=displacement/distanceFromHome;
      p=target+normal*scatterLimit;
      v-=normal*max(0.,dot(v,normal));
    }
    nextPosition=p;nextVelocity=v;
  }`;
  const renderSource = `#version 300 es
  precision highp float;
  layout(location=1) in vec3 photoColor;
  layout(location=2) in float seed;
  layout(location=3) in vec3 position;
  layout(location=4) in vec3 velocity;
  uniform float aspect,scale,offset,ratio,mono,glow;
  out vec3 vColor;out float vEnergy;
  void main() {
    float energy=smoothstep(.3,7.,length(velocity));
    float lum=dot(photoColor,vec3(.299,.587,.114));
    vec3 vivid=clamp(mix(vec3(lum),photoColor,1.035)*1.06,0.,1.);
    vec3 ice=mix(vec3(.055,.09,.15),vec3(.49,.827,.988),pow(lum,.65));
    vColor=mix(mix(vivid,ice,mono),vec3(.49,.827,.988),energy*.38)*(1.+energy*.3);
    vEnergy=energy;
    float perspective=1./max(.7,1.-position.z*.045);
    gl_Position=vec4(position.x*scale/aspect*perspective,(position.y*scale+offset)*perspective,clamp(-position.z*.055,-.95,.95),1.);
    float size=(1.3+fract(seed*133.)*.65)*ratio;
    gl_PointSize=clamp(size*(glow>.5?4.+energy*3.:1.+energy*.35),1.,18.);
  }`;
  const fragmentSource = `#version 300 es
  precision highp float;
  in vec3 vColor;in float vEnergy;uniform float glow;out vec4 outputColor;
  void main() {
    vec2 q=gl_PointCoord*2.-1.;float r=dot(q,q);if(r>1.)discard;
    if(glow>.5)outputColor=vec4(vColor,exp(-r*5.)*(.012+vEnergy*.04));
    else outputColor=vec4(vColor*(.77+.23*sqrt(1.-r)),smoothstep(1.,.5,r));
  }`;
  function shader(type,source) {
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;
  }
  function program(vertex,fragment,feedback) {
    const p=gl.createProgram(),vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(p,vs);gl.attachShader(p,fs);
    if(feedback)gl.transformFeedbackVaryings(p,['nextPosition','nextVelocity'],gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;
  }
  const simulation=program(simulationSource,`#version 300 es
  precision highp float;out vec4 c;void main(){c=vec4(0.);}`,true);
  const render=program(renderSource,fragmentSource,false);
  const uniforms=(p,names)=>Object.fromEntries(names.split(' ').map(n=>[n,gl.getUniformLocation(p,n)]));
  const sim=uniforms(simulation,'dt time tilt brush kick reduced scatterLimit formWeightsA formWeightsB cursor previous cursorVelocity');
  const draw=uniforms(render,'aspect scale offset ratio mono glow');
  const count=Math.min(raw.length/6,canvas.clientWidth<600?36000:65000);
  const attributes=new Float32Array(count*7),initial=new Float32Array(count*6);
  for(let i=0;i<count;i++) {
    const source=Math.floor(i*(raw.length/6)/count)*6;
    attributes.set(raw.subarray(source,source+6),i*7);
    const seed=((Math.sin(i*127.1)*43758.5453)%1+1)%1;attributes[i*7+6]=seed;
    initial.set(raw.subarray(source,source+3),i*6);
    if(!motion.matches) {initial[i*6]+=(seed-.5)*.5;initial[i*6+1]+=Math.sin(seed*91.)*.25;initial[i*6+2]+=Math.cos(seed*37.)*.25;}
  }
  const staticBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,staticBuffer);gl.bufferData(gl.ARRAY_BUFFER,attributes,gl.STATIC_DRAW);
  const formTargets=createFormTargets(count),formBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,formBuffer);gl.bufferData(gl.ARRAY_BUFFER,formTargets,gl.STATIC_DRAW);
  const states=[0,1].map(()=> {
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,initial,gl.DYNAMIC_COPY);
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,staticBuffer);
    for(const [location,size,offset] of [[0,3,0],[1,3,12],[2,1,24]]) {gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,size,gl.FLOAT,false,28,offset);}
    gl.bindBuffer(gl.ARRAY_BUFFER,formBuffer);
    for(let form=1;form<FORM_NAMES.length;form++) {
      const location=4+form;gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location,3,gl.FLOAT,false,FORM_STRIDE*4,(form-1)*12);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    for(const [location,offset] of [[3,0],[4,12]]) {gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,24,offset);}
    gl.bindVertexArray(null);
    const feedback=gl.createTransformFeedback();gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,feedback);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,buffer);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);
    return {buffer,vao,feedback};
  });
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
  let aspect=1,scale=.35,offset=-.02,dpr=1;
  const scatterLimit=.75;
  const forms=FORM_NAMES,formWeights=Array.from({length:forms.length},(_,i)=>Number(i===0));
  const weightsA=new Float32Array(4),weightsB=new Float32Array(4),hitPoint=new Float32Array(3);
  let visible=true,destroyed=false;
  let selectedForm=0,formDirty=false,wheelIntent=0,lastWheel=0,wheelBlockedUntil=0;
  let mono=0,currentMono=0,tilt=0,targetTilt=0;
  let cursor=[99,99],previous=[99,99],pendingCursor=[99,99];
  let active=false,drag=false,moved=0,lastX=0,lastY=0,startX=0,startY=0,pendingKick=0;
  let lastInput=0,lastTime=0,elapsed=0,front=0,frameId=0,paused=false,drawCount=count;
  const samples=[];
  function resize() {
    const box=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio,box.width<700?1.25:1.5);
    canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);
    aspect=box.width/box.height;scale=.40;offset=.035;
    gl.viewport(0,0,canvas.width,canvas.height);invalidate();
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  function pointerPosition(e) {
    const b=canvas.getBoundingClientRect();return [((e.clientX-b.left)/b.width*2-1)*aspect/scale,(1-(e.clientY-b.top)/b.height*2-offset)/scale];
  }
  function hitsShape(point) {
    const angle=tilt+Math.sin(elapsed*.22)*.045,cos=Math.cos(angle),sin=Math.sin(angle);
    const bob=Math.sin(elapsed*.7)*.025;
    // Sample the current form so empty-background clicks do not trigger a burst.
    for(let i=0;i<attributes.length;i+=56) {
      let baseX=attributes[i]*formWeights[0],baseY=attributes[i+1]*formWeights[0],baseZ=attributes[i+2]*formWeights[0];
      for(let form=1;form<forms.length;form++) {
        if(formWeights[form]<.0001)continue;
        sampleFormPoint(formTargets,i/7,form,elapsed,hitPoint);
        baseX+=hitPoint[0]*formWeights[form];baseY+=hitPoint[1]*formWeights[form];baseZ+=hitPoint[2]*formWeights[form];
      }
      const x=baseX*cos+baseZ*sin;
      const z=-baseX*sin+baseZ*cos;
      const perspective=1/Math.max(.7,1-z*.045);
      const y=(baseY+bob)*perspective+offset*(perspective-1)/scale;
      if(Math.hypot(point[0]-x*perspective,point[1]-y)<.14)return true;
    }
    return false;
  }
  function selectForm(value) {
    selectedForm=(value+forms.length)%forms.length;formDirty=true;targetTilt=0;
    options.onFormChange(forms[selectedForm],selectedForm);
    canvas.setAttribute('aria-label',`Interactive particle ${forms[selectedForm].toLowerCase()} of Vaibhav. Click or Space to scatter. Scroll, swipe vertically, or use arrow keys to change form. Escape restores the portrait.`);
    invalidate();
  }
  listen(canvas,'wheel',e=> {
    if(e.ctrlKey)return;
    const delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    if(Math.abs(delta)<1)return;
    e.preventDefault();const now=performance.now();if(now<wheelBlockedUntil)return;
    if(now-lastWheel>180||Math.sign(delta)!==Math.sign(wheelIntent))wheelIntent=0;
    lastWheel=now;wheelIntent+=delta*(e.deltaMode===1?16:e.deltaMode===2?canvas.clientHeight:1);
    if(Math.abs(wheelIntent)>=60){selectForm(selectedForm+Math.sign(wheelIntent));wheelIntent=0;wheelBlockedUntil=now+800;}
  },{passive:false});
  listen(canvas,'pointermove',e=> {
    const next=pointerPosition(e);if(!active){cursor=next.slice();previous=next.slice();}
    pendingCursor=next;active=true;lastInput=performance.now();
    if(drag){moved+=Math.hypot(e.clientX-lastX,e.clientY-lastY);targetTilt=Math.max(-.5,Math.min(.5,targetTilt+(e.clientX-lastX)*.003));lastX=e.clientX;lastY=e.clientY;}
  });
  listen(canvas,'pointerdown',e=> {
    drag=true;moved=0;startX=lastX=e.clientX;startY=lastY=e.clientY;pendingCursor=pointerPosition(e);cursor=pendingCursor.slice();previous=cursor.slice();
    active=true;lastInput=performance.now();canvas.setPointerCapture(e.pointerId);
  });
  listen(canvas,'pointerup',e=> {
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(drag&&e.pointerType==='touch'&&Math.abs(dy)>55&&Math.abs(dy)>Math.abs(dx)*1.25)selectForm(selectedForm+(dy<0?1:-1));
    else if(drag&&moved<8&&!paused&&!motion.matches&&hitsShape(pointerPosition(e)))pendingKick=1;
    drag=false;
  });
  listen(canvas,'pointerleave',()=>{active=false;drag=false;});
  listen(canvas,'pointercancel',()=>{active=false;drag=false;});
  listen(canvas,'keydown',e=> {
    if(e.code==='Space'){e.preventDefault();if(!paused&&!motion.matches)pendingKick=1;invalidate();}
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();selectForm(selectedForm+1);}
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();selectForm(selectedForm-1);}
    if(e.key==='Escape'){e.preventDefault();selectForm(0);}
  });
  function frame(timestamp) {
    frameId=0;const frameDelta=lastTime?Math.min((timestamp-lastTime)/1000,.05):1/60;lastTime=timestamp;
    const reduced=motion.matches,dt=paused?0:frameDelta;elapsed+=reduced?0:dt;
    for(let i=0;i<formWeights.length;i++) {
      const target=Number(i===selectedForm);
      formWeights[i]=reduced||paused?target:formWeights[i]+(target-formWeights[i])*(1-Math.exp(-dt*4));
    }
    const span=formWeights.reduce((sum,weight,i)=>sum+weight*FORM_SPANS[i],0);
    scale=Math.min(.40,aspect*1.76/span);
    currentMono=reduced||paused?mono:currentMono+(mono-currentMono)*(1-Math.exp(-dt*6));
    tilt+=(targetTilt-tilt)*(1-Math.exp(-dt*5));previous=cursor.slice();cursor=pendingCursor.slice();
    const velocity=cursor.map((v,i)=>Math.max(-18,Math.min(18,(v-previous[i])/Math.max(frameDelta,.001))));
    const brush=active?Math.exp(-Math.max(0,timestamp-lastInput-50)/180):0;
    if(!paused||formDirty) {
      gl.useProgram(simulation);gl.uniform1f(sim.dt,dt);gl.uniform1f(sim.time,elapsed);gl.uniform1f(sim.scatterLimit,scatterLimit);
      for(let i=0;i<4;i++){weightsA[i]=formWeights[i];weightsB[i]=formWeights[i+4];}
      gl.uniform4fv(sim.formWeightsA,weightsA);gl.uniform4fv(sim.formWeightsB,weightsB);
      gl.uniform1f(sim.tilt,tilt);gl.uniform1f(sim.brush,brush);gl.uniform1f(sim.kick,pendingKick);gl.uniform1f(sim.reduced,Number(reduced||paused));
      gl.uniform2fv(sim.cursor,cursor);gl.uniform2fv(sim.previous,previous);gl.uniform2fv(sim.cursorVelocity,velocity);
      gl.bindVertexArray(states[front].vao);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,states[1-front].feedback);
      gl.enable(gl.RASTERIZER_DISCARD);gl.beginTransformFeedback(gl.POINTS);gl.drawArrays(gl.POINTS,0,count);
      gl.endTransformFeedback();gl.disable(gl.RASTERIZER_DISCARD);gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);gl.bindVertexArray(null);
      front=1-front;pendingKick=0;formDirty=false;
    }
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(render);gl.bindVertexArray(states[front].vao);
    gl.uniform1f(draw.aspect,aspect);gl.uniform1f(draw.scale,scale);gl.uniform1f(draw.offset,offset);gl.uniform1f(draw.ratio,dpr);gl.uniform1f(draw.mono,currentMono);
    gl.enable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.uniform1f(draw.glow,1);
    gl.drawArrays(gl.POINTS,0,Math.floor(drawCount*.4));
    gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.uniform1f(draw.glow,0);
    gl.drawArrays(gl.POINTS,0,drawCount);gl.bindVertexArray(null);
    samples.push(frameDelta);if(samples.length>90)samples.shift();const fps=Math.round(samples.length/samples.reduce((a,b)=>a+b,0));
    if(samples.length===90&&fps<28&&drawCount>count*.55){drawCount=Math.floor(drawCount*.8);samples.length=0;}
    canvas.particleMetrics={particles:drawCount,simulated:count,form:forms[selectedForm],formWeights:[...formWeights],fps,paused,reducedMotion:reduced,engine:'WebGL2 / persistent velocity',brushRadius:.24,scatterLimit};
    if(!document.hidden&&visible&&!destroyed&&!paused&&!reduced)frameId=requestAnimationFrame(frame);
  }
  function invalidate(){if(!frameId&&!document.hidden&&visible&&!destroyed){lastTime=0;frameId=requestAnimationFrame(frame);}}
  listen(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0;active=false;}else invalidate();});
  listen(motion,'change',invalidate);listen(window,'resize',invalidate);
  listen(canvas,'webglcontextlost',e=>{e.preventDefault();destroy();options.onError();});
  function destroy() {
    if(destroyed)return;
    destroyed=true;cancelAnimationFrame(frameId);observer.disconnect();
    for(const state of states){gl.deleteBuffer(state.buffer);gl.deleteVertexArray(state.vao);gl.deleteTransformFeedback(state.feedback);}
    gl.deleteBuffer(staticBuffer);gl.deleteBuffer(formBuffer);gl.deleteProgram(simulation);gl.deleteProgram(render);
  }
  signal.addEventListener('abort',destroy,{once:true});
  canvas.style.touchAction='none';options.onReady();invalidate();
  return {
    setPaused(value){paused=value;pendingKick=0;invalidate();},
    setVisible(value){visible=value;if(!value){cancelAnimationFrame(frameId);frameId=0;active=false;}else invalidate();},
    destroy,
  };
}
