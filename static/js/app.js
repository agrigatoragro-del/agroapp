// Встроенный справочник географии РК
const KAZAKHSTAN_REGIONS = {
    "Города республиканского значения": ["г. Астана", "г. Алматы", "г. Шымкент"],
    "Костанайская область": [
        "г. Костанай", "г. Рудный", "г. Лисаковск", "г. Житикара", "г. Аркалык", "г. Тобыл",
        "Алтынсаринский район", "Амангельдинский район", "Аулиекольский район", "Денисовский район",
        "Джангельдинский район", "Житикаринский район", "Камыстинский район", "Карабалыкский район",
        "Карасуский район", "Костанайский район", "Мендыкаринский район", "Наурзумский район",
        "Сарыкольский район", "р-н Бейимбета Майлина", "Узункольский район", "Федоровский район"
    ],
    "Акмолинская область": [
        "г. Кокшетау", "г. Степногорск", "г. Щучинск", "г. Косшы", "Аккольский район",
        "Аршалынский район", "Астраханский район", "Атбасарский район", "Буландынский район",
        "Бурабайский район", "Жаксынский район", "Жаркаинский район", "Зерендинский район",
        "Есильский район", "Ерейментауский район", "Коргалжынский район", "Сандыктауский район",
        "Целиноградский район", "Шортандинский район"
    ],
    "Северо-Казахстанская область": [
        "г. Петропавловск", "г. Тайынша", "Акжарский район", "Айыртауский район", "Есильский район",
        "Жамбылский район", "Мамлютский район", "р-н им. Г. Мусрепова", "Кызылжарский район",
        "Аккайынский район", "Тимирязевский район", "Уалихановский район", "р-н Шал Акына"
    ],
    "Павлодарская область": [
        "г. Павлодар", "г. Экибастуз", "г. Аксу", "Актогайский район", "Баянаульский район",
        "Железинский район", "Иртышский район", "р-н Теренколь", "р-н Аккулы", "Майский район",
        "Успенский район", "Щербактинский район"
    ],
    "Актюбинская область": [
        "г. Актобе", "г. Хромтау", "г. Кандыагаш", "г. Шалкар", "Айтекебийский район", "Алгинский район",
        "Байганинский район", "Иргизский район", "Мартукский район", "Мугалжарский район",
        "Темирский район", "Хобдинский район", "Хромтауский район", "Шалкарский район"
    ],
    "Западно-Казахстанская область": [
        "г. Уральск", "г. Аксай", "Акжаикский район", "Бокейординский район", "Бурлинский район",
        "Каратобинский район", "Таскалинский район", "Теректинский район", "Казталовский район",
        "Жангалинский район", "р-н Байтерек", "Шынгырлауский район"
    ],
    "Атырауская область": [
        "г. Атырау", "г. Кульсары", "Жылыойский район", "Индерский район", "Исатайский район",
        "Курмангазинский район", "Кызылкогинский район", "Макатский район", "Махамбетский район"
    ],
    "Мангистауская область": [
        "г. Актау", "г. Жанаозен", "Мангистауский район", "Мунайлинский район", "Каракиянский район",
        "Бейнеуский район", "Тупкараганский район"
    ],
    "Карагандинская область": [
        "г. Караганда", "г. Темиртау", "г. Шахтинск", "г. Сарань", "г. Балхаш", "г. Приозерск",
        "Абайский район", "Актогайский район", "Бухар-Жырауский район", "Каркаралинский район", "Шетский район"
    ],
    "Улытауская область": ["г. Жезказган", "г. Сатпаев", "Жанааркинский район", "Улытауский район"],
    "Восточно-Казахстанская область": [
        "г. Усть-Каменогорск", "г. Риддер", "г. Алтай", "Глубоковский район", "Зайсанский район",
        "Катон-Карагайский район", "Курчумский район", "Уланский район", "Шемонаихинский район"
    ],
    "Абайская область": [
        "г. Семей", "г. Курчатов", "Абайский район", "Аягозский район", "Бескарагайский район",
        "Бородулихинский район", "Жарминский район", "Кокпектинский район", "Урджарский район"
    ],
    "Жетысуская область": [
        "г. Талдыкорган", "г. Текели", "Аксуский район", "Алакольский район", "Ескельдинский район",
        "Каратальский район", "Кербулакский район", "Панфиловский район", "Сарканский район"
    ],
    "Алматинская область": [
        "г. Конаев", "г. Каскелен", "г. Талгар", "г. Есик", "Балхашский район", "Енбекшиказахский район",
        "Жамбылский район", "Илийский район", "Кегенский район", "Райымбекский район", "Уйгурский район"
    ],
    "Жамбылская область": [
        "г. Тараз", "г. Каратау", "г. Шу", "Байзаковский район", "Жамбылский район", "Сарысуский район",
        "Кордайский район", "Меркенский район", "Мойынкумский район", "р-н Т. Рыскулова", "Таласский район", "Шуский район"
    ],
    "Кызылординская область": [
        "г. Кызылорда", "г. Байконур", "Аральский район", "Казалинский район", "Кармакшинский район",
        "Жалагашский район", "Сырдарьинский район", "Шиелийский район", "Жанакорганский район"
    ],
    "Туркестанская область": [
        "г. Туркестан", "г. Арыс", "г. Кентау", "Байдибекский район", "Жетысайский район", "Казыгуртский район",
        "Мактааральский район", "Ордабасинский район", "Отрарский район", "Сайрамский район", "Сарыагашский район",
        "Созакский район", "Толебийский район", "Тюлькубасский район", "Шардаринский район"
    ]
};

let currentUser = JSON.parse(localStorage.getItem('agro_user')) || null;
let currentCategory = '';
let currentAuthType = 'individual';
let pendingAction = null;

document.addEventListener('DOMContentLoaded', () => {
    populateRegionsDropdowns();
    updateHeaderAuthStatus();
    loadAds();
});

function populateRegionsDropdowns() {
    const filterSelect = document.getElementById('filter-region');
    const adSelect = document.getElementById('ad-location');

    let optionsHtmlFilter = '<option value="">Весь Казахстан (Все регионы)</option>';
    let optionsHtmlAd = '<option value="">Выберите область / район / город</option>';

    for (const [regionName, localities] of Object.entries(KAZAKHSTAN_REGIONS)) {
        optionsHtmlFilter += `<optgroup label="${regionName}">`;
        optionsHtmlAd += `<optgroup label="${regionName}">`;

        localities.forEach(loc => {
            optionsHtmlFilter += `<option value="${loc}">${loc}</option>`;
            optionsHtmlAd += `<option value="${loc}, ${regionName}">${loc} (${regionName})</option>`;
        });

        optionsHtmlFilter += `</optgroup>`;
        optionsHtmlAd += `</optgroup>`;
    }

    if (filterSelect) filterSelect.innerHTML = optionsHtmlFilter;
    if (adSelect) adSelect.innerHTML = optionsHtmlAd;
}

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
    document.getElementById('prof-credits').textContent = `${currentUser.ad_credits || 0} ₸`;

    const binContainer = document.getElementById('prof-bin-container');
    if (currentUser.user_type === 'company') {
        binContainer.classList.remove('hidden');
        document.getElementById('prof-bin').textContent = currentUser.bin_iin || 'Не указан';
    } else {
        binContainer.classList.add('hidden');
    }

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

    const adminSection = document.getElementById('admin-panel-section');
    if (currentUser.is_admin) {
        adminSection.classList.remove('hidden');
        loadAdminModerationQueue();
    } else {
        adminSection.classList.add('hidden');
    }

    loadMyAds();
}

async function loadAdminModerationQueue() {
    const container = document.getElementById('admin-moderation-list');
    container.innerHTML = '<p class="text-xs text-gray-500">Загрузка очереди...</p>';

    try {
        const res = await fetch('/api/ads/?admin_view=true');
        const ads = await res.json();
        const pending = ads.filter(ad => !ad.is_approved);

        if (pending.length === 0) {
            container.innerHTML = '<p class="text-xs text-green-700 font-semibold">Нет объявлений, ожидающих модерации.</p>';
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
        }
    } catch (e) {
        alert('Ошибка при одобрении');
    }
}

function previewImages(event) {
    const container = document.getElementById('image-preview-container');
    container.innerHTML = '';
    const files = event.target.files;

    if (files.length > 10) {
        alert('Максимально можно выбрать до 10 фотографий!');
    }

    for (let i = 0; i < Math.min(files.length, 10); i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = "h-14 rounded border overflow-hidden bg-gray-100";
            div.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
            container.appendChild(div);
        }
        reader.readAsDataURL(files[i]);
    }
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
    alert('Вы вышли.');
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
            container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Одобренных объявлений не найдено.</div>';
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

    const imageFiles = document.getElementById('ad-images').files;
    for (let i = 0; i < Math.min(imageFiles.length, 10); i++) {
        formData.append('images', imageFiles[i]);
    }

    const res = await fetch('/api/ads/', { method: 'POST', body: formData });
    if (res.ok) {
        alert('Объявление отправлено на модерацию администратору!');
        closeAddModal();
        document.getElementById('ad-form').reset();
        document.getElementById('image-preview-container').innerHTML = '';
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
        nameInput.placeholder = "ФИО (например, Иван Иванов)";
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
    if (currentAuthType === 'company') {
        formData.append('bin_iin', bin_iin);
    }

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
