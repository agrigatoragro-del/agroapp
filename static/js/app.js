let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAuthMode = 'login';

let allAdsList = [];
let activeDealType = 'all'; // 'all', 'sell', 'buy'
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnUser();
    loadAds();
});

function updateUIBasedOnUser() {
    const container = document.getElementById('user-menu-container');
    const badge = document.getElementById('guest-badge');

    if (currentUser) {
        badge.textContent = `Вы вошли: ${currentUser.name || currentUser.phone}`;
        badge.className = "text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold";
        container.innerHTML = `
            <button onclick="openProfileModal()" class="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-800 transition">
                <i class="fa-solid fa-user-gear"></i>
                <span>Кабинет</span>
            </button>
        `;
    } else {
        badge.textContent = "Режим гостя";
        badge.className = "text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium";
        container.innerHTML = `
            <button onclick="openAuthModal()" class="border border-green-600 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                Войти / Регистрация
            </button>
        `;
    }
}

// Загрузка объявлений
async function loadAds() {
    try {
        const res = await fetch('/api/ads/');
        if (!res.ok) return;
        allAdsList = await res.json();
        applyFilters();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

// Двухуровневая фильтрация (Продам/Куплю + Категория)
function applyFilters() {
    let filtered = allAdsList;

    // 1. Фильтр Продам / Куплю
    if (activeDealType !== 'all') {
        filtered = filtered.filter(ad => {
            const isBuy = ad.title.toLowerCase().includes('куплю') || ad.description.toLowerCase().includes('куплю');
            return activeDealType === 'buy' ? isBuy : !isBuy;
        });
    }

    // 2. Фильтр Категории
    if (activeCategory !== 'all') {
        filtered = filtered.filter(ad => ad.category === activeCategory);
    }

    renderAds(filtered);
}

function filterDealType(type) {
    activeDealType = type;
    document.querySelectorAll('.deal-type-btn').forEach(b => {
        b.classList.remove('bg-white', 'text-green-700', 'shadow-sm');
        b.classList.add('text-gray-600');
    });
    
    const activeBtn = document.getElementById(`type-btn-${type}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-600');
        activeBtn.classList.add('bg-white', 'text-green-700', 'shadow-sm');
    }

    applyFilters();
}

function filterCategory(cat, event) {
    activeCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'border', 'border-gray-200', 'text-gray-700');
    });

    if (event && event.target) {
        event.target.classList.remove('bg-white', 'border', 'border-gray-200', 'text-gray-700');
        event.target.classList.add('bg-green-600', 'text-white', 'shadow-sm');
    }

    applyFilters();
}

function renderAds(adsToRender) {
    const container = document.getElementById('ads-container');
    if (adsToRender.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm col-span-full text-center py-10">В выбранных фильтрах объявлений не найдено.</p>`;
        return;
    }

    container.innerHTML = adsToRender.map(ad => {
        let images = [];
        try { images = JSON.parse(ad.images_json || '[]'); } catch(e){}
        const imgUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/300x200?text=AgroKZ';
        const isBuy = ad.title.toLowerCase().includes('куплю');

        return `
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                    <div class="relative">
                        <img src="${imgUrl}" alt="${ad.title}" class="w-full h-40 object-cover">
                        <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-md text-white ${isBuy ? 'bg-blue-600' : 'bg-green-600'}">
                            ${isBuy ? 'КУПЛЮ' : 'ПРОДАМ'}
                        </span>
                    </div>
                    <div class="p-4">
                        <span class="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-semibold">${ad.category}</span>
                        <h3 class="font-bold text-gray-900 mt-1">${ad.title}</h3>
                        <p class="text-green-700 font-extrabold text-base mt-1">${ad.price.toLocaleString()} ₸</p>
                        <p class="text-gray-500 text-xs mt-1"><i class="fa-solid fa-location-dot"></i> ${ad.location}</p>
                        <p class="text-gray-600 text-xs mt-2 line-clamp-2">${ad.description}</p>
                    </div>
                </div>
                <div class="p-4 pt-0 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 mt-3">
                    <span><i class="fa-solid fa-phone"></i> ${ad.phone}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Авторизация и регистрация
function switchAuthMode(mode) {
    currentAuthMode = mode;
    const regFields = document.getElementById('register-fields');
    const loginBtn = document.getElementById('tab-login-btn');
    const regBtn = document.getElementById('tab-register-btn');
    const submitBtn = document.getElementById('auth-submit-btn');

    if (mode === 'register') {
        regFields.classList.remove('hidden');
        regBtn.className = "flex-1 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-green-700";
        loginBtn.className = "flex-1 py-1.5 text-xs font-semibold text-gray-500 rounded-md";
        submitBtn.textContent = "Зарегистрироваться";
    } else {
        regFields.classList.add('hidden');
        loginBtn.className = "flex-1 py-1.5 text-xs font-semibold rounded-md bg-white shadow-sm text-green-700";
        regBtn.className = "flex-1 py-1.5 text-xs font-semibold text-gray-500 rounded-md";
        submitBtn.textContent = "Войти";
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const phone = document.getElementById('auth-phone').value;
    const password = document.getElementById('auth-password').value;

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('password', password);

    let url = '/api/users/login';
    if (currentAuthMode === 'register') {
        url = '/api/users/register';
        formData.append('name', document.getElementById('reg-name').value);
        formData.append('user_type', document.getElementById('reg-type').value);
    }

    try {
        const res = await fetch(url, { method: 'POST', body: formData });
        const result = await res.json();
        if (res.ok) {
            if (currentAuthMode === 'register') {
                alert('Регистрация успешна! Теперь вы можете войти в аккаунт.');
                switchAuthMode('login');
            } else {
                currentUser = result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                closeAuthModal();
                updateUIBasedOnUser();
                alert('Успешный вход!');
            }
        } else {
            alert('Ошибка: ' + (result.detail || 'Не удалось выполнить запрос'));
        }
    } catch (err) {
        alert('Ошибка соединения с сервером');
    }
}

// Подача объявления
async function handleCreateAd(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Сначала войдите в систему или зарегистрируйтесь!');
        openAuthModal();
        return;
    }

    const formData = new FormData();
    const dealType = document.getElementById('ad-deal-type').value;
    const rawTitle = document.getElementById('ad-title').value;
    
    // Автоматический префикс Продам / Куплю к заголовку
    const titlePrefix = dealType === 'buy' ? 'Куплю: ' : 'Продам: ';
    formData.append('title', rawTitle.toLowerCase().startsWith('куплю') || rawTitle.toLowerCase().startsWith('продам') ? rawTitle : titlePrefix + rawTitle);
    
    formData.append('category', document.getElementById('ad-category').value);
    formData.append('location', document.getElementById('ad-location').value);
    formData.append('price', document.getElementById('ad-price').value);
    formData.append('description', document.getElementById('ad-desc').value);
    formData.append('phone', currentUser.phone);
    formData.append('user_id', currentUser.id);

    const files = document.getElementById('ad-images').files;
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);

    try {
        const res = await fetch('/api/ads/', { method: 'POST', body: formData });
        if (res.ok) {
            alert('Объявление успешно отправлено на модерацию!');
            closeAddAdModal();
            document.getElementById('ad-form').reset();
            loadAds();
        } else {
            alert('Ошибка при создании объявления');
        }
    } catch (err) {
        alert('Ошибка связи с сервером');
    }
}

// Данные админа
async function loadAdminData() {
    if (!currentUser || !currentUser.is_admin) return;
    try {
        const statsRes = await fetch('/api/users/admin/stats');
        if (statsRes.ok) {
            const stats = await statsRes.json();
            document.getElementById('stat-users-count').textContent = stats.total_users;
            document.getElementById('stat-ads-count').textContent = stats.total_ads;
            document.getElementById('stat-pending-count').textContent = stats.pending_ads;
        }

        const adsRes = await fetch('/api/ads/?admin_view=true');
        if (adsRes.ok) {
            const allAds = await adsRes.json();
            const pending = allAds.filter(a => !a.is_approved);
            const container = document.getElementById('admin-moderation-list');

            if (pending.length === 0) {
                container.innerHTML = `<p class="text-xs text-gray-500">Очередь модерации пуста.</p>`;
                return;
            }

            container.innerHTML = pending.map(ad => `
                <div class="bg-white p-2.5 rounded-lg border border-amber-200 flex justify-between items-center text-xs">
                    <div>
                        <p class="font-bold text-gray-800">${ad.title}</p>
                        <p class="text-gray-500">${ad.price} ₸ | ${ad.location}</p>
                    </div>
                    <div class="space-x-1">
                        <button onclick="approveAd(${ad.id})" class="bg-green-600 text-white px-2 py-1 rounded font-semibold">Одобрить</button>
                        <button onclick="deleteAd(${ad.id})" class="bg-red-100 text-red-600 px-2 py-1 rounded font-semibold">Удалить</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {}
}

async function approveAd(id) {
    const res = await fetch(`/api/ads/${id}/approve`, { method: 'POST' });
    if (res.ok) loadAdminData();
}

async function deleteAd(id) {
    const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
    if (res.ok) loadAdminData();
}

// Окна
function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

function openProfileModal() {
    if (!currentUser) return;
    document.getElementById('profile-info').innerHTML = `
        <div class="p-3 bg-gray-50 rounded-xl text-sm space-y-1">
            <p><strong>Имя / Организация:</strong> ${currentUser.name || 'Не указано'}</p>
            <p><strong>Телефон:</strong> ${currentUser.phone}</p>
            <p><strong>Статус:</strong> ${currentUser.user_type === 'company' ? 'Компания / КХ' : 'Физическое лицо'}</p>
            <p><strong>Права:</strong> ${currentUser.is_admin ? '<span class="text-amber-700 font-bold">Администратор</span>' : 'Пользователь'}</p>
        </div>
    `;

    const adminSection = document.getElementById('admin-panel-section');
    if (currentUser.is_admin) {
        adminSection.classList.remove('hidden');
        loadAdminData();
    } else {
        adminSection.classList.add('hidden');
    }
    document.getElementById('profile-modal').classList.remove('hidden');
}
function closeProfileModal() { document.getElementById('profile-modal').classList.add('hidden'); }

function openAddAdModal() {
    if (!currentUser) {
        alert('Подача объявлений доступна только залогиненным пользователям.');
        openAuthModal();
        return;
    }
    document.getElementById('add-ad-modal').classList.remove('hidden');
}
function closeAddAdModal() { document.getElementById('add-ad-modal').classList.add('hidden'); }

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    closeProfileModal();
    updateUIBasedOnUser();
    alert('Вы вышли в режим гостя.');
}
