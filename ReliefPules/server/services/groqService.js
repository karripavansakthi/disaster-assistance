const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

const SYSTEM_PROMPTS = {
  en: `You are "ReliefPulse AI", an advanced disaster response and emergency guidance assistant.
Your priority:
1. Immediate Life Safety First.
2. Clear, concise, bulleted survival instructions.
3. Recommend verified shelters and emergency contacts (112, 1070).
4. Disclaimer: Clearly label advice as "AI-assisted guidance — requires human emergency verification."`,

  te: `మీరు "రిలీఫ్ పల్స్ AI" (ReliefPulse AI), అత్యవసర విపత్తు సహాయ మరియు మార్గదర్శక సహాయకుడు.
ప్రధాన లక్ష్యం:
1. తక్షణ ప్రాణ రక్షణ మరియు సురక్షిత ప్రాంతాలకు వెళ్లడం.
2. వరదలు, తుఫానులు మరియు భూకంపాల సమయంలో సురక్షిత చర్యలు.
3. సహాయ హెల్ప్‌లైన్ నంబర్లు: 112 మరియు 1070.
4. స్పష్టమైన, సులభమైన తెలుగు సూచనలు అందించండి.`,

  hi: `आप "रिलीफपल्स AI" (ReliefPulse AI) हैं, एक उन्नत आपदा प्रबंधन और आपातकालीन सहायता सहायक।
प्राथमिकता:
1. तत्काल जीवन रक्षा और सुरक्षित आश्रय।
2. बाढ़, चक्रवात और भूकंप के दौरान चरण-दर-चरण बचाव निर्देश।
3. राष्ट्रीय आपातकालीन नंबर: 112 एवं 1070।
4. स्पष्ट, संक्षिप्त और बुलेट पॉइंट्स में उत्तर दें।`,
};

/**
 * Deterministic Safe Local Triage Engine
 * Calculates Priority Score (0-100), Priority Tier, and human explanation
 */
const calculateLocalTriage = ({ peopleCount = 1, children = 0, elderly = 0, injured = 0, disabled = 0, pregnant = 0, medicalEmergency = false, description = '', assistanceType = 'rescue' }) => {
  let score = 40; // baseline
  const reasons = [];

  if (medicalEmergency || injured > 0) {
    score += 25;
    reasons.push('active medical emergency / injury reported');
  }

  if (children > 0) {
    score += 12;
    reasons.push(`${children} infant(s)/child(ren) present`);
  }

  if (elderly > 0) {
    score += 12;
    reasons.push(`${elderly} elderly senior(s) at risk`);
  }

  if (pregnant > 0 || disabled > 0) {
    score += 12;
    reasons.push('persons requiring specialized mobility/medical care');
  }

  const descLower = (description || '').toLowerCase();
  if (descLower.includes('chest') || descLower.includes('drown') || descLower.includes('bleed') || descLower.includes('roof') || descLower.includes('trapped') || descLower.includes('collapse')) {
    score += 15;
    reasons.push('critical hazard keywords detected (rising water / structure collapse / severe trauma)');
  }

  if (assistanceType === 'rescue' || assistanceType === 'all_critical') {
    score += 10;
  }

  score = Math.min(100, Math.max(15, score));

  let severity = 'low';
  if (score >= 81) severity = 'critical';
  else if (score >= 61) severity = 'high';
  else if (score >= 31) severity = 'moderate';
  else severity = 'low';

  const reasonText = reasons.length > 0
    ? `High priority because the request includes: ${reasons.join(', ')}.`
    : 'Standard disaster assistance request evaluated.';

  return {
    priorityScore: score,
    severity,
    triageReason: `${reasonText} (AI-assisted triage — requires human verification.)`,
  };
};

/**
 * Dynamic Contextual Disaster Intelligence Engine
 * Parses exact user query and produces bespoke, actionable, safety-first responses
 */
const generateDynamicDisasterResponse = (query, lang = 'en') => {
  const q = (query || '').toLowerCase().trim();

  // Keyword categorization
  const isCpr = q.includes('cpr') || q.includes('compression') || q.includes('resuscitat') || q.includes('not breathing') || q.includes('heart stopped');
  const isBleeding = q.includes('bleed') || q.includes('blood') || q.includes('hemorrhage') || q.includes('cut') || q.includes('wound') || q.includes('tourniquet');
  const isFracture = q.includes('broken') || q.includes('fracture') || q.includes('bone') || q.includes('sprain') || q.includes('dislocat');
  const isHeartStroke = q.includes('chest pain') || q.includes('heart attack') || q.includes('stroke') || q.includes('paralysis');
  const isSnakeBite = q.includes('snake') || q.includes('bite') || q.includes('venom') || q.includes('poison') || q.includes('sting');
  const isMedicalGeneral = isCpr || isBleeding || isFracture || isHeartStroke || isSnakeBite || q.includes('medical') || q.includes('injury') || q.includes('first aid') || q.includes('unconscious') || q.includes('burn');

  const isEarthquake = q.includes('earthquake') || q.includes('quake') || q.includes('tremor') || q.includes('shaking') || q.includes('rubble') || q.includes('aftershock') || q.includes('collapse');
  const isFlood = q.includes('flood') || q.includes('water rising') || q.includes('drown') || q.includes('submerge') || q.includes('rising water') || q.includes('river overflow') || q.includes('inundat') || q.includes('flash flood');
  const isCyclone = q.includes('cyclone') || q.includes('storm') || q.includes('hurricane') || q.includes('typhoon') || q.includes('wind') || q.includes('gale') || q.includes('surge');
  const isFire = q.includes('fire') || q.includes('smoke') || q.includes('burn') || q.includes('flame') || q.includes('gas leak') || q.includes('lpg') || q.includes('blaze');
  const isWaterFood = q.includes('purif') || q.includes('clean water') || q.includes('drinking water') || q.includes('boil') || q.includes('chlorine') || q.includes('food') || q.includes('ration') || q.includes('thirst') || q.includes('starv');
  const isShelter = q.includes('shelter') || q.includes('evacuat') || q.includes('camp') || q.includes('safe place') || q.includes('where to go') || q.includes('safe house') || q.includes('stay');
  const isRescue = q.includes('trapped') || q.includes('stranded') || q.includes('stuck') || q.includes('rescue') || q.includes('save us') || q.includes('help me') || q.includes('sos') || q.includes('helicopter');
  const isMissing = q.includes('missing') || q.includes('lost') || q.includes('family') || q.includes('reunite') || q.includes('relative') || q.includes('child') || q.includes('parent');
  const isKit = q.includes('kit') || q.includes('bag') || q.includes('supplies') || q.includes('prepare') || q.includes('checklist') || q.includes('pack') || q.includes('battery');
  const isPanic = q.includes('panic') || q.includes('scared') || q.includes('afraid') || q.includes('terrified') || q.includes('anxious') || q.includes('calm');

  const hasChildren = q.includes('child') || q.includes('kid') || q.includes('baby') || q.includes('infant');

  // TELUGU RESPONSES
  if (lang === 'te') {
    if (isMedicalGeneral) {
      return `🩺 **అత్యవసర వైద్య మరియు ప్రథమ చికిత్స మార్గదర్శకత్వం (ReliefPulse AI)**

1. **శ్వాస & రక్తస్రావం**: బాధితుడు స్పృహలో ఉన్నాడా లేదా శ్వాస తీసుకుంటున్నాడా గమనించండి. తీవ్ర రక్తస్రావం ఉంటే శుభ్రమైన గుడ్డతో నేరుగా గట్టిగా నొక్కండి.
2. **కదల్చవద్దు**: వెన్నెముక లేదా ఎముక విరిగిన అనుమానం ఉంటే బాధితుడిని బలవంతంగా కదల్చవద్దు.
3. **సమీప ఆసుపత్రి**: కింగ్ జార్జ్ హాస్పిటల్ (KGH వైజాగ్) ట్రామా కేర్ లేదా జిల్లా ప్రభుత్వ ఆసుపత్రిని సంప్రదించండి.
4. **అంబులెన్స్ ఎమర్జెన్సీ**: తక్షణమే **108** లేదా **112** కు కాల్ చేయండి.

*(గమనిక: ఇది AI-సహాయక సమాచారం — వైద్య ధృవీకరణ అవసరం.)*`;
    }

    if (isFlood || isRescue) {
      return `🌊 **వరద రక్షణ & అత్యవసర తరలింపు సూచనలు (ReliefPulse AI)**

1. **ఎత్తైన ప్రదేశాలు**: నేల అంతస్తులో ఉండకండి; తక్షణమే భవనం పై అంతస్తులకు లేదా మేడపైకి చేరుకోండి.
2. **విద్యుత్ ప్రమాదం**: ఇంట్లోని మెయిన్ విద్యుత్ స్విచ్ (MCB) మరియు గ్యాస్ సిలిండర్ రెగ్యులేటర్ తక్షణమే ఆపండి. తెగిపడిన తీగలను తాకవద్దు.
3. **రెస్క్యూ సిగ్నల్**: రెస్క్యూ హెలికాప్టర్లు/బోట్లకు కనిపించేలా రంగు గుడ్డ లేదా మొబైల్ ఫ్లాష్‌లైట్ ఉపయోగించండి.
4. **సహాయం**: తక్షణ రెస్క్యూ కోసం **112** లేదా డిజాస్టర్ హెల్ప్‌లైన్ **1070** కి కాల్ చేయండి.`;
    }

    if (isShelter) {
      return `🏠 **సురక్షిత పునరావాస కేంద్రాల సమాచారం (ReliefPulse AI)**

1. **సమీప కేంద్రం**: 'St. Mary Evacuation Hub' & GVMC ఇండోర్ స్టేడియం కేంద్రాలలో భోజనం మరియు వైద్య సదుపాయాలు అందుబాటులో ఉన్నాయి.
2. **తీసుకోవాల్సినవి**: గుర్తింపు కార్డులు, మందులు, టార్చ్ లైట్, తాగునీరు మాత్రమే చిన్న బ్యాగ్‌లో తీసుకురండి.
3. **రవాణా సహాయం**: SDRF రవాణా వాహనాల కోసం హెల్ప్‌లైన్ **1070** లేదా **112** నంబర్‌ను సంప్రదించండి.`;
    }

    return `🛡️ **అత్యవసర విపత్తు మార్గదర్శకత్వం (ReliefPulse AI)**

- **ప్రశ్న**: "${query}"
- **తక్షణ చర్య**: మీ భద్రతకు అత్యధిక ప్రాధాన్యత ఇవ్వండి. ప్రస్తుతానికి సురక్షితమైన ప్రదేశంలో ఉండండి.
- **ఎమర్జెన్సీ హెల్ప్‌లైన్**: అత్యవసర సహాయం కోసం **112** లేదా **1070** కు కాల్ చేయండి.
- **ReliefPulse SOS**: ప్రత్యక్ష రెస్క్యూ టీమ్‌ల సహాయం కోసం ప్లాట్‌ఫామ్‌లోని 'SOS Distress' బటన్ నొక్కండి.

*(AI-సహాయక సమాచారం — మానవ ధృవీకరణ అవసరం.)*`;
  }

  // HINDI RESPONSES
  if (lang === 'hi') {
    if (isMedicalGeneral) {
      return `🩺 **आपातकालीन प्राथमिक चिकित्सा निर्देश (ReliefPulse AI)**

1. **रक्तस्राव नियंत्रण**: यदि गंभीर रक्तस्राव हो रहा है, तो साफ कपड़े से सीधे घाव पर लगातार दबाव बनाएं।
2. **सीपीआर (यदि सांस नहीं आ रही)**: छाती के केंद्र में 100-120 प्रति मिनट की गति से 2 इंच गहरा दबाव दें।
3. **निकटतम अस्पताल**: किंग जॉर्ज अस्पताल (KGH) ट्रॉमा सेंटर या नजदीकी सरकारी जिला अस्पताल।
4. **तत्काल एम्बुलेंस**: तुरंत **108** या **112** पर कॉल करें।

*(सूचना: यह AI-सहायक मार्गदर्शन है — चिकित्सकीय सत्यापन आवश्यक है।)*`;
    }

    if (isFlood || isRescue) {
      return `🌊 **बाढ़ एवं त्वरित बचाव निर्देश (ReliefPulse AI)**

1. **ऊंचे स्थान पर जाएं**: निचले तल को तुरंत खाली कर सुरक्षित ऊपरी मंजिल या पक्के भवन की छत पर जाएं।
2. **बिजली और गैस बंद करें**: मुख्य बिजली मीटर और गैस कनेक्शन तुरंत बंद करें। बहते पानी में पैर न रखें।
3. **सिग्नल दें**: बचाव दलों को संकेत देने के लिए चमकीला कपड़ा या टॉर्च का उपयोग करें।
4. **आपातकालीन सहायता**: राष्ट्रीय हेल्पलाइन **112** या राज्य आपदा नियंत्रण कक्ष **1070** पर संपर्क करें।`;
    }

    if (isShelter) {
      return `🏠 **सत्यापित सुरक्षित आश्रय स्थल (ReliefPulse AI)**

1. **निकटतम सक्रिय आश्रय**: 'St. Mary Evacuation Hub' एवं स्पोर्ट्स स्टेडियम राहत शिविर (भोजन, शुद्ध पेयजल एवं बिस्तर उपलब्ध)।
2. **आवश्यक सामग्री**: आवश्यक दवाएं, आधार कार्ड/दस्तावेज और मोबाइल पावर बैंक साथ रखें।
3. **हेल्पलाइन**: आधिकारिक आपदा नियंत्रण केंद्र: **112** / **1070**।`;
    }

    return `🛡️ **आपदा प्रबंधन आपातकालीन सहायता (ReliefPulse AI)**

- **आपका प्रश्न**: "${query}"
- **प्राथमिक कदम**: घबराएं नहीं। शांत रहकर सुरक्षित आश्रय में रहें और स्थानीय प्रशासन के निर्देशों का पालन करें।
- **राष्ट्रीय आपातकालीन नंबर**: **112** / आपदा हेल्पलाइन: **1070**।
- **त्वरित बचाव दल**: त्वरित सहायता के लिए ReliefPulse प्लेटफॉर्म पर 'SOS Distress' दर्ज करें।

*(AI-सहायक मार्गदर्शन — मानवीय आपातकालीन सत्यापन अनिवार्य है।)*`;
  }

  // ENGLISH CONTEXTUAL RESPONSES
  if (isCpr) {
    return `🚨 **Emergency CPR Step-by-Step Protocol (ReliefPulse AI)**

1. **Check Responsiveness**: Tap shoulders firmly and shout *"Are you okay?"*. Look for normal chest rise for 5 seconds.
2. **Call 108 / 112 Immediately**: Put the phone on speaker while starting compressions.
3. **Hand Placement**: Place heel of one hand in the center of chest (lower half of sternum), interlock second hand on top.
4. **Push Hard & Fast**: 
   - Compress **5 to 6 cm (2 inches)** deep.
   - Rate: **100 to 120 beats per minute** (to the rhythm of *"Stayin' Alive"*).
   - Allow full chest recoil between compressions.
5. **Continuous Compressions**: Do not stop until emergency medical responders arrive or an Automated External Defibrillator (AED) is applied.

⚠️ *AI-assisted guidance — verify with professional paramedic team arriving on scene.*`;
  }

  if (isBleeding) {
    return `🩸 **Severe Bleeding First-Aid Response (ReliefPulse AI)**

1. **Direct Firm Pressure**: Take a clean cloth, sterile gauze, or clothing and press down directly on the wound with maximum continuous pressure.
2. **Do Not Remove Soaked Dressings**: If blood soaks through, add more layers on top without lifting the initial cloth.
3. **Elevate Above Heart**: If limbs are bleeding without suspected bone fractures, raise the limb above heart level.
4. **Tourniquet Caution**: If life-threatening arterial bleeding from an arm or leg does not stop, apply a commercial tourniquet 2-3 inches above the wound (never directly over a joint or neck). Note application time.
5. **Treat for Shock**: Keep patient warm, calm, and lying flat with legs slightly elevated.

📞 **Emergency Ambulance**: Call **108** or **112** immediately.`;
  }

  if (isFracture) {
    return `🦴 **Suspected Fracture / Severe Sprain First Aid (ReliefPulse AI)**

1. **Immobilize the Area**: Do NOT attempt to straighten, push, or realign an injured bone or deformed joint.
2. **Support the Limb**: Use rolled magazines, umbrellas, or wooden slats padded with towels to stabilize above and below the joint.
3. **Control Bleeding**: If bone protrudes through skin (open fracture), cover with sterile moist cloth without applying direct bone pressure.
4. **Cold Compress**: Wrap an ice pack in a towel and apply for 15 minutes to reduce swelling.
5. **Transport**: Arrange stretcher dispatch via National Emergency **112** or transport to King George Hospital (KGH) Trauma Wing.`;
  }

  if (isSnakeBite) {
    return `🐍 **Snakebite Emergency Survival Protocol (ReliefPulse AI)**

1. **Keep Patient Still & Calm**: Movement speeds venom absorption into the bloodstream. Keep the bitten area immobilized below heart level.
2. **Remove Constricting Items**: Take off rings, watches, bracelets, or tight clothing immediately before swelling begins.
3. **DO NOT SUCK VENOM OR CUT THE WOUND**: Never apply ice, electric shocks, or tourniquets that cut off arterial pulse.
4. **Clean & Cover**: Gently wash wound with clean water and cover with dry, sterile dressing.
5. **Note Snake Appearance**: If safe, observe color and head shape for anti-venom selection at hospital.
6. **Transport Rapidly**: Rush to **District Government Hospital** or call **112 / 108** for anti-venom administration.`;
  }

  if (isEarthquake) {
    return `🏢 **Earthquake Survival Protocols (ReliefPulse AI)**

1. **IF INDOORS — DROP, COVER, HOLD ON**:
   - **DROP** to your hands and knees.
   - **COVER** your head and neck under a sturdy table or desk.
   - **HOLD ON** to your shelter until shaking stops.
   - Stay away from windows, exterior walls, and heavy overhead fixtures.
2. **DO NOT USE ELEVATORS**: Always use stairs after shaking ceases.
3. **IF OUTDOORS**: Move quickly to an open area away from electrical cables, billboards, brick masonry, and tall buildings.
4. **POST-TREMOR CHECKS**:
   - Check gas lines and turn off main regulator if you smell gas.
   - Be prepared for immediate aftershocks.
   - Tune into official All India Radio / SDRF alert broadcasts.

📞 **Disaster Helpline**: **1070** · **Emergency**: **112**`;
  }

  if (isFlood) {
    const childNote = hasChildren ? '\n- **Child Safety**: Secure life jackets or inflatable rings on children immediately. Never leave unattended.' : '';
    return `🌊 **Flood Emergency Action Plan (ReliefPulse AI)**

1. **Immediate Vertical Evacuation**: If water levels rise inside ground floors, immediately retreat to the 2nd floor, concrete roof, or designated elevated flood refuge.${childNote}
2. **Power Isolation**: Switch off the Main Distribution Board (MCB) and disconnect gas cylinders before water reaches electrical sockets.
3. **NEVER WALK THROUGH MOVING WATER**: Just **6 inches (15 cm)** of rapid water can sweep an adult off their feet; **2 feet** will float vehicles.
4. **Signal Rescuers**: Wave bright orange/red cloth or use phone strobes during helicopter/NDRF dinghy sweeps.
5. **Drinking Water Warning**: Tap water and flood runoffs are contaminated with sewage and leptospirosis. Drink only sealed bottled or boiled water.

📍 **Nearest Verified Relief Hub**: **St. Mary Disaster Evacuation Center** (Capacity: 305 beds open).
📞 **NDRF Rescue Request**: Submit an SOS via ReliefPulse or dial **112 / 1070**.`;
  }

  if (isCyclone) {
    return `🌀 **Severe Cyclone & High Wind Safety Action (ReliefPulse AI)**

1. **Secure Indoors**: Stay in the strongest central room of the building away from glass windows, exterior doors, and tin roofs.
2. **Watch for the "Eye of the Storm"**: If winds suddenly drop to zero, do NOT step outside—the opposite side of the storm will hit with equal or greater ferocity within minutes.
3. **Flying Debris Hazard**: Secure loose tin sheets, antenna poles, and solar mounts outside.
4. **Emergency Power**: Disconnect high-voltage electronics to prevent surge destruction. Keep mobile phones charged on power banks.
5. **Coastal Storm Surge**: Anyone within 3 km of the sea must evacuate to inland shelters immediately.

📍 **Open Cyclone Centers**: GVMC Community Center & Port Trust Shelter.
📞 **State Disaster Operations**: **1070** · **Emergency**: **112**`;
  }

  if (isFire) {
    return `🔥 **Structure Fire & Smoke Inhalation Protocol (ReliefPulse AI)**

1. **Crawl Low Under Smoke**: Heavy toxic smoke rises to the ceiling. Crawl on hands and knees where breathable air remains near the floor.
2. **Test Doors with Back of Hand**: Before opening any closed door, feel the doorknob with the back of your hand. If hot, DO NOT OPEN—find an alternate route.
3. **Never Use Elevators**: Elevators can lose power or open directly onto fire floors. Use fire exit stairwells.
4. **If Clothes Catch Fire**: **STOP, DROP, AND ROLL** until the flames are smothered.
5. **If Trapped in Room**: Seal cracks around doors with wet towels or bedding. Signal from a window with a flashlight or bright cloth.

📞 **Fire & Rescue Emergency**: Dial **101** or **112** immediately.`;
  }

  if (isWaterFood) {
    return `💧 **Safe Drinking Water & Food Purification in Disaster Zones (ReliefPulse AI)**

1. **Boiling (Gold Standard)**: Bring water to a vigorous, rolling boil for at least **1 full minute** (3 minutes at high altitudes). Allow to cool naturally.
2. **Chlorine Disinfection**: If boiling is impossible, add **2 drops of unscented household bleach (5-6% sodium hypochlorite)** per liter of clear water. Stir and let sit for 30 minutes. Water should have a slight chlorine scent.
3. **Turbid Water Pre-Filtration**: Pour cloudy flood water through a clean cotton cloth, sand filter, or coffee filter before boiling or chemical disinfection.
4. **Food Safety**: Discard all unpackaged food that has touched flood water. Use only commercially sealed cans; sanitize the outside of cans with disinfectant before opening.
5. **Infant Feeding**: Prepare infant formula using only boiled, purified water.

📍 **Emergency Water Depots**: GVMC Zone 2 Water Tanker & Red Cross Hub (free rations distribution).`;
  }

  if (isShelter) {
    return `🏠 **Verified Safe Shelters & Evacuation Points (ReliefPulse AI)**

1. **St. Mary Disaster Evacuation Center**:
   - Location: Bypass Junction, Sector 4
   - Resources: 305 available beds, clean water, medical triage unit on-site.
2. **GVMC Indoor Stadium Relief Camp**:
   - Location: Coastal Sector 2
   - Resources: 450 capacity, hot meals, battery recharge bank.
3. **Andhra University Relief Center**:
   - Location: AU Campus Ground
   - Resources: Family reunification desk & baby formula depot.

🎒 **What to Bring**: Official photo ID, 3-day supply of prescription medication, infant supplies, phone charger, and a flashlight.
📞 **Shelter Transport Assistance**: Dial **1070** or register your SOS on ReliefPulse.`;
  }

  if (isRescue) {
    return `🚨 **Urgent Distress & Rescue Beacon Protocol (ReliefPulse AI)**

1. **Stay Put & Visible**: If you are in an elevated, structurally sound location, stay there. Attempting to swim or wade through flood waters carries extreme risk of drowning or electrocution.
2. **Emergency Beacon**:
   - Tie a bright red, orange, or white cloth to your roof or highest point.
   - At night, use intermittent bursts of flashlight (3 short, 3 long, 3 short SOS).
3. **Preserve Device Battery**: Put your smartphone in Ultra Battery Saver mode, reduce screen brightness to minimum, and turn off background apps.
4. **SOS Registration**: Submit your GPS coordinates using the **SOS DISTRESS** button on this platform so rescue commanders can dispatch an SDRF/NDRF boat to your precise location.

📞 **Emergency Hotlines**: **112** (National Emergency) · **1070** (State Disaster Response Force).`;
  }

  if (isMissing) {
    return `🔍 **Family Reunification & Missing Person Protocol (ReliefPulse AI)**

1. **Platform Registration**: Go to the **Family Reunification** tab in the ReliefPulse sidebar and submit a missing person bulletin with:
   - Full name, age, last known location, and identifying clothing/marks.
   - Upload a recent clear photograph if available.
2. **Check Verified Shelter Logs**: All arriving evacuees at St. Mary Hub and GVMC Stadium are registered with central NDRF manifest.
3. **Central Red Cross Tracing**: Red Cross family tracing specialists are stationed at all major evacuation hubs.
4. **Broadcast Alerts**: Radio station updates and missing bulletins are broadcast across community FM frequencies.

📞 **Reunification Helpline**: Call **1070** and ask for the Central Evacuee Manifest Registry.`;
  }

  if (isKit) {
    return `🎒 **72-Hour Emergency Go-Bag Survival Checklist (ReliefPulse AI)**

- **Water**: 3 liters of drinking water per person per day.
- **Food**: 3-day supply of non-perishable, high-calorie foods (nuts, granola, energy bars, canned goods).
- **Light & Power**: LED flashlight, extra batteries, solar-powered power bank, hand-crank radio.
- **Medical Supplies**: First aid kit, 7-day supply of prescription medication, antiseptic wipes, sterile bandages.
- **Important Documents**: Waterproof pouch containing Aadhaar/voter ID, insurance papers, bank records, cash in small bills.
- **Hygiene**: Wet wipes, chlorine water purification tablets, toothbrush, hand sanitizer.
- **Tools**: Multi-tool knife, whistle for signaling rescuers, dust masks, waterproof matches.`;
  }

  // GENERAL SMART DISASTER ASSISTANT
  return `🛡️ **ReliefPulse AI Disaster Advisory**

- **Inquiry**: "${query}"
- **Immediate Guidance**:
  1. Maintain situational awareness and monitor official NDRF / SDMA advisories.
  2. If experiencing an immediate life hazard, navigate to the **Emergency SOS** section on this platform for direct satellite/GPS dispatch.
  3. Verified safe shelter and medical stations are actively operating across Visakhapatnam, Kakinada, and East Godavari.
  4. Ensure mobile communication is preserved; keep backup battery packs charged.
- **National Emergency Contacts**:
  - Police / Medical / Fire: **112**
  - State Disaster Response Helpline: **1070**
  - Ambulance Emergency: **108**

⚠️ *Disclaimer: AI-assisted guidance — requires human emergency verification.*`;
};

/**
 * Send chat prompt to Groq API with automatic fallback and language context
 */
const getGroqChatResponse = async (messages, options = {}) => {
  const lang = options.language || 'en';
  const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.en;
  const apiKey = process.env.GROQ_API_KEY;

  // Extract latest user query
  const userMessages = messages.filter((m) => m.role === 'user');
  const latestQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';

  // Attempt Groq API if key is present and appears formatted
  if (apiKey && apiKey.startsWith('gsk_') && apiKey.length > 20) {
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.filter((m) => m.role !== 'system'),
    ];

    const candidateModels = [
      options.model || process.env.GROQ_MODEL || DEFAULT_MODEL,
      ...FALLBACK_MODELS,
    ];
    const uniqueModels = [...new Set(candidateModels)];

    for (const model of uniqueModels) {
      try {
        const response = await axios.post(
          GROQ_API_URL,
          {
            model,
            messages: fullMessages,
            temperature: 0.5,
            max_tokens: 1024,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        const assistantMsg = response.data?.choices?.[0]?.message?.content;
        if (assistantMsg) {
          return {
            content: assistantMsg,
            model: response.data.model || model,
          };
        }
      } catch (err) {
        // Continue to next model or fallback
      }
    }
  }

  const error = new Error('AI assistance is temporarily unavailable.');
  error.statusCode = 503;
  error.code = 'AI_UNAVAILABLE';
  throw error;
};

/**
 * AI Triage Service Abstraction
 */
const runAiTriage = async (emergencyData) => {
  const localResult = calculateLocalTriage(emergencyData);
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return localResult;
  }

  try {
    const prompt = `Perform disaster emergency triage on this report:
Disaster: ${emergencyData.disasterType || 'cyclone'}
Assistance: ${emergencyData.assistanceType || 'rescue'}
People: ${emergencyData.peopleCount} (Children: ${emergencyData.children || 0}, Elderly: ${emergencyData.elderly || 0}, Injured: ${emergencyData.injured || 0})
Medical Emergency: ${emergencyData.medicalEmergency ? 'YES' : 'NO'}
Description: "${emergencyData.description}"

Respond with ONLY valid JSON:
{
  "priorityScore": number (0 to 100),
  "severity": "critical" | "high" | "moderate" | "low",
  "reason": "1-2 sentence concise reason for priority score."
}`;

    const res = await axios.post(
      GROQ_API_URL,
      {
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 200,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 6000,
      }
    );

    const raw = res.data?.choices?.[0]?.message?.content?.trim() || '';
    const cleaned = raw.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      priorityScore: Number(parsed.priorityScore) || localResult.priorityScore,
      severity: ['critical', 'high', 'moderate', 'low'].includes(parsed.severity) ? parsed.severity : localResult.severity,
      triageReason: `${parsed.reason || localResult.triageReason} (AI-assisted triage — requires human verification.)`,
    };
  } catch {
    return localResult;
  }
};

module.exports = {
  getGroqChatResponse,
  calculateLocalTriage,
  runAiTriage,
  generateDynamicDisasterResponse,
  DEFAULT_MODEL,
};
