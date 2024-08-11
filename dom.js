// dark mod toggle the active
const themeSwitchers = document.querySelectorAll(".theme-switcher");

themeSwitchers.forEach((switcher) => {
  switcher.addEventListener("click", () => {
    themeSwitchers.forEach((s) => s.classList.remove("active"));
    switcher.classList.add("active");
  });
  // dark | light mod trigger on
  switcher.addEventListener("click", (e) => {
    const active = e.target.classList.contains("active");
    const dark = e.target.classList.contains("dark");
    const light = e.target.classList.contains("light");
    if (active && dark) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    }
    if (active && light) {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  });
});
// switch between forecast and air quality
const switchWeather = document.querySelectorAll(".switch-weather");
switchWeather.forEach((els) => {
  els.addEventListener("click", () => {
    switchWeather.forEach((e) => e.classList.remove("active"));
    els.classList.add("active");
  });
  els.addEventListener("click", (e) => {
    const active = e.target.classList.contains("active");
    const air = e.target.classList.contains("air");
    const forecast = e.target.classList.contains("forecast");
    const airQuality = document.querySelectorAll("#week-day .days .flip-card");
    if (active && air) {
      airQuality.forEach((element) => {
        element.style.transform = "translateY(0)";
      });
    }
    if (active && forecast) {
      airQuality.forEach((element) => {
        element.style.transform = "translateY(160px)";
      });
    }
  });
});
// move between the [day - tomorrow - 7 days] forecast
const dayForecastBar = document.querySelectorAll(".day-forecast");
dayForecastBar.forEach((element) => {
  element.style.userSelect = "none";
  element.addEventListener("click", () => {
    dayForecastBar.forEach((e) => e.classList.remove("active"));
    element.classList.add("active");
  });
});
// get the days to determin which day we on it
const forecastDays = document.querySelectorAll(".days .head span");
const arrayOfDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let nowDate = new Date();
let weekDays = arrayOfDays[nowDate.getDay()]; // we will use it later
forecastDays.forEach((element, index) => {
  element.textContent = arrayOfDays[index];
});
// test hover in card
