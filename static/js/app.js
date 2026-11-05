let currentUser = JSON.parse(localStorage.getItem('agro_user')) || null;
let currentCategory = '';
let currentAuthType = 'individual';
let pendingAction = null;

// Массив для хранения выбранных файлов фотографий (до 10 шт.)
let selectedImageFiles = [];

document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuthStatus();
    loadAds();
});

function updateHeaderAuthStatus() {
    const badge = document.getElementById('user-status-badge');
    if (!badge) return;
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

    const binContainer = document.getElementById('prof-bin-container');
    if (currentUser.user_type === 'company') {
        binContainer.classList.remove('hidden');
        document.getElementById('prof-bin').textContent = currentUser.bin_iin || 'Не указан';
    } else {
        binContainer.classList.add('hidden');
    }

    const avatarImg = document.getElementById('prof-avatar-img');
    if (avatarImg) avatarImg.src = currentUser.avatar_url || "https://via.placeholder.com/150?text=Фото";

    const adminSection = document.getElementById('admin-panel-section');
    if (currentUser.is_admin && adminSection) {
        adminSection.classList.remove('hidden');
        loadAdminModerationQueue();
    }

    loadMyAds();
}

async function loadAdminModerationQueue() {
    const container = document.getElementById('admin-moderation-list');
    if (!container) return;
    container.innerHTML = '<p class="text-xs text-gray-500">Загрузка очереди...</p>';

    try {
        const res = await fetch('/api/ads/?admin_view=true');
        const ads = await res.json();
        const pending = ads.filter(ad => !ad.is_approved);

        if (pending.length === 0) {
            container.innerHTML = '<p class="text-xs text-green-700 font-semibold">Нет объявлений на модерации.</p>';
            return;
        }

        container.innerHTML = pending.map(ad => `
            <div class="bg-white p-2.5 rounded-lg border flex justify-between items-center text-xs">
                <div>
                    <span class="font-bold text-gray-800">${ad.title}</span> — <span class="text-green-700 font-semibold">${ad.price.toLocaleString()} ₸</span>
                    <p class="text-gray-500">${ad.location} | Тел: ${ad.phone}</p>
                </div>
                <div class="flex gap-1">
                    <button onclick="approveAd(${ad.id})" class="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded font-semibold">Одобрить</button>
                    <button onclick="deleteAd(${ad.id})" class="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-semibold">Удалить</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p class="text-xs text-red-500">Ошибка загрузки очереди</p>';
    }
}

async function approveAd(adId) {
    try {
        const res = await fetch(`/api/ads/${adId}/approve`, { method: 'POST' });
        if (res.ok) {
            alert('Объявление одобрено!');
            loadAdminModerationQueue();
            loadAds();
        }
    } catch (e) {
        alert('Ошибка при одобрении');
    }
}

// Логика мультизагрузки фото (плитка с плюсиком)
function handleFilesSelect(event) {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        if (selectedImageFiles.length >= 10) {
            alert('Максимально можно загрузить до 10 фотографий!');
            break;
        }
        selectedImageFiles.push(files[i]);
    }
    renderImagePreviews();
    event.target.value = ''; // сброс инпута
}

function removeImage(index) {
    selectedImageFiles.splice(index, 1);
    renderImagePreviews();
}

function renderImagePreviews() {
    const grid = document.getElementById('image-preview-grid');
    if (!grid) return;

    let html = selectedImageFiles.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return `
            <div class="relative h-24 rounded-xl overflow-hidden border bg-gray-100 shadow-sm group">
                <img src="${imageUrl}" class="w-full h-full object-cover">
                <button type="button" onclick="removeImage(${index})" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    }).join('');

    if (selectedImageFiles.length < 10) {
        html += `
            <label for="ad-images" class="cursor-pointer border-2 border-dashed border-green-600 hover:border-green-700 bg-green-50 hover:bg-green-100 rounded-xl flex flex-col items-center justify-center h-24 text-green-700 transition">
                <i class="fa-solid fa-plus text-xl mb-1"></i>
                <span class="text-[11px] font-semibold text-center px-1">Ещё фото</span>
            </label>
        `;
    }

    grid.innerHTML = html;
}

async function changePassword(event) {
    event.preventDefault();
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', newPassword);

    try {
        const res = await fetch(`/api/users/${currentUser.id}/change-password`, { method: 'POST', body: formData });
        if (res.ok) {
            alert('Пароль успешно изменен!');
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';
        } else {
            const err = await res.json();
            alert('Ошибка: ' + (err.detail || 'Не удалось сменить пароль'));
        }
    } catch (e) {
        alert('Ошибка соединения');
    }
}

async function uploadUserAvatar(event) {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const res = await fetch(`/api/users/${currentUser.id}/avatar`, { method: 'POST', body: formData });
        if (res.ok) {
            const data = await res.json();
            currentUser.avatar_url = data.avatar_url;
            localStorage.setItem('agro_user', JSON.stringify(currentUser));
            renderProfileData();
            updateHeaderAuthStatus();
            alert('Фото профиля обновлено!');
        }
    } catch (e) {
        alert('Ошибка загрузки фото');
    }
}

async function loadMyAds() {
    const container = document.getElementById('my-ads-list');
    if (!container) return;
    container.innerHTML = '<p class="text-sm text-gray-500">Загрузка...</p>';

    try {
        const res = await fetch('/api/ads/?admin_view=true');
        const ads = await res.json();
        const myAds = ads.filter(ad => ad.user_id === currentUser.id);

        if (myAds.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500">У вас нет объявлений.</p>';
            return;
        }

        container.innerHTML = myAds.map(ad => `
            <div class="border rounded-lg p-3 flex justify-between items-center bg-gray-50">
                <div>
                    <span class="text-xs font-semibold ${ad.is_approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'} px-2 py-0.5 rounded">
                        ${ad.is_approved ? ad.category : 'На модерации'}
                    </span>
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
    if (!confirm('Удалить объявление?')) return;
    try {
        const res = await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
        if (res.ok) {
            loadMyAds();
            if (currentUser && currentUser.is_admin) loadAdminModerationQueue();
            loadAds();
        }
    } catch (e) {
        alert('Ошибка удаления');
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
    if (!container) return;
    
    const regionFilter = document.getElementById('filter-region')?.value || '';
    const searchQuery = document.getElementById('search-input')?.value.toLowerCase() || '';

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

            let imagesList = [];
            try { imagesList = ad.images_json ? JSON.parse(ad.images_json) : []; } catch (e) { imagesList = []; }

            const imageHtml = imagesList.length > 0 
                ? `
                    <div class="mb-3">
                        <div class="h-48 w-full overflow-hidden rounded-lg bg-gray-100 relative">
                            <img id="main-img-${ad.id}" src="${imagesList[0]}" class="w-full h-full object-cover">
                        </div>
                        ${imagesList.length > 1 ? `
                            <div class="flex gap-1 mt-2 overflow-x-auto pb-1">
                                ${imagesList.map(img => `
                                    <img src="${img}" onclick="document.getElementById('main-img-${ad.id}').src='${img}'" class="w-11 h-11 rounded object-cover cursor-pointer border hover:border-green-600 flex-shrink-0">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                  ` 
                : '';

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
                            <button onclick="checkAndOpenContact('${waLink}')" class="bg-green-600 text-white text-xs py-2 px-3 rounded-lg text-center font-medium">WhatsApp</button>
                            <button onclick="checkAndOpenContact('${telLink}')" class="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg text-center font-medium">Позвонить</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<div class="text-center py-10 text-red-500 col-span-full">Ошибка загрузки данных</div>';
    }
}

function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-gray-200', 'active');
        btn.classList.add('bg-gray-100');
    });
    if (event && event.target) {
        event.target.classList.remove('bg-gray-100');
        event.target.classList.add('bg-gray-200', 'active');
    }
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

function closeAddModal() { 
    document.getElementById('addModal').classList.add('hidden'); 
}

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

    // Добавляем файлы из нашего массива (до 10 шт.)
    selectedImageFiles.forEach(file => {
        formData.append('images', file);
    });

    try {
        const res = await fetch('/api/ads/', { method: 'POST', body: formData });
        if (res.ok) {
            alert('Объявление успешно отправлено на модерацию администратору!');
            closeAddModal();
            document.getElementById('ad-form').reset();
            selectedImageFiles = [];
            renderImagePreviews();
            loadAds();
        } else {
            alert('Ошибка при создании объявления');
        }
    } catch (e) {
        alert('Ошибка соединения');
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
        binInput.classList.add('hidden');
        binInput.required = false;
    } else {
        comBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md bg-white shadow-sm text-green-800";
        indBtn.className = "flex-1 py-1 text-xs font-semibold rounded-md text-gray-600";
        nameInput.placeholder = "Название ТОО";
        binInput.classList.remove('hidden');
        binInput.required = true;
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
    const bin_iin = currentAuthType === 'company' ? document.getElementById('auth-bin').value.trim() : '';

    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('user_type', currentAuthType);
    formData.append('name', name);
    if (currentAuthType === 'company') formData.append('bin_iin', bin_iin);

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
            alert('Ошибка входа. Проверьте пароль.');
        }
    } catch (e) {
        alert('Ошибка соединения с сервером');
    }
}

function checkAndOpenContact(link) {
    if (currentUser) {
        window.open(link, '_blank');
    } else {
        requireAuthToContact(() => window.open(link, '_blank'));
    }
}
