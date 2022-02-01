"use strict"

// import {mapBoxKey} from "/tokens.js"



mapboxgl.accessToken = mapBoxKey;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 1,
    center: [-98.4916, 29.4252]
});
// the  geocode method from mapbox-geocoder-utils.js
let goToGeocode = () => {
    geocode("600 Navarro St #350, San Antonio, TX 78205", mapboxgl.accessToken).then(function (result) {
        console.log(result);
        map.setCenter(result);
        map.setZoom(18);
    });
};

// button events
$('#geocodeBtn').click(function(e){
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


// markers
var perrysMarker = new mapboxgl.Marker()
    .setLngLat([ -98.610928, 29.593225])
    .addTo(map);

var alamoPopup = new mapboxgl.Popup()
    .setHTML("<p>Fridays lunch 1/2 off the best porkchop!</p>")

perrysMarker.setPopup(alamoPopup)


$.get("http://api.openweathermap.org/data/2.5/weather", {
    APPID: weatherMapKey,
    q:     "San Antonio, US"
}).done(function(data) {
    console.log(data);
});
$.get("http://api.openweathermap.org/data/2.5/forecast", {
    APPID: weatherMapKey,
    lat:    29.423017,
    lon:   -98.48527,
    units: "imperial"
}).done(function(data) {
    console.log('5 day forecast', data.list[5]);
    for (let i = 5; i < data.list.length; i += 8){
        let dateTime = data.list[i].dt_txt;
        let temp = Math.round(data.list[i].main.temp);
        let weather = data.list[i].weather[0].description;
        let date = dateTime.split(" ")
        console.log(date[0]);
        let weatherIcon = data.list[i].weather[0].icon;

        console.log(weather);
        $(".cardHolder").append(
            "<div class=\"fiveDayCard card text-center mx-1\">" +
                "<div class=\"card-body\">" +
                    "<p class=\"card-title\">" + date[0] + "</p>" +
                    "<p class=\"card-text\">" + weather + "</p>" +
                    "<p class=\"card-text\">" + temp + "</p>" +
                "</div>" +
            "</div>",
        )
    }

});
// $.each(data, function (elm, i){
//     console.log(data);