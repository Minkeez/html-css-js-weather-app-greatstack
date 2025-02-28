const apiKey = "";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.getElementById("searchBtn");
const locateBtn = document.getElementById("locateBtn");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    document.querySelector(
      ".city"
    ).innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector(".temp").innerHTML = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".feels-like").innerHTML = `Feels like: ${Math.round(
      data.main.feels_like
    )}°C`;
    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
    document.querySelector(".wind").innerHTML = `${data.wind.speed} km/h`;
    document.querySelector(".pressure").innerHTML = `${data.main.pressure} hPa`;

    // Convert Sunrise and Sunset times
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    document.querySelector(".sunrise").innerHTML = sunriseTime;
    document.querySelector(".sunset").innerHTML = sunsetTime;

    // Update weather icon
    const weatherCondition = data.weather[0].main.toLowerCase();
    weatherIcon.src = `images/${weatherCondition}.png`;

    // Update Background Based on Weather
    updateBackground(weatherCondition);

    // Show weather details, hide error message
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  } catch (error) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// Function to Update Background Based on Weather
function updateBackground(condition) {
  const body = document.body;
  switch (condition) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #fcb045, #fd1d1d)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #c0c0c0, #808080)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg, #76a5af, #3b5998)";
      break;
    case "mist":
    case "fog":
      body.style.background = "linear-gradient(135deg, #b0bec5, #546e7a)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #d4fc79, #96e6a1)";
      break;
    default:
      body.style.background = "#222";
  }
}

// Handle Search Button Click
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value.trim());
});

// Handle Enter Key Press in Search Box
searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") checkWeather(searchBox.value.trim());
});

// Auto-Detect User Location
locateBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(geoUrl);
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();
        checkWeather(data.name);
      } catch (error) {
        alert("Unable to fetch weather data for your location.");
      }
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Toggle Dark Mode
toggleDarkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
