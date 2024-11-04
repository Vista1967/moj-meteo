const apiKey = "959d9451d7f23817254ee887e8245961"; // Zamenite sa svojim OpenWeatherMap API ključem

// Lista gradova za izbor
const europeanCities = [
    "Belgrade", "Knokke, BE", "Paris", "London", "Berlin", "Madrid", "Rome", "Vienna", "Athens", "Budapest", 
    "Prague", "Warsaw", "Dublin", "Brussels", "Amsterdam", "Lisbon", "Zurich", "Stockholm", 
    "Oslo", "Copenhagen", "Helsinki", "Sofia", "Bucharest", "Ljubljana", "Zagreb", "Podgorica", 
    "Sarajevo", "Skopje", "Tirana", "Sint-Pieters-Leeuw, BE", "Šabac, RS"
];

// Popunjavanje select elementa sa gradovima
const citySelect = document.getElementById("city-select");
europeanCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
});

// Funkcija za ažuriranje podataka o vremenu
function updateWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Greška: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Ažuriranje informacija o vremenu
            document.getElementById("temperature").textContent = data.main.temp.toFixed(1);
            document.getElementById("humidity").textContent = data.main.humidity;
            document.getElementById("description").textContent = data.weather[0].description;

            // Brzina vetra
            document.getElementById("wind-speed").textContent = data.wind.speed.toFixed(1); // m/s

            // Padavine
            const precipitation = data.rain ? data.rain["1h"] || 0 : 0;
            document.getElementById("precipitation").textContent = precipitation.toFixed(1); // mm

            // Latitude i Longitude za grad
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            // Pozivanje funkcija sa tačnim koordinatama
            getUVIndex(lat, lon);
            getPollutionIndex(lat, lon);

            // Dodavanje ikone vremena
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            document.getElementById("weather-icon").src = iconUrl;
        })
        .catch(error => console.error("Greška prilikom dohvatanja podataka:", error));
}

// Funkcija za dobijanje UV indeksa
function getUVIndex(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("uv-index").textContent = data.value.toFixed(1);
        })
        .catch(error => console.error("Greška prilikom dohvatanja UV indeksa:", error));
}

// Funkcija za dobijanje indeksa polucije
function getPollutionIndex(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("pollution").textContent = data.list[0].main.aqi; // AQI vrednost
        })
        .catch(error => console.error("Greška prilikom dohvatanja indeksa polucije:", error));
}

// Funkcija za osvežavanje vremenskih podataka
function refreshWeather() {
    const city = citySelect.value;
    updateWeather(city);
}

// Ažuriramo podatke kada korisnik promeni grad
citySelect.addEventListener("change", refreshWeather);

// Postavljanje podrazumevanog grada
const defaultCity = "Sint-Pieters-Leeuw, BE";
citySelect.value = defaultCity;
refreshWeather();
