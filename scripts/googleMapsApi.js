function initialize() {
  var input = document.getElementById("input-city");
  new google.maps.places.Autocomplete(input, { types: ["(cities)"] });
}

google.maps.event.addDomListener(window, "load", initialize);
