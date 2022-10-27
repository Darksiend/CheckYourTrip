let inputField = document.getElementById("input-city");

inputField.addEventListener("input", function () {
  if (inputField.value[0] != inputField.value[0].toUpperCase()) {
    (inputField.value = inputField.value.slice(0, 1).toUpperCase()) +
      inputField.value.slice(1, inputField.value.length);
  }
});

//getWeather();

//Autocomplite

function initMap() {} // now it IS a function and it is in global
