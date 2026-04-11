export type Lang = "en" | "hi" | "ar" | "de" | "es";

export const LANG_META: Record<Lang, { label: string; native: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", native: "EN", dir: "ltr" },
  hi: { label: "Hindi", native: "हि", dir: "ltr" },
  ar: { label: "Arabic", native: "ع", dir: "rtl" },
  de: { label: "German", native: "DE", dir: "ltr" },
  es: { label: "Spanish", native: "ES", dir: "ltr" },
};

/* ------------------------------------------------------------------ */
/*  Translation keys                                                   */
/* ------------------------------------------------------------------ */

const translations: Record<Lang, {
  nav: { about: string; experience: string; projects: string; skills: string; contact: string; light: string; dark: string; hireMe: string };
  hero: {
    eyebrow: string; name: string; subtitle: string; subtitleCompany: string; subtitleSuffix: string;
    viewProjects: string; contactMe: string; scroll: string;
    stats: { internships: string; studentsReached: string; mlAccuracy: string; dubai: string };
  };
  projects: {
    label: string; heading: string; allGithub: string;
    fraud: { title: string; cat: string; desc: string };
    forecast: { title: string; cat: string; desc: string };
    examforge: { title: string; cat: string; desc: string };
    orvyn: { title: string; cat: string; desc: string };
    f1: { title: string; cat: string; desc: string };
    spotify: { title: string; cat: string; desc: string };
    medair: { title: string; cat: string; desc: string };
  };
  skills: {
    label: string; heading: string; subtitle: string;
    domains: { aiml: { area: string; detail: string }; fullstack: { area: string; detail: string }; infra: { area: string; detail: string }; langs: { area: string; detail: string } };
  };
  experience: {
    label: string; heading: string; keyContrib: string;
    baraka: { role: string; type: string; bullets: string[] };
    indigo: { role: string; type: string; bullets: string[] };
    lab: { role: string; type: string; bullets: string[] };
  };
  contact: {
    label: string; heading1: string; heading2: string; heading3: string;
    subtitle: string; sayHello: string; available: string;
  };
}> = {

  /* ================================================================ */
  /*  ENGLISH                                                          */
  /* ================================================================ */
  en: {
    nav: { about: "About", experience: "Experience", projects: "Projects", skills: "Skills", contact: "Contact", light: "Light", dark: "Dark", hireMe: "Hire Me" },
    hero: {
      eyebrow: "AI Engineer & Software Developer — Dubai, UAE",
      name: "Sanjit Mathur",
      subtitle: "Building intelligent systems, modern web applications, and developer tools. Previously at",
      subtitleCompany: "Baraka Financial",
      subtitleSuffix: "— open to new opportunities.",
      viewProjects: "View Projects",
      contactMe: "Contact Me",
      scroll: "scroll",
      stats: { internships: "Internships", studentsReached: "Students Reached", mlAccuracy: "ML Accuracy", dubai: "Dubai" },
    },
    projects: {
      label: "Projects", heading: "Things I've built", allGithub: "All on GitHub →",
      fraud: { title: "Distributed Fraud Detection", cat: "ML · Security", desc: "Built ensemble anomaly detection system (Isolation Forest, LOF, Autoencoder) processing 284K credit card transactions. Engineered domain-specific features and trained models on normal-only data; automated threshold optimization via precision-recall analysis. Developed interactive Streamlit dashboard with SHAP explainability for transaction-level fraud reasoning." },
      forecast: { title: "Multi-Domain Demand Forecaster", cat: "ML · Forecasting", desc: "Built ensemble ML forecasting engine using XGBoost + LightGBM stacking with Ridge meta-learner for multi-domain demand prediction (airline bookings, e-commerce, payment volume). Engineered advanced temporal features: cyclical encodings, rolling statistics for trend/seasonality capture. Deployed FastAPI prediction microservice and Streamlit analytics dashboard for real-time forecasts and model performance monitoring." },
      examforge: { title: "ExamForge", cat: "AI · EdTech", desc: "Built full-stack LLM-powered exam generation platform enabling teachers to dynamically create multi-format assessments. Designed interactive workflows for exam generation, student attempts, and automated evaluation." },
      orvyn: { title: "Orvyn ExoArm", cat: "Robotics · Rehab", desc: "Developing signal classification pipeline to differentiate between intended finger movements and noise, targeting 90%+ accuracy for assisted rehab exercises. Designing a microcontroller-based rehabilitation exoskeleton that interprets sEMG signals to assist finger movement through real-time signal processing and controlled servo actuation." },
      f1: { title: "F1 Simulation Dashboard", cat: "Data Viz · Racing", desc: "Built a full-stack race simulation engine modeling tire degradation, pit strategy, safety cars, weather, and overtaking across all 24 2026 GPs using Monte Carlo probability methods. Implemented dual-mode interface: season-wide predictions and fully configurable custom race simulations." },
      spotify: { title: "Spotify Song Analyzer", cat: "Data · Music", desc: "Built a Spotify data analysis pipeline to extract and analyze audio features (tempo, energy, danceability) using Python. Identified key correlations in music attributes through exploratory analysis and feature engineering." },
      medair: { title: "MedAir", cat: "Autonomous · Medical", desc: "Designed a hybrid autonomous aircraft for emergency medical delivery with embedded flight control logic and mission-based transition systems. Awarded Platinum and Gold at Dubai University Innovation Fair." },
    },
    skills: {
      label: "Skills", heading: "Technical Stack",
      subtitle: "From embedded systems to cloud-native AI pipelines — across the full stack with a focus on intelligent, production-grade software.",
      domains: {
        aiml: { area: "AI / ML / Data", detail: "XGBoost, LightGBM, Scikit-learn, Pandas, NumPy, Logistic Regression, LSTM, SHAP" },
        fullstack: { area: "Full-Stack", detail: "FastAPI, Node.js, Express.js, REST APIs, Pydantic, PostgreSQL, React, Next.js" },
        infra: { area: "Infrastructure", detail: "Docker, Kubernetes, Streamlit, Plotly" },
        langs: { area: "Languages", detail: "Python, TypeScript, SQL, C++" },
      },
    },
    experience: {
      label: "Experience", heading: "Where I've made an impact", keyContrib: "Key contributions",
      baraka: {
        role: "AI Engineering Intern", type: "FinTech · AI",
        bullets: [
          "Architected and shipped 5 production microservices (Position Search, Trading Account Monitor, CRA, EOD History, Slack Automation) deployed to Kubernetes; used daily by entire operations team for portfolio management and trade reconciliation.",
          "Built LLM-powered error classification pipeline that reduced manual support triage time by 6+ hours per week, automated categorization of support tickets across OMS, Instruments, and Wallet microservices.",
          "Engineered unified portfolio state model consolidating inconsistent data schemas across distributed microservices; eliminated data discrepancies that previously affected user accounts, enabling accurate cross-market position reporting.",
        ],
      },
      indigo: {
        role: "Digital Intern", type: "Aviation · ML",
        bullets: [
          "Engineered end-to-end Logistic Regression pipeline for on-time arrival prediction (DEL–BOM sector), achieved 88% accuracy using 1,000 flight records and 30-variable dataset.",
          "Conducted comprehensive feature engineering: block-hour overrun computation, departure delay anomaly detection, ATC congestion indexing, weather factor extraction; identified top 6 features via correlation analysis across 10 numerical variables and 3 categorical aircraft types.",
        ],
      },
      lab: {
        role: "Software Engineering Intern", type: "EdTech",
        bullets: [
          "Designed and shipped backend APIs for course content delivery and student progress tracking; system served 500+ students across 4 campuses.",
          "Built authentication, course enrollment, and progress persistence layers using Node.js/Express and PostgreSQL.",
        ],
      },
    },
    contact: {
      label: "Contact",
      heading1: "Let's build", heading2: "something", heading3: "together.",
      subtitle: "Open to internships, collaborations, and ambitious projects. Based in Dubai — available globally.",
      sayHello: "Say Hello", available: "Available for new opportunities · Dubai, UAE",
    },
  },

  /* ================================================================ */
  /*  HINDI                                                            */
  /* ================================================================ */
  hi: {
    nav: { about: "परिचय", experience: "अनुभव", projects: "प्रोजेक्ट्स", skills: "कौशल", contact: "संपर्क", light: "लाइट", dark: "डार्क", hireMe: "संपर्क करें" },
    hero: {
      eyebrow: "AI इंजीनियर और सॉफ्टवेयर डेवलपर — दुबई, UAE",
      name: "संजित माथुर",
      subtitle: "बुद्धिमान प्रणालियाँ, आधुनिक वेब एप्लिकेशन और डेवलपर टूल्स बना रहा हूँ। पहले",
      subtitleCompany: "Baraka Financial",
      subtitleSuffix: "में काम कर चुका हूँ — नए अवसरों के लिए उपलब्ध।",
      viewProjects: "प्रोजेक्ट्स देखें",
      contactMe: "संपर्क करें",
      scroll: "स्क्रॉल",
      stats: { internships: "इंटर्नशिप", studentsReached: "छात्रों तक पहुँच", mlAccuracy: "ML सटीकता", dubai: "दुबई" },
    },
    projects: {
      label: "प्रोजेक्ट्स", heading: "मेरी बनाई चीज़ें", allGithub: "GitHub पर सभी →",
      fraud: { title: "Distributed Fraud Detection", cat: "ML · सुरक्षा", desc: "Isolation Forest, LOF, और Autoencoder मॉडल का उपयोग करके 284K क्रेडिट कार्ड लेनदेन का विश्लेषण करने वाली वितरित धोखाधड़ी पहचान प्रणाली बनाई। precision-recall विश्लेषण के माध्यम से स्वचालित थ्रेशोल्ड ऑप्टिमाइज़ेशन के साथ सामान्य-डेटा पाइपलाइन से डोमेन फीचर्स इंजीनियर किए और मॉडल प्रशिक्षित किए। लेनदेन-स्तरीय धोखाधड़ी तर्क और रियल-टाइम विसंगति जाँच के लिए SHAP व्याख्यात्मकता के साथ इंटरैक्टिव Streamlit डैशबोर्ड विकसित किया।" },
      forecast: { title: "Multi-Domain Demand Forecaster", cat: "ML · पूर्वानुमान", desc: "Ridge मेटा-लर्नर के साथ XGBoost + LightGBM स्टैकिंग एन्सेम्बल का उपयोग करके माँग पूर्वानुमान इंजन बनाया। 10वें/90वें पर्सेंटाइल कॉन्फिडेंस इंटरवल के लिए क्वांटाइल रिग्रेशन लागू किया और डोमेन-विशिष्ट रोलिंग स्टैटिस्टिक्स के साथ चक्रीय साइन/कोसाइन टेम्पोरल एनकोडिंग इंजीनियर की। RESTful FastAPI सेवा और इंटरैक्टिव Streamlit डैशबोर्ड के माध्यम से तैनात किया।" },
      examforge: { title: "ExamForge", cat: "AI · एडटेक", desc: "विषयों में डायनामिक मल्टी-फॉर्मेट मूल्यांकन उत्पन्न करने के लिए LLM APIs का उपयोग करके फुल-स्टैक AI परीक्षा निर्माण प्लेटफ़ॉर्म बनाया। शिक्षकों को स्वचालित मूल्यांकन पाइपलाइन के साथ कस्टमाइज़्ड परीक्षाएँ बनाने, प्रयास करने और समीक्षा करने में सक्षम बनाने वाले इंटरैक्टिव वर्कफ़्लो डिज़ाइन किए।" },
      orvyn: { title: "Orvyn ExoArm", cat: "रोबोटिक्स · पुनर्वास", desc: "सहायक पुनर्वास अभ्यासों के लिए 90%+ सटीकता लक्ष्य करते हुए उद्देश्यित उंगली गतियों और शोर के बीच अंतर करने के लिए सिग्नल वर्गीकरण पाइपलाइन विकसित कर रहा हूँ। रियल-टाइम सिग्नल प्रोसेसिंग और नियंत्रित सर्वो एक्चुएशन के माध्यम से sEMG सिग्नल की व्याख्या करने वाला माइक्रोकंट्रोलर-आधारित पुनर्वास एक्सोस्केलेटन डिज़ाइन कर रहा हूँ।" },
      f1: { title: "F1 Simulation Dashboard", cat: "डेटा विज़ · रेसिंग", desc: "मोंटे कार्लो प्रोबेबिलिटी विधियों का उपयोग करके सभी 24 2026 GPs में टायर डिग्रेडेशन, पिट स्ट्रैटेजी, सेफ्टी कार, मौसम और ओवरटेकिंग को मॉडल करने वाला फुल-स्टैक रेस सिमुलेशन इंजन बनाया। सीज़न-वाइड प्रेडिक्शन और पूरी तरह कॉन्फिगरेबल कस्टम रेस सिमुलेशन: दोहरे-मोड इंटरफ़ेस लागू किया।" },
      spotify: { title: "Spotify Song Analyzer", cat: "डेटा · संगीत", desc: "Python का उपयोग करके ऑडियो फीचर्स (टेम्पो, एनर्जी, डांसेबिलिटी) निकालने और विश्लेषण करने के लिए Spotify डेटा विश्लेषण पाइपलाइन बनाई। एक्सप्लोरेटरी एनालिसिस और फीचर इंजीनियरिंग के माध्यम से संगीत विशेषताओं में प्रमुख सहसंबंधों की पहचान की।" },
      medair: { title: "MedAir", cat: "स्वायत्त · चिकित्सा", desc: "एम्बेडेड फ्लाइट कंट्रोल लॉजिक और मिशन-आधारित ट्रांज़िशन सिस्टम के साथ आपातकालीन चिकित्सा डिलीवरी के लिए हाइब्रिड स्वायत्त विमान डिज़ाइन किया। दुबई यूनिवर्सिटी इनोवेशन फेयर में प्लैटिनम और गोल्ड से सम्मानित।" },
    },
    skills: {
      label: "कौशल", heading: "तकनीकी स्टैक",
      subtitle: "एम्बेडेड सिस्टम से लेकर क्लाउड-नेटिव AI पाइपलाइन तक — बुद्धिमान, प्रोडक्शन-ग्रेड सॉफ्टवेयर पर फोकस के साथ पूरे स्टैक में।",
      domains: {
        aiml: { area: "AI / ML / डेटा", detail: "XGBoost, LightGBM, Scikit-learn, Pandas, NumPy, Logistic Regression, LSTM, SHAP" },
        fullstack: { area: "फुल-स्टैक", detail: "FastAPI, Node.js, Express.js, REST APIs, Pydantic, PostgreSQL, React, Next.js" },
        infra: { area: "इन्फ्रास्ट्रक्चर", detail: "Docker, Kubernetes, Streamlit, Plotly" },
        langs: { area: "भाषाएँ", detail: "Python, TypeScript, SQL, C++" },
      },
    },
    experience: {
      label: "अनुभव", heading: "जहाँ मैंने प्रभाव डाला", keyContrib: "मुख्य योगदान",
      baraka: {
        role: "AI इंजीनियरिंग इंटर्न", type: "फिनटेक · AI",
        bullets: [
          "Kubernetes पर कंटेनराइज़्ड सेवाएँ तैनात कीं; AI-संचालित आंतरिक टूलिंग बनाई जिसने एरर क्लासिफिकेशन और लॉग विश्लेषण को स्वचालित किया, सपोर्ट वर्कफ़्लो में मैन्युअल ट्राइएज को समाप्त किया।",
          "Position Search, Trading Account Monitor, CRA, EOD History, Slack Automation और अन्य मॉड्यूल बनाए जो OMS, Instruments, और Wallet माइक्रोसर्विसेज को एकीकृत करते हैं, ऑपरेशन टीमों के लिए मैन्युअल पोर्टफोलियो लुकअप समय को कम किया।",
          "वितरित सेवाओं में असंगत डेटा स्कीमा को एकल पोर्टफोलियो स्टेट मॉडल में एकीकृत किया, क्रॉस-मार्केट अकाउंट व्यू में डेटा विसंगतियों को समाप्त किया।",
        ],
      },
      indigo: {
        role: "डिजिटल इंटर्न", type: "एविएशन · ML",
        bullets: [
          "DEL-BOM सेक्टर पर 1,000 फ्लाइट रिकॉर्ड और 6 इंजीनियर्ड फीचर्स (ब्लॉक-आवर ओवररन, डिपार्चर डिले, एयरक्राफ्ट टाइप, वेदर इंडेक्स, ATC कंजेशन) का उपयोग करके ऑन-टाइम अराइवल परफॉर्मेंस की भविष्यवाणी करने के लिए लॉजिस्टिक रिग्रेशन मॉडल बनाया, दोनों क्लासेज में संतुलित प्रिसिजन/रिकॉल के साथ 88% सटीकता हासिल की।",
          "रॉ ऑपरेशनल डेटा से फीचर्स इंजीनियर किए जिसमें 3 एयरक्राफ्ट प्रकारों (A320, A320neo, A321neo) का वन-हॉट एनकोडिंग, शेड्यूल्ड बनाम एक्चुअल घंटों से ब्लॉक-आवर ओवररन की गणना, और मॉडलिंग के लिए फीचर सिलेक्शन को सूचित करने के लिए 10 न्यूमेरिकल वेरिएबल्स में कोरिलेशन एनालिसिस किया।",
        ],
      },
      lab: {
        role: "सॉफ्टवेयर इंजीनियरिंग इंटर्न", type: "एडटेक",
        bullets: [
          "4 कैंपसों में 500+ छात्रों द्वारा उपयोग किया जाने वाला आंतरिक शैक्षिक सॉफ्टवेयर बनाया।",
          "कोर्स कंटेंट डिलीवरी और छात्र प्रगति ट्रैकिंग के लिए बैकएंड APIs डिज़ाइन किए।",
        ],
      },
    },
    contact: {
      label: "संपर्क",
      heading1: "आइए मिलकर", heading2: "कुछ बेहतरीन", heading3: "बनाएँ।",
      subtitle: "इंटर्नशिप, सहयोग और महत्वाकांक्षी प्रोजेक्ट्स के लिए उपलब्ध। दुबई में स्थित — विश्व स्तर पर उपलब्ध।",
      sayHello: "नमस्ते कहें", available: "नए अवसरों के लिए उपलब्ध · दुबई, UAE",
    },
  },

  /* ================================================================ */
  /*  ARABIC                                                           */
  /* ================================================================ */
  ar: {
    nav: { about: "نبذة", experience: "الخبرة", projects: "المشاريع", skills: "المهارات", contact: "تواصل", light: "فاتح", dark: "داكن", hireMe: "وظّفني" },
    hero: {
      eyebrow: "مهندس ذكاء اصطناعي ومطوّر برمجيات — دبي، الإمارات",
      name: "سانجيت ماثور",
      subtitle: "أبني أنظمة ذكية وتطبيقات ويب حديثة وأدوات للمطورين. عملت سابقاً في",
      subtitleCompany: "Baraka Financial",
      subtitleSuffix: "— متاح لفرص جديدة.",
      viewProjects: "عرض المشاريع",
      contactMe: "تواصل معي",
      scroll: "مرّر",
      stats: { internships: "تدريب عملي", studentsReached: "طالب تم الوصول إليهم", mlAccuracy: "دقة ML", dubai: "دبي" },
    },
    projects: {
      label: "المشاريع", heading: "أشياء بنيتها", allGithub: "الكل على GitHub ←",
      fraud: { title: "Distributed Fraud Detection", cat: "ML · أمان", desc: "بنيت نظام كشف احتيال موزع يحلل 284 ألف معاملة بطاقات ائتمان باستخدام نماذج Isolation Forest وLOF وAutoencoder. هندست ميزات المجال ودربت النماذج باستخدام خطوط أنابيب البيانات العادية مع تحسين العتبة التلقائي عبر تحليل precision-recall. طورت لوحة معلومات Streamlit تفاعلية مع قابلية تفسير SHAP للتحقيق في الاحتيال على مستوى المعاملات في الوقت الفعلي." },
      forecast: { title: "Multi-Domain Demand Forecaster", cat: "ML · تنبؤ", desc: "بنيت محرك تنبؤ بالطلب باستخدام مجموعة XGBoost + LightGBM مع متعلم Ridge فوقي. نفذت انحدار الكمّيات لفترات ثقة المئين العاشر/التسعين وهندست ترميزات زمنية دورية sin/cos مع إحصائيات متدحرجة خاصة بالمجال. نشرت عبر خدمة FastAPI RESTful ولوحة معلومات Streamlit تفاعلية." },
      examforge: { title: "ExamForge", cat: "AI · تعليم", desc: "بنيت منصة توليد امتحانات AI باستخدام واجهات LLM لإنشاء تقييمات ديناميكية متعددة الصيغ عبر المواد. صممت سير عمل تفاعلية تتيح للمعلمين إنشاء ومحاولة ومراجعة الامتحانات المخصصة مع خطوط تقييم آلية." },
      orvyn: { title: "Orvyn ExoArm", cat: "روبوتات · تأهيل", desc: "أطوّر خط أنابيب تصنيف إشارات للتمييز بين حركات الأصابع المقصودة والضوضاء، مستهدفاً دقة +90% لتمارين إعادة التأهيل المساعدة. أصمم هيكلاً خارجياً لإعادة التأهيل قائماً على متحكم دقيق يفسر إشارات sEMG لمساعدة حركة الأصابع." },
      f1: { title: "F1 Simulation Dashboard", cat: "تصوير بيانات · سباق", desc: "بنيت محرك محاكاة سباق شامل يُنمذج تآكل الإطارات واستراتيجية الحفر وسيارات الأمان والطقس والتجاوز عبر جميع 24 جائزة كبرى 2026 باستخدام طرق مونت كارلو الاحتمالية. نفذت واجهة مزدوجة الوضع: تنبؤات على مستوى الموسم ومحاكاة سباق مخصصة." },
      spotify: { title: "Spotify Song Analyzer", cat: "بيانات · موسيقى", desc: "بنيت خط أنابيب تحليل بيانات Spotify لاستخراج وتحليل الميزات الصوتية (الإيقاع، الطاقة، القابلية للرقص) باستخدام Python. حددت الارتباطات الرئيسية في سمات الموسيقى من خلال التحليل الاستكشافي وهندسة الميزات." },
      medair: { title: "MedAir", cat: "مستقل · طبي", desc: "صممت طائرة مستقلة هجينة للتوصيل الطبي الطارئ مع منطق تحكم طيران مدمج وأنظمة انتقال قائمة على المهام. حصلت على البلاتين والذهب في معرض جامعة دبي للابتكار." },
    },
    skills: {
      label: "المهارات", heading: "المكدس التقني",
      subtitle: "من الأنظمة المدمجة إلى خطوط أنابيب AI السحابية — عبر المكدس الكامل مع التركيز على البرمجيات الذكية الجاهزة للإنتاج.",
      domains: {
        aiml: { area: "AI / ML / بيانات", detail: "XGBoost, LightGBM, Scikit-learn, Pandas, NumPy, Logistic Regression, LSTM, SHAP" },
        fullstack: { area: "فول ستاك", detail: "FastAPI, Node.js, Express.js, REST APIs, Pydantic, PostgreSQL, React, Next.js" },
        infra: { area: "البنية التحتية", detail: "Docker, Kubernetes, Streamlit, Plotly" },
        langs: { area: "اللغات", detail: "Python, TypeScript, SQL, C++" },
      },
    },
    experience: {
      label: "الخبرة", heading: "أين أحدثت تأثيراً", keyContrib: "المساهمات الرئيسية",
      baraka: {
        role: "متدرب هندسة AI", type: "تقنية مالية · AI",
        bullets: [
          "نشرت خدمات مُحاوية على Kubernetes؛ بنيت أدوات داخلية مدعومة بالذكاء الاصطناعي أتمتت تصنيف الأخطاء وتحليل السجلات، مما ألغى الفرز اليدوي عبر سير عمل الدعم.",
          "بنيت Position Search وTrading Account Monitor وCRA وEOD History وSlack Automation وغيرها من الوحدات التي تدمج خدمات OMS وInstruments وWallet المصغرة، مما قلل وقت البحث اليدوي عن المحفظة لفرق العمليات.",
          "وحّدت مخططات البيانات غير المتسقة عبر الخدمات الموزعة في نموذج حالة محفظة واحد، مما ألغى تباينات البيانات في عروض الحسابات عبر الأسواق.",
        ],
      },
      indigo: {
        role: "متدرب رقمي", type: "طيران · ML",
        bullets: [
          "بنيت نموذج انحدار لوجستي للتنبؤ بأداء الوصول في الموعد على قطاع DEL-BOM باستخدام 1,000 سجل رحلة و6 ميزات مهندسة (تجاوز ساعات الكتلة، تأخير المغادرة، نوع الطائرة، مؤشر الطقس، ازدحام ATC)، محققاً دقة 88% مع دقة/استدعاء متوازن.",
          "هندست ميزات من البيانات التشغيلية الخام بما في ذلك ترميز one-hot لـ 3 أنواع طائرات (A320, A320neo, A321neo)، وحسبت تجاوز ساعات الكتلة، وأجريت تحليل ارتباط عبر 10 متغيرات رقمية.",
        ],
      },
      lab: {
        role: "متدرب هندسة برمجيات", type: "تعليم",
        bullets: [
          "بنيت برنامج تعليمي داخلي يستخدمه أكثر من 500 طالب عبر 4 حرم جامعية.",
          "صممت واجهات برمجة خلفية لتوصيل محتوى الدورات وتتبع تقدم الطلاب.",
        ],
      },
    },
    contact: {
      label: "تواصل",
      heading1: "لنبنِ", heading2: "شيئاً", heading3: "معاً.",
      subtitle: "متاح للتدريب والتعاون والمشاريع الطموحة. مقيم في دبي — متاح عالمياً.",
      sayHello: "قل مرحباً", available: "متاح لفرص جديدة · دبي، الإمارات",
    },
  },

  /* ================================================================ */
  /*  GERMAN                                                           */
  /* ================================================================ */
  de: {
    nav: { about: "Über mich", experience: "Erfahrung", projects: "Projekte", skills: "Skills", contact: "Kontakt", light: "Hell", dark: "Dunkel", hireMe: "Kontakt" },
    hero: {
      eyebrow: "KI-Ingenieur & Softwareentwickler — Dubai, VAE",
      name: "Sanjit Mathur",
      subtitle: "Ich entwickle intelligente Systeme, moderne Webanwendungen und Entwickler-Tools. Zuvor bei",
      subtitleCompany: "Baraka Financial",
      subtitleSuffix: "— offen für neue Möglichkeiten.",
      viewProjects: "Projekte ansehen",
      contactMe: "Kontakt",
      scroll: "scrollen",
      stats: { internships: "Praktika", studentsReached: "Erreichte Studenten", mlAccuracy: "ML-Genauigkeit", dubai: "Dubai" },
    },
    projects: {
      label: "Projekte", heading: "Was ich gebaut habe", allGithub: "Alles auf GitHub →",
      fraud: { title: "Distributed Fraud Detection", cat: "ML · Sicherheit", desc: "Ein verteiltes Betrugserkennungssystem zur Analyse von 284K Kreditkartentransaktionen mit Isolation Forest, LOF und Autoencoder-Modellen entwickelt. Domänenmerkmale engineert und Modelle mit Nur-Normal-Daten-Pipelines mit automatisierter Schwellenwertoptimierung via Precision-Recall-Analyse trainiert. Ein interaktives Streamlit-Dashboard mit SHAP-Erklärbarkeit für transaktionsbezogene Betrugserkennung und Echtzeit-Anomalieuntersuchung entwickelt." },
      forecast: { title: "Multi-Domain Demand Forecaster", cat: "ML · Prognose", desc: "Eine Bedarfsprognose-Engine mit XGBoost + LightGBM Stacking-Ensemble mit Ridge Meta-Learner entwickelt. Quantil-Regression für 10./90. Perzentil-Konfidenzintervalle implementiert und zyklische Sin/Cos-Zeitkodierungen mit domänenspezifischen rollierenden Statistiken engineert. Über RESTful FastAPI-Service und interaktives Streamlit-Dashboard bereitgestellt." },
      examforge: { title: "ExamForge", cat: "KI · EdTech", desc: "Eine Full-Stack KI-Prüfungsgenerierungsplattform mit LLM-APIs zur dynamischen Erstellung von Multi-Format-Assessments über Fächer hinweg entwickelt. Interaktive Workflows entworfen, die Lehrern ermöglichen, maßgeschneiderte Prüfungen mit automatisierten Bewertungspipelines zu erstellen, zu bearbeiten und zu überprüfen." },
      orvyn: { title: "Orvyn ExoArm", cat: "Robotik · Reha", desc: "Entwickle eine Signalklassifizierungspipeline zur Unterscheidung zwischen beabsichtigten Fingerbewegungen und Rauschen mit einem Genauigkeitsziel von 90%+ für assistierte Reha-Übungen. Entwerfe ein mikrocontrollerbasiertes Rehabilitations-Exoskelett, das sEMG-Signale für die Fingerbewegungsunterstützung interpretiert." },
      f1: { title: "F1 Simulation Dashboard", cat: "Datenvis. · Rennen", desc: "Eine Full-Stack-Rennsimulations-Engine entwickelt, die Reifenverschleiß, Boxenstrategie, Safety Cars, Wetter und Überholmanöver über alle 24 GPs 2026 mit Monte-Carlo-Wahrscheinlichkeitsmethoden modelliert. Dual-Mode-Interface implementiert: saisonweite Vorhersagen und vollständig konfigurierbare Rennsimulationen." },
      spotify: { title: "Spotify Song Analyzer", cat: "Daten · Musik", desc: "Eine Spotify-Datenanalyse-Pipeline zum Extrahieren und Analysieren von Audio-Features (Tempo, Energie, Tanzbarkeit) mit Python entwickelt. Schlüsselkorrelationen in Musikattributen durch explorative Analyse und Feature Engineering identifiziert." },
      medair: { title: "MedAir", cat: "Autonom · Medizin", desc: "Ein hybrides autonomes Flugzeug für medizinische Notfalllieferungen mit eingebetteter Flugsteuerungslogik und missionsbasierten Übergangssystemen entworfen. Mit Platin und Gold auf der Dubai University Innovation Fair ausgezeichnet." },
    },
    skills: {
      label: "Skills", heading: "Technischer Stack",
      subtitle: "Von eingebetteten Systemen bis zu Cloud-nativen KI-Pipelines — über den gesamten Stack mit Fokus auf intelligente, produktionsreife Software.",
      domains: {
        aiml: { area: "KI / ML / Daten", detail: "XGBoost, LightGBM, Scikit-learn, Pandas, NumPy, Logistic Regression, LSTM, SHAP" },
        fullstack: { area: "Full-Stack", detail: "FastAPI, Node.js, Express.js, REST APIs, Pydantic, PostgreSQL, React, Next.js" },
        infra: { area: "Infrastruktur", detail: "Docker, Kubernetes, Streamlit, Plotly" },
        langs: { area: "Sprachen", detail: "Python, TypeScript, SQL, C++" },
      },
    },
    experience: {
      label: "Erfahrung", heading: "Wo ich Wirkung erzielt habe", keyContrib: "Wichtige Beiträge",
      baraka: {
        role: "KI-Engineering-Praktikant", type: "FinTech · KI",
        bullets: [
          "Containerisierte Dienste auf Kubernetes bereitgestellt; KI-gestützte interne Tools gebaut, die Fehlerklassifizierung und Log-Analyse automatisierten und manuelles Triage über Support-Workflows eliminierten.",
          "Position Search, Trading Account Monitor, CRA, EOD History, Slack Automation und andere Module gebaut, die OMS-, Instruments- und Wallet-Microservices integrieren und die manuelle Portfolio-Suchzeit für Operations-Teams reduzierten.",
          "Inkonsistente Datenschemata über verteilte Dienste in ein einheitliches Portfolio-Zustandsmodell vereinheitlicht und Dateninkonsistenzen in marktübergreifenden Kontoansichten eliminiert.",
        ],
      },
      indigo: {
        role: "Digital-Praktikant", type: "Luftfahrt · ML",
        bullets: [
          "Ein logistisches Regressionsmodell zur Vorhersage der pünktlichen Ankunftsleistung auf der DEL-BOM-Strecke mit 1.000 Flugaufzeichnungen und 6 engineerten Features (Block-Hour-Überschreitung, Abflugverspätung, Flugzeugtyp, Wetterindex, ATC-Stau) gebaut, mit 88% Genauigkeit bei ausgewogener Präzision/Recall.",
          "Features aus rohen Betriebsdaten engineert, einschließlich One-Hot-Encoding von 3 Flugzeugtypen (A320, A320neo, A321neo), Block-Hour-Überschreitung berechnet und Korrelationsanalyse über 10 numerische Variablen zur Feature-Selektion durchgeführt.",
        ],
      },
      lab: {
        role: "Software-Engineering-Praktikant", type: "EdTech",
        bullets: [
          "Interne Bildungssoftware gebaut, die von 500+ Studenten an 4 Standorten genutzt wird.",
          "Backend-APIs für Kursinhaltbereitstellung und Lernfortschrittsverfolgung entworfen.",
        ],
      },
    },
    contact: {
      label: "Kontakt",
      heading1: "Lass uns", heading2: "etwas", heading3: "zusammen bauen.",
      subtitle: "Offen für Praktika, Kooperationen und ambitionierte Projekte. In Dubai ansässig — weltweit verfügbar.",
      sayHello: "Sag Hallo", available: "Verfügbar für neue Möglichkeiten · Dubai, VAE",
    },
  },

  /* ================================================================ */
  /*  SPANISH                                                          */
  /* ================================================================ */
  es: {
    nav: { about: "Sobre mí", experience: "Experiencia", projects: "Proyectos", skills: "Habilidades", contact: "Contacto", light: "Claro", dark: "Oscuro", hireMe: "Contrátame" },
    hero: {
      eyebrow: "Ingeniero de IA y Desarrollador de Software — Dubái, EAU",
      name: "Sanjit Mathur",
      subtitle: "Construyo sistemas inteligentes, aplicaciones web modernas y herramientas para desarrolladores. Anteriormente en",
      subtitleCompany: "Baraka Financial",
      subtitleSuffix: "— abierto a nuevas oportunidades.",
      viewProjects: "Ver Proyectos",
      contactMe: "Contáctame",
      scroll: "desplazar",
      stats: { internships: "Prácticas", studentsReached: "Estudiantes alcanzados", mlAccuracy: "Precisión ML", dubai: "Dubái" },
    },
    projects: {
      label: "Proyectos", heading: "Lo que he construido", allGithub: "Todo en GitHub →",
      fraud: { title: "Distributed Fraud Detection", cat: "ML · Seguridad", desc: "Construí un sistema distribuido de detección de fraude que analiza 284K transacciones de tarjetas de crédito usando modelos Isolation Forest, LOF y Autoencoder. Diseñé características de dominio y entrené modelos con pipelines de datos normales con optimización automática de umbrales mediante análisis precision-recall. Desarrollé un panel interactivo en Streamlit con explicabilidad SHAP para razonamiento de fraude a nivel de transacción e investigación de anomalías en tiempo real." },
      forecast: { title: "Multi-Domain Demand Forecaster", cat: "ML · Pronóstico", desc: "Construí un motor de pronóstico de demanda usando ensamble de apilamiento XGBoost + LightGBM con meta-aprendiz Ridge. Implementé Regresión Cuantílica para intervalos de confianza del percentil 10/90 y diseñé codificaciones temporales cíclicas seno/coseno con estadísticas rodantes específicas del dominio. Desplegado mediante servicio RESTful FastAPI y panel interactivo Streamlit." },
      examforge: { title: "ExamForge", cat: "IA · EdTech", desc: "Construí una plataforma de generación de exámenes IA usando APIs LLM para generar dinámicamente evaluaciones multiformato en diversas materias. Diseñé flujos de trabajo interactivos que permiten a los profesores generar, intentar y revisar exámenes personalizados con pipelines de evaluación automatizados." },
      orvyn: { title: "Orvyn ExoArm", cat: "Robótica · Rehab", desc: "Desarrollando un pipeline de clasificación de señales para diferenciar entre movimientos de dedos intencionados y ruido, apuntando a una precisión del 90%+ para ejercicios de rehabilitación asistida. Diseñando un exoesqueleto de rehabilitación basado en microcontrolador que interpreta señales sEMG para asistir el movimiento de dedos." },
      f1: { title: "F1 Simulation Dashboard", cat: "Datos Viz · Carreras", desc: "Construí un motor de simulación de carreras completo que modela degradación de neumáticos, estrategia de boxes, coches de seguridad, clima y adelantamientos en los 24 GPs de 2026 usando métodos de probabilidad Monte Carlo. Implementé interfaz de modo dual: predicciones de temporada y simulaciones de carrera personalizables." },
      spotify: { title: "Spotify Song Analyzer", cat: "Datos · Música", desc: "Construí un pipeline de análisis de datos de Spotify para extraer y analizar características de audio (tempo, energía, bailabilidad) usando Python. Identifiqué correlaciones clave en atributos musicales mediante análisis exploratorio e ingeniería de características." },
      medair: { title: "MedAir", cat: "Autónomo · Médico", desc: "Diseñé una aeronave autónoma híbrida para entrega médica de emergencia con lógica de control de vuelo embebida y sistemas de transición basados en misiones. Premiado con Platino y Oro en la Feria de Innovación de la Universidad de Dubái." },
    },
    skills: {
      label: "Habilidades", heading: "Stack Técnico",
      subtitle: "Desde sistemas embebidos hasta pipelines de IA nativas en la nube — a través de todo el stack con enfoque en software inteligente y listo para producción.",
      domains: {
        aiml: { area: "IA / ML / Datos", detail: "XGBoost, LightGBM, Scikit-learn, Pandas, NumPy, Logistic Regression, LSTM, SHAP" },
        fullstack: { area: "Full-Stack", detail: "FastAPI, Node.js, Express.js, REST APIs, Pydantic, PostgreSQL, React, Next.js" },
        infra: { area: "Infraestructura", detail: "Docker, Kubernetes, Streamlit, Plotly" },
        langs: { area: "Lenguajes", detail: "Python, TypeScript, SQL, C++" },
      },
    },
    experience: {
      label: "Experiencia", heading: "Donde he generado impacto", keyContrib: "Contribuciones clave",
      baraka: {
        role: "Pasante de Ingeniería IA", type: "FinTech · IA",
        bullets: [
          "Desplegué servicios contenedorizados en Kubernetes; construí herramientas internas impulsadas por IA que automatizaron la clasificación de errores y el análisis de logs, eliminando el triaje manual en flujos de soporte.",
          "Construí Position Search, Trading Account Monitor, CRA, EOD History, Slack Automation y otros módulos integrando microservicios OMS, Instruments y Wallet, reduciendo el tiempo de búsqueda manual de portafolio para equipos de operaciones.",
          "Unifiqué esquemas de datos inconsistentes entre servicios distribuidos en un modelo único de estado de portafolio, eliminando discrepancias de datos en vistas de cuentas entre mercados.",
        ],
      },
      indigo: {
        role: "Pasante Digital", type: "Aviación · ML",
        bullets: [
          "Construí un modelo de Regresión Logística para predecir el rendimiento de llegada puntual en el sector DEL-BOM usando 1,000 registros de vuelo y 6 características diseñadas (exceso de horas bloque, retraso de salida, tipo de aeronave, índice meteorológico, congestión ATC), logrando 88% de precisión con precisión/recall equilibrados.",
          "Diseñé características a partir de datos operacionales crudos incluyendo codificación one-hot de 3 tipos de aeronave (A320, A320neo, A321neo), calculé exceso de horas bloque y realicé análisis de correlación en 10 variables numéricas para informar la selección de características.",
        ],
      },
      lab: {
        role: "Pasante de Ingeniería de Software", type: "EdTech",
        bullets: [
          "Construí software educativo interno usado por 500+ estudiantes en 4 campus.",
          "Diseñé APIs backend para entrega de contenido de cursos y seguimiento del progreso estudiantil.",
        ],
      },
    },
    contact: {
      label: "Contacto",
      heading1: "Construyamos", heading2: "algo", heading3: "juntos.",
      subtitle: "Abierto a prácticas, colaboraciones y proyectos ambiciosos. Basado en Dubái — disponible globalmente.",
      sayHello: "Saluda", available: "Disponible para nuevas oportunidades · Dubái, EAU",
    },
  },
};

export default translations;
export type T = typeof translations.en;
