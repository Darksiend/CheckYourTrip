let inpuCityForm = document.getElementById("input-city-form");
const APIWeatherKey = "abe55f95b925a7dd5653ef7f8147bd6b";

inpuCityForm.addEventListener("submit", getCity);
let temps = new Array();
let labelsArr = new Array();
let city = "";
let country = "";
let countryID = "";
let lat = 0;
let lon = 0;
function getCity(event) {
  if (inputField.value == "") {
    event.preventDefault(event);
  } else {
    event.preventDefault(event);
    city = inputField.value;
    console.log(inputField.value);
    getCoords();
  }
}

function getCountryDetails() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  fetch(
    `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryID}`,
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      let currency = "";
      currency = response.data.currencyCodes[0];
      console.log(response.data.flagImageUri);
      document.getElementById(
        "flag-of-country"
      ).style.backgroundImage = `url(${response.data.flagImageUri})`;

      document.getElementById("currency-of-country").innerHTML = currency;
      document.getElementById("country-name").innerHTML = response.data.name;
      console.log(currency);
      console.log(response);
    });
}

function getCoords() {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIWeatherKey}`
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      //document.getElementById("city-name").innerHTML = data[0].name;
      for (i = 0; i < document.querySelectorAll(".city-name").length; i++) {
        document.querySelectorAll(".city-name")[i].innerHTML = data[0].name;
      }

      countryID = data[0].country;
      lat = data[0].lat;
      lon = data[0].lon;
      countryID = data[0].country.toUpperCase();
      getCountryDetails();
      getCurrentWeather().catch((err) => console.error(err));
    })
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
      document.getElementById("current-temp").append(condIcon);
    })
    .then(getWeatherForChart)
    .catch((err) => console.error(err));
}
//api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
function createChart() {
  const data = {
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: temps,
      },
    ],
  };

  data.labels = labelsArr;

  console.log(data);

  const config = {
    type: "line",
    data: data,
    options: {},
  };
  const myChart = new Chart(document.getElementById("myChart"), config);
}

function getWeatherForChart() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data.list);
      for (i = 0; i < data.list.length; i++) {
        //    let obj = { x: data.list[i].main.temp, y: data.list[i].dt_txt };
        //  let obj = { x: data.list[i].main.temp, y: i };
        temps.push(data.list[i].main.temp);
        labelsArr.push(data.list[i].dt_txt);
        //2022-10-29 00:00:00"
      }
      console.log(temps);
    })
    .then(createChart)
    .catch((err) => console.error(err));
}
