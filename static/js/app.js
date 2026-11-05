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
        badge.textContent = `${currentUser.name || currentUser.phone}`;
        badge.className = "text-xs bg-green-900 px-3 py-1 rounded-full border border-green-400 text-white";
    } else {
        badge.textContent = "Гость";
        badge.className = "text-xs bg-green-800 px-3 py-1 rounded-full border border-green-500 text-white";
    }
}

async function loadAds() {
    const container = document.getElementById('ads-list');
    const regionFilter = document.getElementById('filter-region').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Загрузка объявлений...</div>';

    try {
        const ads = await fetchAdsApi();
        
        let filtered = ads;
        if (currentCategory) {
            filtered = filtered.filter(ad => ad.category === currentCategory);
        }
        if (regionFilter) {
            filtered = filtered.filter(ad => ad.location && ad.location.includes(regionFilter));
        }
        if (searchQuery) {
            filtered = filtered.filter(ad => ad.title.toLowerCase().includes(searchQuery) || ad.description.toLowerCase().includes(searchQuery));
        }

        if (!filtered || filtered.length === 0) {
            container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Объявлений по вашему запросу не найдено.</div>';
            return;
        }

        container.innerHTML = filtered.map(ad => {
            const phoneClean = ad.phone ? ad.phone.replace(/[^0-9]/g, '') : '77000000000';
            const waText = encodeURIComponent(`Здравствуйте! Меня интересует ваше объявление "${ad.title}" на АгроМаркете.`);
            const waLink = `https://wa.me/${phoneClean}?text=${waText}`;
            const telLink = `tel:${phoneClean}`;

            return `
                <div class="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded">${ad.category}</span>
                            <span class="text-xs text-gray-500"><i class="fa-solid fa-location-dot text-green-600"></i> ${ad.location || 'Казахстан'}</span>
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
        container.innerHTML = '<div class="text-center py-10 text-red-500 col-span-full">Ошибка загрузки данных с сервера</div>';
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
        alert("Для подачи объявления необходимо авторизоваться!");
        requireAuthToContact(() => {
            document.getElementById('addModal').classList.remove('hidden');
        });
        return;
    }
    document.getElementById('addModal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('addModal').classList.add('hidden');
}

async function submitAd(event) {
    event.preventDefault();
    if (!currentUser) {
        alert("Пожалуйста, авторизуйтесь!");
        return;
    }

    const data = {
        title: document.getElementById('ad-title').value,
        category: document.getElementById('ad-category').value,
        location: document.getElementById('ad-location').value,
        description: document.getElementById('ad-description').value,
        price: parseFloat(document.getElementById('ad-price').value),
        phone: document.getElementById('ad-phone').value,
        user_id: currentUser.id
    };

    try {
        const res = await createAdApi(data);
        if (res.ok) {
            alert('Объявление успешно опубликовано!');
            closeAddModal();
            document.getElementById('ad-form').reset();
            loadAds();
        } else {
            const err = await res.json();
            alert('Ошибка: ' + (err.detail || 'Не удалось создать объявление'));
        }
    } catch (e) {
        alert('Ошибка соединения с сервером');
    }
}

// Авторизация при клике на контакты
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
    const name = document.getElementById('auth-name').value.trim();
    const bin_iin = document.getElementById('auth-bin').value.trim();

    const payload = {
        phone: phone,
        user_type: currentAuthType,
        name: name,
        bin_iin: bin_iin
    };

    try {
        const res = await fetch('/api/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const user = await res.json();
            currentUser = user;
            localStorage.setItem('agro_user', JSON.stringify(user));
            updateHeaderAuthStatus();
            
            closeAuthModal();
            alert('Успешный вход!');
            
            loadAds();
            if (pendingAction) {
                pendingAction();
            }
        } else {
            const err = await res.json();
            alert('Ошибка входа: ' + (err.detail || 'Не удалось войти'));
        }
    } catch (e) {
        alert('Ошибка соединения с сервером');
    }
}

function checkAndOpenContact(link) {
    if (currentUser) {
        window.open(link, '_blank');
    } else {
        requireAuthToContact(() => {
            window.open(link, '_blank');
        });
    }
}
