let currentCategory = '';

document.addEventListener('DOMContentLoaded', () => {
    loadAds();
});

async function loadAds() {
    const container = document.getElementById('ads-list');
    const regionFilter = document.getElementById('filter-region').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Загрузка объявлений...</div>';
    
    let ads = await fetchAdsApi();
    
    if (currentCategory) {
        ads = ads.filter(ad => ad.category === currentCategory);
    }
    if (regionFilter) {
        ads = ads.filter(ad => ad.location && ad.location.includes(regionFilter));
    }
    if (searchQuery) {
        ads = ads.filter(ad => ad.title.toLowerCase().includes(searchQuery) || ad.description.toLowerCase().includes(searchQuery));
    }

    if (!ads || ads.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-gray-500 col-span-full">Объявлений по вашему запросу не найдено.</div>';
        return;
    }

    container.innerHTML = ads.map(ad => {
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
                        <a href="${waLink}" target="_blank" class="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg text-center font-medium flex items-center justify-center gap-1">
                            <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                        </a>
                        <a href="${telLink}" class="bg-gray-900 hover:bg-gray-800 text-white text-xs py-2 px-3 rounded-lg text-center font-medium flex items-center justify-center gap-1">
                            <i class="fa-solid fa-phone text-xs"></i> Позвонить
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
    document.getElementById('addModal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('addModal').classList.add('hidden');
}

async function submitAd(event) {
    event.preventDefault();
    const data = {
        title: document.getElementById('ad-title').value,
        category: document.getElementById('ad-category').value,
        location: document.getElementById('ad-location').value,
        description: document.getElementById('ad-description').value,
        price: parseFloat(document.getElementById('ad-price').value),
        phone: document.getElementById('ad-phone').value,
        user_id: parseInt(document.getElementById('ad-user-id').value)
    };

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
}
