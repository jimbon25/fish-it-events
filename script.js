/**
 * FISH IT ROBLOX - LANDING PAGE SCRIPT
 * 
 * Fungsi:
 * - Fetch event data dari GitHub repository
 * - Render event cards ke halaman
 * - Handle responsiveness dan animasi
 */

// ===== Configuration =====
const CONFIG = {
    // GitHub raw content URL untuk events.json
    EVENTS_URL: 'https://raw.githubusercontent.com/jimbon25/fish-it-events/main/events.json',
    
    // Fallback data jika tidak bisa fetch dari GitHub
    FALLBACK_EVENTS: [
        {
            id: 1,
            title: "🎣 Fishing Competition",
            date: "2026-02-08",
            description: "Kompetisi fishing terbesar bulan ini! Kumpulkan ikan sebanyak mungkin dan menangkan hadiah besar.",
            reward: "1st Place: 500 Robux\n2nd Place: 300 Robux\n3rd Place: 100 Robux"
        },
        {
            id: 2,
            title: "🎯 Treasure Hunt",
            date: "2026-02-15",
            description: "Cari harta karun yang tersembunyi di seluruh peta. Petunjuk akan diberikan saat event dimulai.",
            reward: "Top 5 Winners: 200 Robux each\nParticipation: 50 Robux"
        },
        {
            id: 3,
            title: "⚡ Speed Racing Challenge",
            date: "2026-02-22",
            description: "Balapan kecepatan seru dengan lintasan yang menantang. Siapa yang tercepat adalah juaranya!",
            reward: "1st Place: 400 Robux\n2nd Place: 250 Robux\n3rd Place: 150 Robux"
        }
    ]
};

/**
 * Fetch events dari GitHub repository
 * Returns: Promise<Array> - Array of events
 */
async function fetchEvents() {
    try {
        // Fetch dari GitHub raw URL
        const response = await fetch(CONFIG.EVENTS_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const events = await response.json();
        console.log('✅ Events berhasil di-fetch dari GitHub:', events);
        return events;
    } catch (error) {
        console.warn('⚠️ Tidak bisa fetch dari GitHub, menggunakan fallback data:', error);
        return CONFIG.FALLBACK_EVENTS;
    }
}

/**
 * Format tanggal ke format yang lebih readable
 * Params: dateString (YYYY-MM-DD)
 * Returns: String - Formatted date
 */
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Buat HTML untuk satu event card
 * Params: event (Object) - Event data
 * Returns: String - HTML event card
 */
function createEventCard(event) {
    const formattedDate = formatDate(event.date);
    const shortDate = event.date.split('-').reverse().join('/');
    
    // Format reward dengan line breaks
    const rewardHTML = event.reward
        .split('\n')
        .map(line => `<div>${line.trim()}</div>`)
        .join('');
    
    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-date">
                📅 ${shortDate}
            </div>
            <h3 class="event-title">${escapeHtml(event.title)}</h3>
            <p class="event-description">${escapeHtml(event.description)}</p>
            <div class="event-reward">
                <div class="event-reward-label">🎁 Hadiah:</div>
                <div class="event-reward-text">${rewardHTML}</div>
            </div>
        </div>
    `;
}

/**
 * Escape HTML untuk security (prevent XSS)
 * Params: text (String) - Text to escape
 * Returns: String - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Render events ke DOM
 * Params: events (Array) - Array of events
 */
function renderEvents(events) {
    const container = document.getElementById('eventsContainer');
    
    if (!container) {
        console.error('❌ Container #eventsContainer tidak ditemukan');
        return;
    }
    
    // Validasi events
    if (!Array.isArray(events) || events.length === 0) {
        container.innerHTML = `
            <div class="loading-spinner">
                <p>Belum ada event tersedia.</p>
            </div>
        `;
        return;
    }
    
    // Sort events by date (yang akan datang terlebih dahulu)
    const sortedEvents = events.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Generate HTML untuk semua events
    const eventsHTML = sortedEvents
        .map(event => createEventCard(event))
        .join('');
    
    container.innerHTML = eventsHTML;
    console.log(`✅ ${events.length} events berhasil di-render`);
}

/**
 * Inisialisasi halaman saat DOM selesai loading
 */
function initializePage() {
    console.log('🚀 Menginisialisasi landing page...');
    
    // Fetch dan render events
    fetchEvents().then(events => {
        renderEvents(events);
    }).catch(error => {
        console.error('❌ Error saat memuat events:', error);
        renderEvents(CONFIG.FALLBACK_EVENTS);
    });
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', initializePage);

/**
 * Smooth scroll untuk navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('✅ Landing page script loaded successfully');
