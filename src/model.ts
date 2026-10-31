export type Department = 'Urgences'|'Médecine'|'Cardiologie'|'Chirurgie';
export type PatientStatus = 'attente'|'hospitalisé'|'sorti';
export type Patient = {id:string;name:string;age:number;arrivedAt:number;department:Department;condition:string;severity:number;status:PatientStatus;bedId:string|null;stayHours:number;examDone:boolean;cost:number;revenue:number;admittedAt?:number;dischargedAt?:number;report?:string};
export type Bed = {id:string;department:Exclude<Department,'Urgences'>;patientId:string|null};
export type Employee = {id:string;name:string;role:'Médecin'|'Infirmier'|'Aide-soignant'|'Administratif';department:Department|'Administration';monthlyCost:number};
export type LedgerEntry={id:string;at:number;label:string;category:'Recettes soins'|'Parking'|'Personnel'|'Achats'|'Investissements';amount:number;account:'trésorerie'|'à recevoir'|'à payer';patientId?:string};
export type Event={id:string;at:number;message:string;kind:'info'|'warning'|'success'};
export type Equipment={scanner:boolean;scannerBrokenUntil:number};
export type Game={version:1;id:string;name:string;clock:number;seed:number;sequence:number;cash:number;receivables:number;payables:number;stock:number;parkingRate:number;parkingSpaces:number;parkingOccupancy:number;parkingIncomeToday:number;patients:Patient[];beds:Bed[];staff:Employee[];ledger:LedgerEntry[];events:Event[];equipment:Equipment;lastPayrollMonth:number;autoOperations?:boolean;autoCollections?:boolean;clinicalAlerts?:number;completedExams?:number;dailyOperatingCosts?:number};
const names=['Camille Martin','Maxime Dubois','Inès Laurent','Thomas Bernard','Julie Moreau','Hugo Petit','Léa Lefebvre','Nicolas Michel','Emma Roux','Alexandre Fontaine','Chloé Girard','Sarah Lambert','David Faure','Manon Gauthier','Yanis Garcia','Sophie André','Paul Vincent','Nora Leroy'];
const conditions=[['Douleur thoracique','Cardiologie'],['Malaise','Médecine'],['Fracture du poignet','Chirurgie'],['Infection respiratoire','Médecine'],['Palpitations','Cardiologie'],['Douleur abdominale','Chirurgie'],['Fièvre persistante','Médecine'],['Traumatisme léger','Chirurgie']] as const;
const next=(g:Game)=>{g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296};
const id=(g:Game,prefix:string)=>`${prefix}-${++g.sequence}`;
const event=(g:Game,message:string,kind:Event['kind']='info')=>{g.events.unshift({id:id(g,'E'),at:g.clock,message,kind});g.events=g.events.slice(0,120)};
const entry=(g:Game,label:string,category:LedgerEntry['category'],amount:number,account:LedgerEntry['account'],patientId?:string)=>{g.ledger.unshift({id:id(g,'L'),at:g.clock,label,category,amount:Math.round(amount*100)/100,account,patientId});g.ledger=g.ledger.slice(0,2500)};
const copy=(game:Game):Game=>structuredClone(game);
const salaries:Record<Employee['role'],number>={'Médecin':7900,'Infirmier':3700,'Aide-soignant':2900,'Administratif':3100};
export const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
export const clockString=(c:number)=>new Date(c*60000).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'});
export function newGame(name='Centre hospitalier Saint-Louis'):Game{
 const g:Game={version:1,id:crypto.randomUUID(),name,clock:Date.UTC(2026,0,5,8)/60000,seed:984321,sequence:0,cash:650000,receivables:0,payables:0,stock:1400,parkingRate:2,parkingSpaces:120,parkingOccupancy:35,parkingIncomeToday:0,patients:[],beds:[],staff:[],ledger:[],events:[],equipment:{scanner:true,scannerBrokenUntil:0},lastPayrollMonth:0,autoOperations:true,autoCollections:true,clinicalAlerts:0,completedExams:0,dailyOperatingCosts:0};
 for(const [dep,number] of [['Médecine',36],['Cardiologie',20],['Chirurgie',24]] as const){for(let i=0;i<number;i++)g.beds.push({id:`${dep.slice(0,3).toUpperCase()}-${String(i+1).padStart(3,'0')}`,department:dep,patientId:null})}
 const roles:Employee['role'][]=['Médecin','Infirmier','Aide-soignant','Administratif'];
 for(let i=0;i<48;i++){const role=roles[i%4];const department:Employee['department']=role==='Administratif'?'Administration':(['Urgences','Médecine','Cardiologie','Chirurgie'] as Department[])[Math.floor(i/4)%4];g.staff.push({id:id(g,'S'),name:names[i%names.length]+` ${Math.floor(i/names.length)+1}`,role,department,monthlyCost:salaries[role]})}
 event(g,'Votre établissement vient d’ouvrir sa première journée.','success');for(let i=0;i<9;i++)generatePatient(g);return g;
}
function generatePatient(g:Game){const c=conditions[Math.floor(next(g)*conditions.length)];const severity=1+Math.floor(next(g)*5);const p:Patient={id:id(g,'P'),name:names[Math.floor(next(g)*names.length)],age:18+Math.floor(next(g)*75),arrivedAt:g.clock,department:c[1],condition:c[0],severity,status:'attente',bedId:null,stayHours:8+Math.floor(next(g)*48),examDone:false,cost:0,revenue:0};g.patients.push(p);if(severity>=5)event(g,`Urgence prioritaire : ${p.name} (${p.condition}).`,'warning')}
export function admit(game:Game,patientId:string):Game{const g=copy(game);const p=g.patients.find(x=>x.id===patientId);if(!p||p.status!=='attente')return g;const bed=g.beds.find(b=>b.department===p.department&&b.patientId===null);if(!bed){event(g,`Aucun lit disponible en ${p.department}.`,'warning');return g}const nurseCount=g.staff.filter(s=>s.department===p.department&&s.role==='Infirmier').length;if(nurseCount===0){event(g,`Admission bloquée : aucun infirmier affecté en ${p.department}.`,'warning');return g}bed.patientId=p.id;p.bedId=bed.id;p.status='hospitalisé';p.admittedAt=g.clock;p.cost+=85;g.stock=Math.max(0,g.stock-2);event(g,`${p.name} admis(e) en ${p.department}, lit ${bed.id}.`,'success');return g}
export function exam(game:Game,patientId:string):Game{const g=copy(game);const p=g.patients.find(x=>x.id===patientId);if(!p||p.status!=='hospitalisé'||p.examDone)return g;if(!g.equipment.scanner||g.equipment.scannerBrokenUntil>g.clock){event(g,'Imagerie indisponible : examen reporté.','warning');return g}if(g.stock<3){event(g,'Stock insuffisant pour réaliser l’examen.','warning');return g}g.stock-=3;p.examDone=true;p.cost+=115;g.completedExams=(g.completedExams||0)+1;event(g,`Examen réalisé pour ${p.name}.`,'success');return g}
export function discharge(game:Game,patientId:string):Game{const g=copy(game);const p=g.patients.find(x=>x.id===patientId);if(!p||p.status!=='hospitalisé')return g;const bed=g.beds.find(b=>b.id===p.bedId);if(bed)bed.patientId=null;p.bedId=null;p.status='sorti';p.dischargedAt=g.clock;p.report=`COMPTE RENDU FICTIF — ${p.name} — ${p.condition}. Admission : ${p.admittedAt?clockString(p.admittedAt):'non renseignée'}. Sortie : ${clockString(g.clock)}. ${p.examDone?'Examen complémentaire effectué.':'Aucun examen complémentaire enregistré.'} Document de simulation sans valeur médicale.`;const care=290+Math.round(p.severity*145)+Math.round(p.cost*.65);p.revenue=care;g.receivables+=care;entry(g,`Valorisation simulée du séjour ${p.id}`,'Recettes soins',care,'à recevoir',p.id);event(g,`Sortie de ${p.name} : ${money(care)} à recevoir.`,'success');return g}
export function collect(game:Game):Game{const g=copy(game);const amount=Math.min(g.receivables,Math.max(0,Math.round(g.receivables*.65)));if(amount<=0)return g;g.receivables-=amount;g.cash+=amount;entry(g,'Encaissement de créances hospitalières','Recettes soins',amount,'trésorerie');event(g,`Encaissement de ${money(amount)}.`,'success');return g}
export function purchase(game:Game,quantity=500):Game{const g=copy(game);const cost=quantity*6;if(g.cash<cost){event(g,'Trésorerie insuffisante pour commander.','warning');return g}g.cash-=cost;g.stock+=quantity;entry(g,`Achat de ${quantity} unités de consommables`,'Achats',-cost,'trésorerie');event(g,`Livraison de ${quantity} consommables, coût ${money(cost)}.`,'success');return g}
export function hire(game:Game,role:Employee['role'],department:Employee['department']):Game{const g=copy(game);const e:Employee={id:id(g,'S'),name:`Agent recruté ${g.sequence}`,role,department,monthlyCost:salaries[role]};g.staff.push(e);event(g,`Recrutement : ${role} affecté(e) en ${department}.`,'success');return g}
export function setParkingRate(game:Game,rate:number):Game{const g=copy(game);g.parkingRate=Math.max(0,Math.min(15,rate));event(g,`Tarif parking ajusté à ${money(g.parkingRate)} par heure.`);return g}
export function expand(game:Game):Game{const g=copy(game);if(g.cash<90000){event(g,'Investissement refusé : trésorerie insuffisante.','warning');return g}g.cash-=90000;for(let i=0;i<5;i++)g.beds.push({id:`MED-${String(g.beds.length+1).padStart(3,'0')}`,department:'Médecine',patientId:null});entry(g,'Création de 5 lits de médecine','Investissements',-90000,'trésorerie');event(g,'Cinq nouveaux lits installés en médecine.','success');return g}
export function setAutomation(game:Game,field:'autoOperations'|'autoCollections',value:boolean):Game{const g=copy(game);g[field]=value;event(g,`${field==='autoOperations'?'Prise en charge automatique':'Recouvrement automatique'} : ${value?'activé':'désactivé'}.`);return g}
export function assignStaff(game:Game,employeeId:string,department:Employee['department']):Game{const g=copy(game);const staff=g.staff.find(x=>x.id===employeeId);if(!staff)return g;if(staff.role==='Administratif'&&department!=='Administration')return g;if(staff.role!=='Administratif'&&department==='Administration')return g;staff.department=department;event(g,`${staff.name} affecté(e) en ${department}.`,'success');return g}
export function tick(game:Game,hours=1):Game{
 const g=copy(game);
 for(let h=0;h<Math.min(240,Math.max(0,Math.floor(hours)));h++){
  const prev=new Date(g.clock*60000);g.clock+=60;const now=new Date(g.clock*60000);
  const arrivals=1+Math.floor(next(g)*3);for(let i=0;i<arrivals;i++)generatePatient(g);
  if(g.autoOperations!==false){
   const queue=g.patients.filter(p=>p.status==='attente').sort((a,b)=>b.severity-a.severity||a.arrivedAt-b.arrivedAt);
   for(const p of queue){
    const bed=g.beds.find(b=>b.department===p.department&&!b.patientId);
    if(!bed||g.stock<2)continue;
    const nurses=g.staff.filter(e=>e.department===p.department&&e.role==='Infirmier').length;
    const doctors=g.staff.filter(e=>e.department===p.department&&e.role==='Médecin').length;
    const occupants=g.beds.filter(b=>b.department===p.department&&b.patientId).length;
    const cap=Math.max(0,Math.min(nurses*7,doctors*15));
    if(occupants>=cap)continue;
    bed.patientId=p.id;p.bedId=bed.id;p.status='hospitalisé';p.admittedAt=g.clock;p.cost+=85;g.stock-=2;
    if(p.severity>=4)event(g,`Admission prioritaire de ${p.name} en ${p.department}.`,'success');
   }
   let examsThisHour=0;
   for(const p of g.patients){
    if(p.status!=='hospitalisé')continue;
    const elapsed=(g.clock-(p.admittedAt??g.clock))/60;
    if(!p.examDone&&elapsed>=2&&examsThisHour<3&&g.stock>=3&&g.equipment.scannerBrokenUntil<=g.clock){p.examDone=true;p.cost+=115;g.stock-=3;examsThisHour++;g.completedExams=(g.completedExams||0)+1}
    if(elapsed>=p.stayHours&&(p.examDone||elapsed>=p.stayHours+10)){
     const bed=g.beds.find(b=>b.id===p.bedId);if(bed)bed.patientId=null;p.bedId=null;p.status='sorti';p.dischargedAt=g.clock;
     p.report=`COMPTE RENDU FICTIF — ${p.name} — ${p.condition}. Séjour de ${Math.round(elapsed)} h. ${p.examDone?'Examen complémentaire réalisé.':'Examen non réalisé.'} Aucun usage médical réel.`;
     const care=290+Math.round(p.severity*145)+Math.round(p.cost*.65);p.revenue=care;g.receivables+=care;entry(g,`Valorisation simulée du séjour ${p.id}`,'Recettes soins',care,'à recevoir',p.id);
     if(p.severity>=4)event(g,`Sortie de ${p.name} — ${money(care)} de produit simulé.`,'success');
    }
   }
  }
  const oldestWaiting=g.patients.filter(p=>p.status==='attente'&&g.clock-p.arrivedAt>360);
  if(oldestWaiting.length>0&&now.getUTCHours()%6===0){g.clinicalAlerts=(g.clinicalAlerts||0)+oldestWaiting.filter(p=>p.severity>=4).length;event(g,`${oldestWaiting.length} patient(s) en attente depuis plus de 6 heures.`,'warning')}
  const occupied=g.beds.filter(b=>b.patientId).length;const utilisation=occupied/Math.max(1,g.beds.length);
  g.parkingOccupancy=Math.min(g.parkingSpaces,Math.max(5,Math.round(g.parkingSpaces*(.24+utilisation*.55+next(g)*.14))));
  const parking=Math.round(g.parkingOccupancy*g.parkingRate*.45*100)/100;g.cash+=parking;g.parkingIncomeToday+=parking;entry(g,'Stationnement visiteurs','Parking',parking,'trésorerie');
  if(now.getUTCDate()!==prev.getUTCDate()){
   const operatingCost=1200+g.beds.length*13;g.cash-=operatingCost;g.dailyOperatingCosts=(g.dailyOperatingCosts||0)+operatingCost;
   entry(g,'Énergie, hygiène et maintenance quotidiennes','Achats',-operatingCost,'trésorerie');
   if(g.autoCollections!==false&&g.receivables>0){const paid=Math.round(g.receivables*.20*100)/100;g.receivables-=paid;g.cash+=paid;entry(g,'Règlement des créances simulées','Recettes soins',paid,'trésorerie')}
   event(g,`Bilan du ${prev.toLocaleDateString('fr-FR',{timeZone:'UTC'})} : ${g.patients.filter(p=>p.status==='sorti').length} sorties cumulées, ${money(g.cash)} de trésorerie.`);
   g.parkingIncomeToday=0;
  }
  if(now.getUTCMonth()!==prev.getUTCMonth()){
   const payroll=g.staff.reduce((s,e)=>s+e.monthlyCost,0);g.cash-=payroll;entry(g,'Masse salariale mensuelle','Personnel',-payroll,'trésorerie');event(g,`Salaires versés : ${money(payroll)}.`,'warning')
  }
  if(g.equipment.scannerBrokenUntil>0&&g.equipment.scannerBrokenUntil<=g.clock){g.equipment.scannerBrokenUntil=0;event(g,'Scanner de nouveau opérationnel.','success')}
  if(next(g)<.007&&g.equipment.scannerBrokenUntil===0){g.equipment.scannerBrokenUntil=g.clock+180;event(g,'Panne du scanner pour trois heures.','warning')}
 }
 return g;
}
export function validateGame(value:unknown):value is Game{if(!value||typeof value!=='object')return false;const g=value as Record<string,unknown>;return g.version===1&&typeof g.clock==='number'&&Number.isFinite(g.clock)&&typeof g.cash==='number'&&Number.isFinite(g.cash)&&typeof g.name==='string'&&Array.isArray(g.patients)&&Array.isArray(g.staff)&&Array.isArray(g.beds)&&Array.isArray(g.ledger)&&Array.isArray(g.events)&&typeof g.seed==='number'&&typeof g.sequence==='number'&&typeof g.parkingRate==='number'&&typeof g.stock==='number'&&typeof g.receivables==='number'&&typeof g.parkingSpaces==='number'&&typeof g.parkingOccupancy==='number'&&typeof g.parkingIncomeToday==='number'&&typeof g.payables==='number'&&typeof g.equipment==='object'&&g.equipment!==null}
