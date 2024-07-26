// YOUR JS CODE HERE
const container = document.querySelector(".container");

async function fetchWeatherData() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=49.2497&longitude=-123.1193&current=temperature_2m,weather_code,is_day,rain,showers,wind_speed_10m&timezone=auto&forecast_days=1"
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}

function detectWeather(code) {
  // code = 63;
  let weather;
  switch (code) {
    case 0:
      weather = "sunny";
      break;
    case 61:
    case 63:
    case 65:
      weather = "rainy";
      break;
    default:
      weather = "sunny";
  }
  return weather;
}

async function buildApp() {
  const data = await fetchWeatherData();
  if (!data) {
    container.textContent = "Failed to load weather data.";
    return;
  }
  console.log(data);
  // Temperature
  const temperature = document.createTextNode(
    `${data.current.temperature_2m} ${data.current_units.temperature_2m}`
  );
  const temp = document.createElement("div");
  temp.appendChild(temperature);
  temp.classList.add("temperature");

  // Wind
  const windSpeedTxt = document.createTextNode(
    `WindSpeed: ${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`
  );
  const windSpeed = document.createElement("div");
  windSpeed.appendChild(windSpeedTxt);
  windSpeed.classList.add("wind-speed");

  // TimeZone
  const timeZoneTxt = document.createTextNode(data.timezone);
  const timeZone = document.createElement("div");
  timeZone.appendChild(timeZoneTxt);
  timeZone.classList.add("time-zone");

  // Updated
  const updatedTxt = document.createTextNode(
    "Last updated: " + new Date(data.current.time).toLocaleString()
  );
  const updated = document.createElement("div");
  updated.appendChild(updatedTxt);
  updated.classList.add("updated");

  container.classList.add(detectWeather(data.current.weather_code));
  container.appendChild(temp);
  container.appendChild(windSpeed);
  container.appendChild(timeZone);
  container.appendChild(updated);
}

buildApp();
