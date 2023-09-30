const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const locationButton = document.querySelector(".location-btn");

const API_KEY = "acb5778b3ea5b17f1dbb57349368c20e";
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2) * 9/5 + 32} F </h4>
        <h4>Wind: ${(weatherItem.wind.speed)} m/s</h4>
        <h4>Humidity: ${(weatherItem.main.humidity)} %</h4>
    </div>
    <div class="weather-icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
        <h4>${weatherItem.weather[0].description}</h4>

    </div>`;
    } else {
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2) * 9/5 + 32} F </h4>
                <h4>Wind: ${(weatherItem.wind.speed)} m/s</h4>
                <h4>Humidity: ${(weatherItem.main.humidity)} %</h4>
            </li>`;
        }
}
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch (WEATHER_API_URL).then(res => res.json()).then(data => {
       const forecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!forecastDays.includes(forecastDate)) {
                return forecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML ="";
        console.log (fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });

    })  .catch(() => {
        alert("An error occured while fetching weather forecast!");
    });

}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim ();
    if(!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch (GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert (`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data [0];
        getWeatherDetails(name, lat, lon);
    }) .catch(() => {
        alert("An error occured!");
    });
}

const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition (
    position => {
        console.log(position);
        const { latitude, longitude} = position.coords;
        const REVERSE_GEOCODING_URL= `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
        fetch (REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            console.log(data);
            const { name } = data [0];
            getWeatherDetails(name, latitude, longitude);

        }) .catch(() => {
            alert("An error occured!");
        });

    },
    error => {
        console.log(error);
        if(error.code === error.PERMISSION_DENIED){
            alert ("Allow location denied. Please allow share location");
        }
    }
    );
}


searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());