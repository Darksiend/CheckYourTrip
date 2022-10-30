let inpuCityForm = document.getElementById("input-city-form");
const APIWeatherKey = "abe55f95b925a7dd5653ef7f8147bd6b";

inpuCityForm.addEventListener("submit", getCity);
let temps = [];
let labelsArr = [];
let city = "";
let countryID = "";
let lat = 0;
let lon = 0;
let currency = "";

function getCity(event) {
  if (inputField.value === "") {
    event.preventDefault(event);
  } else {
    event.preventDefault(event);
    city = inputField.value;
    console.log(inputField.value);
    getCoords();
    turnSpinner();
    setTimeout(function () {
      turnDisplay("city-div");
    }, 1500);
  }
}

async function getCountryDetails() {
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
      currency = response.data.currencyCodes[0];
      console.log(response.data.flagImageUri);
      document.getElementById(
        "flag-of-country"
      ).style.backgroundImage = `url(${response.data.flagImageUri})`;

      document.getElementById("currency-of-country").innerHTML = currency;
      // document.getElementById("country-name").innerHTML = response.data.name;
      for (i = 0; i < document.querySelectorAll(".country-name").length; i++) {
        document.querySelectorAll(".country-name")[i].innerHTML =
          response.data.name;
      }
      console.log(currency);
      console.log(response);
      getExchangeRate();
    });
}

async function getCoords() {
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

async function getCurrentWeather() {
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
async function createChart() {
  const data = {
    datasets: [
      {
        backgroundColor: "#FFB52E",
        borderColor: "#FFB52E",
        data: temps,
        fill: "none",
        tension: 0.4,
        pointStyle: "rectRounded",
      },
    ],
  };

  data.labels = labelsArr;

  const config = {
    type: "line",
    data: data,
    options: {
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Hourly forecast to 5 days in your destonation.",
        },
      },
    },
  };
  const myChart = new Chart(document.getElementById("myChart"), config);
}

async function getWeatherForChart() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then(function (data) {
      for (i = 0; i < data.list.length; i++) {
        //    let obj = { x: data.list[i].main.temp, y: data.list[i].dt_txt };
        //  let obj = { x: data.list[i].main.temp, y: i };
        temps.push(Math.round(data.list[i].main.temp));
        labelsArr.push(validateDateOfForecast(data.list[i].dt_txt));
        //2022-10-29 00:00:00"
      }
      console.log(temps);
    })
    .then(createChart)
    .catch((err) => console.error(err));
}

function validateDateOfForecast(elem) {
  let months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };
  let time = elem.split(" ")[1].split(":").slice(0, 2).join(":");
  let date = elem.split(" ")[0].split("-").slice(1, 3);
  date[0] = months[date[0]];
  console.log(date);
  dateTime = date + " " + time;
  return dateTime;
}

function turnDisplay(id) {
  let spinner = document.getElementById("donut");
  spinner.style.display = "none";
  document.getElementById("input-city-form").style.display = "none";

  let el = document.getElementById(id);
  el.style.display = "flex";
}

function turnSpinner() {
  let spinner = document.getElementById("donut");
  spinner.style.display = "inline-block";
}

async function getExchangeRate() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
      "X-RapidAPI-Host":
        "currency-conversion-and-exchange-rates.p.rapidapi.com",
    },
  };

  fetch(
    `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=ILS&to=${currency}&amount=100`,
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      console.log(response);
      document.getElementById("currency-amount").innerHTML = response.result;
    })

    .catch((err) => console.error(err));
}
