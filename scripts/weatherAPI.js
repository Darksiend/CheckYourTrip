let inpuCityForm = document.getElementById("input-city-form");
const APIWeatherKey = "abe55f95b925a7dd5653ef7f8147bd6b";

inpuCityForm.addEventListener("submit", getCity);

let city = "";
function getCity(event) {
  if (inputField.value == "") {
    event.preventDefault(event);
  } else {
    event.preventDefault(event);
    city = inputField.value;
    getWeather();
  }
}
let lat = 0;
let lon = 0;
function getWeather() {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIWeatherKey}`
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      document.getElementById("city-name").innerHTML = data[0].name;
      lat = data[0].lat;
      lon = data[0].lon;
      getCurrentWeather().catch(function () {});
    })
    .then()
    .catch(function () {});
}

function getCurrentWeather() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then(function (data) {
      document.getElementById("current-temp").innerHTML =
        Math.round(data.main.temp) + "°C";
      let condIcon = document.createElement("img");
      let iconCode = "";
      iconCode = data.weather[0].icon;
      condIcon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${iconCode}@2x.png`
      );
      document.getElementById("city-div").append(condIcon);
    })
    .catch(function () {});
}
