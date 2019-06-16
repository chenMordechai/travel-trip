console.log('Main!');

import locService from './services/loc.service.js'
import mapService from './services/map.service.js'
import weatherService from './services/weather.service.js'





// locService.getLocs()
//     .then(locs => console.log('locs', locs))

document.body.onload = () => {
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


document.querySelector('.btn-search').onclick = onSearch

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

document.querySelector('.btn-copy').onclick = copyLocation

function copyLocation() {
    console.log('copy location')
    var lat = locService.currrCoords.lat
    var lng = locService.currrCoords.lng
    console.log(lat, lng)
    var url = `github.io/travelTip/index.html?lat=${lat}&lng=${lng}`

    url.select()
    document.execCommand("copy");
    alert("Copied the text: " + url);
}