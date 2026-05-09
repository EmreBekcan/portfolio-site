// script.js

// --- Preloader Kontrol Kodu ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    if (preloader) {
        // --- SÜREYİ UZATMAK İÇİN BU KODU KULLANIYORUZ ---
        // setTimeout fonksiyonu, içindeki kodun belirtilen milisaniye sonra çalışmasını sağlar.
        // 2000 milisaniye = 2 saniye. Bu değeri artırıp azaltarak süreyi değiştirebilirsiniz.
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500); // <-- SÜREYİ DEĞİŞTİRMEK İÇİN BU SAYIYI AYARLAYIN
    }
});

// --- Dil Çeviri Kodları ---
const translations = {
    en: {
        portfolio: "Portfolio",
        navHome: "Home Page",
        navWork: "Work",
        navAbout: "About",
        myNameIs: "My Name Is",
        jobTitle: "I'm a Visual Communication Designer",
        moreAboutMe: "More About Me",
        contactMe: "Contact Me",
        social: "Social",
        getInTouch: "Get in touch",
        bio: "I graduated from visual communication design department in 2023. I work on graphic design, 3D modeling and UX/UI. I also do editing, game design and architectural visualization. In my spare time I shoot photography and short films and use them to improve the quality of my work.",
        inquiries: "Inquiries",
        formIntro: "Please fill out the form on the bottom or email me directly at: <a href=\"mailto:emrebkcn@gmail.com\">emrebkcn@gmail.com</a>",
        formName: "Name",
        formEmail: "Email",
        formSubject: "Subject",
        formProject: "About Project",
        formSend: "Send",
        worksTitle: "3D Works"
    },
    tr: {
        portfolio: "Portfolyo",
        navHome: "Ana Sayfa",
        navWork: "Çalışmalar",
        navAbout: "Hakkında",
        myNameIs: "Benim Adım",
        jobTitle: "Görsel İletişim Tasarımcısıyım",
        moreAboutMe: "Daha Fazlası",
        contactMe: "İletişim",
        social: "Sosyal Medya",
        getInTouch: "İletişime Geçin",
        bio: "2023 yılında görsel iletişim tasarımı bölümünden mezun oldum. Grafik tasarım, 3D modelleme ve UX/UI üzerine çalışıyorum. Ayrıca kurgu, oyun tasarımı ve mimari görselleştirme de yapıyorum. Boş zamanlarımda fotoğraf ve kısa filmler çekerek işlerimin kalitesini artırmak için kullanıyorum.",
        inquiries: "Talepler",
        formIntro: "Lütfen aşağıdaki formu doldurun veya doğrudan e-posta gönderin: <a href=\"mailto:emrebkcn@gmail.com\">emrebkcn@gmail.com</a>",
        formName: "İsim",
        formEmail: "E-posta",
        formSubject: "Konu",
        formProject: "Proje Hakkında",
        formSend: "Gönder",
        worksTitle: "3D Çalışmalar"
    }
};

const languageSwitcher = document.getElementById('lang-switcher');

const setLanguage = (language) => {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[language] && translations[language][key]) {
            if (element.placeholder !== undefined) {
                element.placeholder = translations[language][key];
            } else if (key === 'formIntro') {
                element.innerHTML = translations[language][key];
            } else {
                element.textContent = translations[language][key];
            }
        }
    });
    document.documentElement.lang = language;
    if (languageSwitcher) {
        languageSwitcher.textContent = language === 'en' ? 'TR' : 'EN';
    }
    localStorage.setItem('language', language);
};

if (languageSwitcher) {
    languageSwitcher.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'tr' : 'en';
        setLanguage(newLang);
    });
}

// Sayfa içeriği (HTML) yüklendiğinde dili ayarla
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    // Contact form submit handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset();
                } else {
                    alert('Failed to send message: ' + (result.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to send message. Please try again.');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});