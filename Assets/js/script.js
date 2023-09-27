const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const API_KEY = "acb5778b3ea5b17f1dbb57349368c20e";

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

        console.log (fiveDaysForecast);
    })  .catch(() => {
        alert("An error occured while fetching weather forecast!");
    });

}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim ();
    if(!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    fetch (GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert ("No coordinates found");
        const { name, lat, lon } = data [0];
        getWeatherDetails(name, lat, lon)
    }) .catch(() => {
        alert("An error occured!");
    });
}

searchButton.addEventListener("click", getCityCoordinates);