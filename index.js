const apiKey = '87c11aed1f8a54b9843b4d73c6951ef5';

document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) {
        alert('You are currently offline');
        return;
    }
    getUserLocation(); 
    displaySearchHistory();
});

document.getElementById('toggleDarkMode').addEventListener('change', (event) => {
    document.body.classList.toggle('dark-mode', event.target.checked);
    document.getElementById('modeLabel').textContent = event.target.checked ? 'Light Mode' : 'Dark Mode';
});

document.getElementById('getWeather').addEventListener('click', () => {
    if (!navigator.onLine) {
        document.getElementById('error').innerHTML = 'You are currently offline';
        return;
    }
    const city = document.getElementById('city').value;
    const unit = document.getElementById('unitSelect').value;
    if (city) {
        getWeather(city, unit);
        saveSearch(city);
    } else {
        document.getElementById('error').innerHTML = 'Please enter a city';
    }
    setTimeout(() => {
        document.getElementById('error').innerHTML = '';
    }, 2000);
});

document.getElementById('getLocation').addEventListener('click', getUserLocation);

function getWeather(city, unit) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            getForecast(city, unit);
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('User denied the request for Geolocation.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Location information is unavailable.');
                        break;
                    case error.TIMEOUT:
                        alert('The request to get user location timed out.');
                        break;
                    case error.UNKNOWN_ERROR:
                        alert('An unknown error occurred.');
                        break;
                }
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}


function getWeatherByCoordinates(lat, lon) {
    const unit = document.getElementById('unitSelect').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getForecastByCoordinates(lat, lon);
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        });
}

function getForecast(city, unit) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            document.getElementById('forecast').innerHTML = `<p>${error.message}</p>`;
        });
}

function getForecastByCoordinates(lat, lon) {
    const unit = document.getElementById('unitSelect').value;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            document.getElementById('forecast').innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const { name, main, weather, wind, sys } = data;
    const icon = weather[0].icon;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

    weatherDiv.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon" class="${icon.includes('01d') ? 'sun-icon' : ''}">
    `;

    updateBackground(weather[0].description);
}

function updateBackground(weatherCondition) {
    const body = document.body;
    if (weatherCondition.includes('rain')) {
        body.style.backgroundImage = "url('rainy_background.jpg')";
    } else if (weatherCondition.includes('clear')) {
        body.style.backgroundImage = "url('sunny_background.jpg')";
    } else {
        body.style.backgroundImage = "url('default_background.jpg')";
    }
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<h2>5-Day Forecast</h2>`;
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const temp = item.main.temp;
        const condition = item.weather[0].description;
        const icon = item.weather[0].icon;

        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <p>${date.toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                <p>${temp} °C</p>
                <p>${condition}</p>
            </div>
        `;
    });
}

function saveSearch(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    displaySearchHistory();
}

function displaySearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '<h3>Recent Searches:</h3>';
    history.forEach(city => {
        historyDiv.innerHTML += `<button onclick="getWeather('${city}', '${document.getElementById('unitSelect').value}')">${city}</button>`;
    });
}
