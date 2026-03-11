/* ============================================================
   FOODIE ZONE — PREMIUM FEATURES JS
   Covers: Voice Search, Spin Wheel, Push Notifications,
           Tamil Language Toggle, PDF Receipt
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   1. 🎤 VOICE SEARCH
   ────────────────────────────────────────────────────────── */
function initVoiceSearch(inputId) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const btn = document.getElementById('voiceSearchBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        recognition.start();
        btn.classList.add('animate-pulse', 'text-orange-500');
        btn.innerHTML = '<i class="fa-solid fa-microphone-lines text-orange-500"></i>';
        showToast('🎤 Listening... Speak now!', 'info');
    });

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById(inputId);
        if (input) {
            input.value = transcript;
            input.dispatchEvent(new Event('keyup'));
        }
        showToast(`🎤 Searching: "${transcript}"`, 'success');
        btn.classList.remove('animate-pulse', 'text-orange-500');
        btn.innerHTML = '<i class="fa-solid fa-microphone text-gray-400"></i>';
    };

    recognition.onerror = () => {
        btn.classList.remove('animate-pulse', 'text-orange-500');
        btn.innerHTML = '<i class="fa-solid fa-microphone text-gray-400"></i>';
        showToast('❌ Could not hear you. Try again!', 'error');
    };

    recognition.onend = () => {
        btn.classList.remove('animate-pulse');
        btn.innerHTML = '<i class="fa-solid fa-microphone text-gray-400"></i>';
    };
}

/* ──────────────────────────────────────────────────────────
   2. 🔔 PUSH NOTIFICATIONS
   ────────────────────────────────────────────────────────── */
async function requestNotificationPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
}

async function sendPushNotification(title, body, icon = '/image/logo.png') {
    const allowed = await requestNotificationPermission();
    if (!allowed) return;
    const notif = new Notification(title, { body, icon, badge: icon, vibrate: [200, 100, 200] });
    notif.onclick = () => { window.focus(); notif.close(); };
}

function notifyOrderPlaced(orderId) {
    sendPushNotification(
        '✅ Order Confirmed! — Foodie Zone',
        `Your order #${orderId} is confirmed. We're preparing it now! 🍽️`
    );
    setTimeout(() => sendPushNotification(
        '👨‍🍳 Cooking Started — Foodie Zone',
        'Our chef has started cooking your order. ETA: ~25 mins!'
    ), 15000);
    setTimeout(() => sendPushNotification(
        '🛵 Out for Delivery — Foodie Zone',
        'Your food is on its way! Ramesh Kumar is heading to you.'
    ), 30000);
}

/* ──────────────────────────────────────────────────────────
   3. 📄 PDF RECEIPT GENERATOR
   ────────────────────────────────────────────────────────── */
function generatePDFReceipt(orderData) {
    // jsPDF must be loaded
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        showToast('PDF library loading... try again in 2 seconds', 'info');
        return;
    }

    const { jsPDF } = window.jspdf || window;
    const doc = new jsPDF({ unit: 'mm', format: 'a5' });

    const primary = [255, 107, 0];
    const dark = [30, 30, 30];
    const gray = [120, 120, 120];

    // Header background
    doc.setFillColor(...primary);
    doc.rect(0, 0, 148, 32, 'F');

    // Logo text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Foodie Zone', 10, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 200, 200);
    doc.text('#1 Food & Event Service in Tamil Nadu', 10, 20);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('ORDER RECEIPT', 10, 28);

    // Order ID & Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(`Order ID: ${orderData.orderId}`, 10, 40);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(`Date: ${new Date().toLocaleString('en-IN')}`, 10, 47);

    // Divider
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.5);
    doc.line(10, 52, 138, 52);

    // Items header
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 54, 128, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...dark);
    doc.text('Item', 13, 60);
    doc.text('Qty', 95, 60);
    doc.text('Price', 118, 60);
    doc.text('Total', 133, 60);

    // Items
    let y = 68;
    let grandTotal = 0;
    const items = orderData.items || [];

    items.forEach((item) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...dark);
        doc.text(String(item.name).substring(0, 28), 13, y);
        doc.text(String(item.qty), 97, y);
        doc.text(`Rs.${item.price}`, 115, y);
        doc.text(`Rs.${itemTotal}`, 130, y);

        y += 8;
        if (y > 180) { doc.addPage(); y = 20; }
    });

    // Totals box
    y += 4;
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.3);
    doc.line(10, y, 138, y);
    y += 6;

    const deliveryFee = orderData.deliveryFee || 0;
    const taxes = Math.round(grandTotal * 0.05);
    const finalTotal = grandTotal + deliveryFee + taxes;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text('Subtotal:', 90, y); doc.text(`Rs.${grandTotal}`, 130, y); y += 7;
    doc.text(`Delivery Fee:`, 90, y); doc.text(`Rs.${deliveryFee}`, 130, y); y += 7;
    doc.text('Taxes (5%):', 90, y); doc.text(`Rs.${taxes}`, 130, y); y += 5;
    doc.line(88, y, 138, y); y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primary);
    doc.text('TOTAL PAID:', 86, y);
    doc.text(`Rs.${finalTotal}`, 126, y);

    // Delivery address
    if (orderData.address) {
        y += 14;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...dark);
        doc.text('Delivered To:', 10, y); y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.text(orderData.address, 10, y, { maxWidth: 128 });
    }

    // Footer
    doc.setFillColor(...primary);
    doc.rect(0, 195, 148, 15, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('Thank you for ordering! | foodiezone.com | support@foodiezone.com', 74, 204, { align: 'center' });

    // Save
    doc.save(`Foodie_Zone_Receipt_${orderData.orderId}.pdf`);
    if (typeof showToast === 'function') showToast('📄 Receipt downloaded!', 'success');
}

/* ──────────────────────────────────────────────────────────
   4. 🎰 SPIN WHEEL
   ────────────────────────────────────────────────────────── */
const SPIN_REWARDS = [
    { label: '10% OFF', color: '#ff6b00', value: 'SPIN10' },
    { label: 'Try Again', color: '#6b7280', value: null },
    { label: 'Free\nDelivery', color: '#10b981', value: 'FREEDEL' },
    { label: '5% OFF', color: '#f59e0b', value: 'SPIN5' },
    { label: 'Try Again', color: '#6b7280', value: null },
    { label: '₹50 OFF', color: '#8b5cf6', value: 'FLAT50' },
    { label: 'Try Again', color: '#6b7280', value: null },
    { label: '15% OFF', color: '#ff8533', value: 'SPIN15' },
];

let spinAngle = 0;
let isSpinning = false;

function openSpinWheel() {
    const modal = document.getElementById('spinModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        drawWheel(spinAngle);
    }
}

function closeSpinModal() {
    const modal = document.getElementById('spinModal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}

function drawWheel(angle) {
    const canvas = document.getElementById('spinCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 8;
    const sliceAngle = (2 * Math.PI) / SPIN_REWARDS.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SPIN_REWARDS.forEach((seg, i) => {
        const start = angle + i * sliceAngle;
        const end = start + sliceAngle;

        // Slice
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        const lines = seg.label.split('\n');
        lines.forEach((line, li) => ctx.fillText(line, r - 10, li * 13 - (lines.length - 1) * 6));
        ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ff6b00';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = 'bold 9px Outfit';
    ctx.fillStyle = '#ff6b00';
    ctx.textAlign = 'center';
    ctx.fillText('SPIN!', cx, cy + 3);
}

function spinWheel() {
    if (isSpinning) return;

    let spinKey = 'lastSpinDate_guest';
    try {
        const u = JSON.parse(localStorage.getItem('currentUser'));
        if (u && u.username) spinKey = 'lastSpinDate_' + u.username;
    } catch(e) {}
    
    const lastSpun = localStorage.getItem(spinKey);
    const today = new Date().toDateString();
    if (lastSpun === today) {
        showToast('🎰 Already spun today! Come back tomorrow.', 'info');
        return;
    }

    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('spinResult').innerHTML = '';

    const sliceAngle = 360 / SPIN_REWARDS.length;
    const extraSpins = 5 * 360;
    const winIndex = Math.floor(Math.random() * SPIN_REWARDS.length);
    let startAngleDeg = (spinAngle * 180 / Math.PI) || 0;
    
    // We want the middle of winIndex slice to end up at exactly 270 degrees (top pointer).
    // Final angle + slice offset = 270
    // We add a realistic random offset so it doesn't land perfectly dead-center every time.
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);
    let delta = 270 - (startAngleDeg % 360) - (winIndex * sliceAngle) - (sliceAngle / 2) + randomOffset;
    while (delta < 0) delta += 360;
    const targetDeg = extraSpins + delta;
    const totalDeg = startAngleDeg + targetDeg;

    const duration = 5000; // Increased duration for a more realistic spin
    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        // Cubic ease-out for a very realistic wheel deceleration
        const ease = 1 - Math.pow(1 - t, 3);
        let current = startAngleDeg + (totalDeg - startAngleDeg) * ease;
        spinAngle = (current * Math.PI) / 180;
        drawWheel(spinAngle);
        if (t < 1) { requestAnimationFrame(animate); }
        else {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            const winner = SPIN_REWARDS[winIndex];
            
            let saveKey = 'lastSpinDate_guest';
            try {
                const u = JSON.parse(localStorage.getItem('currentUser'));
                if (u && u.username) saveKey = 'lastSpinDate_' + u.username;
            } catch(e) {}
            localStorage.setItem(saveKey, today);
            
            if (winner.value) {
                localStorage.setItem('spinCoupon', winner.value);
                document.getElementById('spinResult').innerHTML =
                    `<div class="mt-4 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-center">
            <p class="text-2xl font-black text-emerald-600">🎉 You Won!</p>
            <p class="text-xl font-bold text-gray-800 mt-1">${winner.label}</p>
            <p class="text-sm text-gray-500 mt-1">Code: <span class="font-mono font-black text-emerald-700">${winner.value}</span></p>
            <p class="text-xs text-gray-400 mt-2">Applied automatically on your next order!</p>
          </div>`;
                if (typeof confetti !== 'undefined') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff6b00', '#10b981', '#f59e0b'] });
                }
            } else {
                document.getElementById('spinResult').innerHTML =
                    `<div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
            <p class="text-lg font-bold text-gray-500">Better luck next time! 😊</p>
            <p class="text-xs text-gray-400">Spin again tomorrow!</p>
          </div>`;
            }
        }
    }
    requestAnimationFrame(animate);
}

/* ──────────────────────────────────────────────────────────
   5. 🌐 TAMIL LANGUAGE TOGGLE
   ────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
    en: {
        home: 'Home', about: 'About', order: 'Order',
        halls: 'Party Halls', reviews: 'Reviews',
        partner: 'Partner with Us', careers: 'Job Careers', login: 'Login',
        hero_title: 'Taste the <span class="text-emerald-400">Tradition</span>',
        hero_sub: 'From homely hostel mess plans to grand wedding feasts—we deliver happiness.',
        search_placeholder: 'Search for restaurant, item or more',
        search_btn: 'Search',
        tagline: '#1 Food & Event Service in Tamil Nadu',
    },
    ta: {
        home: 'முகப்பு', about: 'எங்களை பற்றி', order: 'ஆர்டர்',
        halls: 'பார்ட்டி ஹால்ஸ்', reviews: 'மதிப்புரைகள்',
        partner: 'கூட்டு வியாபாரி', careers: 'வேலை வாய்ப்பு', login: 'உள்நுழை',
        hero_title: 'சுவையின் <span class="text-emerald-400">பாரம்பரியம்</span>',
        hero_sub: 'ஹாஸ்டல் உணவிலிருந்து திருமண விருந்து வரை — மகிழ்ச்சி வழங்குகிறோம்.',
        search_placeholder: 'உணவகம் அல்லது உணவு பொருள் தேடுங்கள்',
        search_btn: 'தேடு',
        tagline: 'தமிழ்நாட்டின் #1 உணவு மற்றும் நிகழ்வு சேவை',
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ta' : 'en';
    localStorage.setItem('lang', currentLang);
    applyTranslations();
    updateLangBtn();
}

function applyTranslations() {
    const t = TRANSLATIONS[currentLang];
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });
}

function updateLangBtn() {
    const btn = document.getElementById('langToggleBtn');
    if (!btn) return;
    btn.innerHTML = currentLang === 'en'
        ? '<span class="text-xs font-black">தமிழ்</span>'
        : '<span class="text-xs font-black">EN</span>';
}

document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    updateLangBtn();
});
