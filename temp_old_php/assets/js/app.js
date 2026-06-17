// Global JS logic for GrowGenie

const API_BASE = 'api';

const translations = {
    en: {
        dashboard: "Dashboard", products: "Products", ai_planner: "Grow Genie Planner", invoices: "Invoices", faq_bot: "Genie FAQ Bot", marketing: "Marketing", progress: "My Progress", logout: "Logout", logged_in_as: "Logged in as", welcome_back: "Welcome back", ai_business_dashboard: "Your Genie business dashboard", ai_modules: "Genie Modules", modules_subtitle: "Access your powerful business automation tools.", upgrade_plan: "Upgrade Now", total_queries: "Total queries", genie_generations: "Genie Generations", invoices_sent: "Invoices Sent", faq_entries: "FAQ Entries", catalog_items: "Catalog items", gst_compliant: "GST-compliant", knowledge_base: "Knowledge base", ai_roadmap_gen_desc: "Startup roadmap, strategy, ad copy & more", invoice_gen_desc: "GST-compliant PDF invoices for your business.", faq_bot_desc: "Train your bot — Genie handles queries 24/7", manage_products: "Full CRUD — manage your products & services", effective_ways: "Ad copy, descriptions & multilingual campaigns", open_module: "Open Module", translator: "Translator", translator_desc: "Campaigns in Hindi, Tamil, Bengali, Marathi", active_subscriptions: "Your Subscription Plan", valid_until: "Valid until ...", marketplace: "Marketplace", marketplace_subtitle: "Premium services to accelerate your startup", cart_title: "Cart", your_cart: "Your Cart", total_amount: "Total Amount", proceed_to_pay: "Proceed to Pay", startup_details: "Startup Details", startup_name: "Startup Name", startup_name_placeholder: "e.g. Aura Bottles", startup_idea: "Startup Idea", startup_idea_placeholder: "Describe what your business does...", category: "Category", budget_range: "Budget Range (INR)", output_language: "Output Language", generate_roadmap: "Generate Roadmap", your_roadmap: "Your Roadmap", roadmap_placeholder: "Generate a customized step-by-step roadmap for your startup.", marketing_center: "Marketing Command Center", marketing_desc: "Get a custom strategy or launch high-converting campaigns.", genie_strategist: "Genie Marketing Strategist", strategist_tagline: "Tell Genie your budget, get a roadmap.", your_product_label: "Your Product/Service", budget_label: "Monthly Budget (INR)", generate_strat_btn: "Generate My Strategy", online_marketing: "Online Marketing", offline_marketing: "Offline Marketing", meta_ads: "Meta Facebook Ads", meta_ads_desc: "Target billions with precise demographics",
        new_invoice: "New Invoice", total_invoices_stat: "Total Invoices", paid_amount: "Paid Amount", pending_amount: "Pending Amount", business_profile: "Business Profile", profile_setup_desc: "One-time setup for all your invoices", company_name: "Company Name", save_profile: "Save Business Profile", no_invoices: "No invoices yet", no_invoices_desc: "Click 'New Invoice' to generate your first GST invoice.",
        train_assistant: "Train your support assistant", ask_questions: "Ask Questions About GrowGenie", chat_welcome: "Hello! I'm your Genie assistant. You can click on the questions to the left or type your own question below!", chat_placeholder: "Type your question here...",
        performance: "Performance", report: "Report", progress_desc: "Deep dive into your startup's growth and engagement.", live_data: "Live Data", total_revenue: "Total Sales Revenue", genie_intelligence: "Genie Intelligence", platform_usage: "Platform Usage", milestone_tracker: "Milestone Tracker", account_created: "Account Created", first_invoice: "First Invoice Sent", strategy_generated: "Full Strategy Generated", top_categories: "Top Performing Categories", growth_suggestions: "Growth Suggestions",
        sign_in_desc: "Sign in to your GrowGenie account", email_address: "Email Address", email_placeholder: "Name@company.com", password: "Password", password_placeholder: "Enter your password", sign_in: "Sign In", no_account: "Don't have an account?", start_free_trial: "Start Free Trial",
        instagram_ads: "Instagram Ads", instagram_ads_desc: "Visual storytelling for younger audiences", google_ads: "Google Search Ads", google_ads_desc: "Appear when people search for your product", physical_flyers: "Physical Flyers", physical_flyers_desc: "Local distribution in high-traffic areas", billboard_ads: "Billboard Advertising", billboard_ads_desc: "High-impact visibility in key city locations", event_stalls: "Event Stalls", event_stalls_desc: "Direct engagement at exhibitions and fairs", expert_marketing: "Expert Managed Marketing", expert_marketing_desc: "Want our team to handle everything? From full-scale Meta campaigns to bulk billboard bookings—we've got you covered.", contact_marketing: "Contact Marketing Team",
        voice_assistant: "Voice Assistant", voice_assistant_desc: "Talk to Genie — ask anything about your business", try_saying: "Try Saying…", voice_tips: "Voice Tips", conversation: "Conversation", voice_input_placeholder: "Type or speak your question…"
    },
    hi: {
        dashboard: "डैशबोर्ड", products: "उत्पाद", ai_planner: "ग्रो जेनी प्लानर", invoices: "चालान", faq_bot: "जेनी एफएक्यू बॉट", marketing: "मार्केटिंग", progress: "मेरी प्रगति", logout: "लॉग आउट", logged_in_as: "लॉग इन किया है", welcome_back: "आपका स्वागत है", ai_business_dashboard: "आपका जेनी बिजनेस डैशबोर्ड", ai_modules: "जेनी मॉड्यूल", modules_subtitle: "अपने शक्तिशाली व्यवसाय स्वचालन टूल तक पहुंचें।", upgrade_plan: "अभी अपग्रेड करें", total_queries: "कुल प्रश्न", genie_generations: "जेनी जनरेशन", invoices_sent: "भेजे गए चालान", faq_entries: "एफएक्यू प्रविष्टियां", catalog_items: "कैटलॉग आइटम", gst_compliant: "जीएसटी-अनुपालक", knowledge_base: "ज्ञान आधार", ai_roadmap_gen_desc: "जीपीटी-4 के माध्यम से स्टार्टअप रोडमैप और बाजार रणनीति", invoice_gen_desc: "आपके व्यवसाय के लिए जीएसटी-अनुपालक पीडीएफ चालान।", faq_bot_desc: "अपने बॉट को प्रशिक्षित करें — जेनी 24/7 प्रश्नों को संभालती है", manage_products: "पूर्ण सीआरयूडी — अपने उत्पादों और सेवाओं का प्रबंधन करें", effective_ways: "विज्ञापन प्रति, विवरण और बहुभाषी अभियान", open_module: "मॉड्यूल खोलें", translator: "अनुवादक", translator_desc: "हिंदी, तमिल, बंगाली, मराठी में अभियान", active_subscriptions: "आपकी सदस्यता योजना", valid_until: "जब तक वैध ...", marketplace: "मार्केटप्लेस", marketplace_subtitle: "आपके स्टार्टअप को गति देने के लिए प्रीमियम सेवाएं", cart_title: "कार्ट", your_cart: "आपकी कार्ट", total_amount: "कुल राशि", proceed_to_pay: "भुगतान करने के लिए आगे बढ़ें", startup_details: "स्टार्टअप विवरण", startup_name: "स्टार्टअप का नाम", startup_name_placeholder: "जैसे ऑरा बॉटल्स", startup_idea: "स्टार्टअप विचार", startup_idea_placeholder: "बताएं कि आपका व्यवसाय क्या करता है...", category: "श्रेणी", budget_range: "बजट सीमा (INR)", output_language: "आउटपुट भाषा", generate_roadmap: "रोडमैप तैयार करें", your_roadmap: "आपका रोडमैप", roadmap_placeholder: "अपने स्टार्टअप के लिए एक अनुकूलित चरण-दर-चरण रोडमैप तैयार करें।", marketing_center: "मार्केटिंग कमांड सेंटर", marketing_desc: "एक कस्टम रणनीति प्राप्त करें या उच्च-परिवर्तित अभियान शुरू करें।", genie_strategist: "जेनी मार्केटिंग रणनीतिकार", strategist_tagline: "जेनी को अपना बजट बताएं, रोडमैप प्राप्त करें।", your_product_label: "आपका उत्पाद/सेवा", budget_label: "मासिक बजट (INR)", generate_strat_btn: "मेरी रणनीति बनाएं", online_marketing: "ऑनलाइन मार्केटिंग", offline_marketing: "ऑफलाइन मार्केटिंग", meta_ads: "मेटा फेसबुक विज्ञापन", meta_ads_desc: "सटीक जनसांख्यिकी के साथ अरबों को लक्षित करें",
        new_invoice: "नया चालान", total_invoices_stat: "कुल चालान", paid_amount: "भुगतान की गई राशि", pending_amount: "लंबित राशि", business_profile: "व्यापार प्रोफ़ाइल", profile_setup_desc: "आपके सभी चालानों के लिए एक बार का सेटअप", company_name: "कंपनी का नाम", save_profile: "बिजनेस प्रोफाइल सहेजें", no_invoices: "अभी तक कोई चालान नहीं", no_invoices_desc: "अपना पहला जीएसटी चालान जेनरेट करने के लिए 'नया चालान' पर क्लिक करें।",
        train_assistant: "अपने सहायता सहायक को प्रशिक्षित करें", ask_questions: "ग्रोजेनी के बारे में प्रश्न पूछें", chat_welcome: "नमस्ते! मैं आपका जेनी सहायक हूँ। आप बाईं ओर के प्रश्नों पर क्लिक कर सकते हैं या नीचे अपना स्वयं का प्रश्न टाइप कर सकते हैं!", chat_placeholder: "अपना प्रश्न यहां लिखें...",
        performance: "प्रदर्शन", report: "रिपोर्ट", progress_desc: "अपने स्टार्टअप के विकास और जुड़ाव में गहराई से उतरें।", live_data: "लाइव डेटा", total_revenue: "कुल बिक्री राजस्व", genie_intelligence: "जेनी इंटेलिजेंस", platform_usage: "प्लेटफ़ॉर्म उपयोग", milestone_tracker: "मील का पत्थर ट्रैकर", account_created: "खाता बनाया गया", first_invoice: "पहला चालान भेजा गया", strategy_generated: "पूर्ण रणनीति तैयार", top_categories: "शीर्ष प्रदर्शन करने वाली श्रेणियां", growth_suggestions: "विकास के सुझाव",
        sign_in_desc: "अपने GrowGenie खाते में साइन इन करें", email_address: "ईमेल पता", email_placeholder: "नाम@कंपनी.com", password: "पासवर्ड", password_placeholder: "अपना पासवर्ड दर्ज करें", sign_in: "साइन इन", no_account: "कोई खाता नहीं है?", start_free_trial: "निःशुल्क ट्रायल शुरू करें",
        instagram_ads: "इंस्टाग्राम विज्ञापन", instagram_ads_desc: "युवा दर्शकों के लिए दृश्य कथावाचन", google_ads: "गूगल सर्च विज्ञापन", google_ads_desc: "जब लोग आपके उत्पाद खोजते हैं तब दिखें", physical_flyers: "फ़्लायर", physical_flyers_desc: "उच्च-यातायात क्षेत्रों में स्थानीय वितरण", billboard_ads: "होर्डिंग विज्ञापन", billboard_ads_desc: "प्रमुख शहरी स्थानों में उच्च दृश्यमानता", event_stalls: "इवेंट स्टॉल", event_stalls_desc: "प्रदर्शनियों और मेलों में सिधा जुड़ाव", expert_marketing: "विशेषज्ञ प्रबंधित मार्केटिंग", expert_marketing_desc: "सब कुछ हमारी टीम पर छोड़ना चाहते हैं? हम आपके लिए तैयार हैं।", contact_marketing: "मार्केटिंग टीम से संपर्क करें",
        voice_assistant: "वॉयस असिस्टेंट", voice_assistant_desc: "जेनी से बात करें — अपने व्यवसाय के बारे में कुछ भी पूछें", try_saying: "यह कहने का प्रयास करें…", voice_tips: "वॉयस टिप्स", conversation: "बातचीत", voice_input_placeholder: "अपना प्रश्न टाइप करें या बोलें…"
    },
    ta: {
        dashboard: "டாஷ்போர்டு", products: "தயாரிப்புகள்", ai_planner: "Grow Genie பிளானர்", invoices: "இன்வாய்ஸ்கள்", faq_bot: "Genie FAQ பாட்", marketing: "மார்க்கெட்டிங்", progress: "எனது முன்னேற்றம்", logout: "வெளியேறு", logged_in_as: "உள்நுழைந்துள்ளவர்", welcome_back: "நல்வரவு", ai_business_dashboard: "உங்கள் Genie வணிக டாஷ்போர்டு", ai_modules: "Genie தொகுதிகள்", modules_subtitle: "உங்கள் சக்திவாய்ந்த வணிக ஆட்டோமேஷன் கருவிகளை அணுகவும்.", upgrade_plan: "இப்போது மேம்படுத்தவும்", total_queries: "மொத்த வினவல்கள்", genie_generations: "Genie தலைமுறைகள்", invoices_sent: "அனுப்பப்பட்ட இன்வாய்ஸ்கள்", faq_entries: "FAQ பதிவுகள்", catalog_items: "பட்டியல் உருப்படிகள்", gst_compliant: "GST-இணக்கம்", knowledge_base: "அறிவு தளம்", ai_roadmap_gen_desc: "தொடக்கம் வரைபடம், உத்தி, விளம்பர நகல் & மேலும்", invoice_gen_desc: "உங்கள் வணிகத்திற்கான GST-இணக்கமான PDF இன்வாய்ஸ்கள்.", faq_bot_desc: "உங்கள் பாட்டைப் பயிற்றுவிக்கவும் — Genie 24/7 வினவல்களைக் கையாளுகிறது", manage_products: "முழு CRUD — தயாரிப்புகள் மற்றும் சேவைகளை நிர்வகிக்கவும்", effective_ways: "விளம்பர நகல், விளக்கங்கள் மற்றும் பலமொழி பிரச்சாரங்கள்", open_module: "தொகுதியைத் திற", translator: "மொழிபெயர்ப்பாளர்", translator_desc: "இந்தி, தமிழ், பெங்காலி, மராத்தியில் பிரச்சாரங்கள்", active_subscriptions: "உங்கள் சந்தா திட்டம்", valid_until: "வரை செல்லுபடியாகும் ...", marketplace: "சந்தை", marketplace_subtitle: "உங்கள் தொடக்கத்தை துரிதப்படுத்த பிரீமியம் சேவைகள்", cart_title: "வண்டி", your_cart: "உங்கள் வண்டி", total_amount: "மொத்த தொகை", proceed_to_pay: "பணம் செலுத்த தொடரவும்", startup_details: "தொடக்க விவரங்கள்", startup_name: "தொடக்கப் பெயர்", startup_name_placeholder: "எ.கா. ஆரா பாட்டில்கள்", startup_idea: "தொடக்க யோசனை", startup_idea_placeholder: "உங்கள் வணிகம் என்ன செய்கிறது என்பதை விளக்குங்கள்...", category: "வகை", budget_range: "பட்ஜெட் வரம்பு (INR)", output_language: "வெளியீட்டு மொழி", generate_roadmap: "சாலை வரைபடத்தை உருவாக்கு", your_roadmap: "உங்கள் சாலை வரைபடம்", roadmap_placeholder: "உங்கள் தொடக்கத்திற்காக தனிப்பயனாக்கப்பட்ட படிப்படியான சாலை வரைபடத்தை உருவாக்குங்கள்.", marketing_center: "சந்தைப்படுத்தல் கட்டளை மையம்", marketing_desc: "தனிப்பயன் உத்தியைப் பெறுங்கள் அல்லது பிரச்சாரங்களைத் தொடங்குங்கள்.", genie_strategist: "Genie சந்தைப்படுத்தல் மூலோபாயவாதி", strategist_tagline: "Genie-யிடம் உங்கள் பட்ஜெட்டைச் சொல்லுங்கள், ஒரு வரைபடத்தைப் பெறுங்கள்.", your_product_label: "உங்கள் தயாரிப்பு/சேவை", budget_label: "மாதாந்திர பட்ஜெட் (INR)", generate_strat_btn: "எனது மூலோபாயத்தை உருவாக்கு", online_marketing: "ஆன்லைன் மார்க்கெட்டிங்", offline_marketing: "ஆஃப்லைன் மார்க்கெட்டிங்", meta_ads: "மெட்டா பேஸ்புக் விளம்பரங்கள்", meta_ads_desc: "துல்லியமான புள்ளிவிவரங்களுடன் பில்லியன்களை இலக்கு வைக்கவும்",
        new_invoice: "புதிய இன்வாய்ஸ்", total_invoices_stat: "மொத்த இன்வாய்ஸ்கள்", paid_amount: "செலுத்தப்பட்ட தொகை", pending_amount: "நிலுவையில் உள்ள தொகை", business_profile: "வணிக சுயவிவரம்", profile_setup_desc: "உங்கள் அனைத்து இன்வாய்ஸுக்கும் ஒரு முறை அமைப்பு", company_name: "நிறுவனத்தின் பெயர்", save_profile: "வணிக சுயவிவரத்தைச் சேமி", no_invoices: "இன்னும் இன்வாய்ஸ்கள் இல்லை", no_invoices_desc: "உங்கள் முதல் ஜிஎஸ்டி இன்வாய்ஸை உருவாக்க 'புதிய இன்வாய்ஸ்' என்பதைக் கிளிக் செய்யவும்.",
        train_assistant: "உங்கள் ஆதரவு உதவியாளரைப் பயிற்றுவிக்கவும்", ask_questions: "GrowGenie பற்றி கேள்விகளைக் கேளுங்கள்", chat_welcome: "வணக்கம்! நான் உங்கள் Genie உதவியாளர். இடதுபுறத்தில் உள்ள கேள்விகளைக் கிளிக் செய்யலாம் அல்லது உங்கள் சொந்தக் கேள்வியைக் கீழே தட்டச்சு செய்யலாம்!", chat_placeholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
        performance: "செயல்திறன்", report: "அறிக்கை", progress_desc: "உங்கள் தொடக்கத்தின் வளர்ச்சி மற்றும் ஈடுபாட்டை ஆழமாக ஆராயுங்கள்.", live_data: "நேரடி தரவு", total_revenue: "மொத்த விற்பனை வருவாய்", genie_intelligence: "Genie நுண்ணறிவு", platform_usage: "தள பயன்பாடு", milestone_tracker: "மைல்கல் டிராக்கர்", account_created: "கணக்கு உருவாக்கப்பட்டது", first_invoice: "முதல் இன்வாய்ஸ் அனுப்பப்பட்டது", strategy_generated: "முழு உத்தி உருவாக்கப்பட்டது", top_categories: "சிறந்த செயல்திறன் கொண்ட வகைகள்", growth_suggestions: "வளர்ச்சி பரிந்துரைகள்",
        sign_in_desc: "உங்கள் GrowGenie கணக்கில் உள்நுழைக", email_address: "மின்னஞ்சல் முகவரி", email_placeholder: "பெயர்@நிறுவனம்.com", password: "கடவுச்சொல்", password_placeholder: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்", sign_in: "உள்நுழைக", no_account: "கணக்கு இல்லையா?", start_free_trial: "இலவச சோதனை தொடங்கு",
        instagram_ads: "இன்ஸ்டாகிராம் விளம்பரங்கள்", instagram_ads_desc: "இளய ப்ரேக்ஷகர்களுக்கான தொடர்கதை கதைகள்", google_ads: "கூகிள் தேடல் விளம்பரங்கள்", google_ads_desc: "மக்கள் உங்கள் தயாரிப்பை தேடும்போது தோன்றுங்கள்", physical_flyers: "ஒளியில் விளம்பரத்தாள்கள்", physical_flyers_desc: "அடர்ந்த பாதை பிரச்சார பிரேத௞த்தில் உள்ளூர் விதரணம்", billboard_ads: "மேம்பலை விளம்பரம்", billboard_ads_desc: "முக்கிய நகர இடங்களில் உயர் தெரிந்தய்", event_stalls: "நிகழ்வு ச்டால்கள்", event_stalls_desc: "கண்காட்சிகளில் நேரடி ஈடுபாடு", expert_marketing: "நிபுணர் நிர்வகிக்கப்பட்ட மார்க்கெட்டிங்", expert_marketing_desc: "அனைத்தையும் எங்கள் குழு கையாளட்டும் படியுங்களா?", contact_marketing: "மார்க்கெட்டிங் குழுவை தொடர்பு கொள்",
        voice_assistant: "குரல் உதவியாளர்", voice_assistant_desc: "ஜெனியுடன் பேசுங்கள் — உங்கள் வணிகத்தைப் பற்றி எதையும் கேளுங்கள்", try_saying: "இதைச் சொல்ல முயற்சிக்கவும்…", voice_tips: "குரல் குறிப்புகள்", conversation: "உரையாடல்", voice_input_placeholder: "உங்கள் கேள்வியைத் தட்டச்சு செய்யவும் அல்லது பேசவும்…"
    }
};

let currentLang = localStorage.getItem('growgenie_lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('growgenie_lang', lang);
    applyTranslations();
    // Refresh sidebar to update text
    const activePage = document.querySelector('.nav-item.active')?.getAttribute('href')?.replace('.php', '') || 'dashboard';
    renderSidebar(activePage);

    // Also trigger content translation for AI modules if they have language dropdowns
    const langSelect = document.getElementById('output_lang');
    if (langSelect) {
        // Map UI lang to AI output lang
        const map = { 'hi': 'Hindi', 'ta': 'Tamil', 'bn': 'Bengali', 'en': 'English' };
        if (map[lang]) langSelect.value = map[lang];
    }
}

function applyTranslations() {
    const langData = translations[currentLang];
    if (!langData) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });

    // Support for placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            el.placeholder = langData[key];
        }
    });
}

async function checkAuth(redirectIfNotLogged = true) {
    try {
        const response = await fetch(`${API_BASE}/auth.php?action=check`, {
            credentials: 'same-origin'
        });
        const data = await response.json();

        const path = window.location.pathname;
        const isAuthPage = path.endsWith('login.php') ||
            path.endsWith('register.php') ||
            path.endsWith('index.php') ||
            path.endsWith('about.php') ||
            path === '/' ||
            path.endsWith('/') ||
            path === '';

        if (data.status === 'success') {
            if (isAuthPage) {
                window.location.href = 'dashboard.php';
                return;
            }

            // Update UI elements if present
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => el.textContent = data.user.name);

            const subStatusElement = document.getElementById('sub-status');
            if (subStatusElement) {
                const status = data.user.subscription_status;
                const labelMap = { trial: 'Free Trial', premium: 'Premium Plan', expired: 'Plan Expired' };
                subStatusElement.textContent = labelMap[status] || status.toUpperCase();

                const dot = subStatusElement.previousElementSibling;
                if (status === 'premium') {
                    subStatusElement.className = 'text-sm font-black uppercase tracking-wider text-amber-600';
                    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 border border-dark-black inline-block';
                } else if (status === 'expired') {
                    subStatusElement.className = 'text-sm font-black uppercase tracking-wider text-red-600';
                    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-red-500 border border-dark-black inline-block';
                } else {
                    subStatusElement.className = 'text-sm font-black uppercase tracking-wider text-dark-black';
                    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-lime-green border border-dark-black inline-block';
                }
            }
            return data.user;
        } else {
            if (redirectIfNotLogged && !isAuthPage) {
                window.location.href = 'login.php';
            }
            return null;
        }
    } catch (e) {
        console.error("Auth check failed", e);
    }
}

async function logout() {
    await fetch(`${API_BASE}/auth.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=logout'
    });
    window.location.href = 'login.php';
}

function toggleSidebar() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (window.innerWidth > 1024) {
        document.body.classList.toggle('sidebar-closed');
    } else {
        document.body.classList.toggle('sidebar-open');
        if (overlay) overlay.classList.toggle('visible');
    }
}

function getSidebarHTML(activePage) {
    return `
        <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
        <div class="w-64 h-screen sidebar fixed top-0 left-0 flex flex-col p-6 border-r border-[#191a23] bg-white">
            <div class="flex items-center justify-between mb-12">
                <div class="flex items-center">
                    <svg class="w-8 h-8 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#b9ff66"/>
                        <path d="M20 10L30 20L20 30L10 20L20 10Z" fill="#191a23"/>
                    </svg>
                    <h1 class="text-2xl font-bold tracking-tight text-[#191a23]">GrowGenie</h1>
                </div>
                <button onclick="toggleSidebar()" class="text-dark-black hover:text-lime-green transition">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                </button>
            </div>
            
            <nav class="flex-1 space-y-2 overflow-y-auto">
                <a href="dashboard.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'dashboard' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span data-i18n="dashboard">Dashboard</span>
                </a>
                <a href="products.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'products' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <span data-i18n="products">Products</span>
                </a>
                <a href="ideas.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'ideas' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span data-i18n="ai_planner">Grow Genie Planner</span>
                </a>
                <a href="invoices.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'invoices' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span data-i18n="invoices">Invoices</span>
                </a>
                <a href="faq_bot.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'faq' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    <span data-i18n="faq_bot">FAQ Bot</span>
                </a>
                <a href="voice_assistant.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'voice' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    <span data-i18n="voice_assistant">Voice Assistant</span>
                </a>
                <a href="marketing.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'marketing' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                    <span data-i18n="marketing">Marketing</span>
                </a>
                <a href="progress.php" class="nav-item flex items-center p-4 font-bold text-lg ${activePage === 'progress' ? 'active' : 'text-[#191a23]'}">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <span data-i18n="progress">My Progress</span>
                </a>
            </nav>

            <div class="mt-auto space-y-4 pt-6 border-t border-gray-100">
                <div class="p-4 border border-[#191a23] rounded-2xl bg-light-gray shadow-[4px_4px_0_#191a23]">
                    <p class="text-xs text-gray-500 mb-2 uppercase tracking-wider font-extrabold">UI Language</p>
                    <select onchange="setLanguage(this.value)" class="w-full bg-white border border-dark-black rounded-lg p-2 font-bold text-sm focus:outline-none">
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English 🇺🇸</option>
                        <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>हिन्दी 🇮🇳</option>
                        <option value="ta" ${currentLang === 'ta' ? 'selected' : ''}>தமிழ் 🇮🇳</option>
                        <option value="bn" ${currentLang === 'bn' ? 'selected' : ''}>বাংলা 🇮🇳</option>
                        <option value="te" ${currentLang === 'te' ? 'selected' : ''}>తెలుగు 🇮🇳</option>
                        <option value="mr" ${currentLang === 'mr' ? 'selected' : ''}>मराठी 🇮🇳</option>
                        <option value="gu" ${currentLang === 'gu' ? 'selected' : ''}>ગુજરાતી 🇮🇳</option>
                        <option value="kn" ${currentLang === 'kn' ? 'selected' : ''}>ಕನ್ನಡ 🇮🇳</option>
                        <option value="ml" ${currentLang === 'ml' ? 'selected' : ''}>മലയാളം 🇮🇳</option>
                        <option value="pa" ${currentLang === 'pa' ? 'selected' : ''}>ਪੰਜਾਬੀ 🇮🇳</option>
                        <option value="es" ${currentLang === 'es' ? 'selected' : ''}>Español 🇪🇸</option>
                        <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français 🇫🇷</option>
                    </select>
                </div>

                <a href="profile.php" class="block p-4 border border-[#191a23] rounded-2xl bg-[#f3f3f3] shadow-[4px_4px_0_#191a23] hover:bg-lime-green hover:-translate-y-1 hover:shadow-[6px_6px_0_#191a23] transition-all cursor-pointer group">
                    <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider font-extrabold group-hover:text-dark-black" data-i18n="logged_in_as">Logged in as</p>
                    <p class="font-bold user-name truncate text-[#191a23] text-lg"></p>
                </a>
                <button onclick="logout()" class="w-full flex items-center justify-center p-4 rounded-xl border border-dark-black bg-white text-dark-black hover:bg-red-50 hover:text-red-600 transition font-bold shadow-[4px_4px_0_#191a23] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span data-i18n="logout">Logout</span>
                </button>
            </div>
        </div>
    `;
}

function renderSidebar(activePage) {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        sidebarContainer.innerHTML = getSidebarHTML(activePage);
        applyTranslations();
    }
}

// Add global floating WhatsApp button
document.addEventListener('DOMContentLoaded', () => {
    const waLink = 'https://wa.me/918292586501?text=Hi%20I%20need%20help%20with%20GrowGenie';
    const waButton = document.createElement('a');
    waButton.href = waLink;
    waButton.target = '_blank';
    waButton.className = 'fixed bottom-8 right-8 z-[999] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[4px_4px_0_#191a23] hover:-translate-y-1 hover:shadow-[6px_6px_0_#191a23] transition-all border-2 border-dark-black';
    waButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`;
    document.body.appendChild(waButton);
});
