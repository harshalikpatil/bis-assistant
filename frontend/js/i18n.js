// Minimal translation layer. Add a language: add a key below + an <option> in the selector.
// Only UI labels are translated now; AI answers come in the backend phase.
const I18N = {
  en:{finder:"Find standards",home:"Home",chat:"Ask assistant",services:"BIS services",about:"About",h1:"Understand Indian Standards without reading every document first",lead:"Ask about standards, certification, testing, laboratories or hallmarking in plain language. Answers will point to the BIS source they come from.",start:"Start a conversation",explore:"Explore BIS services",ph:"Type your question…",send:"Send",demo:"Demo mode: replies are placeholders, not official BIS information."},
  hi:{finder:"मानक खोजें",home:"मुख्य पृष्ठ",chat:"सहायक से पूछें",services:"बीआईएस सेवाएँ",about:"परिचय",h1:"हर दस्तावेज़ पढ़े बिना भारतीय मानकों को समझें",lead:"मानकों, प्रमाणन, परीक्षण, प्रयोगशालाओं या हॉलमार्किंग के बारे में सरल भाषा में पूछें। उत्तर के साथ उसका बीआईएस स्रोत बताया जाएगा।",start:"बातचीत शुरू करें",explore:"बीआईएस सेवाएँ देखें",ph:"अपना प्रश्न लिखें…",send:"भेजें",demo:"डेमो मोड: उत्तर केवल नमूने हैं, आधिकारिक बीआईएस जानकारी नहीं।"},
  mr:{finder:"मानके शोधा",home:"मुख्यपृष्ठ",chat:"सहाय्यकाला विचारा",services:"बीआयएस सेवा",about:"माहिती",h1:"प्रत्येक दस्तऐवज वाचल्याशिवाय भारतीय मानके समजून घ्या",lead:"मानके, प्रमाणन, चाचणी, प्रयोगशाळा किंवा हॉलमार्किंगबद्दल सोप्या भाषेत विचारा. उत्तरासोबत त्याचा बीआयएस स्रोत दाखवला जाईल.",start:"संवाद सुरू करा",explore:"बीआयएस सेवा पहा",ph:"तुमचा प्रश्न लिहा…",send:"पाठवा",demo:"डेमो मोड: उत्तरे केवळ नमुना आहेत, अधिकृत बीआयएस माहिती नाही."}
};
function getLang(){return localStorage.getItem("lang")||"en"}
function t(k){return (I18N[getLang()]||I18N.en)[k]||I18N.en[k]||""}
function applyLang(){
  const l=getLang();document.documentElement.lang=l;
  document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll("[data-i18n-ph]").forEach(e=>e.placeholder=t(e.dataset.i18nPh));
  document.querySelectorAll("select.lang").forEach(s=>s.value=l);
}
