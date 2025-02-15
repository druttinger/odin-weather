// const TEMP = 'temperature_2m';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FDenver&forecast_days=1'
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search?count=1&name='
const REVERSE_GEOCODE = 'https://us1.api-bdc.net/data/reverse-geocode-client'

export class WeatherBox {
    constructor(){
        this.setCurrentLocationHere = this.setCurrentLocationHere.bind(this);

        this.setCurrentLocationHere();
        console.log(this.latitude, this.longitude);
        // this.location = prompt('Where are you?');
        this.resetWeather();
    }

    latitude= 0;
    longitude= 0;
    locationName= '';
    weatherData = { };
    
    async setCurrentLocationHere() {
        navigator.geolocation.getCurrentPosition((pos)=> {
            this.latitude = pos.coords.latitude
            this.longitude = pos.coords.longitude
        });
        console.log(this.latitude, this.longitude);
        const reverseGeo = await fetch(REVERSE_GEOCODE + 
            `?latitude=${this.latitude}&longitude=${this.longitude}`);
        const reverseGeoData = await reverseGeo.json();
        this.locationName = reverseGeoData.city + ', ' +
                            reverseGeoData.principalSubdivision + ', ' +
                            reverseGeoData.countryName;
        console.log(reverseGeoData);
        console.log(this.locationName);
    }

    getLocation(){
        return this.locationName;
    }

    async setLocationByName(locationName){
        this.locationName = locationName;
        try{
            const geo = await fetch(GEO_URL + locationName);
            const geoData = await geo.json();
            this.latitude = geoData.results[0].latitude;
            this.longitude = geoData.results[0].longitude;
            console.log(geoData)
            console.log(this.latitude, this.longitude);
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }

    async resetWeather(){
        this.weatherData = await this.loadLatestWeather();
        console.log('resetWeather called.', this.weatherData);
    }

    async loadLatestWeather() {
        try{
            // await this.getCoordinates();
            if (this.locationName !== ''){
                await this.setCurrentLocationHere();
            }
            console.log(this.latitude, this.longitude)
            const rawWeather = await fetch(WEATHER_URL + `&latitude=${this.latitude}&longitude=${this.longitude}`);
            const weatherData = await rawWeather.json();
            return weatherData;
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }

    async getCurrentTemp(){
        try{
            await this.setCurrentLocationHere();
            weatherData = await this.loadLatestWeather();
            console.log("Weather Data", this.weatherData)
            let temp = weatherData.current.temperature_2m;
            console.log(temp)
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }

    async showWeatherData(){
        try{
            console.log(await this.weatherData)
        } catch(error) {
            console.error(`ERROR: ${error}`);
        }
    }
}


