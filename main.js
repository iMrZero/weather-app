import {
  forecast_api_key,
  fetchData,
  getCityForeCast,
  getLocation,
  otherCitysForecast,
  chanceOf,
  weekForecast,
  searchForecast,
  switchDay,
  mapContainer,
  map,
  forecast_url,
} from "./functions.js";
// HERE ALL VARABILE WE NEED
// FIRST APP IS MAP API
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
async function main() {
  const userLocation = await getLocation();
  let lat = userLocation.coords.latitude;
  let lon = userLocation.coords.longitude;
  const data = await fetchData(
    `${forecast_url}?key=${forecast_api_key}&q=${lat},${lon}&days=7&aqi=yes`
  );
  //   set location forecast
  const userGeo = document.getElementById("user-location");
  userGeo.textContent = data.location.country + " , " + data.location.name;
  // set zoom in to you location
  map.setView([lat, lon], 3);
  //   bindpop to specific city to get forecast
  getCityForeCast();
  // other citys forecast
  otherCitysForecast("sudan");
  otherCitysForecast("berlin");
  otherCitysForecast("london");
  // get the chance to rain or snow or ...
  chanceOf(data);
  // get weather for the next 7 days
  weekForecast(data);
  // search for specific city forecast
  searchForecast();
  // switch between [today - tomorrow - next 7 days]
  switchDay(data);
  // console.log(data);
}
main();
