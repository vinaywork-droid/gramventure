export type RagChunk = {
  id:string;
  title:string;
  text:string;
  source:string;
  url:string;
  tags:string[];
  verified:string;
};

// Small, curated retrieval index for the prototype. In production this can be
// replaced by a vector database fed from the latest official scheme documents.
export const KNOWLEDGE:RagChunk[] = [
  {
    id:'pmfme-individual',
    title:'PMFME — Individual Micro Food Processing Units',
    text:'The Ministry of Food Processing Industries states that individual micro food processing units can receive a credit-linked capital subsidy of 35% of eligible project cost, subject to a maximum of Rs.10 lakh per unit. Beneficiary contribution should be at least 10% and the balance is a bank loan. The scheme also provides capacity-building/training support. Eligibility and current conditions must be checked for the specific activity and location.',
    source:'Ministry of Food Processing Industries — PMFME',
    url:'https://mofpi.gov.in/pmfme/shgs-fpos-co-operatives-individual-micro-food-enterprise',
    tags:['pmfme','food','processing','pickle','flour','millet','fruit','jaggery','food processing','subsidy','training','loan'],
    verified:'2026-09'
  },
  {
    id:'pmfme-odop',
    title:'PMFME — ODOP and new units',
    text:'Official PMFME guidance describes an ODOP approach and states that new units under the relevant individual/group support components are supported for ODOP products, while eligibility and component-specific conditions apply. The current PMFME portal also publishes ODOP information and scheme updates.',
    source:'PMFME — Ministry of Food Processing Industries',
    url:'https://pmfme.mofpi.gov.in/',
    tags:['pmfme','odop','food','processing','new unit','district','local product'],
    verified:'2026-09'
  },
  {
    id:'pmegp-guidelines',
    title:'PMEGP — Revised Scheme Guidelines',
    text:'The official PMEGP guidelines state that assistance is for new projects sanctioned specifically under PMEGP, subject to scheme conditions. Projects without capital expenditure are not eligible. PMEGP applies to new viable micro-enterprises except activities restricted by authorities or included in the scheme negative list. Trading and service activities have additional conditions, so a specific business should not be labelled eligible without checking the current guidelines.',
    source:'Khadi and Village Industries Commission — PMEGP',
    url:'https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf',
    tags:['pmegp','loan','new business','new project','service','retail','trading','manufacturing','negative list','eligibility'],
    verified:'2026-09'
  },
  {
    id:'pmegp-trading',
    title:'PMEGP — Trading and service conditions',
    text:'PMEGP guidelines contain specific rules for trading activities and allow certain retail/trading models under defined conditions, including outlets backed by manufacturing or service facilities. Therefore GramVenture should describe PMEGP as potentially relevant rather than promise eligibility for a rural retail or distribution business.',
    source:'Khadi and Village Industries Commission — PMEGP Guidelines',
    url:'https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf',
    tags:['pmegp','retail','trading','distribution','service','eligibility'],
    verified:'2026-09'
  },
  {
    id:'gramventure-guardrail',
    title:'GramVenture decision-support rules',
    text:'GramVenture uses structured prototype data for business scores and financial calculations. The LLM must not invent local prices, scheme eligibility, loan approval, or guaranteed profit. If a requested fact is not in the retrieved source context or structured user data, the assistant should say that verification is required rather than fabricate an answer.',
    source:'GramVenture prototype knowledge policy',
    url:'',
    tags:['guardrail','hallucination','financial','scheme','loan','local data','score'],
    verified:'2026-09'
  }
];

const STOP=new Set(['the','and','for','what','why','how','can','with','this','that','you','your','are','from','about','business','does','will','have','has','into','need','start','money','please','मुझे','क्या','और','यह','आप','के','से','है','हैं','करें','कितना','मेरे','मेरा','मुझे','केलिए','में','का','की','के']);
function tokens(s:string){return (s||'').toLowerCase().replace(/[^\p{L}\p{N}%₹]+/gu,' ').split(/\s+/).filter(x=>x.length>2&&!STOP.has(x));}

export function retrieve(question:string, business:string, topK=3){
  const q=new Set(tokens(`${question} ${business}`));
  return KNOWLEDGE.map(c=>{
    const tags=new Set(tokens(c.tags.join(' ')));
    const text=new Set(tokens(c.text));
    let score=0;
    q.forEach(t=>{if(tags.has(t))score+=4; else if(text.has(t))score+=1;});
    return {chunk:c,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,topK).map(x=>x.chunk);
}
