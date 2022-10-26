let inputField = document.getElementById("input-city");

inputField.addEventListener("input", function () {
  if (inputField.value[0] != inputField.value[0].toUpperCase()) {
    (inputField.value = inputField.value.slice(0, 1).toUpperCase()) +
      inputField.value.slice(1, inputField.value.length);
  }
});

let APIWeatherKey = "abe55f95b925a7dd5653ef7f8147bd6b";
