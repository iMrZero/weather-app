export const forecast_api_key = "13e2648bce534122952193155240108";
export const forecast_url = "https://api.weatherapi.com/v1/forecast.json";
export const mapContainer = document.getElementById("map-container");
export const map = L.map(mapContainer).setView([0, 0], 2);
export async function fetchData(url) {
  try {
    const respone = await fetch(url);
    const data = await respone.json();
    return data;
  } catch (error) {
    console.error(`Unable to fetch data from ${url}: ${error}`);
  }
}
export async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
export async function getCityForeCast() {
  let previousMarker;
  map.on("click", async function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    const forecast = await fetchData(
      `${forecast_url}?key=${forecast_api_key}&q=${lat},${lng}`
    );
    // Remove the previous marker if it exists
    if (previousMarker) {
      map.removeLayer(previousMarker);
    }
    const marker = L.marker([
      forecast.location.lat,
      forecast.location.lon,
    ]).addTo(map);
    marker.bindPopup(
      `<h5>${forecast.location.country} , ${forecast.location.name}</h5> 
            <h6>Feel Like ${forecast.current.feelslike_c}</h6>
            <h6>humidity ${forecast.current.humidity}</h6>
            <h6>wind speen ${forecast.current.wind_kph}</h6>`
    );
    previousMarker = marker;
  });
}
export async function otherCitysForecast(param) {
  const data = await fetchData(
    `${forecast_url}?key=${forecast_api_key}&q=${param}`
  );
  const citiesForecast = document.getElementById("cities");
  const divCity = document.createElement("div");
  divCity.classList.add("city");
  if (citiesForecast.childElementCount == 3) {
    citiesForecast.innerHTML = "";
  }
  divCity.innerHTML = `
                <div class="txt">
                  <span>${data.location.country}</span>
                  <h5>${data.location.name}</h5>
                  <span>${data.current.condition.text}</span>
                </div>
                <div class="icon">
                  <img src=${data.current.condition.icon} alt="">
                </div>
    `;
  citiesForecast.appendChild(divCity);
}
export async function chanceOf(param) {
  const chanceOfRain = document.querySelector("#rainy i");
  const chanceOfSunny = document.querySelector("#sunny i");
  const chanceOfSnow = document.querySelector("#snow i");
  chanceOfRain.style.width = `${param.forecast.forecastday[0].day.daily_chance_of_rain}%`;
  chanceOfSnow.style.width = `${param.forecast.forecastday[0].day.daily_chance_of_snow}%`;
  chanceOfSunny.style.width = `${param.current.feelslike_c}%`;
}
export async function weekForecast(param) {
  const airQualityLevels = [
    { id: 1, description: "Good" },
    { id: 2, description: "Moderate" },
    { id: 3, description: "Unhealthy for sensitive group" },
    { id: 4, description: "Unhealthy" },
    { id: 5, description: "Very Unhealthy" },
    { id: 6, description: "Hazardous" },
  ];
  const forecast = param.forecast.forecastday;
  const arrayOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDay = document.querySelector("#week-day");
  if (weekDay.childElementCount == 7) {
    weekDay.innerHTML = "";
  }
  // function of create days div
  function createDaysDiv(dayOfWeek, day) {
    const daysDiv = document.createElement("div");
    daysDiv.classList.add("days");
    daysDiv.innerHTML = `
        <div class="head">
          <span>${dayOfWeek}</span>
        </div>
        <div class="body">
          <img src=${day.day.condition.icon} alt="rain-and-sleet-mix" />
          <span class="degree">${Math.floor(day.day.avgtemp_c)}</span>
        </div>
        <div class="flip-card">
          ${createAirQualityInfo(day.day.air_quality)}
        </div>
      `;
    return daysDiv;
  }
  // function to get air qualtiy
  function createAirQualityInfo(airQuality) {
    return `
        <div class="air-quality">
          <label>co</label>
          <span>${airQuality.co?.toFixed(0) ?? 0}</span>
        </div>
        <div class="air-quality">
          <label>o<sup>3</sup></label>
          <span>${airQuality.o3?.toFixed(0) ?? 0}</span>
        </div>
        <div class="air-quality">
          <label>no<sup>2</sup></label>
          <span>${airQuality.no2?.toFixed(0) ?? 0}</span>
        </div>
        <div class="quality">
          <span>${
            airQuality["us-epa-index"] == null
              ? "normal"
              : airQualityLevels.find(
                  (e) => e.id === airQuality["us-epa-index"]
                )?.description ?? "unknown"
          }</span>
        </div>
      `;
  }
  forecast.forEach((day) => {
    let date = new Date(day.date);
    let dayOfWeek = arrayOfDays[date.getDay()];
    const daysDiv = createDaysDiv(dayOfWeek, day);
    weekDay.appendChild(daysDiv);
  });
}
export async function searchForecast() {
  const searchBtn = document.querySelector("#search-icon");
  searchBtn.addEventListener("click", async () => {
    const cityName = document.querySelector("#city-name").value;
    const data = await fetchData(
      `${forecast_url}?key=${forecast_api_key}&q=${cityName}&days=7&aqi=yes`
    );
    if (cityName == null || cityName == "") return;
    // here will use most of function that already build to change the forecast
    // from our location to
    // the city that we search
    //   set location forecast
    const userGeo = document.getElementById("user-location");
    userGeo.textContent = data.location.country + " , " + data.location.name;
    chanceOf(data);
    weekForecast(data);
  });
}
export async function switchDay(param) {
  const data = await fetchData(
    `${forecast_url}?key=${forecast_api_key}&q=cairo&days=7&aqi=yes`
  );
  const forecastDays = data.forecast.forecastday;
  const arrayOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysDiv = document.querySelector("#week-day .days");
  const daySpan = document.querySelector("#week-day .days .head span");
  forecastDays.forEach((time) => {
    const myDate = new Date(time.date);
    const today = arrayOfDays[myDate.getDay()];
    const tomorrow = new Date(myDate.setDate(myDate.getDate() + 1));
    const tomorrowDay = arrayOfDays[tomorrow.getDay()];
    console.log(tomorrowDay);
    console.log(daySpan);
    document.querySelectorAll(".day-forecast").forEach((element) => {
      element.addEventListener("click", (e) => {
        const active = e.target.classList.contains("active");
        const nextDays = e.target.classList.contains("nextdays");
        const isToday =
          e.target.classList.contains("today") && today === daySpan.textContent;
        const isTomorrow =
          e.target.classList.contains("tomorrow") &&
          tomorrowDay === daySpan.textContent;

        if (active && isToday) {
          daysDiv.style.backgroundColor = "var(--accent-color)";
          daysDiv.nextElementSibling.style.backgroundColor =
            "var(--secondary-color)";
        } else if (active && isTomorrow) {
          daysDiv.style.backgroundColor = "var(--secondary-color)";
          daysDiv.nextElementSibling.style.backgroundColor =
            "var(--accent-color)";
        } else if (active && nextDays) {
          daysDiv.style.backgroundColor = "var(--secondary-color)";
          daysDiv.nextElementSibling.style.backgroundColor =
            "var(--secondary-color)";
        }
      });
    });
  });
}
