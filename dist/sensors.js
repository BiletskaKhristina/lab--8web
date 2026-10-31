"use strict";
// Глобальний масив для збереження завантажених сенсорів
let allSensors = [];
// Крок 8. Функція для відображення карток сенсорів у DOM
function renderSensors(sensors) {
    const container = document.querySelector(".sensor-list");
    if (!container) {
        return;
    }
    container.innerHTML = "";
    if (sensors.length === 0) {
        container.innerHTML = "<p>Сенсорів за обраними критеріями не знайдено.</p>";
        return;
    }
    sensors.forEach((sensor) => {
        const card = document.createElement("div");
        card.className = "sensor-card";
        card.innerHTML = `
      <h3>${sensor.name}</h3>
      <p>Район: ${sensor.district}</p>
      <p>Рівень шуму: ${sensor.noiseLevel} дБ</p>
      <p>Статус: ${sensor.status}</p>
    `;
        container.appendChild(card);
    });
}
// Логіка фільтрації сенсорів за районом та критичним рівнем шуму
function applyFilters() {
    const districtSelect = document.querySelector("#district-filter");
    const criticalCheckbox = document.querySelector("#critical-filter");
    const selectedDistrict = districtSelect ? districtSelect.value : "all";
    const isCriticalOnly = criticalCheckbox ? criticalCheckbox.checked : false;
    const filteredSensors = allSensors.filter((sensor) => {
        const matchDistrict = selectedDistrict === "all" || sensor.district === selectedDistrict;
        // Увага: вважаємо критичним рівень шуму > 70 дБ (або зі статусом inactive)
        const matchCritical = !isCriticalOnly || sensor.noiseLevel > 70;
        return matchDistrict && matchCritical;
    });
    renderSensors(filteredSensors);
}
// Налаштування слухачів подій для фільтрів
function setupFilters() {
    const districtSelect = document.querySelector("#district-filter");
    const criticalCheckbox = document.querySelector("#critical-filter");
    districtSelect?.addEventListener("change", applyFilters);
    criticalCheckbox?.addEventListener("change", applyFilters);
}
// Крок 7. Завантаження даних із MockAPI
async function loadSensors() {
    try {
        // Вкажіть тут вашу реальну адресу MockAPI
        const response = await fetch("https://6ae63e5e877d34ccafc2bf1b.mockapi.io/api/v1/sensors");
        if (!response.ok) {
            throw new Error("Не вдалося завантажити сенсори");
        }
        const sensors = await response.json();
        // Фільтруємо лише валідні записи (ігноруємо залишкові дефолтні об'єкти MockAPI з avatar/createdAt)
        allSensors = sensors.filter((s) => s.name && s.district && typeof s.noiseLevel === "number");
        renderSensors(allSensors);
        setupFilters();
    }
    catch (error) {
        console.error("Помилка при завантаженні сенсорів:", error);
    }
}
// Крок 9. Запуск завантаження
loadSensors();
