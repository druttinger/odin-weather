const weatherURL = new URL('https://api.open-meteo.com/v1/forecast?current=temperature_2m,precipitation,wind_speed_10m')
const geoURL = new URL('https://geocoding-api.open-meteo.com/v1/search?count=1&name=')
const reverseGeocode = new URL('https://us1.api-bdc.net/data/reverse-geocode-client');

export class WeatherBox {

    latitude= 39;
    longitude= 106;
    locationName= '';
    cityName='';
    weatherData = {};
    tempUnits = 'fahrenheit';
    windUnits = 'mph';

    constructor () {
        this.setTempUnits(this.tempUnits);
        this.setWindUnits(this.windUnits);
    }
    
    setTempUnits = (units) => {
        this.tempUnits = units;
        weatherURL.searchParams.set('temperature_unit', units)
    }
    
    setWindUnits = (units) => {
        this.windUnits = units;
        weatherURL.searchParams.set('wind_speed_unit', units)
    }

    getPosition = () => {
        return new Promise((resolve, reject) => 
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
    }

    setCurrentLocationHere = async () => {
        let pos = await this.getPosition();
        this.latitude = pos.coords.latitude
        this.longitude = pos.coords.longitude
        weatherURL.searchParams.set('latitude', this.latitude);
        weatherURL.searchParams.set('longitude', this.longitude);
        await this.updateLocationName();
    }
    
    updateLocationName = async () => {
        const reverseGeo = await fetch(reverseGeocode + 
            `?latitude=${this.latitude}&longitude=${this.longitude}`);
            const reverseGeoData = await reverseGeo.json();
            this.cityName = reverseGeoData.city;
            this.locationName = reverseGeoData.city + ', ' +
            reverseGeoData.principalSubdivision + ', ' +
            reverseGeoData.countryName;
    }

    getLocation(){
        return this.locationName;
    }

    getCityName(){
        return this.cityName;
    }
    
    setLocationByName = async (locationName) => {
        this.locationName = locationName;
        try{
            const geo = await fetch(geoURL + locationName);
            const geoData = await geo.json();
            this.latitude = geoData.results[0].latitude;
            this.longitude = geoData.results[0].longitude;
            weatherURL.searchParams.set('latitude', this.latitude);
            weatherURL.searchParams.set('longitude', this.longitude);
            await this.updateLocationName();
        } catch(error) {
            alert(`ERROR: ${error}\nCould not find that location.`);
            await this.setCurrentLocationHere();
        }
    }

    loadLatestWeather = async () => {
        try{
            if (this.locationName === ''){
                await this.setCurrentLocationHere();
            }
            const rawWeather = await fetch(weatherURL); 
            const weatherData = await rawWeather.json();
            this.weatherData = weatherData;
            return weatherData;
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }

    async getCurrentTemp(){
        try{
            await this.setCurrentLocationHere();
            weatherData = await this.loadLatestWeather();
            let temp = weatherData.current.temperature_2m;
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }

    async resetWeather(){
        this.weatherData = await this.loadLatestWeather();
    }
}


