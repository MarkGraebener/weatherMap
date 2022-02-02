"use strict"

// import {mapBoxKey} from "/tokens.js"


//creating map from map box--------------
mapboxgl.accessToken = mapBoxKey;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 1,
    center: [-98.4916, 29.4252]
})

// the  geocode method from mapbox-geocoder-utils.js
let goToGeocode = () => {
    geocode("600 Navarro St #350, San Antonio, TX 78205", mapboxgl.accessToken).then(function (result) {
        // console.log(result);
        map.setCenter(result);
        console.log(result);
        map.setZoom(18);
    });
};
// console.log(map.get);


// MARKERS-----------------

//draggable marker
const coordinates = document.getElementById('coordinates');
const draggableMarker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([-98.4916, 29.4252])
    .addTo(map);

function onDragEnd() {
    const lngLat = draggableMarker.getLngLat();
    // console.log(lngLat);
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    let long = lngLat.lng;
    let lat = lngLat.lat;
    // console.log(typeof long);
    $.get(`https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${long}&appid=${weatherMapKey}`)
        .done(function (data) {
            console.log(data);
            fiveDayCall();
        })
}

draggableMarker.on('dragend', onDragEnd);

// var perrysMarker = new mapboxgl.Marker()
//     .setLngLat([ -98.610928, 29.593225])
//     .addTo(map);
//
// var alamoPopup = new mapboxgl.Popup()
//     .setHTML("<p>Fridays lunch 1/2 off the best porkchop!</p>")
//
// perrysMarker.setPopup(alamoPopup)

//getting current weather data-------------
$.get("https://api.openweathermap.org/data/2.5/weather", {
    APPID: weatherMapKey,
    q: "San Antonio, US"
}).done(function (data) {
    // console.log(data);
});
//adding geocode search--------------
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapBoxKey,
//         mapboxgl: mapboxgl
//     })
// );
//getting 5 day forecast data------------

let fiveDayCall = () => {
    const lngLat = draggableMarker.getLngLat();
    // console.log(funLat, funLong);
    $.get("https://api.openweathermap.org/data/2.5/forecast", {
        APPID: weatherMapKey,
        lat: lngLat.lat,
        lon: lngLat.lng,
        units: "imperial"
    })
        //setting 5 day forecast in cards
        .done(function (data) {
        $(".cardHolder").html("");// clears cards when func runs
        for (let i = 5; i < data.list.length; i += 8) {
            let dateTime = data.list[i].dt;
            let newDate = new Date(dateTime * 1000).toLocaleDateString("en",{weekday: "long"});
            // let date = dateTime.split(" ")
            // console.log(dateTime);
            let temp = Math.round(data.list[i].main.temp);
            let weather = data.list[i].weather[0].description;

            // console.log(newDate);
            let weatherIcon = data.list[i].weather[0].icon;

            // console.log(weather);

            $(".cardHolder").append(
                "<div class=\"fiveDayCard card text-center mx-4 col\">" +
                "<div class=\"card-body\">" +
                "<p class=\"card-title\">" + newDate + "</p>" +
                "<img class=/'weatherIcon/' src='https://openweathermap.org/img/w/" + weatherIcon + ".png' alt=/'weather Icon/'>" +
                "<p class=\"card-text\">" + weather + "</p>" +
                "<p class=\"card-text\">" + temp + "°F" + "</p>" +
                "</div>" +
                "</div>"
            )
        }

    });
}

// button events
$('#geocodeBtn').click(function (e) {
    goToGeocode();
})
$('#zoom5').click(function (e) {
    map.flyTo({zoom: 5})
});
$('#zoom10').click(function (e) {
    map.flyTo({zoom: 10})
});
$('#zoom15').click(function (e) {
    map.flyTo({zoom: 15});
})

    (fiveDayCall()) // initializes on doc load