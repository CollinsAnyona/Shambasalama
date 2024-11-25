const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelslike = document.querySelector(".feelslike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("HValue"),
  WValue = document.getElementById("WValue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("CValue"),
  UValue = document.getElementById("UValue"),
  Forecast = document.getElementById("Forecast");

const WEATHER_API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=";
const WEATHER_DATA_ENDPOINT = "https://api.openweathermap.org/data/2.5/onecall?appid=8673578fcd2e5073bd4047023ef7dbdc&exclude=minutely&units=metric";

function findUserLocation() {
  if (!userLocation.value) {
    alert("Please enter a location.");
    return;
  }

  fetch(`${WEATHER_API_ENDPOINT}${userLocation.value}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.cod !== 200) {
        alert(`Error: ${data.message}`);
        return;
      }

      console.log(data.coord.lon, data.coord.lat);

      city.innerHTML = `${data.name}, ${data.sys.country}`;
      weatherIcon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

      fetch(`${WEATHER_DATA_ENDPOINT}&lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (!data.current) {
            console.error("Error: 'current' data is not available.");
            return;
          }

          console.log(data);

          temperature.innerHTML = `${data.current.temp} °C`;
          feelslike.innerHTML = `Feels like ${data.current.feels_like} °C`;
          description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${data.current.weather[0].description}`;
        })
        .catch((error) => console.error("Error fetching One Call API data:", error));
    })
    .catch((error) => console.error("Error fetching Weather API data:", error));
}
