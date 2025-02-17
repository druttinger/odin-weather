import { WeatherBox } from "./weather";

let wb = new WeatherBox();

const cityField = document.getElementById('city');

const setLocationButton = document.getElementById('set-location');
setLocationButton.addEventListener('click', async () => {
    locationViewer.innerText = 'Loading...';
    weatherViewer.innerText = '';
    await wb.setLocationByName(cityField.value);
    refresh();
});

document.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter'){
        locationViewer.innerText = 'Loading...';
        weatherViewer.innerText = '';
        await wb.setLocationByName(cityField.value);
        refresh();
    }
});

const currentButton = document.getElementById('current-location');
currentButton.addEventListener('click', async () => {
    locationViewer.innerText = 'Loading...';
    weatherViewer.innerText = '';
    await wb.setCurrentLocationHere();
    refresh();
});

const info = document.getElementById('info');
const locationViewer = document.getElementById('locationView');
const weatherViewer = document.getElementById('weatherView');

const unitSelector = document.getElementById('unit-selector');
unitSelector.addEventListener('click', (event)=> {
    let elem = event.target;
    if (elem.getAttribute('name') === 'temp-unit'){
        wb.setTempUnits(elem.getAttribute('value'))
        refresh();
    } else if (elem.getAttribute('name') === 'wind-unit'){
        wb.setWindUnits(elem.getAttribute('value'))
        refresh();
    }
})


async function refresh(){
    await wb.loadLatestWeather();
    cityField.value = wb.getCityName();
    locationViewer.innerText = ('Weather for ' + wb.getLocation() + 
        ' at latitude ' + wb.latitude + ', longitude ' + wb.longitude);
    let temp = wb.weatherData.current.temperature_2m;
    let precipitation = wb.weatherData.current.precipitation;
    let windSpeed = wb.weatherData.current.wind_speed_10m;

    weatherViewer.innerText = 'It is currently ' + 
                                temp +
                                ' degrees ' + wb.tempUnits + ' with ' +
                                (precipitation ? 
                                 precipitation + 'mm of':
                                 'no') +
                                ' precipitation. The wind speed is ' +
                                windSpeed + wb.windUnits +'.';

    if (temp < 37){
        info.className = 'snowy'
    } else if (precipitation > 0){
        info.className = 'rainy'
    } else {
        info.className = 'sunny'
    }
}

refresh();
