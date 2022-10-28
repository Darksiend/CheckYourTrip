const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "75882334a2mshe48f433583c7d92p16dc85jsn98c3fe3ab2d2",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};

fetch("https://wft-geo-db.p.rapidapi.com/v1/geo/countries/US", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
