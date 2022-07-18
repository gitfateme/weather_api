//functions

// function changeCity(event) {
//   event.preventDefault();

//   if (searchInput.value) {
//     cityName.textContent = searchInput.value;
//   }
// }

function celciusToFahrenheit(celcius) {
  return Math.floor((celcius * 9) / 5 + 32);
}

function fahrenheitToCelclius(fahrenheit) {
  return Math.ceil(((fahrenheit - 32) * 5) / 9);
}

function changeToCelcius(event) {
  event.preventDefault();

  if (currentCF.textContent !== "°C") {
    let newDegree = fahrenheitToCelclius(currentDegree.textContent);
    currentDegree.textContent = newDegree;
    currentCF.textContent = "°C";
  }
}

function changeToFahrenheit(event) {
  event.preventDefault();

  if (currentCF.textContent !== "°F") {
    let newDegree = celciusToFahrenheit(currentDegree.textContent);
    currentDegree.textContent = newDegree;
    currentCF.textContent = "°F";
  }
}

function changeWeather(searchInputValue) {
  let newCity = searchInputValue;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((r) => {
      changeDescription(r);
      changeIcon(r);
      getForecast(r.data.coord);
      currentCF.textContent = "°C";

      cityName.textContent = searchInputValue;
      countryName.textContent = r.data.sys.country;
      currentDegree.textContent = Math.round(r.data.main.temp);
      searchInput.value = "";
    })
    .catch((error) => {
      if (error.response) {
        alert(error.response.data.message);
        searchInput.value = "";
      }
    });
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Say"];
  return days[day];
}

function formatForecastTime(timestamp) {
  let date = new Date(timestamp * 1000);
  function getHour() {
    let newHour = date.getHours();
    if (newHour < 10) {
      return `0${newHour}`;
    } else {
      return newHour;
    }
  }
  function getMinute() {
    let newMin = date.getMinutes();
    if (newMin < 10) {
      return `0${newMin}`;
    } else {
      return newMin;
    }
  }
  return `${getHour()}:${getMinute()}`;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.getElementById("forecast");
  let forecastArrays = [];
  response.data.list.forEach((arr) => {
    forecastArrays.push(arr);
  });

  let forecastHTML = "";
  forecastArrays.forEach(function (arr, index) {
    if (index < 8) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-6 col-sm-3 mb-3">
  <p class="my-0">${formatForecastDay(arr.dt)}</p>
    <p class="my-0">${formatForecastTime(arr.dt)}</p>
    <img src="https://openweathermap.org/img/wn/${
      arr.weather[0].icon
    }.png" alt="" />
    <div class="weather-forecast-temperatures mb-3">

      <span class="weather-forecast-temp forecast-degree">${Math.floor(
        arr.main.temp
      )}</span><span class="forecast-cf">°C</span>
    </div>
  </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

//Time

let timeSpan = document.querySelector("#time-span");
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
function getMinute() {
  let newMin = now.getMinutes();
  if (newMin < 10) {
    newMin = `0${newMin}`;
  }
  return newMin;
}

timeSpan.textContent = `${day} ${hour}:${getMinute()}`;

//city
let cityName = document.querySelector("#city-name");
let countryName = document.getElementById("country-name");
let searchForm = document.querySelector("#search-form");
let searchInput = document.querySelector(".search-input");
let yourLocationButton = document.getElementById("your-location");

//celcius and fahrenheit
let celciusLink = document.querySelector("#c-link");
let fahrenheitLink = document.querySelector("#f-link");

let currentCF = document.querySelector(".current-cf");
let currentDegree = document.querySelector(".current-degree");

//API
let apiKey = "20c9277c0c1a5b967be7ce712a171f19";

function showCityTemperature(res) {
  res.preventDefault();
  if (searchInput.value) {
    changeWeather(searchInput.value);
  } else {
    alert("Enter city name!");
  }
}

function showCurrentCityTemp(lat, lon) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then((r) => {
    currentDegree.textContent = Math.round(r.data.main.temp);
    cityName.textContent = r.data.name;
    changeIcon(r);
    changeDescription(r);
    getForecast(r.data.coord);
    currentCF.textContent = "°C";
    countryName.textContent = r.data.sys.country;
  });
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition((p) => {
    let lat = p.coords.latitude;
    let lon = p.coords.longitude;
    showCurrentCityTemp(lat, lon);
  });
}

//default temperature
function defaultTemp() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=tehran&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then((r) => {
    currentDegree.textContent = Math.round(r.data.main.temp);
    changeIcon(r);
    changeDescription(r);
    getForecast(r.data.coord);
    currentCF.textContent = "°C";
    countryName.textContent = r.data.sys.country;
  });
}

//icon and description
let iconImage = document.getElementById("weather-icon");
let weatherDescription = document.getElementById("weather-description");
let humidity = document.getElementById("humidity");
let windSpeed = document.getElementById("wind-speed");

function changeIcon(r) {
  let newIcon = r.data.weather[0].icon;
  iconImage.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${newIcon}@2x.png`
  );
}

function changeDescription(r) {
  let newDescription = r.data.weather[0].description;
  weatherDescription.textContent = newDescription;
  let newHumidity = r.data.main.humidity;
  humidity.textContent = newHumidity;
  let newWindSpeed = (r.data.wind.speed * 3.6).toFixed(1);
  windSpeed.textContent = newWindSpeed;
}

//Forecast

//Event listeners
window.addEventListener("load", defaultTemp);
celciusLink.addEventListener("click", changeToCelcius);
fahrenheitLink.addEventListener("click", changeToFahrenheit);
searchForm.addEventListener("submit", showCityTemperature);
yourLocationButton.addEventListener("click", getCurrentPosition);
