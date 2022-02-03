"use strict"

//creating map from map box--------------
mapboxgl.accessToken = mapBoxKey;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 3,
    center: [-98.4916, 29.4252]
})

// MARKERS-----------------

//draggable marker
// const coordinates = document.getElementById('coordinates');
let draggableMarker = new mapboxgl.Marker({
    draggable: true
})
    .setLngLat([-98.4916, 29.4252])
    .addTo(map);

function addMarker  (geolat, geolong) {
    // console.log(geolat);
    // console.log(geolong);
    draggableMarker
        .setLngLat([geolat, geolong])
        .addTo(map);
    onDragEnd();
}

function onDragEnd() {
    const lngLat = draggableMarker.getLngLat();
    // console.log(lngLat);
    // coordinates.style.display = 'block';
    // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    let long = lngLat.lng;
    let lat = lngLat.lat;
    // console.log(typeof long);
    $.get(`https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=${lat}&lon=${long}&appid=${weatherMapKey}`)
        .done(function (data) {
            // console.log(data);
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
            console.log(data);
            //setting current weather in popup---------
            let alamoPopup = new mapboxgl.Popup()
                .setHTML(
                    "<div class='popUp'>" +
                    "<h5> Current Weather </h5>" +
                    "<p>" + data.city.name + "</p>" +
                    "<img class=/'weatherIcon/' src='https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png' alt=/'weather Icon/'>" +
                    "<p>" + data.list[0].weather[0].main + "</p>" +
                    "<p>" + Math.round(data.list[0].main.temp) + "°F" + "</p>" +
                    "</div>")

            draggableMarker.setPopup(alamoPopup)

        $(".cardHolder").html("");// clears cards when func runs

        //    iterating through forecast weather data---------
        for (let i = 5; i < data.list.length; i += 8) {
            let dateTime = data.list[i].dt;
            let newDate = new Date(dateTime * 1000).toLocaleDateString("en",{weekday: "long"});
            // console.log(dateTime);
            let temp = Math.round(data.list[i].main.temp);
            let weather = data.list[i].weather[0].description;
            let weatherIcon = data.list[i].weather[0].icon;
            //CREATING CARDS---------------------
            $(".cardHolder").append(
                "<div class=\"fiveDayCard text-center\">" +
                // "<div class=\"card-body\">" +
                "<div class=\"\">" + newDate + "</div>" +
                "<img class=/'weatherIcon/' src='https://openweathermap.org/img/w/" + weatherIcon + ".png' alt=/'weather Icon/'>" +
                "<div class=\"\">" + weather + "</d>" +
                "<div class=\"\">" + temp + "°F" + "</d>" +
                // "</div>" +
                "</div>"
            )
        }

    });
}

// the  geocode method from mapbox-geocoder-utils.js
let goToGeocode = (city) => {
    geocode(city, mapboxgl.accessToken).then(function (result) {
        // console.log(result);
        map.setCenter(result);
        // console.log(result[0], result[1]);
        map.setZoom(7);
        addMarker(result[0], result[1]);
    });
};
//SEARCH BUTTON --------------
$("#searchBtn").on("click",(e) => {

    e.preventDefault();
    let city = $("#searchInput").val();
    goToGeocode(city);
    $("#searchInput").val("");

});
// button events

// $('#geocodeBtn').click(function (e) {
//     goToGeocode();
// })
$('#zoom5').click(function (e) {
    map.flyTo({zoom: 5, center: [lat, long]})
    console.log(lat, long);
});
$('#zoom10').click(function (e) {
    map.flyTo({zoom: 10, center: [lat, long]})
});
$('#zoom15').click(function (e) {
    map.flyTo({zoom: 15, center: [lat, long]})
})

    (fiveDayCall()) // initializes on doc load