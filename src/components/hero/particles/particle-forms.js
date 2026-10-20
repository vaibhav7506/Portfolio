export const FORM_NAMES=['Portrait','Orbit','Sphere','Helix','Torus','Heart','Wave','Galaxy'];
export const FORM_SPANS=[3.3,4.2,3.2,1.85,3,3.1,3.6,3.8];
export const FORM_STRIDE=(FORM_NAMES.length-1)*3;

function random(index,salt) {
  let value=(index+1)^Math.imul(salt,0x9e3779b9);
  value=Math.imul(value^(value>>>16),0x21f0aaad);
  value=Math.imul(value^(value>>>15),0x735a2d97);
  return ((value^(value>>>15))>>>0)/4294967296;
}

// Independent samples keep the surfaces dense without visible latitude stripes.
export function createFormTargets(count) {
  const points=new Float32Array(count*FORM_STRIDE),tau=Math.PI*2;
  for(let i=0;i<count;i++) {
    const u=random(i,1),v=random(i,2),w=random(i,3),a=u*tau,b=v*tau;
    const row=i*FORM_STRIDE;
    const set=(form,x,y,z)=>points.set([x,y,z],row+(form-1)*3);
    set(1,Math.cos(a)*(1.5+v*.6),Math.sin(a)*.62,Math.sin(a)*1.2+(w-.5)*.14);
    const sy=1-2*v,sr=Math.sqrt(1-sy*sy);
    set(2,sr*Math.cos(a)*1.6,sy*1.6,sr*Math.sin(a)*1.6);

    const rung=w<.18,h=rung?Math.round(u*20)/20:u;
    const helixAngle=h*Math.PI*4+(i%2)*Math.PI;
    const helixRadius=rung?(v*2-1)*.78:.78;
    set(3,Math.cos(helixAngle)*helixRadius+Math.cos(b)*.055,
      (h-.5)*3.5+(w-.5)*.045,Math.sin(helixAngle)*helixRadius+Math.sin(b)*.055);

    const tube=.35,toroid=1.15+tube*Math.cos(b);
    set(4,toroid*Math.cos(a),toroid*Math.sin(a),tube*Math.sin(b));

    const fill=Math.sqrt(v),heartX=16*Math.pow(Math.sin(a),3);
    const heartY=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);
    set(5,heartX*.097*fill,heartY*.097*fill+.12,
      (w*2-1)*.55*Math.sqrt(1-fill*fill));

    set(6,(u-.5)*3.6,0,(v-.5)*2.65);

    const core=w<.2,radius=(core?.48:1.9)*Math.sqrt(v);
    const spiral=core?a:(i%4)*Math.PI*.5+radius*2.2+(u-.5)*.42;
    set(7,Math.cos(spiral)*radius,Math.sin(spiral)*radius,
      (w-.5)*.28*(1-v));
  }
  return points;
}

// The same transforms as the GPU shader, reused for click hit-testing.
export function sampleFormPoint(points,index,form,time,result) {
  const offset=index*FORM_STRIDE+(form-1)*3;
  let x=points[offset],y=points[offset+1],z=points[offset+2],angle=0;
  switch(form) {
    case 1: angle=time*.16;break;
    case 2: angle=time*.10;break;
    case 3: angle=time*.17;break;
    case 4: {
      const oldY=y;y=y*.82-z*.57;z=oldY*.57+z*.82;
      angle=Math.sin(time*.19)*.35;break;
    }
    case 5: {
      const pulse=1+Math.sin(time*1.3)*.025;x*=pulse;y*=pulse;z*=pulse;break;
    }
    case 6: y=z*.6+Math.sin(x*2.1+time*.9)*.38+Math.cos(z*2.4-time*.7)*.19;break;
    case 7: {
      const turn=time*.12,c=Math.cos(turn),s=Math.sin(turn),oldX=x;
      x=c*x-s*y;y=(s*oldX+c*y)*.62;break;
    }
  }
  const c=Math.cos(angle),s=Math.sin(angle);
  result[0]=c*x+s*z;result[1]=y;result[2]=-s*x+c*z;
  return result;
}
