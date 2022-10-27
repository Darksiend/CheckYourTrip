let inputField = document.getElementById("input-city");

inputField.addEventListener("input", function () {
  if (inputField.value[0] != inputField.value[0].toUpperCase()) {
    (inputField.value = inputField.value.slice(0, 1).toUpperCase()) +
      inputField.value.slice(1, inputField.value.length);
  }
});

document
  .getElementById("submit-button")
  .addEventListener("mouseover", function () {
    document.getElementById("submit-button");
    event.target.value = "Take Me to trip!";
  });

document
  .getElementById("submit-button")
  .addEventListener("mouseout", function () {
    document.getElementById("submit-button");
    event.target.value = "Check My Trip!";
  });
