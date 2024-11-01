const apiKey = "959d9451d7f23817254ee887e8245961"; // Zamenite sa svojim OpenWeatherMap API ključem

// Lista gradova za izbor
const europeanCities = [
    "Belgrade, RS", "Paris, FR", "London, GB", "Berlin, DE", "Madrid, ES", 
    "Rome, IT", "Vienna, AT", "Athens, GR", "Budapest, HU", "Prague, CZ", 
    "Warsaw, PL", "Dublin, IE", "Brussels, BE", "Amsterdam, NL", 
    "Lisbon, PT", "Zurich, CH", "Stockholm, SE", "Oslo, NO", 
    "Copenhagen, DK", "Helsinki, FI", "Sofia, BG", "Bucharest, RO", 
    "Ljubljana, SI", "Zagreb, HR", "Podgorica, ME", "Sarajevo, BA", 
    "Skopje, MK", "Tirana, AL", "Sint-Pieters-Leeuw, BE", "Šabac, RS"
];

// Popunjavanje select elementa sa gradovima
const citySelect = document.getElementById("city-select");
europeanCities.forEach(city => {
    const option = document.createElement("option");
    option.value = city; // Koristimo naziv grada sa oznakom zemlje
    option.textContent = city;
    citySelect.appendChild(option);
});

// Funkcija za ažuriranje podataka o vremenu
function updateWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;
    
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

            // Dodavanje koda za ikonu
            const iconCode = data.weather[0].icon; // Uzmi kod ikone
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL za ikonu
            document.getElementById("weather-icon").src = iconUrl; // Postavi URL ikone
        })
        .catch(error => console.error("Greška prilikom dohvatanja podataka:", error));
}

// Funkcija za osvežavanje vremenskih podataka
function refreshWeather() {
    const city = citySelect.value;
    updateWeather(city);
}

// Ažuriramo podatke kada korisnik promeni grad
citySelect.addEventListener("change", refreshWeather);

// Postavljanje podrazumevanog grada
const defaultCity = "Sint-Pieters-Leeuw, BE"; // Podrazumevani grad sa oznakom zemlje
citySelect.value = defaultCity; // Postavljanje izabranog grada
refreshWeather(); // Ažuriranje podataka za podrazumevani grad
