let currentUser = JSON.parse(localStorage.getItem('agro_user')) || null;
let currentCategory = '';
let currentAuthType = 'individual';
let pendingAction = null;

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuthStatus();
    loadAds();
});

function updateHeaderAuthStatus() {
    const badge = document.getElementById('user-status-badge');
    if (currentUser) {
        const avatarSrc = currentUser.avatar_url || 'https://via.placeholder.com/40?text=A';
        badge.innerHTML = `
            <div class="flex items-center gap-1.5">
                <img src="${avatarSrc}" class="w-5 h-5 rounded-full object-cover border border-white">
                <span>${currentUser.name || currentUser.phone}</span>
            </div>
        `;
        badge.className = "text-xs bg-green-900 px-3 py-1 rounded-full border border-green-400 text-white cursor-pointer";
    } else {
        badge.innerHTML = "Гость";
        badge.className = "text-xs bg-green-800 px-3 py-1 rounded-full border border-green-500 text-white cursor-pointer";
    }
}

function switchTab(tabName) {
    const feedView = document.getElementById('view-feed');
    const profileView = document.getElementById('view-profile');
    const navFeed = document.getElementById('nav-feed');
    const navProfile = document.getElementById('nav-profile');

    if (tabName === 'feed') {
        feedView.classList.remove('hidden');
        profileView.classList.add('hidden');
        navFeed.className = "flex flex-col items-center text-green-600";
        navProfile.className = "flex flex-col items-center text-gray-500 hover:text-green-600";
        loadAds();
    } else if (tabName === 'profile') {
        if (!currentUser) {
            requireAuthToContact(() => switchTab('profile'));
            return;
        }
        feedView.classList.add('hidden');
        profileView.classList.remove('hidden');
        navProfile.className = "flex flex-col items-center text-green-600";
        navFeed.className = "flex flex-col items-center text-gray-500 hover:text-green-600";
        renderProfileData();
    }
}

function renderProfileData() {
    if (!currentUser) return;

    document.getElementById('prof-name').textContent = currentUser.name || 'Не указано';
    document.getElementById('prof-phone').textContent = currentUser.phone;
    document.getElementById('prof-type').textContent = currentUser.user_type === 'company' ? 'Юр. лицо (ТОО)' : 'Физ. лицо / КХ';
    document.getElementById('prof-bin').textContent = currentUser.bin_iin || 'Не указан';
    document.getElementById('prof-credits').textContent = `${currentUser.ad_credits || 0} ₸`;

    const avatarImg = document.getElementById('prof-avatar-img');
    avatarImg.src = currentUser.avatar_url || "https://via.placeholder.com/150?text=Фото";

    const badge = document.getElementById('prof-verified-badge');
    if (currentUser.is_verified) {
        badge.textContent = "Verified Vendor (Проверен)";
        badge.className = "text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold";
    } else {
        badge.textContent = "Обычный аккаунт";
        badge.className = "text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold";
    }

    loadMyAds();
}

// Смена пароля из ЛК
async function changePassword(event) {
    event.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);

    try {
        const res = await fetch(`/api/users/${currentUser.id}/change-password`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            alert('Пароль успешно изменен!');
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';
        } else {
            const err = await res.json();
            alert('Ошибка: ' + (err.detail || 'Не удалось сменить пароль'));
        }
    } catch (e) {
        alert('Ошибка соединения с сервером');
    }
}

async function uploadUserAvatar(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const res = await fetch(`/api/users/${currentUser.id}/avatar`, {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            currentUser.avatar_url = data.avatar_url;
            localStorage.setItem('agro_user', JSON.stringify(currentUser));
            renderProfileData();
            updateHeaderAuthStatus();
            alert('Фото профиля успешно обновлено!');
        } else {
            alert('Не удалось загрузить фото');
        }
    } catch (e) {
        alert('Ошибка соединения');
    }
}

async function loadMyAds() {
    const container = document.getElementById('my-ads-list');
    container.innerHTML = '<p class="text-sm text-gray-500">Загрузка...</p>';

    try {
        const ads = await fetchAdsApi();
        const myAds = ads.filter(ad => ad.user_id === currentUser.id);

        if (myAds.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">У вас пока нет объявлений.</p>';
            return;
        }

        container.innerHTML = myAds.map(ad => `
            <div class="border rounded-lg p-3 flex justify-between items-center bg-gray-50">
                <div>
                    <span class="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">${ad.category}</span>
                    <h4 class="font-bold text-gray-800 text-sm mt-1">${ad.title}</h4>
                    <p class="text-xs text-green-700 font-extrabold">${ad.price.toLocaleString()} ₸</p>
                </div>
                <button onclick="deleteAd(${ad.id})" class="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-trash"></i> Удалить
                </button>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p class="text-sm text-red-500">Ошибка загрузки</p>';
    }
}

async function deleteAd(adId) {
    if (!confirm('Удалить это объявление?')) return;
    try {
        const res = await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
        if (res.ok) {
            loadMyAds();
        } else {
            alert('Не удалось удалить');
        }
    } catch (e) {
        alert('Ошибка соединения');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('agro_user');
    updateHeaderAuthStatus();
    switchTab('feed');
    alert('Вы вышли из аккаунта.');
}

async function loadAds() {
    const container = document.getElementById('ads-list');
    const regionFilter = document.getElementById('filter-region').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Загрузка объявлений...</div>';

    try {
        const ads = await fetchAdsApi();
        let filtered = ads;
        if (currentCategory) filtered = filtered.filter(ad => ad.category === currentCategory);
        if (regionFilter) filtered = filtered.filter(ad => ad.location && ad.location.includes(regionFilter));
        if (searchQuery) filtered = filtered.filter(ad => ad.title.toLowerCase().includes(searchQuery) || ad.description.toLowerCase().includes(searchQuery));

        if (!filtered || filtered.length === 0) {
            container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Объявлений не найдено.</div>';
            return;
        }

        container.innerHTML = filtered.map(ad => {
            const phoneClean = ad.phone ? ad.phone.replace(/[^0-9]/g, '') : '77000000000';
            const waLink = `https://wa.me/${phoneClean}?text=` + encodeURIComponent(`Здравствуйте! Меня интересует "${ad.title}".`);
            const telLink = `tel:${phoneClean}`;
            const imageHtml = ad.image_url ? `<div class="h-48 w-full overflow-hidden rounded-lg mb-3 bg-gray-100"><img src="${ad.image_url}" class="w-full h-full object-cover"></div>` : '';

            return `
                <div class="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
                    <div>
                        ${imageHtml}
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">${ad.category}</span>
                            <span class="text-xs text-gray-500"><i class="fa-solid fa-location-dot text-green-600"></i> ${ad.location}</span>
                        </div>
                        <h3 class="font-bold text-lg text-gray-800 mb-1">${ad.title}</h3>
                        <p class="text-gray-600 text-sm mb-3 line-clamp-2">${ad.description}</p>
                    </div>
                    <div>
                        <div class="flex justify-between items-center border-t pt-3 mt-2 mb-3">
                            <span class="text-xl font-extrabold text-green-700">${ad.price.toLocaleString()} ₸</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <button onclick="checkAndOpenContact('${waLink}')" class="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg text-center font-medium flex items-center justify-center gap-1">
                                <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                            </button>
                            <button onclick="checkAndOpenContact('${telLink}')" class="bg-gray-900 hover:bg-gray-800 text-white text-xs py-2 px-3 rounded-lg text-center font-medium flex items-center justify-center gap-1">
                                <i class="fa-solid fa-phone text-xs"></i> Позвонить
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<div class="text-center py-10 text-red-500 col-span-full">Ошибка загрузки</div>';
    }
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-gray-200', 'active');
        btn.classList.add('bg-gray-100');
    });
    event.target.classList.remove('bg-gray-100');
    event.target.classList.add('bg-gray-200', 'active');
    loadAds();
}

function openAddModal() {
    if (!currentUser) {
        alert("Для подачи объявления необходимо войти!");
        requireAuthToContact(() => document.getElementById('addModal').classList.remove('hidden'));
        return;
    }
    document.getElementById('addModal').classList.remove('hidden');
}

function closeAddModal() { document.getElementById('addModal').classList.add('hidden'); }

async function submitAd(event) {
    event.preventDefault();
    if (!currentUser) return;

    const formData = new FormData();
    formData.append('title', document.getElementById('ad-title').value);
    formData.append('category', document.getElementById('ad-category').value);
    formData.append('location', document.getElementById('ad-location').value);
    formData.append('description', document.getElementById('ad-description').value);
    formData.append('price', document.getElementById('ad-price').value);
    formData.append('phone', document.getElementById('ad-phone').value);
    formData.append('user_id', currentUser.id);

    const imageFile = document.getElementById('ad-image').files[0];
    if (imageFile) formData.append('image', imageFile);

    const res = await fetch('/api/ads/', { method: 'POST', body: formData });
    if (res.ok) {
        alert('Объявление опубликовано!');
        closeAddModal();
        document.getElementById('ad-form').reset();
        loadAds();
    } else {
        alert('Ошибка создания объявления');
    }
}

function setAuthType(type) {
    currentAuthType = type;
    const indBtn = document.getElementById('auth-ind-btn');
    const comBtn = document.getElementById('auth-com-btn');
    const nameInput = document.getElementById('auth-name');
    const binInput = document.getElementById('auth-bin');

    if (type === 'individual') {
        indBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md bg-white shadow-sm text-green-800";
        comBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md text-gray-600";
        nameInput.placeholder = "ФИО";
        binInput.placeholder = "ИИН (12 цифр)";
    } else {
        comBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md bg-white shadow-sm text-green-800";
        indBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md text-gray-600";
        nameInput.placeholder = "Название ТОО";
        binInput.placeholder = "БИН компании (12 цифр)";
    }
}

function requireAuthToContact(actionCallback) {
    pendingAction = actionCallback;
    document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
    pendingAction = null;
}

async function handleQuickAuth(event) {
    event.preventDefault();
    const phone = document.getElementById('auth-phone').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const name = document.getElementById('auth-name').value.trim();
    const bin_iin = document.getElementById('auth-bin').value.trim();

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('user_type', currentAuthType);
    formData.append('name', name);
    formData.append('bin_iin', bin_iin);

    try {
        const res = await fetch('/api/users/', { method: 'POST', body: formData });
        if (res.ok) {
            const user = await res.json();
            currentUser = user;
            localStorage.setItem('agro_user', JSON.stringify(user));
            updateHeaderAuthStatus();
            closeAuthModal();
            alert('Успешный вход!');
            loadAds();
            if (pendingAction) pendingAction();
        } else {
            const err = await res.json();
            alert('Ошибка входа: ' + (err.detail || 'Проверьте пароль'));
        }
    } catch (e) {
        alert('Ошибка соединения');
    }
}

function checkAndOpenContact(link) {
    if (currentUser) {
        window.open(link, '_blank');
    } else {
        requireAuthToContact(() => window.open(link, '_blank'));
    }
}
