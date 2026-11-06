let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAuthMode = 'login'; // 'login' или 'register'

document.addEventListener('DOMContentLoaded', () => {
    updateUIBasedOnUser();
    loadAds();
});

// Управление интерфейсом в зависимости от входа
function updateUIBasedOnUser() {
    const container = document.getElementById('user-menu-container');
    if (currentUser) {
        container.innerHTML = `
            <button onclick="openProfileModal()" class="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-800 transition">
                <i class="fa-solid fa-user-shield"></i>
                <span>${currentUser.name || currentUser.phone}</span>
            </button>
        `;
    } else {
        container.innerHTML = `
            <button onclick="openAuthModal()" class="border border-green-600 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition">
                Войти
            </button>
        `;
    }
}

// Переключение между вкладками Войти / Регистрация
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

// Обработка отправки формы Входа/Регистрации
async function handleAuthSubmit(event) {
    event.preventDefault();
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
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            if (currentAuthMode === 'register') {
                alert('Регистрация прошла успешно! Теперь вы можете войти.');
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
    } catch (e) {
        console.error(e);
        alert('Ошибка соединения с сервером');
    }
}

// Загрузка обычных одобренных объявлений
async function loadAds() {
    try {
        const res = await fetch('/api/ads/');
        if (!res.ok) return;
        const ads = await res.json();
        const container = document.getElementById('ads-container');
        
        if (ads.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-sm col-span-full">Пока нет активных объявлений.</p>`;
            return;
        }

        container.innerHTML = ads.map(ad => {
            let images = [];
            try { images = JSON.parse(ad.images_json || '[]'); } catch(e){}
            const imgUrl = images.length > 0 ? images[0] : 'https://via.placeholder.com/300x200?text=AgroKZ';

            return `
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
                    <img src="${imgUrl}" alt="${ad.title}" class="w-full h-40 object-cover">
                    <div class="p-4">
                        <span class="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">${ad.category}</span>
                        <h3 class="font-bold text-gray-900 mt-1">${ad.title}</h3>
                        <p class="text-green-700 font-extrabold text-base mt-1">${ad.price.toLocaleString()} ₸</p>
                        <p class="text-gray-500 text-xs mt-1"><i class="fa-solid fa-location-dot"></i> ${ad.location}</p>
                        <p class="text-gray-600 text-xs mt-2 line-clamp-2">${ad.description}</p>
                        <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span><i class="fa-solid fa-phone"></i> ${ad.phone}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Ошибка загрузки объявлений", e);
    }
}

// Создание объявления
async function handleCreateAd(event) {
    event.preventDefault();
    if (!currentUser) {
        alert('Сначала войдите в систему!');
        openAuthModal();
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('ad-title').value);
    formData.append('category', document.getElementById('ad-category').value);
    formData.append('location', document.getElementById('ad-location').value);
    formData.append('price', document.getElementById('ad-price').value);
    formData.append('description', document.getElementById('ad-desc').value);
    formData.append('phone', currentUser.phone);
    formData.append('user_id', currentUser.id);

    const files = document.getElementById('ad-images').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

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
    } catch (e) {
        console.error(e);
        alert('Ошибка соединения');
    }
}

// Загрузка статистики и очереди для админа
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
            const listContainer = document.getElementById('admin-moderation-list');

            if (pending.length === 0) {
                listContainer.innerHTML = `<p class="text-xs text-gray-500">Нет объявлений на модерации.</p>`;
                return;
            }

            listContainer.innerHTML = pending.map(ad => `
                <div class="bg-white p-3 rounded-lg border border-amber-200 flex justify-between items-center text-xs">
                    <div>
                        <p class="font-bold text-gray-800">${ad.title}</p>
                        <p class="text-gray-500">${ad.price} ₸ | ${ad.location}</p>
                    </div>
                    <div class="space-x-1">
                        <button onclick="approveAd(${ad.id})" class="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded font-semibold">Одобрить</button>
                        <button onclick="deleteAd(${ad.id})" class="bg-red-100 hover:bg-red-200 text-red-600 px-2.5 py-1 rounded font-semibold">Удалить</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error("Ошибка загрузки данных админа", e);
    }
}

async function approveAd(id) {
    const res = await fetch(`/api/ads/${id}/approve`, { method: 'POST' });
    if (res.ok) loadAdminData();
}

async function deleteAd(id) {
    const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
    if (res.ok) loadAdminData();
}

// Управление модальными окнами
function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

function openProfileModal() {
    if (!currentUser) return;
    const info = document.getElementById('profile-info');
    info.innerHTML = `
        <div class="p-3 bg-gray-50 rounded-xl space-y-1 text-sm">
            <p><strong>Имя:</strong> ${currentUser.name || 'Не указано'}</p>
            <p><strong>Телефон:</strong> ${currentUser.phone}</p>
            <p><strong>Тип аккаунта:</strong> ${currentUser.user_type === 'company' ? 'Компания / КХ' : 'Физическое лицо'}</p>
            <p><strong>Роль:</strong> ${currentUser.is_admin ? '<span class="text-amber-700 font-bold">Администратор</span>' : 'Пользователь'}</p>
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
        alert('Сначала войдите в систему!');
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
    alert('Вы вышли из аккаунта.');
}
