// Chave da API OpenWeatherMap
const API_KEY = "b1b15e88fa797225412429c1c50c122a1"; 

// Variáveis globais
let lastForecastData = null;
let activeTab = "temperatura";
let hourlyChartInstance = null;

// Função para obter nome do dia
function getDayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

// Função para buscar dados do clima
async function getWeatherData(city) {
  const encodedCity = encodeURIComponent(city);
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity},BR&appid=${API_KEY}&units=metric&lang=pt_br`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity},BR&appid=${API_KEY}&units=metric&lang=pt_br`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok) throw new Error('Cidade não encontrada.');
    if (!forecastResponse.ok) throw new Error('Erro ao buscar previsão.');

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    return { currentData, forecastData };
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Função para preparar dados do gráfico
function getChartData(forecastData, type = "temperatura") {
  const nextHours = forecastData.list.slice(0, 8);
  let chartData = {};

  switch (type) {
    case "temperatura":
      chartData = {
        label: "Temperatura (°C)",
        color: "#ffe066",
        background: "rgba(249,217,35,0.12)",
        data: nextHours.map(item => Math.round(item.main.temp))
      };
      break;
    case "chuva":
      chartData = {
        label: "Chuva (mm)",
        color: "#6ec6ff",
        background: "rgba(110,198,255,0.12)",
        data: nextHours.map(item => (item.rain?.['3h'] || item.rain?.['1h']) || 0)
      };
      break;
    case "vento":
      chartData = {
        label: "Vento (km/h)",
        color: "#8fff80",
        background: "rgba(143,255,128,0.15)",
        data: nextHours.map(item => (item.wind?.speed ? (item.wind.speed*3.6).toFixed(1) : 0))
      };
      break;
    default:
      chartData = { label: "Dados", color: "#fff", background: "#000", data: [] };
  }

  return chartData;
}

// Atualiza gráfico horário
function updateHourlyChart(forecastData, type = "temperatura") {
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  const nextHours = forecastData.list.slice(0, 8);
  const labels = nextHours.map(item =>
    new Date(item.dt_txt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  const chartData = getChartData(forecastData, type);

  if (hourlyChartInstance) hourlyChartInstance.destroy();

  hourlyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: chartData.label,
        data: chartData.data,
        fill: true,
        tension: 0.35,
        borderColor: chartData.color,
        backgroundColor: chartData.background,
        pointBackgroundColor: '#fff',
        pointBorderColor: chartData.color,
        pointRadius: 6,
        pointHoverRadius: 10,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0)' }, ticks: { color: '#c0c0c0', font: { size: 14 } } },
        y: {
          grid: { color: '#444' },
          ticks: { color: '#c0c0c0', font: { size: 14 } },
          beginAtZero: type !== "temperatura",
          suggestedMin: type === "temperatura" ? Math.min(...chartData.data)-2 : 0,
          suggestedMax: Math.max(...chartData.data)+2
        }
      }
    }
  });
}

// Atualiza interface completa
function updateUI(currentData, forecastData, type = "temperatura") {
  document.getElementById('current-temp').textContent = Math.round(currentData.main.temp);
  document.getElementById('current-rain').textContent = currentData.rain ? (currentData.rain['1h'] || 0) : 0;
  document.getElementById('current-humidity').textContent = currentData.main.humidity;
  document.getElementById('current-wind').textContent = (currentData.wind.speed*3.6).toFixed(0);

  const iconCode = currentData.weather[0].icon;
  document.getElementById('main-weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById('main-weather-icon').alt = currentData.weather[0].description;
  document.getElementById('current-description').textContent = currentData.weather[0].description.charAt(0).toUpperCase() + currentData.weather[0].description.slice(1);

  const date = new Date(currentData.dt*1000);
  document.getElementById('current-day-time').textContent = date.toLocaleDateString('pt-BR', { weekday:'long', hour:'2-digit', minute:'2-digit', hour12:false });

  if (currentData.name) document.getElementById('current-location').textContent = currentData.name;

  updateHourlyChart(forecastData, type);

  // CRIA CARDS DIÁRIOS (while, if-else)
  const dailyForecastContainer = document.querySelector('.daily-forecast');
  dailyForecastContainer.innerHTML = '';
  const dailyData = {};
  let i = 0;
  while (i < forecastData.list.length) {
    const item = forecastData.list[i];
    const dayKey = new Date(item.dt_txt).toISOString().slice(0,10);

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { temps: [], icon: item.weather[0].icon, dayName: getDayName(item.dt_txt), periods: [] };
    }

    dailyData[dayKey].temps.push(item.main.temp_max, item.main.temp_min);
    dailyData[dayKey].periods.push(item);

    if (item.weather[0].icon.endsWith('d')) dailyData[dayKey].icon = item.weather[0].icon;

    i++;
  }

  const sortedDays = Object.keys(dailyData).sort();
  i = 0;
  while (i < Math.min(8, sortedDays.length)) {
    const day = sortedDays[i];
    const data = dailyData[day];
    const minTemp = Math.min(...data.temps).toFixed(0);
    const maxTemp = Math.max(...data.temps).toFixed(0);

    let dayCard = document.createElement('div');
    dayCard.classList.add('day-card');

    if (maxTemp > 30) dayCard.style.background = "#ff6b6b";
    else if (maxTemp < 15) dayCard.style.background = "#4d79ff";
    else dayCard.style.background = "#24292f";

    dayCard.innerHTML = `
      <div class="day-name">${data.dayName}</div>
      <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="">
      <div class="temp-range">${maxTemp}° <span class="min">${minTemp}°</span></div>
    `;

    dayCard.addEventListener('click', () => showDayDetailsModal(data.periods, data.dayName, day));
    dailyForecastContainer.appendChild(dayCard);

    i++;
  }
}

// Modal de detalhes do dia
function showDayDetailsModal(periods, dayName, dayKey) {
  let modal = document.createElement('div');
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal">
      <button class="close-modal" title="Fechar">×</button>
      <h2>Detalhes de ${dayName} (${dayKey.split('-').reverse().join('/')})</h2>
      <div class="modal-details"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const detailsDiv = modal.querySelector('.modal-details');

  // FOR para percorrer os períodos
  for (let j = 0; j < periods.length; j++) {
    const item = periods[j];
    const hour = new Date(item.dt_txt).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    const desc = item.weather[0].description;
    const icon = item.weather[0].icon;

    detailsDiv.innerHTML += `
      <div class="modal-period">
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
        <b>${hour}</b> - <b>${Math.round(item.main.temp)}°C</b>,
        ${desc.charAt(0).toUpperCase() + desc.slice(1)}
        | 💧${item.main.humidity}% 
        | 💨${(item.wind.speed*3.6).toFixed(0)}km/h 
        | 🌧️${item.rain?.['3h'] || item.rain?.['1h'] || 0}mm
      </div>
    `;
  }

  modal.querySelector('.close-modal').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); }
}

// Inicializa clima
async function initializeWeather(city = "São Paulo", type = "temperatura") {
  const weatherData = await getWeatherData(city);
  if (weatherData) {
    lastForecastData = weatherData.forecastData;
    updateUI(weatherData.currentData, weatherData.forecastData, type);
  }
}

// Configura busca de cidade
function setupCitySearch() {
  const searchBtn = document.getElementById('search-btn');
  const cityInput = document.getElementById('city-input');
  const form = document.querySelector('.search-city');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) await initializeWeather(city, activeTab);
  });

  searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (city) await initializeWeather(city, activeTab);
  });
}

// Configura tabs
function setupTabs() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeTab = button.getAttribute('data-type');
      if (lastForecastData) updateHourlyChart(lastForecastData, activeTab);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupCitySearch();
  setupTabs();
  initializeWeather();
});
