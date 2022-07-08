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
  let newCity = searchInput.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=metric`;
  if (searchInput.value) {
    axios
      .get(apiUrl)
      .then((r) => {
        changeDescription(r);
        changeIcon(r);
        cityName.textContent = searchInput.value;
        currentDegree.textContent = Math.round(r.data.main.temp);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        }
      });
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
  });
}

//icon and description
let iconImage = document.getElementById("weather-icon");
let weatherDescription = document.getElementById("weather-description");

function changeIcon(r) {
  let newIcon = r.data.weather[0].icon;
  iconImage.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${newIcon}@2x.png`
  );
}
function changeDescription(r) {
  let description = r.data.weather[0].description;
  weatherDescription.textContent = description;
}

//Event listeners
window.addEventListener("load", defaultTemp);
celciusLink.addEventListener("click", changeToCelcius);
fahrenheitLink.addEventListener("click", changeToFahrenheit);
searchForm.addEventListener("submit", showCityTemperature);
yourLocationButton.addEventListener("click", getCurrentPosition);
