let inpuCityForm = document.getElementById("input-city-form");

let APIWeatherKey = 'abe55f95b925a7dd5653ef7f8147bd6b'
inpuCityForm.addEventListener("submit", getCity);
let temps = [];
let labelsArr = [];
let city = "";
let countryID = "";
let lat = 0;
let lon = 0;
let currency = "";
let allSymbols = [];

function getCity(event) {
  if (inputField.value === "") {
    event.preventDefault(event);
  } else {
    event.preventDefault(event);
    city = inputField.value;
    console.log(inputField.value);
    getCoords();

    turnSpinner();
    getAllSymbols();
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

      for (
        let i = 0;
        i < document.querySelectorAll(".country-name").length;
        i++
      ) {
        document.querySelectorAll(".country-name")[i].innerHTML =
          response.data.name;
      }
      console.log(currency);
      console.log(response);
    });
}

async function getCoords() {
  await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIWeatherKey}`
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      //document.getElementById("city-name").innerHTML = data[0].name;
      for (let i = 0; i < document.querySelectorAll(".city-name").length; i++) {
        document.querySelectorAll(".city-name")[i].innerHTML = data[0].name;
      }

      countryID = data[0].country;
      lat = data[0].lat;
      lon = data[0].lon;
      countryID = data[0].country.toUpperCase();
      getCountryDetails();
      getCurrentWeather().catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}

async function getCurrentWeather() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIWeatherKey}&units=metric`
  )
    .then((response) => response.json())
    .then(function (data) {
      document.getElementById("current-temp").innerHTML =
        Math.round(data.main.temp) + "??C";
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
        label: "Temperature",
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
  await fetch(
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
  let time = elem.split(" ")[1].split(":").slice(0, 2).join(":");
  let date = elem.split(" ")[0].split("-").slice(1, 3).join(".");

  let dateTime = date + " " + time;
  return dateTime;
}

function turnDisplay(id) {
  let spinner = document.getElementById("donut");
  spinner.style.display = "none";
  document.getElementById("input-city-form").style.display = "none";

  let el = document.getElementById(id);

  el.style.display = "flex";
  initMap();
}

function turnSpinner() {
  let spinner = document.getElementById("donut");
  spinner.style.display = "inline-block";
}

async function getExchangeRate() {
  let amount = document.getElementById("exchange-input").value;

  let pickedCur =
    allSymbols[document.getElementById("symbol-picker").selectedIndex];
  console.log("amount", amount);
  console.log("pickedCur", pickedCur);
  console.log(amount);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
      "X-RapidAPI-Host":
        "currency-conversion-and-exchange-rates.p.rapidapi.com",
    },
  };

  await fetch(
    `https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${pickedCur}&to=${currency}&amount=${amount}`,
    options
  )
    .then((response) => response.json())
    .then(function (response) {
      console.log(response);

      document.getElementById("currency-amount").innerHTML =
        response.result.toFixed(1);
    })

    .catch((err) => console.error(err));
}

let pickedCur;

async function getAllSymbols() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
      "X-RapidAPI-Host":
        "currency-conversion-and-exchange-rates.p.rapidapi.com",
    },
  };

  await fetch(
    "https://currency-conversion-and-exchange-rates.p.rapidapi.com/symbols",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      allSymbols = Object.keys(response.symbols).sort();
      for (let i = 0; i < allSymbols.length; i++) {
        let optionEl = document.createElement("option");
        optionEl.setAttribute("value", allSymbols[i]);
        optionEl.innerHTML = allSymbols[i];
        document.getElementById("symbol-picker").append(optionEl);
        if (allSymbols[i] === "ILS") {
          optionEl.selected = true;
          console.log("selected!!!!!");
        }
      }
      getNameOfCurrency();
    })
    .catch((err) => console.error(err));
}

async function getNameOfCurrency() {
  let currencyFullName;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
      "X-RapidAPI-Host":
        "currency-conversion-and-exchange-rates.p.rapidapi.com",
    },
  };

  await fetch(
    "https://currency-conversion-and-exchange-rates.p.rapidapi.com/symbols",
    options
  )
    .then((response) => response.json())
    .then((response) => {
      currencyFullName = response.symbols[currency];
      console.log(currencyFullName);
      document.getElementById("full-name-currency").innerHTML =
        currencyFullName;
    })
    .catch((err) => console.error(err));
}

function initMap() {
  const map = L.map("map").setView([lat, lon], 13);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.invalidateSize();
}
