let inputField = inputField.addEventListener("input", function () {
  if (inputField.value[0] != inputField.value[0].toUpperCase()) {
    (inputField.value = inputField.value.slice(0, 1).toUpperCase()) +
      inputField.value.slice(1, inputField.value.length);
  }
});
