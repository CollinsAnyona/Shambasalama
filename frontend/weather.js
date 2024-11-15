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

WEATHER_API_ENDPOINT=`https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=`;
WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/2.5/onecall?appid=8673578fcd2e5073bd4047023ef7dbdc&exclude=minutely&units=metric&lon=8&lat=10`;
function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT+userLocation.value).then((response) => response.json()).then((data) => {
        if(data.cod != "" && data.cod != 200) {
            alert(data.message);
            return;
        }
        console.log(data.coord.lon, data.coord.lat);

        city.innerHTML=data.name + "," + data.sys.country;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/10d@2x.png)`
        fetch(WEATHER_DATA_ENDPOINT+`lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response) => response.json()).then((data) => {
            console.log(data);
        });
    });
}