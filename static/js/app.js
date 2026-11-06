let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentAuthMode = 'login';
let allAdsList = [];
let selectedFilesArray = [];

const districtsData = {
    "Костанайская": [
        "г. Костанай (Областной центр)", "г. Рудный", "г. Лисаковск", "г. Аркалык", "г. Тобыл",
        "Алтынсаринский район (с. Убаганское)", "Амангельдинский район (с. Амангельды)", "Аулиекольский район (с. Аулиеколь)",
        "Денисовский район (с. Денисовка)", "Джангельдинский район (с. Торгай)", "Житикаринский район (г. Житикара)",
        "Карабалыкский район (п. Карабалык)", "Карасуский район (с. Карасу)", "Камыстинский район (с. Камысты)",
        "Мендыкаринский район (с. Боровской)", "Наурзумский район (с. Караменды)", "Район Беимбета Майлина (с. Айет)",
        "Сарыкольский район (п. Сарыколь)", "Узункольский район (с. Узунколь)", "Федоровский район (п. Федоровка)"
    ],
    "Акмолинская": [
        "г. Кокшетау (Областной центр)", "г. Степногорск", "г. Косшы", "г. Щучинск", "г. Атбасар", "г. Акколь", "г. Ерейментау", "г. Есиль", "г. Макинск", "г. Державинск",
        "Аккольский район (г. Акколь)", "Астраханский район (с. Астраханка)", "Атбасарский район (г. Атбасар)", "Буландынский район (г. Макинск)",
        "Бурабайский район (г. Щучинск)", "Егиндыкольский район (с. Егиндыколь)", "Ерейментауский район (г. Ерейментау)", "Есильский район (г. Есиль)",
        "Жаксынский район (с. Жаксы)", "Жаркаинский район (г. Державинск)", "Зерендинский район (с. Зеренда)", "Коргалжынский район (с. Коргалжын)",
        "Сандыктауский район (с. Балкашино)", "Целиноградский район (с. Акмол)", "Аршалынский район (п. Аршалы)"
    ],
    "СКО": [
        "г. Петропавловск (Областной центр)", "г. Тайынша", "г. Булаево", "г. Мамлютка", "г. Сергеевка",
        "Айыртауский район (с. Саумалколь)", "Акжарский район (с. Талшик)", "Аккайынский район (с. Смирново)", "Есильский район (с. Явленка)",
        "Жамбылский район (с. Пресновка)", "Кызылжарский район (с. Бесколь)", "Мамлютский район (г. Мамлютка)", "Район Габита Мусрепова (п. Новоишимское)",
        "Район Магжана Жумабаева (г. Булаево)", "Район Шал акына (г. Сергеевка)", "Тайыншинский район (г. Тайынша)", "Тимирязевский район (с. Тимирязево)", "Уалихановский район (с. Кишкенеколь)"
    ],
    "Павлодарская": [
        "г. Павлодар (Областной центр)", "г. Экибастуз", "г. Аксу",
        "Актогайский район (с. Актогай)", "Баянаульский район (с. Баянаул)", "Железинский район (с. Железинка)", "Иртышский район (с. Иртышск)",
        "Майский район (с. Коктобе)", "Павлодарский район (г. Павлодар)", "Район Теренколь (с. Теренколь)", "Успенский район (с. Успенка)", "Щербактинский район (с. Щербакты)"
    ],
    "Карагандинская": [
        "г. Караганда (Областной центр)", "г. Темиртау", "г. Балхаш", "г. Шахтинск", "г. Сарань", "г. Абай", "г. Приозерск",
        "Абайский район (г. Абай)", "Актогайский район (с. Актогай)", "Бухар-Жырауский район (п. Ботакара)", "Каркаралинский район (г. Каркаралинск)",
        "Нуринский район (п. Нура)", "Осакаровский район (п. Осакаровка)", "Шетский район (с. Аксу-Аюлы)"
    ],
    "Улытауская": ["г. Жезказган (Областной центр)", "г. Сатпаев", "г. Каражал", "Жанааркинский район (п. Жанаарка)", "Улытауский район (с. Улытау)"],
    "ВКО": [
        "г. Усть-Каменогорск (Областной центр)", "г. Риддер", "г. Алтай", "г. Зайсан", "г. Шемонаиха",
        "Алтайский район (г. Алтай)", "Глубоковский район (п. Глубокое)", "Зайсанский район (г. Зайсан)", "Катон-Карагайский район (с. Катон-Карагай)",
        "Курчумский район (с. Курчум)", "Самарский район (с. Самарское)", "Тарбагатайский район (с. Акжар)", "Уланский район (п. Касыма Кайсенова)", "Шемонаихинский район (г. Шемонаиха)"
    ],
    "Абайская": [
        "г. Семей (Областной центр)", "г. Аягоз", "г. Курчатов",
        "Абайский район (с. Карауыл)", "Аксуатский район (с. Аксуат)", "Аягозский район (г. Аягоз)", "Бескарагайский район (с. Бескарагай)",
        "Бородулихинский район (с. Бородулиха)", "Жарминский район (с. Калбатау)", "Кокпектинский район (с. Кокпекты)", "Урджарский район (с. Урджар)"
    ],
    "Актюбинская": [
        "г. Актобе (Областной центр)", "г. Хромтау", "г. Кандыагаш", "г. Шалкар", "г. Алга", "г. Темир", "г. Жем",
        "Алгинский район (г. Алга)", "Байганинский район (с. Карауылкельды)", "Каргалинский район (с. Бадамша)", "Кобдинский район (с. Кобда)",
        "Мартукский район (с. Мартук)", "Мугалжарский район (г. Кандыагаш)", "Темирский район (п. Шубаркудук)", "Уилский район (с. Уил)",
        "Хромтауский район (г. Хромтау)", "Шалкарский район (г. Шалкар)", "Иргизский район (с. Иргиз)"
    ],
    "ЗКО": [
        "г. Уральск (Областной центр)", "г. Аксай", "Бурлинский район (г. Aксай)", "Жангалинский район (с. Жангала)", "Жанибекский район (с. Жанибек)",
        "Казталовский район (с. Казталовка)", "Каратобинский район (с. Каратобе)", "Район Байтерек (с. Переметное)", "Теректинский район (с. Федоровка)",
        "Таскалинский район (с. Таскала)", "Бокейординский район (с. Сайхин)", "Акжаикский район (с. Чапаев)"
    ],
    "Алматинская": [
        "г. Конаев (Областной центр)", "г. Каскелен", "г. Талгар", "г. Есик", "г. Жаркент",
        "Балхашский район (с. Баканас)", "Енбекшиказахский район (г. Есик)", "Жамбылский район (с. Узынагаш)", "Карасайский район (г. Каскелен)",
        "Кегенский район (с. Кеген)", "Райымбекский район (с. Нарынкол)", "Талгарский район (г. Талгар)", "Уйгурский район (с. Чунджа)", "Илийский район (п. Отеген Батыр)"
    ],
    "Жетысуская": [
        "г. Талдыкорган (Областной центр)", "г. Текели", "г. Ушарал", "г. Сарканд",
        "Аксуский район (с. Жансугуров)", "Алакольский район (г. Ушарал)", "Ескельдинский район (с. Карабулак)", "Каратальский район (г. Уштобе)",
        "Кербулакский район (с. Сарыозек)", "Коксуский район (с. Балпык Би)", "Панфиловский район (г. Жаркент)", "Саркандский район (г. Сарканд)"
    ],
    "Жамбылская": [
        "г. Тараз (Областной центр)", "г. Шу", "г. Каратау", "г. Жанатас",
        "Байзакский район (с. Сарыкемер)", "Жамбылский район (с. Аса)", "Жуалынский район (с. Бауыржан Момышулы)", "Кордайский район (с. Кордай)",
        "Меркенский район (с. Мерке)", "Мойынкумский район (с. Мойынкум)", "Т. Рыскулова район (с. Кулан)", "Таласский район (г. Каратау)", "Шуский район (г. Шу)"
    ],
    "Туркестанская": [
        "г. Туркестан (Областной центр)", "г. Кентау", "г. Арыс", "г. Жетысай", "г. Шардара", "г. Сарыагаш",
        "Байдибекский район (с. Шаян)", "Жетысайский район (г. Жетысай)", "Казыгуртский район (с. Казыгурт)", "Мактааральский район (п. Мырзакент)",
        "Ордабасинский район (с. Темирлановка)", "Отрарский район (с. Шаульдер)", "Сайрамский район (с. Аксукент)", "Сарыагашский район (г. Сарыагаш)",
        "Сузакский район (с. Шолаккорган)", "Толебийский район (г. Ленгер)", "Тюлькубасский район (с. Турара Рыскулова)", "Шардаринский район (г. Шардара)"
    ],
    "Кызылординская": [
        "г. Кызылорда (Областной центр)", "г. Байконыр", "г. Аральск", "г. Казалинск",
        "Аральский район (г. Аральск)", "Жанакорганский район (п. Жанакорган)", "Казалинский район (п. Айтеке Би)",
        "Кармакшинский район (п. Жосалы)", "Сырдарьинский район (п. Теренозек)", "Шиелийский район (п. Шиели)"
    ],
    "Атырауская": [
        "г. Атырау (Областной центр)", "г. Кульсары",
        "Жылыойский район (г. Кульсары)", "Индерский район (п. Индерборский)", "Исатайский район (с. Аккистау)",
        "Кзылкогинский район (с. Миялы)", "Курмангазинский район (с. Курмангазы)", "Макатский район (п. Макат)", "Махамбетский район (с. Махамбет)"
    ],
    "Мангистауская": [
        "г. Актау (Областной центр)", "г. Жанаозен", "г. Форт-Шевченко",
        "Бейнеуский район (с. Бейнеу)", "Каракиянский район (с. Курык)", "Мангистауский район (с. Шетпе)", "Мунайлинский район (с. Мангистау)", "Тупкараганский район (г. Форт-Шевченко)"
    ],
    "г. Астана": ["г. Астана (Республиканское значение)"],
    "г. Алматы": ["г. Алматы (Республиканское значение)"],
    "г. Шымкент": ["г. Шымкент (Республиканское значение)"]
};

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
            <a href="/static/profile.html" class="flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-800 transition">
                <i class="fa-solid fa-user-gear"></i>
                <span>Кабинет</span>
            </a>
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

function onFilterOblastChange() {
    const oblastSelect = document.getElementById('filter-region-oblast');
    const districtSelect = document.getElementById('filter-region-district');
    const selectedOblast = oblastSelect.value;

    districtSelect.innerHTML = '<option value="all">Все районы / города / центры</option>';

    if (selectedOblast === 'all' || !districtsData[selectedOblast]) {
        districtSelect.disabled = true;
        districtSelect.className = "w-full p-2.5 border rounded-xl text-sm outline-none bg-gray-100 text-gray-400";
    } else {
        districtSelect.disabled = false;
        districtSelect.className = "w-full p-2.5 border rounded-xl text-sm outline-none bg-gray-50 focus:bg-white focus:border-green-600 transition text-gray-800";
        
        districtsData[selectedOblast].forEach(dist => {
            const opt = document.createElement('option');
            opt.value = dist;
            opt.textContent = dist;
            districtSelect.appendChild(opt);
        });
    }

    applyFilters();
}

function onAdOblastChange() {
    const oblastVal = document.getElementById('ad-oblast').value;
    const districtSelect = document.getElementById('ad-district');

    districtSelect.innerHTML = '<option value="" disabled selected>Выберите район / город / райцентр...</option>';

    if (!oblastVal || !districtsData[oblastVal]) {
        districtSelect.disabled = true;
        districtSelect.className = "w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-400";
    } else {
        districtSelect.disabled = false;
        districtSelect.className = "w-full p-2 border rounded-lg text-sm bg-white text-gray-800";

        districtsData[oblastVal].forEach(dist => {
            const opt = document.createElement('option');
            opt.value = dist;
            opt.textContent = dist;
            districtSelect.appendChild(opt);
        });
    }
}

function onAdDistrictChange() {
    const districtVal = document.getElementById('ad-district').value;
    const villageContainer = document.getElementById('village-container');
    const villageInput = document.getElementById('ad-village');

    if (districtVal.includes('г. ') || districtVal.includes('Областной центр') || districtVal.includes('Республиканское значение')) {
        villageInput.required = false;
        villageInput.value = '';
        villageContainer.style.display = 'none';
    } else {
        villageInput.required = true;
        villageContainer.style.display = 'block';
    }
}

function handleImagesSelected(event) {
    const files = Array.from(event.target.files);
    if (selectedFilesArray.length + files.length > 10) {
        alert('Максимальное количество фотографий — 10!');
        return;
    }
    files.forEach(file => selectedFilesArray.push(file));
    renderPhotoPreviews();
    event.target.value = '';
}

function renderPhotoPreviews() {
    const container = document.getElementById('photo-preview-container');
    const addBtnLabel = document.getElementById('add-photo-btn-label');

    container.querySelectorAll('.photo-preview-card').forEach(card => card.remove());

    selectedFilesArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = document.createElement('div');
            card.className = "photo-preview-card relative w-20 h-20 rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white";
            card.innerHTML = `
                <img src="${e.target.result}" class="w-full h-full object-cover">
                <button type="button" onclick="removePhoto(${index})" class="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] hover:bg-red-700 shadow">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
            container.insertBefore(card, addBtnLabel);
        };
        reader.readAsDataURL(file);
    });

    addBtnLabel.style.display = selectedFilesArray.length >= 10 ? 'none' : 'flex';
}

function removePhoto(index) {
    selectedFilesArray.splice(index, 1);
    renderPhotoPreviews();
}

function applyFilters() {
    const dealTypeVal = document.getElementById('filter-deal-type').value;
    const categoryVal = document.getElementById('filter-category').value;
    const oblastVal = document.getElementById('filter-region-oblast').value;
    const districtVal = document.getElementById('filter-region-district').value;

    let filtered = allAdsList;

    if (dealTypeVal !== 'all') {
        filtered = filtered.filter(ad => {
            const isBuy = ad.title.toLowerCase().includes('куплю') || ad.description.toLowerCase().includes('куплю');
            return dealTypeVal === 'buy' ? isBuy : !isBuy;
        });
    }

    if (categoryVal !== 'all') {
        filtered = filtered.filter(ad => ad.category === categoryVal);
    }

    if (oblastVal !== 'all') {
        filtered = filtered.filter(ad => ad.location.toLowerCase().includes(oblastVal.toLowerCase()));
    }

    if (districtVal !== 'all' && districtVal !== '') {
        const cleanDistrict = districtVal.split('(')[0].trim().toLowerCase();
        filtered = filtered.filter(ad => ad.location.toLowerCase().includes(cleanDistrict));
    }

    renderAds(filtered);
}

function renderAds(adsToRender) {
    const container = document.getElementById('ads-container');
    if (adsToRender.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-sm col-span-full text-center py-10">По выбранным фильтрам объявлений не найдено.</p>`;
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

function onUserTypeChange() {
    const typeVal = document.getElementById('reg-type').value;
    const binContainer = document.getElementById('bin-container');
    if (typeVal === 'company') {
        binContainer.classList.remove('hidden');
    } else {
        binContainer.classList.add('hidden');
        document.getElementById('reg-bin').value = '';
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
        const userType = document.getElementById('reg-type').value;
        formData.append('user_type', userType);
        if (userType === 'company') {
            const binVal = document.getElementById('reg-bin').value;
            if (!binVal.trim()) {
                alert('Для юридического лица обязательно укажите БИН!');
                return;
            }
            formData.append('bin_iin', binVal);
        }
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

async function handleCreateAd(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Подача объявлений доступна только залогиненным пользователям.');
        openAuthModal();
        return;
    }

    const formData = new FormData();
    const dealType = document.getElementById('ad-deal-type').value;
    const rawTitle = document.getElementById('ad-title').value;
    
    const titlePrefix = dealType === 'buy' ? 'Куплю: ' : 'Продам: ';
    formData.append('title', rawTitle.toLowerCase().startsWith('куплю') || rawTitle.toLowerCase().startsWith('продам') ? rawTitle : titlePrefix + rawTitle);
    
    formData.append('category', document.getElementById('ad-category').value);
    
    const oblastVal = document.getElementById('ad-oblast').value;
    const districtVal = document.getElementById('ad-district').value;
    const villageVal = document.getElementById('ad-village').value;
    
    const fullLocation = villageVal ? `${oblastVal}, ${districtVal}, ${villageVal}` : `${oblastVal}, ${districtVal}`;
    formData.append('location', fullLocation);

    formData.append('price', document.getElementById('ad-price').value);
    formData.append('description', document.getElementById('ad-desc').value);
    formData.append('phone', currentUser.phone);
    formData.append('user_id', currentUser.id);

    selectedFilesArray.forEach(file => {
        formData.append('images', file);
    });

    try {
        const res = await fetch('/api/ads/', { method: 'POST', body: formData });
        if (res.ok) {
            alert('Объявление успешно отправлено на модерацию!');
            closeAddAdModal();
            document.getElementById('ad-form').reset();
            selectedFilesArray = [];
            renderPhotoPreviews();
            loadAds();
        } else {
            alert('Ошибка при создании объявления');
        }
    } catch (err) {
        alert('Ошибка связи с сервером');
    }
}

function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }

function openAddAdModal() {
    if (!currentUser) {
        alert('Подача объявлений доступна только залогиненным пользователям.');
        openAuthModal();
        return;
    }
    document.getElementById('add-ad-modal').classList.remove('hidden');
}
function closeAddAdModal() { document.getElementById('add-ad-modal').classList.add('hidden'); }
