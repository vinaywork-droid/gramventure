import {BUSINESSES, LOCATIONS, SCHEMES} from './data';
export const money=(n:number)=>'₹'+Math.round(Math.max(0,n)).toLocaleString('en-IN');
export const profit=(b:any)=>Math.max(0,b.sales-b.opex);
const weights=[25,20,15,15,10,10,5];
export function evaluate(b:any,location:string,capital:number,resources:string[],skill:number,support:boolean){
 const l=LOCATIONS.find(x=>x.district===location)!; const need=b.cost+b.working;
 const capitalFit=Math.min(100,Math.round(capital/Math.max(1,need)*100));
 const resourceFit=Math.round(b.resources.reduce((n:number,r:string)=>n+(resources.includes(r)?1:0),0)/Math.max(1,b.resources.length)*100);
 const demand=Math.min(100,Math.round((l.market+(b.signals.some((s:string)=>l.signals.includes(s))?15:0)+l.purchasing)/3));
 const gap=Math.min(100,Math.round((100-(l.market*.45))+((b.signals.some((s:string)=>l.signals.includes(s)))?25:0)));
 const profitability=Math.min(100,Math.round((profit(b)/Math.max(1,b.sales))*100+45));
 const skillFit=Math.min(100,Math.round((skill+b.skills.length*5)/1.25));
 const supportScore=support?75:45;
 const factors=[demand,capitalFit,Math.round((resourceFit+65)/2),profitability,gap,supportScore,skillFit];
 const score=Math.round(factors.reduce((s,v,i)=>s+v*weights[i]/100,0));
 return {score,factors,need,capitalFit,resourceFit,demand,gap,profitability,skillFit,supportScore};
}
export function rank(location:string,capital:number,resources:string[],skill:number){return BUSINESSES.map(b=>({b,e:evaluate(b,location,capital,resources,skill,b.support.length>0)})).sort((a,z)=>z.e.score-a.e.score)}
export function finance(b:any,capital:number,debts:number){
 const required=b.cost+b.working; const amountAvailable=Math.max(0,capital); const gap=Math.max(0,required-amountAvailable);
 const psProject=Math.min(required,amountAvailable*10); const psLoan=Math.max(0,psProject-amountAvailable);
 const rate=required<=140000?6.5:8; const months=required<=140000?36:84; const r=rate/1200;
 const exampleLoan=Math.min(gap,Math.max(0,psLoan||gap));
 const examplePayment=exampleLoan?exampleLoan*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1):0;
 const monthlyAfford=profit(b)-debts;
 return {required,amountAvailable,gap,psProject,psLoan,rate,months,exampleLoan,examplePayment,monthlyAfford,debtPay:debts};
}
// Scenario testing uses rupee/unit and volume changes, never percentages in the UI.
export function sim(b:any,c:any){
 const unit=Math.max(1,b.unitPrice||Math.round(b.sales/Math.max(1,b.unitsPerMonth||100)));
 const units=Math.max(1,b.unitsPerMonth||100);
 const newUnit=Math.max(1,unit+c.price);
 const newUnits=Math.max(1,units+c.volume);
 const sales=newUnit*newUnits;
 const op=Math.max(0,b.opex+c.raw+c.opex);
 const p=Math.max(0,sales-op); const base=profit(b);
 return {unit,newUnit,units,newUnits,sales,op,p,delta:p-base,decision:p>=base*.85?'START':p>=base*.6?'MODIFY':'RECONSIDER'};
}
export function schemes(b:any){return SCHEMES.filter(s=>b.line==='food'?true:s.id==='pmegp')}
