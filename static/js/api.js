const API_BASE = '/api';

async function fetchAdsApi() {
    try {
        const res = await fetch(`${API_BASE}/ads/`);
        return await res.json();
    } catch (err) {
        console.error('Ошибка загрузки объявлений:', err);
        return [];
    }
}

async function createAdApi(adData) {
    const res = await fetch(`${API_BASE}/ads/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adData)
    });
    return res;
}
