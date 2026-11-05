<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Агро-Маркетплейс Казахстана</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="bg-gray-100 min-h-screen pb-20">

    <!-- Шапка приложения -->
    <header class="bg-green-700 text-white p-4 sticky top-0 z-50 shadow-md">
        <div class="max-w-4xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-bold flex items-center gap-2">
                <i class="fa-solid fa-wheat-awn"></i> АгроМаркет KZ
            </h1>
            <div id="user-header-profile" class="flex items-center gap-2 cursor-pointer" onclick="switchTab('profile')">
                <span id="user-status-badge" class="text-xs bg-green-800 px-3 py-1 rounded-full border border-green-500">
                    Гость
                </span>
            </div>
        </div>
    </header>

    <!-- Основной контент (Лента объявлений) -->
    <main id="view-feed" class="max-w-4xl mx-auto p-4">
        <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <input type="text" id="search-input" placeholder="Поиск: ангары, тракторы..." class="p-2 border rounded-lg focus:outline-none focus:border-green-600">
                
                <!-- География Казахстана: динамический выбор областей и районов -->
                <select id="filter-region" class="p-2 border rounded-lg bg-white text-sm">
                    <option value="">Весь Казахстан (Все регионы)</option>
                </select>

                <button onclick="loadAds()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Найти</button>
            </div>
            
            <div class="flex gap-2 overflow-x-auto pb-2 text-sm">
                <button onclick="filterCategory('')" class="cat-btn bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap active">Все</button>
                <button onclick="filterCategory('Ангары')" class="cat-btn bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">Ангары</button>
                <button onclick="filterCategory('Зерновые комплексы')" class="cat-btn bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">Зернокомплексы</button>
                <button onclick="filterCategory('Сельхозтехника')" class="cat-btn bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">Сельхозтехника</button>
            </div>
        </div>

        <div id="ads-list" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-center py-10 text-gray-500 col-span-full">Загрузка объявлений...</div>
        </div>
    </main>

    <!-- Личный кабинет -->
    <main id="view-profile" class="max-w-4xl mx-auto p-4 hidden">
        <div class="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto space-y-6">
            <div class="flex justify-between items-center border-b pb-4">
                <h2 class="text-xl font-bold text-green-800"><i class="fa-solid fa-user-gear"></i> Личный кабинет</h2>
                <button onclick="logout()" class="text-red-500 text-xs font-semibold hover:underline">Выйти из аккаунта</button>
            </div>

            <div class="bg-green-50 rounded-xl p-4">
                <div class="flex items-center gap-4 mb-4 pb-4 border-b">
                    <div class="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-green-600 flex-shrink-0">
                        <img id="prof-avatar-img" src="https://via.placeholder.com/150?text=Агро" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <label class="cursor-pointer bg-white border border-green-600 text-green-700 text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-100 inline-block">
                            <i class="fa-solid fa-camera"></i> Сменить фото / логотип
                            <input type="file" id="avatar-input" accept="image/*" class="hidden" onchange="uploadUserAvatar(event)">
                        </label>
                        <p class="text-[10px] text-gray-500 mt-1">Фото владельца или логотип ТОО</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-xs text-gray-500">Имя:</p>
                        <p class="font-bold text-gray-800" id="prof-name">-</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">Телефон (Логин):</p>
                        <p class="font-bold text-gray-800" id="prof-phone">-</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500">Тип профиля:</p>
                        <p class="font-bold text-gray-800" id="prof-type">-</p>
                    </div>
                    <div id="prof-bin-container" class="hidden">
                        <p class="text-xs text-gray-500">БИН:</p>
                        <p class="font-bold text-gray-800" id="prof-bin">-</p>
                    </div>
                    <div class="md:col-span-2 border-t pt-3 flex justify-between items-center">
                        <div>
                            <p class="text-xs text-gray-500">Рекламный баланс:</p>
                            <p class="text-lg font-extrabold text-green-700" id="prof-credits">0 ₸</p>
                        </div>
                        <span id="prof-verified-badge" class="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-bold">Обычный аккаунт</span>
                    </div>
                </div>
            </div>

            <!-- Админ-панель (появляется только у администраторов) -->
            <div id="admin-panel-section" class="bg-amber-50 rounded-xl p-4 border border-amber-300 hidden">
                <h3 class="font-bold text-md text-amber-900 mb-3"><i class="fa-solid fa-shield-halved"></i> Панель модератора (Админ)</h3>
                <p class="text-xs text-amber-800 mb-3">Объявления оживающие модерации:</p>
                <div id="admin-moderation-list" class="space-y-2">
                    <p class="text-xs text-gray-500">Загрузка очереди...</p>
                </div>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 border">
                <h3 class="font-bold text-sm text-gray-800 mb-3"><i class="fa-solid fa-key text-green-700"></i> Смена пароля</h3>
                <form onsubmit="changePassword(event)" class="space-y-3">
                    <input type="password" id="old-password" placeholder="Текущий пароль" class="w-full p-2 border rounded-lg text-sm bg-white" required>
                    <input type="password" id="new-password" placeholder="Новый пароль" class="w-full p-2 border rounded-lg text-sm bg-white" required>
                    <button type="submit" class="bg-gray-900 hover:bg-gray-800 text-white text-xs py-2 px-4 rounded-lg font-medium">Обновить пароль</button>
                </form>
            </div>

            <div>
                <h3 class="font-bold text-md text-gray-800 mb-3">Мои объявления</h3>
                <div id="my-ads-list" class="space-y-3">
                    <p class="text-sm text-gray-500">У вас пока нет опубликованных объявлений.</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Модалка подачи (с выбором региона из списка РК и до 10 фото с предпросмотром) -->
    <div id="addModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 class="text-xl font-bold mb-4 text-green-800">Подать объявление</h2>
            <form id="ad-form" onsubmit="submitAd(event)" class="space-y-3">
                <input type="text" id="ad-title" placeholder="Название (например, Ангар 15х30)" required class="w-full p-2 border rounded-lg">
                
                <select id="ad-category" required class="w-full p-2 border rounded-lg">
                    <option value="">Выберите категорию</option>
                    <option value="Ангары">Ангары</option>
                    <option value="Зерновые комплексы">Зерновые комплексы</option>
                    <option value="Сельхозтехника">Сельхозтехника</option>
                </select>

                <!-- Выбор региона и района из полного справочника РК -->
                <select id="ad-location" required class="w-full p-2 border rounded-lg text-sm bg-white">
                    <option value="">Выберите область / район / город</option>
                </select>

                <textarea id="ad-description" placeholder="Описание, характеристики, условия..." rows="3" required class="w-full p-2 border rounded-lg"></textarea>
                
                <input type="number" id="ad-price" placeholder="Цена в тенге (₸)" required class="w-full p-2 border rounded-lg">
                <input type="text" id="ad-phone" placeholder="Ваш телефон для связи (+7...)" required class="w-full p-2 border rounded-lg">

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Фотографии объекта (до 10 шт. с предпросмотром):</label>
                    <input type="file" id="ad-images" accept="image/*" multiple max="10" onchange="previewImages(event)" class="w-full p-2 border rounded-lg text-sm bg-gray-50">
                    <div id="image-preview-container" class="grid grid-cols-5 gap-2 mt-2"></div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeAddModal()" class="px-4 py-2 bg-gray-300 rounded-lg text-sm">Отмена</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Опубликовать на модерацию</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Модалка быстрой авторизации -->
    <div id="authModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-sm w-full p-6 relative shadow-xl">
            <h3 class="text-lg font-bold mb-2 text-green-800">Вход / Регистрация</h3>
            <p class="text-xs text-gray-600 mb-4">Введите телефон и пароль:</p>
            
            <div class="flex rounded-lg bg-gray-200 p-1 mb-3">
                <button type="button" onclick="setAuthType('individual')" id="auth-ind-btn" class="flex-1 py-1 text-xs font-semibold rounded-md bg-white shadow-sm text-green-800">Физ. лицо / КХ</button>
                <button type="button" onclick="setAuthType('company')" id="auth-com-btn" class="flex-1 py-1 text-xs font-semibold rounded-md text-gray-600">Юр. лицо (ТОО)</button>
            </div>

            <form onsubmit="handleQuickAuth(event)" class="space-y-3">
                <input type="text" id="auth-phone" placeholder="Телефон (+7...)" class="w-full p-2 border rounded-lg text-sm" required>
                <input type="password" id="auth-password" placeholder="Пароль" class="w-full p-2 border rounded-lg text-sm" required>
                <input type="text" id="auth-name" placeholder="ФИО или Название ТОО" class="w-full p-2 border rounded-lg text-sm" required>
                <input type="text" id="auth-bin" placeholder="БИН компании (12 цифр)" class="w-full p-2 border rounded-lg text-sm hidden">

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="closeAuthModal()" class="px-3 py-1.5 bg-gray-300 rounded-lg text-xs">Отмена</button>
                    <button type="submit" class="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium">Войти</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Нижняя панель -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 z-50 max-w-4xl mx-auto shadow-lg">
        <button onclick="switchTab('feed')" id="nav-feed" class="flex flex-col items-center text-green-600">
            <i class="fa-solid fa-store text-lg"></i>
            <span class="text-xs">Объявления</span>
        </button>
        <button onclick="openAddModal()" class="flex flex-col items-center text-gray-500 hover:text-green-600">
            <i class="fa-solid fa-circle-plus text-2xl text-green-600"></i>
            <span class="text-xs">Подать</span>
        </button>
        <button onclick="switchTab('profile')" id="nav-profile" class="flex flex-col items-center text-gray-500 hover:text-green-600">
            <i class="fa-solid fa-user text-lg"></i>
            <span class="text-xs">Профиль</span>
        </button>
    </nav>

    <!-- Подключаем справочник географии и основной скрипт -->
    <script src="/static/js/regions.js"></script>
    <script src="/static/js/api.js"></script>
    <script src="/static/js/app.js"></script>
</body>
</html>
