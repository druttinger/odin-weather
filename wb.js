import { WeatherBox } from "./weather";

let wb = new WeatherBox();

const currentButton = document.getElementById('current-location');
currentButton.addEventListener('click', wb.setCurrentLocationHere, wb);

const setLocationButton = document.getElementById('set-location');
setLocationButton.addEventListener('click', () => {
    wb.setLocationByName(prompt('Name a location'));
});



const locationViewer = document.getElementById('locationView');
const weatherViewer = document.getElementById('weatherView');

wb.resetWeather();

function refresh(){
    // console.log("calling refresh()")
    // console.log(wb.locationName);
    locationViewer.innerText = ('Weather for ' + wb.getLocation() + 
        ' at latitude ' + wb.latitude + ', longitude ' + wb.longitude);
    
    weatherViewer.innerText = 'It is currently ' + 
                                wb.weatherData.current.temperature_2m +
                                'degrees farenheit with ' +
                                wb.weatherData.current.precipitation_sum +
                                'mm of precipitation.';
}

const refreshButton = document.getElementById('refresh');
refreshButton.addEventListener('click', refresh);

//refresh();


// wb.showWeatherData();
// wb.getCurrentTemp();
// wb.resetWeather();
// wb.showWeatherData();
