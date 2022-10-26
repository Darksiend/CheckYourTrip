let inputField = document.getElementById("input-city");

inputField.addEventListener("input", function () {
  if (inputField.value[0] != inputField.value[0].toUpperCase()) {
    (inputField.value = inputField.value.slice(0, 1).toUpperCase()) +
      inputField.value.slice(1, inputField.value.length);
  }
});

const APIWeatherKey = "abe55f95b925a7dd5653ef7f8147bd6b";

//let curWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIWeatherKey}`;

function getCity() {}

function getWeather() {
  let city = "london";
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIWeatherKey}`
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      document.getElementById("city-name").innerHTML = data[0].name;
    })
    .catch(function () {});
}

getWeather();
