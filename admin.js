/**
 * FISH IT ROBLOX - ADMIN DASHBOARD SCRIPT
 * 
 * Fungsi:
 * - Login dengan password
 * - Fetch events dari GitHub
 * - Form untuk tambah/edit event
 * - Simpan events ke GitHub menggunakan REST API
 * - Update events.json di repository
 */

// ===== Configuration =====
const ADMIN_CONFIG = {
    // Admin password (HARDCODED - untuk production, gunakan backend)
    ADMIN_PASSWORD: 'fishit2026',
    
    // GitHub Configuration
    GITHUB_USERNAME: 'jimbon25',
    GITHUB_REPO: 'fish-it-events',
    GITHUB_BRANCH: 'main',
    GITHUB_TOKEN_KEY: 'GITHUB_TOKEN', // Key untuk environment variable
    
    // File path di repository
    EVENTS_FILE_PATH: 'events.json',
    
    // Local storage keys
    AUTH_KEY: 'fishit_admin_authenticated',
    EVENTS_KEY: 'fishit_events_cache'
};

// ===== State Management =====
let isAuthenticated = false;
let currentEvents = [];

/**
 * Check if user sudah authenticated (dari localStorage)
 * Returns: Boolean
 */
function checkAuthentication() {
    const auth = localStorage.getItem(ADMIN_CONFIG.AUTH_KEY);
    return auth === 'true';
}

/**
 * Set authentication status
 * Params: status (Boolean)
 */
function setAuthentication(status) {
    if (status) {
        localStorage.setItem(ADMIN_CONFIG.AUTH_KEY, 'true');
    } else {
        localStorage.removeItem(ADMIN_CONFIG.AUTH_KEY);
    }
    isAuthenticated = status;
}

/**
 * Handle login form submission
 * Params: event (Event object)
 */
function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput.value.trim();
    
    // Validasi password
    if (password === ADMIN_CONFIG.ADMIN_PASSWORD) {
        console.log('✅ Login berhasil!');
        setAuthentication(true);
        showAdminDashboard();
        loadEvents();
        passwordInput.value = '';
    } else {
        console.warn('❌ Password salah');
        alert('❌ Password salah! Silakan coba lagi.');
        passwordInput.value = '';
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Yakin ingin logout?')) {
        setAuthentication(false);
        console.log('📤 Logout berhasil');
        location.reload();
    }
}

/**
 * Show admin dashboard (hide login page)
 */
function showAdminDashboard() {
    const loginPage = document.getElementById('loginPage');
    const dashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginPage) loginPage.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
}

/**
 * Show login page (hide admin dashboard)
 */
function showLoginPage() {
    const loginPage = document.getElementById('loginPage');
    const dashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginPage) loginPage.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
}

/**
 * Get GitHub token dari environment variable
 * PENTING: Token harus di-set di environment variable saat deploy
 * Returns: String - GitHub token
 */
function getGitHubToken() {
    // Coba ambil dari localStorage dulu (untuk development)
    const tokenFromStorage = localStorage.getItem('github_token');
    if (tokenFromStorage) {
        console.log('✅ Token dari localStorage');
        return tokenFromStorage;
    }
    
    // Untuk Vercel, token tersedia sebagai environment variable
    // Akan di-inject saat build/deploy
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.GITHUB_TOKEN) {
        console.log('✅ Token dari environment');
        return window.__ENV__.GITHUB_TOKEN;
    }
    
    console.warn('⚠️ GitHub token tidak ditemukan!');
    console.warn('Di Vercel: Token harus di-set di Environment Variables');
    console.warn('Di localhost: Set localStorage.setItem("github_token", "token_anda")');
    return null;
}

/**
 * Fetch events dari GitHub
 * Returns: Promise<Array> - Array of events
 */
async function fetchEventsFromGitHub() {
    try {
        const url = `https://raw.githubusercontent.com/${ADMIN_CONFIG.GITHUB_USERNAME}/${ADMIN_CONFIG.GITHUB_REPO}/${ADMIN_CONFIG.GITHUB_BRANCH}/${ADMIN_CONFIG.EVENTS_FILE_PATH}`;
        
        console.log(`🔄 Fetching events dari: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const events = await response.json();
        
        // Cache events di localStorage
        localStorage.setItem(ADMIN_CONFIG.EVENTS_KEY, JSON.stringify(events));
        
        console.log('✅ Events berhasil di-fetch:', events);
        return events;
    } catch (error) {
        console.error('❌ Error fetching events:', error);
        
        // Gunakan cached events jika tersedia
        const cached = localStorage.getItem(ADMIN_CONFIG.EVENTS_KEY);
        if (cached) {
            console.log('💾 Menggunakan cached events');
            return JSON.parse(cached);
        }
        
        return [];
    }
}

/**
 * Load events ke memory
 */
async function loadEvents() {
    currentEvents = await fetchEventsFromGitHub();
    renderEventsList(currentEvents);
}

/**
 * Format tanggal ke YYYY-MM-DD
 * Params: dateString - date string dalam berbagai format
 * Returns: String - YYYY-MM-DD
 */
function formatDateISO(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

/**
 * Create event object baru dari form
 * Returns: Object - New event
 */
function createEventFromForm() {
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const reward = document.getElementById('eventReward').value.trim();
    const date = document.getElementById('eventDate').value;
    
    // Validasi
    if (!title || !description || !reward || !date) {
        throw new Error('Semua field harus diisi!');
    }
    
    // Generate ID (timestamp-based)
    const id = Date.now();
    
    return {
        id,
        title,
        description,
        reward,
        date: formatDateISO(date)
    };
}

/**
 * Save events ke GitHub menggunakan REST API
 * Params: events (Array) - Updated events array
 * Returns: Promise<boolean> - Success status
 */
async function saveEventsToGitHub(events) {
    const token = getGitHubToken();
    
    if (!token) {
        showStatus('❌ GitHub token tidak ditemukan. Setup token di environment variable.', 'error');
        return false;
    }
    
    try {
        // Format JSON dengan indent 2 untuk readability
        const jsonContent = JSON.stringify(events, null, 2);
        
        // Encode content ke base64 (GitHub API requirement)
        const encodedContent = btoa(jsonContent);
        
        // GitHub API endpoint
        const apiUrl = `https://api.github.com/repos/${ADMIN_CONFIG.GITHUB_USERNAME}/${ADMIN_CONFIG.GITHUB_REPO}/contents/${ADMIN_CONFIG.EVENTS_FILE_PATH}`;
        
        console.log(`📤 Mengupload ke GitHub: ${apiUrl}`);
        
        // Get current file SHA (untuk update)
        const getResponse = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        let sha = null;
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
            console.log('📝 Current file SHA:', sha);
        }
        
        // Prepare commit payload
        const payload = {
            message: `🐟 Update events - ${new Date().toLocaleString('id-ID')}`,
            content: encodedContent,
            branch: ADMIN_CONFIG.GITHUB_BRANCH
        };
        
        // Jika file sudah ada, include SHA untuk update
        if (sha) {
            payload.sha = sha;
        }
        
        // Upload ke GitHub
        const putResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!putResponse.ok) {
            const errorData = await putResponse.json();
            throw new Error(`GitHub API error: ${errorData.message}`);
        }
        
        const result = await putResponse.json();
        console.log('✅ Events berhasil disimpan ke GitHub!', result);
        
        return true;
    } catch (error) {
        console.error('❌ Error saving to GitHub:', error);
        throw error;
    }
}

/**
 * Handle form submission untuk tambah event
 * Params: event (Event object)
 */
async function handleEventFormSubmit(event) {
    event.preventDefault();
    
    try {
        console.log('📝 Membuat event baru...');
        
        // Create event dari form
        const newEvent = createEventFromForm();
        
        // Tambah ke array
        currentEvents.push(newEvent);
        
        // Sort by date
        currentEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Save ke GitHub
        showStatus('⏳ Menyimpan ke GitHub...', 'info');
        await saveEventsToGitHub(currentEvents);
        
        // Success message
        showStatus('✅ Event berhasil ditambahkan!', 'success');
        
        // Reset form
        document.getElementById('eventForm').reset();
        
        // Refresh events list
        renderEventsList(currentEvents);
        
        // Clear success message setelah 3 detik
        setTimeout(() => {
            const msg = document.getElementById('statusMessage');
            if (msg) msg.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error creating event:', error);
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Delete event
 * Params: eventId (number)
 */
async function deleteEvent(eventId) {
    if (!confirm('Yakin ingin menghapus event ini?')) {
        return;
    }
    
    try {
        console.log(`🗑️ Menghapus event ${eventId}...`);
        
        // Filter out event
        currentEvents = currentEvents.filter(e => e.id !== eventId);
        
        // Save ke GitHub
        showStatus('⏳ Menghapus event...', 'info');
        await saveEventsToGitHub(currentEvents);
        
        // Success
        showStatus('✅ Event berhasil dihapus!', 'success');
        renderEventsList(currentEvents);
        
        // Clear message setelah 3 detik
        setTimeout(() => {
            const msg = document.getElementById('statusMessage');
            if (msg) msg.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('❌ Error deleting event:', error);
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

/**
 * Render daftar events di admin panel
 * Params: events (Array)
 */
function renderEventsList(events) {
    const container = document.getElementById('eventsList');
    
    if (!container) return;
    
    if (!Array.isArray(events) || events.length === 0) {
        container.innerHTML = `
            <div class="loading-spinner">
                <p>Belum ada event. Tambahkan event baru!</p>
            </div>
        `;
        return;
    }
    
    // Sort by date
    const sorted = [...events].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Generate HTML
    const html = sorted.map(event => `
        <div class="event-list-item">
            <div class="event-list-content">
                <h4>${escapeHtml(event.title)}</h4>
                <div class="event-list-date">
                    📅 ${event.date}
                </div>
                <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                    ${escapeHtml(event.description)}
                </p>
            </div>
            <div class="event-list-actions">
                <button class="btn btn-delete" onclick="deleteEvent(${event.id})">
                    🗑️ Hapus
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

/**
 * Show status message
 * Params: message (String), type (String) - 'success', 'error', 'info'
 */
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
}

/**
 * Escape HTML untuk security
 * Params: text (String)
 * Returns: String - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize admin page
 */
function initializeAdminPage() {
    console.log('🚀 Initializing admin dashboard...');
    
    // Check authentication
    if (checkAuthentication()) {
        console.log('✅ User sudah authenticated');
        showAdminDashboard();
        loadEvents();
    } else {
        console.log('🔒 User belum authenticated');
        showLoginPage();
    }
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventFormSubmit);
    }
}

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', initializeAdminPage);

console.log('✅ Admin dashboard script loaded successfully');
