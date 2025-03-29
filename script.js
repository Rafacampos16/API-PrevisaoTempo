// Elementos do DOM
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weather-icon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

// Função para obter as coordenadas da cidade
async function getCityCoordinates(city) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=pt&count=1`;

  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) throw new Error("Erro ao buscar coordenadas");

    const data = await response.json();
    if (data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      getWeatherData(latitude, longitude);
    } else {
      alert("Cidade não encontrada");
    }
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

// Função para buscar os dados do clima usando coordenadas
async function getWeatherData(latitude, longitude) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error("Erro ao buscar dados da API");

    const data = await response.json();
    updateUI(data.current_weather);
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

// Função para atualizar a interface
function updateUI(data) {
  cityName.textContent = cityInput.value;
  temperature.textContent = `${Math.round(data.temperature)}°C`;
  description.textContent = getDescription(data.weathercode);
  weatherIcon.className = `wi ${getWeatherIcon(data.weathercode)}`;
  humidity.textContent = `Umidade: ${data.relative_humidity || "--"}%`;
  windSpeed.textContent = `Vento: ${Math.round(data.windspeed)} km/h`;
}

// Função para retornar o ícone com base no código do clima
function getWeatherIcon(weatherCode) {
  const icons = {
    0: "wi-day-sunny",       // Céu limpo
    1: "wi-day-cloudy",      // Parcialmente nublado
    2: "wi-cloudy",          // Nublado
    3: "wi-rain",            // Chuva
    45: "wi-fog",            // Névoa
    48: "wi-fog",            // Névoa densa
    51: "wi-sprinkle",       // Chuvisco
    61: "wi-rain-mix",       // Chuva leve
    80: "wi-showers",        // Pancadas de chuva
    95: "wi-thunderstorm",   // Trovoadas
  };
  return icons[weatherCode] || "wi-na"; // Retorna "wi-na" se o código não for encontrado
}

// Função para retornar a descrição com base no código do clima
function getDescription(weatherCode) {
  const descriptions = {
    0: "Céu limpo",
    1: "Parcialmente nublado",
    2: "Nublado",
    3: "Chuva",
    45: "Névoa",
    48: "Névoa densa",
    51: "Chuvisco",
    61: "Chuva leve",
    80: "Pancadas de chuva",
    95: "Trovoadas",
  };
  return descriptions[weatherCode] || "Não disponível";
}

// Eventos
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getCityCoordinates(city);
  } else {
    alert("Por favor, digite o nome de uma cidade!");
  }
});

// Função para alternar o modo escuro
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Elementos do DOM
const forecastContainer = document.createElement("div");
forecastContainer.id = "weekly-forecast";
forecastContainer.style.marginTop = "20px";
document.querySelector(".weather-info").appendChild(forecastContainer);

// Função para buscar previsão semanal
async function getWeeklyForecast(latitude, longitude) {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error("Erro ao buscar previsão semanal");

    const data = await response.json();
    updateWeeklyForecast(data.daily);
  } catch (error) {
    alert("Erro: " + error.message);
  }
}

// Função para atualizar a previsão semanal na interface
function updateWeeklyForecast(daily) {
  const daysOfWeek = ["Domingoㅤ", "Segunda-feiraㅤ ", "Terça-feiraㅤ ", "Quarta-feiraㅤ ", "Quinta-feiraㅤ ", "Sexta-feiraㅤ ", "Sábadoㅤ "];
  const today = new Date().getDay();
  forecastContainer.innerHTML = "<h3>Previsão da Semana:</h3>";

  daily.time.forEach((date, index) => {
    const dayIndex = (today + index) % 7;
    const maxTemp = Math.round(daily.temperature_2m_max[index]);
    const minTemp = Math.round(daily.temperature_2m_min[index]);
    const weatherDesc = getDescription(daily.weathercode[index]);
    const weatherIcon = getWeatherIcon(daily.weathercode[index]);

    forecastContainer.innerHTML += `
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <i class="wi ${weatherIcon}" style="font-size: 2rem; margin-right: 10px;"></i>
        <div>
          <p style="margin: 0; font-weight: bold;">${daysOfWeek[dayIndex]}</p>
          <p style="margin: 0;">${maxTemp}° / ${minTemp}°ㅤ</p>
          <p style="margin: 0;">${weatherDesc}</p>
        </div>
      </div>
    `;
  });
}

// Atualize a função principal para incluir a previsão semanal
async function getCityCoordinates(city) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=pt&count=1`;

  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) throw new Error("Erro ao buscar coordenadas");

    const data = await response.json();
    if (data.results.length > 0) {
      const { latitude, longitude } = data.results[0];
      getWeatherData(latitude, longitude);
      getWeeklyForecast(latitude, longitude); // Chamada para previsão semanal
    } else {
      alert("Cidade não encontrada");
    }
  } catch (error) {
    alert("Erro: " + error.message);
  }
}
