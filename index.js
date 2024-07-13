const apiKey = '87c11aed1f8a54b9843b4d73c6951ef5';
document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.onLine) {
        //document.getElementById('error').innerHTML = 'Error loading: Check your internet connection'
         alert('You are currently offline');
        return;
    };
    getUserLocation(); 
    getForecast();
});

document.getElementById('toggleDarkMode').addEventListener('change', (event) => {
    document.body.classList.toggle('dark-mode', event.target.checked);
    document.getElementById('modeLabel').textContent = event.target.checked ? 'Light Mode' : 'Dark Mode';
});

document.getElementById('getWeather').addEventListener('click', () => {
    if (!navigator.onLine) {
        document.getElementById('error').innerHTML = 'You are current offline'
        alert('You are current offline');
        return;
    }
    const city = document.getElementById('city').value;
    const unit = document.getElementById('unitSelect').value;
    if (city) {
        getWeather(city, unit);
        saveSearch(city);
    } else {
         document.getElementById('error').innerHTML = 'Please enter a city'
        // alert("Please enter a city");
    };
    setTimeout(() => {
        document.getElementById('error').innerHTML = '';
    }, 2000);
});

document.getElementById('getLocation').addEventListener('click', getUserLocation);

document.getElementById('toggleDarkMode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

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
            console.log(error);
        });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        }, () => {
            alert('Unable to retrieve your location.');
        });
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

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const { name, main, weather } = data;
    const icon = weather[0].icon;

    weatherDiv.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Condition: ${weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<h2>5-Day Forecast</h2>`;
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const temp = item.main.temp;
        const condition = item.weather[0].description;

        forecastDiv.innerHTML += `
            <div>
                <p>${date.toLocaleDateString()}: ${temp} °C, ${condition}</p>
            </div>
        `;
    });
}

function saveSearch(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}
