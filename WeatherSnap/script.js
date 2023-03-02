const mapCont = document.querySelector("#map");
const weatherDetails = document.querySelector(".weather-details");
const Geo_API = `150873837177381284035x49772`;
const search = document.querySelector("#search-item");
let lat, lng;

var map = L.map("map");

function loadMap(lat = 18.2767, lng = 83.8789) {
  map.setView([lat, lng], 7);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
  addMarker(lat, lng);
  getWeatherData(lat, lng);
}

// enter key event

document.addEventListener("keyup", function (e) {
  if (e.key !== "Enter") return;
  const searchValue = search.value.trim().toLowerCase();
  if (searchValue) {
    console.log(searchValue);
    geocode(searchValue);
    search.value = "";
  }
});

// onclick event on map

map.on("click", function (e) {
  var latlng = e.latlng;
  if (!latlng) return;
  var lat = latlng.lat;
  var lng = latlng.lng;
  addMarker(lat, lng);
  loadMap(lat, lng);
});

//geolocation event
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      loadMap(lat, lng);
    },
    function (error) {
      loadMap();
      console.log("Error getting location: " + error.message);
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

function addMarker(lat, lng) {
  var marker = L.marker([lat, lng]).addTo(map);
}

function redorWeather(data) {
  console.log(data);
  const html = `
  <li>
  <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="sunny">
  <div class="temp-det">
      <p class="discription">${data.weather[0].description}</p>
      <p class="temp">${data.main.temp}<span class="units">°C</span></p>
      <p>${data.name}</p>
  </div>
</li>
  `;
  weatherDetails.insertAdjacentHTML("afterbegin", html);
}
async function geocode(name) {
  try {
    const response = await fetch(
      `https://geocode.xyz/${name}?json=1&auth=${Geo_API}`
    );
    const data = await response.json();
    const { latt, longt } = data;
    lat = latt;
    lng = longt;
    if (lat === "0.00000" && lng === "0.00000") {
      alert("no city/country found");
      return;
    }
    console.log(lat, lng);
    loadMap(lat, lng);
  } catch (err) {
    console.log(err);
  }
}

async function getWeatherData(lat, lng) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=75373688a6b2b7c6c5d0f52070b86fe1&units=metric`
  );
  const data = await response.json();
  redorWeather(data);
}
