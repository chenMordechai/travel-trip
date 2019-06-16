console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherService from './services/weather.service.js'
import utils from './services/util.service.js'



// locService.getLocs()
//     .then(locs => console.log('locs', locs))

document.body.onload = () => {

    const urlParams = new URLSearchParams(window.location.search)
    console.log('urlParams :', urlParams);
    let pos = {}
    if (urlParams.has('lat') && urlParams.has('lng')) {
        console.log('init with url');
        pos.lat = +urlParams.get('lat')
        pos.lng = +urlParams.get('lng')

    } else {
        pos = locService.getPosition().then((pos) => {
            console.log('init with get pos');
            
        }).catch((err) => {
            console.log('error!');
        });
    }

    mapService.initMap()
        .then(
            locService.getPosition()
            .then(pos => {
                // console.log('User position is:', pos.coords);
                mapService.panTo(pos.coords.latitude, pos.coords.longitude)
                mapService.addMarker({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                locService.currrCoords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
                locService.getCityByCoords(pos.coords.latitude, pos.coords.longitude)
                .then(renderCityName)
                
                weatherService.getWeather(pos.coords.latitude, pos.coords.longitude)
                .then(renderWeather)
            })
            
            
            
            )
            document.querySelector('.btn-search').onclick = onSearch
            document.querySelector('.btn-copy').addEventListener('click', copyLocation)
}

// document.querySelector('.btn1').onclick =  () => {
//     console.log('Thanks!');
// }



document.querySelector('.btn-my-location').addEventListener('click', (ev) => {
    // console.log('my location', ev.target);
    // mapService.panTo( 35.6895,  139.6917);
    locService.getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
            locService.currrCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            locService.getCityByCoords(pos.coords.latitude, pos.coords.longitude)
            .then(renderCityName)
            weatherService.getWeather(pos.coords.latitude, pos.coords.longitude)
            .then(renderWeather)
        })
    })
    
    

function onSearch() {
    var city = document.querySelector('.search').value
    console.log('the city in search', city)
    locService.getCoordsByCity(city)
        .then(coords => {
            console.log('coords in the search', coords.lat, coords.lng)
            mapService.panTo(coords.lat, coords.lng)
            mapService.addMarker({
                lat: coords.lat,
                lng: coords.lng
            });
            locService.currrCoords = {
                lat: coords.lat,
                lng: coords.lng
            }
            renderCityName(city)
            console.log('hear!', coords)
            weatherService.getWeather(coords.lat, coords.lng)
                .then(renderWeather)
        })

}


function renderCityName(cityName) {
    console.log(cityName)
    document.querySelector('.city-name').innerHTML = 'location:' + cityName
}

function renderWeather(weather) {
    console.log(weather)
    var strHtml = `<h2> weather today </h2>

  <img src="img/${weather.icon}.png" alt="">
   <br>
   <span>${weather.name}</span>
   ${weather.description}
   <br>
   ${weather.temp}° temerature from ${weather.tempMin}° to ${weather.tempMax}°
   <br>
   wind ${weather.wind}
   `

    document.querySelector('.weather').innerHTML = strHtml

}


function copyLocation() {
    // console.log(locService.currrCoords)
     
    locService.getPosition()
        .then(pos => {
            console.log(pos)
            const URL = `https://chenmordechai.github.io/travel-trip?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
            return URL
        }).then(URL => {
            utils.copyStringToClipboard(URL)
        })

        // https://chenmordechai.github.io/travel-trip/
}