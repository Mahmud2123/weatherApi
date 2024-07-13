const apiKey = 'cf657a8801df04ca1ab9d454608dce73';

document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('city').value;
    try {
         if (city != "") {
        getWeather(city);
    } else {
       throw new Error("Please enter a city")
        }
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        document.getElementById('weather').style.color = 'red'
    }
   
  
});

document.getElementById('getLocation').addEventListener('click', () => {
    getUserLocation();
});

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            // if () {
            //     throw new Error('Enter a city');
            // }
            if (!response.ok) {
                throw new Error('City not found');
            }
            console.log(response);
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
            document.getElementById('weather').style.color = 'red';
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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const { name, main, weather } = data;

    weatherDiv.innerHTML = `
        <h2>Weather in ${name}</h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Condition: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}
  
