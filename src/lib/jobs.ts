export interface JobNotification {
  id: string;
  title: string;
  titleHindi: string;
  organization: string;
  orgShort: string;
  category: 'government' | 'police_defense' | 'railways' | 'banking' | 'teaching' | 'international' | 'healthcare' | 'tech';
  regionType: 'up_state' | 'all_india' | 'international' | 'other_states';
  countryOrState: string;
  countryCode?: string;
  totalVacancies: number;
  qualification: string;
  qualificationHindi: string;
  ageLimit: string;
  salaryRange?: string;
  applicationDeadline: string; // YYYY-MM-DD
  status: 'ACTIVE' | 'CLOSING_SOON' | 'ADMIT_CARD' | 'RESULT_DECLARED';
  applicationFee?: string;
  officialNotificationUrl: string;
  applyUrl: string;
  postedAt: string;
  featured?: boolean;
  description: string;
  selectionProcess?: string[];
  keyDates?: { label: string; date: string }[];
}

export const SAMPLE_JOBS: JobNotification[] = [
  // --- UTTAR PRADESH STATE RECRUITMENTS ---
  {
    id: 'job-up-police-constable',
    title: 'UP Police Constable & PAC 60,244 Posts Recruitment 2026',
    titleHindi: 'यूपी पुलिस कांस्टेबल एवं पीएसी 60,244 पद सीधी भर्ती',
    organization: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB)',
    orgShort: 'UPPRPB',
    category: 'police_defense',
    regionType: 'up_state',
    countryOrState: 'उत्तर प्रदेश (UP State)',
    countryCode: 'IN-UP',
    totalVacancies: 60244,
    qualification: '10+2 (Intermediate)',
    qualificationHindi: '12वीं (इंटरमीडिएट) पास',
    ageLimit: '18 से 25 वर्ष (नियमानुसार छूट)',
    salaryRange: '₹21,700 - ₹69,100 (पे मैट्रिक्स लेवल-3)',
    applicationDeadline: '2026-12-18',
    status: 'ACTIVE',
    applicationFee: 'सामान्य / ओबीसी: ₹400, एससी / एसटी: ₹400',
    officialNotificationUrl: 'http://uppbpb.gov.in',
    applyUrl: 'http://uppbpb.gov.in',
    postedAt: '2026-11-20',
    featured: true,
    description: 'उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड द्वारा आरक्षी नागरिक पुलिस एवं पीएसी के 60 हजार से अधिक पदों पर बंपर भर्ती प्रक्रिया सक्रिय है। गाजीपुर, लखनऊ, वाराणसी सहित सभी जिलों के अभ्यर्थी पात्र हैं।',
    selectionProcess: ['लिखित परीक्षा (ओएमआर आधारित)', 'दस्तावेज सत्यापन एवं शारीरिक मानक परीक्षण (PST)', 'शारीरिक दक्षता परीक्षा (PET दौड़)', 'अंतिम मेरिट सूची'],
    keyDates: [
      { label: 'आवेदन शुरू', date: '2026-11-01' },
      { label: 'अंतिम तिथि', date: '2026-12-18' },
      { label: 'परीक्षा तिथि', date: 'जनवरी 2027 (प्रस्तावित)' }
    ]
  },
  {
    id: 'job-up-lekhpal',
    title: 'UPSSSC Rajasva Lekhpal 8,085 Vacancies Recruitment 2026',
    titleHindi: 'यूपीएसएसएससी राजस्व लेखपाल 8,085 पदों पर भर्ती',
    organization: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)',
    orgShort: 'UPSSSC',
    category: 'government',
    regionType: 'up_state',
    countryOrState: 'उत्तर प्रदेश (UP State)',
    countryCode: 'IN-UP',
    totalVacancies: 8085,
    qualification: '12th Pass + UP PET Qualified',
    qualificationHindi: '12वीं पास + यूपी पीईटी (PET) वैध स्कोर',
    ageLimit: '18 से 40 वर्ष',
    salaryRange: '₹5,200 - ₹20,200 (ग्रेड पे ₹2,000)',
    applicationDeadline: '2026-12-05',
    status: 'CLOSING_SOON',
    applicationFee: 'सामान्य / ओबीसी: ₹25 (प्रारंभिक शुल्क), मुख्य परीक्षा शुल्क अलग से',
    officialNotificationUrl: 'http://upsssc.gov.in',
    applyUrl: 'http://upsssc.gov.in',
    postedAt: '2026-11-15',
    featured: true,
    description: 'उत्तर प्रदेश राजस्व विभाग में लेखपाल के पदों पर भर्ती हेतु आवेदन आमंत्रित किए गए हैं। ग्रामीण भूमि पैमाइश, चकबंदी व राजस्व रिकॉर्ड प्रबंधन हेतु महत्वपूर्ण भर्ती।',
    selectionProcess: ['पीईटी स्कोर शॉर्टलिस्टिंग', 'मुख्य लिखित परीक्षा', 'दस्तावेज सत्यापन'],
    keyDates: [
      { label: 'आवेदन शुरू', date: '2026-11-10' },
      { label: 'अंतिम तिथि', date: '2026-12-05' }
    ]
  },
  {
    id: 'job-up-teachers',
    title: 'UP Basic Education Council 51,000 Primary Teachers Recruitment',
    titleHindi: 'यूपी बेसिक शिक्षा परिषद 51,000 प्राथमिक शिक्षक (Super TET) भर्ती',
    organization: 'UP Basic Education Board, Prayagraj',
    orgShort: 'UPBEB',
    category: 'teaching',
    regionType: 'up_state',
    countryOrState: 'उत्तर प्रदेश (UP State)',
    countryCode: 'IN-UP',
    totalVacancies: 51000,
    qualification: 'D.El.Ed / B.Ed + UPTET / CTET Pass',
    qualificationHindi: 'स्नातक + डीएलएड/बीएड + यूपीटीईटी / सीटीईटी उत्तीर्ण',
    ageLimit: '21 से 40 वर्ष',
    salaryRange: '₹35,400 - ₹1,12,400 (लेवल-6)',
    applicationDeadline: '2026-12-30',
    status: 'ACTIVE',
    applicationFee: 'सामान्य / ओबीसी: ₹700, एससी / एसटी: ₹500',
    officialNotificationUrl: 'https://updeled.gov.in',
    applyUrl: 'https://updeled.gov.in',
    postedAt: '2026-11-18',
    featured: true,
    description: 'उत्तर प्रदेश के प्राथमिक व उच्च प्राथमिक विद्यालयों में शिक्षकों के रिक्त पदों पर बंपर भर्ती प्रक्रिया का शासनादेश। सभी जिलों में काउंसिलिंग के आधार पर पोस्टिंग होगी।',
    selectionProcess: ['सुपर टीईटी (Super TET) लिखित परीक्षा', 'अकादमिक मेरिट (10वीं, 12वीं, स्नातक, प्रशिक्षण)', 'जिला स्तरीय काउंसिलिंग']
  },

  // --- ALL INDIA CENTRAL GOVT JOBS ---
  {
    id: 'job-ssc-gd',
    title: 'SSC GD Constable in BSF, CISF, CRPF, ITBP 45,284 Vacancies',
    titleHindi: 'एसएससी जीडी कांस्टेबल (बीएसएफ, सीआईएसएफ, सीआरपीएफ) 45,284 पद',
    organization: 'Staff Selection Commission (SSC)',
    orgShort: 'SSC',
    category: 'police_defense',
    regionType: 'all_india',
    countryOrState: 'All India (केन्द्रीय सरकार)',
    countryCode: 'IN',
    totalVacancies: 45284,
    qualification: '10th Class (Matriculation)',
    qualificationHindi: '10वीं (हाईस्कूल) पास',
    ageLimit: '18 से 23 वर्ष (आरक्षित वर्गों को 5 वर्ष तक छूट)',
    salaryRange: '₹21,700 - ₹69,100 (लेवल-3)',
    applicationDeadline: '2026-12-25',
    status: 'ACTIVE',
    applicationFee: 'सामान्य / ओबीसी: ₹100, महिला / एससी / एसटी: ₹0',
    officialNotificationUrl: 'https://ssc.gov.in',
    applyUrl: 'https://ssc.gov.in',
    postedAt: '2026-11-21',
    featured: true,
    description: 'केंद्रीय अर्धसैनिक बलों (BSF, CISF, CRPF, SSB, ITBP, AR, SSF) में सिपाही जीडी के पदों पर अखिल भारतीय स्तर पर भर्ती। कंप्यूटर आधारित परीक्षा हिंदी व अंग्रेजी सहित 13 क्षेत्रीय भाषाओं में आयोजित होगी।',
    selectionProcess: ['कंप्यूटर आधारित परीक्षा (CBE)', 'शारीरिक मानक व दक्षता परीक्षा (PST/PET)', 'चिकित्सा परीक्षण (DME/RME)']
  },
  {
    id: 'job-rrb-railway',
    title: 'Indian Railways RRB Technician & Assistant Loco Pilot 18,799 Posts',
    titleHindi: 'भारतीय रेलवे (RRB) सहायक लोको पायलट व तकनीशियन 18,799 पद',
    organization: 'Railway Recruitment Boards (RRB)',
    orgShort: 'RRB',
    category: 'railways',
    regionType: 'all_india',
    countryOrState: 'All India (भारतीय रेल)',
    countryCode: 'IN',
    totalVacancies: 18799,
    qualification: '10th + ITI / Diploma in Engineering',
    qualificationHindi: '10वीं पास + संबंधित ट्रेड में आईटीआई या इंजीनियरिंग डिप्लोमा',
    ageLimit: '18 से 30 वर्ष',
    salaryRange: '₹19,900 - ₹63,200 (लेवल-2) + रनिंग अलाउंस',
    applicationDeadline: '2026-12-10',
    status: 'CLOSING_SOON',
    applicationFee: 'सामान्य / ओबीसी: ₹500 (सीबीटी देने पर ₹400 रिफंड), एससी / एसटी: ₹250',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    applyUrl: 'https://rrbcdg.gov.in',
    postedAt: '2026-11-12',
    featured: true,
    description: 'भारतीय रेलवे के विभिन्न जोनों में ट्रेन संचालन और रखरखाव के लिए लोको पायलट और तकनीशियनों की बड़े पैमाने पर भर्ती। पूर्वांचल व उत्तर रेलवे के अभ्यर्थी बड़ी संख्या में आवेदन कर सकते हैं।',
    selectionProcess: ['सीबीटी चरण-1 (Screening)', 'सीबीटी चरण-2 (Technical + Non-Tech)', 'कंप्यूटर आधारित योग्यता परीक्षा (CBAT/Psycho)', 'दस्तावेज एवं मेडिकल']
  },
  {
    id: 'job-sbi-po',
    title: 'State Bank of India (SBI) Probationary Officers (PO) 2,000 Posts',
    titleHindi: 'स्टेट बैंक ऑफ इंडिया (SBI) प्रोबेशनरी ऑफिसर (PO) 2,000 पद',
    organization: 'State Bank of India',
    orgShort: 'SBI',
    category: 'banking',
    regionType: 'all_india',
    countryOrState: 'All India (बैंकिंग)',
    countryCode: 'IN',
    totalVacancies: 2000,
    qualification: 'Graduation in Any Discipline',
    qualificationHindi: 'किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक (ग्रेजुएशन)',
    ageLimit: '21 से 30 वर्ष',
    salaryRange: '₹65,000+ प्रतिमाह (सकल परिलब्धियां + आवास भत्ता)',
    applicationDeadline: '2026-12-08',
    status: 'ACTIVE',
    applicationFee: 'सामान्य / ओबीसी / ईडब्ल्यूएस: ₹750, एससी / एसटी / दिव्यांग: ₹0',
    officialNotificationUrl: 'https://sbi.co.in/careers',
    applyUrl: 'https://sbi.co.in/careers',
    postedAt: '2026-11-17',
    featured: false,
    description: 'देश के सबसे बड़े सरकारी बैंक में मैनेजमेंट कैडर के तहत पीओ पदों पर भर्ती। आकर्षक वेतनमान, देश-विदेश में पोस्टिंग के अवसर एवं तेज पदोन्नति नीति।'
  },

  // --- INTERNATIONAL / OVERSEAS JOBS (COUNTRY-WISE) ---
  {
    id: 'job-gulf-uae-nurses',
    title: 'UAE & Gulf Ministry of Health Certified Staff Nurses & Healthcare Technicians',
    titleHindi: 'दुबई एवं संयुक्त अरब अमीरात (UAE) स्वास्थ्य मंत्रालय स्टाफ नर्स व पैरामेडिकल भर्ती',
    organization: 'Ministry of Health & Prevention (MOHAP) UAE / Gulf Overseas Council',
    orgShort: 'MOHAP UAE',
    category: 'healthcare',
    regionType: 'international',
    countryOrState: 'संयुक्त अरब अमीरात (UAE / Dubai / Abu Dhabi)',
    countryCode: 'AE',
    totalVacancies: 1250,
    qualification: 'B.Sc Nursing / GNM + 2 Yrs Exp (DHA/MOH License Support)',
    qualificationHindi: 'बीएससी नर्सिंग / जीएनएम डिप्लोमा + 2 वर्ष क्लिनिकल अनुभव',
    ageLimit: '22 से 40 वर्ष',
    salaryRange: 'AED 8,500 - 16,000 / माह (लगभग ₹1,95,000 - ₹3,65,000 टैक्स-फ्री) + आवास',
    applicationDeadline: '2027-01-15',
    status: 'ACTIVE',
    applicationFee: 'निःशुल्क सरकारी पंजीकरण (Government Certified Agency Protocol)',
    officialNotificationUrl: 'https://www.mohap.gov.ae/en/services/careers',
    applyUrl: 'https://www.mohap.gov.ae/en/services/careers',
    postedAt: '2026-11-19',
    featured: true,
    description: 'दुबई, अबू धाबी एवं शारजाह के सरकारी व सुपर स्पेशियलिटी अस्पतालों में भारतीय नर्सों और मेडिकल लैब टेक्नीशियनों की सीधी भर्ती। चयनित उम्मीदवारों को निःशुल्क कार्य वीजा, हवाई टिकट और फैमिली स्पॉन्सरशिप की सुविधा मिलेगी।',
    selectionProcess: ['दस्तावेज व नर्सिंग काउंसिल सत्यापन', 'ऑनलाइन वीडियो साक्षात्कार (MS Teams)', 'डीएचए/एमओएच परीक्षा सहायता', 'वीजा व वर्क परमिट जारी'],
    keyDates: [
      { label: 'आवेदन प्रक्रिया सक्रिय', date: '2026-11-15' },
      { label: 'साक्षात्कार चरण', date: 'दिसंबर 2026 - जनवरी 2027' }
    ]
  },
  {
    id: 'job-saudi-neom-engineers',
    title: 'Saudi Arabia Mega Projects (NEOM & Metro) Civil & Electrical Supervisors',
    titleHindi: 'सऊदी अरब (NEOM एवं रियाद मेट्रो) सिविल व इलेक्ट्रिकल इंजीनियर व सुपरवाइजर',
    organization: 'NEOM Infrastructure Authority / NSDC International Partner',
    orgShort: 'NEOM KSA',
    category: 'tech',
    regionType: 'international',
    countryOrState: 'सऊदी अरब (Saudi Arabia / Neom City)',
    countryCode: 'SA',
    totalVacancies: 680,
    qualification: 'B.Tech / Diploma in Civil / Electrical / Safety Engineering',
    qualificationHindi: 'बीटेक या 3 वर्षीय पॉलीटेक्निक डिप्लोमा (सिविल / इलेक्ट्रिकल / सेफ्टी)',
    ageLimit: '23 से 45 वर्ष',
    salaryRange: 'SAR 7,000 - 14,000 / माह (लगभग ₹1,55,000 - ₹3,10,000) + भोजन व आवास',
    applicationDeadline: '2026-12-28',
    status: 'ACTIVE',
    applicationFee: 'विदेश मंत्रालय (MEA India) अनुबंधित भर्ती नीति',
    officialNotificationUrl: 'https://www.neom.com/en-us/careers',
    applyUrl: 'https://www.neom.com/en-us/careers',
    postedAt: '2026-11-14',
    featured: true,
    description: 'दुनिया के सबसे बड़े स्मार्ट सिटी प्रोजेक्ट "नियोम" और रियाद इंफ्रास्ट्रक्चर नेटवर्क के लिए भारतीय इंजीनियरों, सर्वेयरों व सेफ्टी अधिकारियों की भर्ती। भारत सरकार के ई-माइग्रेट (e-Migrate) पोर्टल द्वारा प्रमाणित।',
    selectionProcess: ['तकनीकी सीवी शॉर्टलिस्टिंग', 'फेस-टू-फेस / वीडियो इंटरव्यू', 'मेडिकल फिटनेस (GAMCA)', 'ई-माइग्रेट वर्क वीजा स्टैम्पिंग']
  },
  {
    id: 'job-germany-chancenkarte',
    title: 'Germany Opportunity Card (Chancenkarte) Skilled IT & Engineering Talent 2026',
    titleHindi: 'जर्मनी ऑपर्च्युनिटी कार्ड (Chancenkarte) कुशल आईटी, ऑटोमेशन व टेक जॉब्स',
    organization: 'Federal Employment Agency of Germany (Bundesagentur für Arbeit)',
    orgShort: 'BA Germany',
    category: 'tech',
    regionType: 'international',
    countryOrState: 'जर्मनी / यूरोप (Germany / EU)',
    countryCode: 'DE',
    totalVacancies: 4500,
    qualification: 'Degree in Engineering / Computer Science / Vocational Training + Basic German or English',
    qualificationHindi: 'इंजीनियरिंग / कंप्यूटर साइंस में डिग्री या मान्यता प्राप्त तकनीकी प्रशिक्षण',
    ageLimit: '21 से 40 वर्ष',
    salaryRange: '€4,200 - €7,500 / माह (लगभग ₹3,80,000 - ₹6,80,000)',
    applicationDeadline: '2027-02-28',
    status: 'ACTIVE',
    applicationFee: 'जर्मन दूतावास वीज़ा शुल्क: €75',
    officialNotificationUrl: 'https://www.make-it-in-germany.com',
    applyUrl: 'https://www.make-it-in-germany.com',
    postedAt: '2026-11-16',
    featured: true,
    description: 'जर्मनी सरकार के नए "ऑपर्च्युनिटी कार्ड" कानून के तहत भारतीय तकनीकी स्नातकों को बिना पहले से जॉब ऑफर के भी जर्मनी में रहकर नौकरी खोजने का वैध 1 वर्ष का वर्क वीजा मिल रहा है। आईटी, मैकेनिकल और एआई पेशेवरों के लिए सुनहरा अवसर।',
    selectionProcess: ['पॉइंट्स कैलकुलेटर मूल्यांकन (भाषा, आयु, योग्यता)', 'जर्मन दूतावास वीजा साक्षात्कार', 'जर्मनी में ऑन-साइट जॉब मैचिंग']
  },
  {
    id: 'job-japan-titp',
    title: 'Japan TITP & SSW Technical Interns & Construction Specialists (TITP Japan)',
    titleHindi: 'जापान तकनीकी इंटर्न व विनिर्माण विशेषज्ञ (NSDC इंटरनेशनल सहयोग)',
    organization: 'Japan International Training Cooperation Organization (JITCO)',
    orgShort: 'JITCO Japan',
    category: 'international',
    regionType: 'international',
    countryOrState: 'जापान (Japan - Tokyo & Osaka)',
    countryCode: 'JP',
    totalVacancies: 350,
    qualification: '10th / 12th / ITI + Japanese Language N5/N4 Training',
    qualificationHindi: '10वीं / 12वीं / आईटीआई + जापानी भाषा एन5/एन4 प्रारंभिक ज्ञान',
    ageLimit: '18 से 32 वर्ष',
    salaryRange: 'JPY 180,000 - 260,000 / माह (लगभग ₹1,10,000 - ₹1,65,000)',
    applicationDeadline: '2027-01-30',
    status: 'ACTIVE',
    officialNotificationUrl: 'https://nsdcinternational.com',
    applyUrl: 'https://nsdcinternational.com',
    postedAt: '2026-11-10',
    featured: false,
    description: 'जापान सरकार और भारत सरकार के कौशल विकास मंत्रालय के तत्वावधान में जापानी कंपनियों में 3 से 5 वर्ष के लिए उच्च-वेतन तकनीकी इंटर्नशिप। प्रशिक्षण अवधि के दौरान पूर्ण छात्रवृत्ति व हवाई टिकट।'
  },
  {
    id: 'job-global-remote-tech',
    title: 'Global Remote Software Engineers & Generative AI Data Specialists (Work from Home)',
    titleHindi: 'ग्लोबल रिमोट सॉफ्टवेयर व जेनरेटिव एआई डेटा विशेषज्ञ (वर्क फ्रॉम होम)',
    organization: 'Apex Global Tech Consortium / Remote Horizon',
    orgShort: 'Apex Tech',
    category: 'tech',
    regionType: 'international',
    countryOrState: 'ग्लोबल रिमोट (Global Remote / US & Europe)',
    countryCode: 'US',
    totalVacancies: 180,
    qualification: 'Proficiency in Python / React / Data Engineering / LLMs',
    qualificationHindi: 'कंप्यूटर साइंस स्नातक या कोडिंग/एआई में उत्कृष्ट कौशल',
    ageLimit: '18+ वर्ष',
    salaryRange: '$2,500 - $5,000 / माह (लगभग ₹2,10,000 - ₹4,20,000) फुल टाइम रिमोट',
    applicationDeadline: '2026-12-31',
    status: 'ACTIVE',
    officialNotificationUrl: 'https://remotehorizon.io',
    applyUrl: 'https://remotehorizon.io',
    postedAt: '2026-11-22',
    featured: false,
    description: 'घर बैठे अमेरिका व यूरोप की शीर्ष टेक कंपनियों के लिए रिमोट काम करने का अवसर। लचीले घंटे, अंतर्राष्ट्रीय डॉलर भुगतान और नवीनतम एआई सिस्टम पर कार्य का अनुभव।'
  },

  // --- OTHER STATES ---
  {
    id: 'job-bihar-bpsc-tre',
    title: 'Bihar BPSC Teacher Recruitment Phase-4 (TRE 4.0) 87,000 Posts',
    titleHindi: 'बिहार लोक सेवा आयोग (BPSC) शिक्षक भर्ती फेज-4 (TRE 4.0) 87,000 पद',
    organization: 'Bihar Public Service Commission (BPSC)',
    orgShort: 'BPSC',
    category: 'teaching',
    regionType: 'other_states',
    countryOrState: 'बिहार (Bihar State)',
    countryCode: 'IN-BR',
    totalVacancies: 87000,
    qualification: 'Graduation + B.Ed/D.El.Ed + CTET/STET Qualified',
    qualificationHindi: 'स्नातक + प्रशिक्षण + सीटीईटी/एसटीईटी उत्तीर्ण (यूपी के अभ्यर्थी भी सामान्य श्रेणी में पात्र)',
    ageLimit: '21 से 37 वर्ष',
    salaryRange: '₹35,000 - ₹50,000 प्रतिमाह',
    applicationDeadline: '2026-12-20',
    status: 'ACTIVE',
    officialNotificationUrl: 'https://bpsc.bih.nic.in',
    applyUrl: 'https://bpsc.bih.nic.in',
    postedAt: '2026-11-15',
    featured: false,
    description: 'बिहार राज्य के विद्यालयों में प्राथमिक, माध्यमिक व उच्च माध्यमिक अध्यापकों के 87 हजार पदों पर भर्ती। उत्तर प्रदेश व पूर्वांचल सीमावर्ती जिलों के युवा भी आवेदन के पात्र हैं।'
  }
];

export function getJobs(options?: {
  regionType?: string;
  category?: string;
  search?: string;
  status?: string;
  limit?: number;
}): JobNotification[] {
  let list = [...SAMPLE_JOBS];

  if (options?.regionType && options.regionType !== 'all') {
    list = list.filter(j => j.regionType === options.regionType);
  }

  if (options?.category && options.category !== 'all') {
    list = list.filter(j => j.category === options.category);
  }

  if (options?.status && options.status !== 'all') {
    list = list.filter(j => j.status === options.status);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.titleHindi.toLowerCase().includes(q) ||
      j.organization.toLowerCase().includes(q) ||
      j.countryOrState.toLowerCase().includes(q) ||
      j.qualification.toLowerCase().includes(q) ||
      j.qualificationHindi.toLowerCase().includes(q)
    );
  }

  if (options?.limit) {
    return list.slice(0, options.limit);
  }

  return list;
}
