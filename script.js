const apiKey = "959d9451d7f23817254ee887e8245961";

const europeanCities = [
    "Belgrade", "Knokke, BE", "Paris", "London", "Berlin", "Madrid", "Rome", "Vienna", "Athens", 
    "Budapest", "Prague", "Warsaw", "Dublin", "Brussels", "Amsterdam", "Lisbon", "Zurich", 
    "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Sofia", "Bucharest", "Ljubljana", 
    "Zagreb", "Podgorica", "Sarajevo", "Skopje", "Tirana", "Sint-Pieters-Leeuw, BE", "Šabac, RS"
];

const cityCoords = {
    "Belgrade": {lat: 44.8, lon: 20.5},
    "Knokke, BE": {lat: 51.3, lon: 3.3},
    "Paris": {lat: 48.9, lon: 2.4},
    // Add coordinates for other cities as needed
};

const citySelect = document.getElementById("city-select");

europeanCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
});

function updateWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("temperature").textContent = data.main.temp.toFixed(1);
            document.getElementById("humidity").textContent = data.main.humidity;
            document.getElementById("description").textContent = data.weather[0].description;
            document.getElementById("wind-speed").textContent = data.wind.speed.toFixed(1);
            document.getElementById("precipitation").textContent = data.rain ? (data.rain["1h"] || 0).toFixed(1) : 0;
            document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            const { lat, lon } = cityCoords[city] || {};
            if (lat && lon) {
                getUVIndex(lat, lon);
                getPollutionIndex(lat, lon);
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function getUVIndex(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("uv-index").textContent = data.value.toFixed(1);
        })
        .catch(error => console.error("Error fetching UV index:", error));
}

function getPollutionIndex(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("pollution").textContent = data.list[0].main.aqi;
        })
        .catch(error => console.error("Error fetching pollution index:", error));
}

citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;
    updateWeather(selectedCity);
});

const defaultCity = "Sint-Pieters-Leeuw, BE";
citySelect.value = defaultCity;
updateWeather(defaultCity);
