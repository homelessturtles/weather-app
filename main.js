const getData = async (location) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=f67656dd98b7b171ae574d288a972bd1&units=imperial`
  );
  const data = await response.json();

  return data;
};

const getTemp = async (data) => {
  const weather = await data;
  const temp = await weather.main.temp;
  return Math.round(temp);
};

const getDesc = async (data) => {
  const weather = await data;
  const desc = await weather.weather[0].description;
  return desc;
};

const getId = async (data) => {
  const weather = await data;
  const id = await weather.weather[0].id;
  return id;
};

const getTime = async (data) => {
  const utcOffset = await data.timezone;
  const sunriseEpoch = await data.sys.sunrise;
  const sunsetEpoch = await data.sys.sunset;

  const current = new Date(Date.now());
  const utcCurrent = current.getUTCSeconds();

  const utcsec = utcCurrent + utcOffset;
  current.setUTCSeconds(utcsec);
  const time = current.toUTCString();

  const sunriseDate = new Date(sunriseEpoch * 1000);
  const sunriseutcsec = sunriseDate.getUTCSeconds() + utcOffset;
  sunriseDate.setUTCSeconds(sunriseutcsec);
  const sunriseTime = sunriseDate.toUTCString();

  const sunsetDate = new Date(sunsetEpoch * 1000);
  const sunsetutcsec = sunsetDate.getUTCSeconds() + utcOffset;
  sunsetDate.setUTCSeconds(sunsetutcsec);
  const sunsetTime = sunsetDate.toUTCString();

  const isDay = () => {
    if (current > sunriseDate && current < sunsetDate) {
      return true;
    } else {
      return false;
    }
  };

  return { time, sunriseTime, sunsetTime, isDay };
};

const renderDay = () => {
  const moon = document.querySelector(".moon");
  const sun = document.querySelector(".sun");
  const stars = document.querySelector(".stars");
  const dayhills = document.querySelector(".day-hills");
  const nighthills = document.querySelector(".night-hills");
  const nightsky = document.querySelector(".sky-night");
  const daysky = document.querySelector(".sky-day");
  const rainsky = document.querySelector(".sky-rain");

  nighthills.classList.add("hidenighthills");
  dayhills.classList.remove("hidedayhills");
  stars.classList.add("hidestars");
  moon.classList.add("hidemoon");
  sun.classList.remove("hidesun");
  nightsky.classList.add("hidenight");
  daysky.classList.remove("hideday");
  rainsky.classList.add("hideskyrain");
};

const renderNight = () => {
  const moon = document.querySelector(".moon");
  const sun = document.querySelector(".sun");
  const stars = document.querySelector(".stars");
  const dayhills = document.querySelector(".day-hills");
  const nighthills = document.querySelector(".night-hills");
  const nightsky = document.querySelector(".sky-night");
  const daysky = document.querySelector(".sky-day");
  const rainsky = document.querySelector(".sky-rain");

  dayhills.classList.add("hidedayhills");
  nighthills.classList.remove("hidenighthills");
  stars.classList.remove("hidestars");
  moon.classList.remove("hidemoon");
  sun.classList.add("hidesun");
  nightsky.classList.remove("hidenight");
  daysky.classList.add("hideday");
  rainsky.classList.add("hideskyrain");
};

const initWeather = async (search, locationEl, tempEl, descEl) => {
  //check if search is an input or a static string
  const isString = typeof search == "string" ? true : false;
  console.log(isString);
  try {
    let data, location;
    if (isString) {
      location = search;
      data = await getData(search);
    } else {
      location = search.value;
      data = await getData(search.value);
    }
    const temp = await getTemp(data);
    const desc = await getDesc(data);
    const id = await getId(data);
    const timedata = await getTime(data);

    const isday = timedata.isDay();

    tempEl.innerHTML = `${temp}°`;
    descEl.innerHTML = desc;
    locationEl.innerHTML = location;

    if (isday) {
      renderDay();
      renderConditions(id);
    } else {
      renderNight();
      renderConditions(id);
    }

    // debug
    // const time = timedata.time;
    // const sunrise = timedata.sunriseTime;
    // const sunset = timedata.sunsetTime;
    // console.log(temp);
    // console.log(desc);
    // console.log(time);
    // console.log(sunrise);
    // console.log(sunset);
    // console.log(`It is daytime in this city: ${isday}`);

    if (!isString) {
      search.value = "";
    }
  } catch (error) {
    console.log(error);
  }
};

const renderConditions = (id) => {
  const moon = document.querySelector(".moon");
  const sun = document.querySelector(".sun");
  const nightsky = document.querySelector(".sky-night");
  const daysky = document.querySelector(".sky-day");
  const rainsky = document.querySelector(".sky-rain");
  const rain = document.querySelector(".rain");
  const lilclouds = document.querySelector(".lilclouds");
  const vclouds = document.querySelector(".vclouds");
  const snow = document.querySelector(".snow");
  const lightning = document.querySelector(".lightning");

  //thunderstorm
  if (id >= 200 && id <= 232) {
    //hide
    sun.classList.add("hidesun");
    moon.classList.add("hidemoon");
    lilclouds.classList.add("hidelilclouds");
    nightsky.classList.add("hidenightsky");
    daysky.classList.add("hidedaysky");
    snow.classList.add("hidesnow");

    //show
    vclouds.classList.remove("hidevclouds");
    rain.classList.remove("hiderain");
    rainsky.classList.remove("hideskyrain");
    lightning.classList.remove("hidelightning");
  }
  //rain
  if (id >= 300 && id <= 531) {
    //hide
    sun.classList.add("hidesun");
    moon.classList.add("hidemoon");
    lilclouds.classList.add("hidelilclouds");
    nightsky.classList.add("hidenightsky");
    daysky.classList.add("hidedaysky");
    snow.classList.add("hidesnow");
    lightning.classList.add("hidelightning");

    //show
    vclouds.classList.remove("hidevclouds");
    rain.classList.remove("hiderain");
    rainsky.classList.remove("hideskyrain");
  }
  //snow
  if (id >= 600 && id <= 622) {
    //hide
    sun.classList.add("hidesun");
    moon.classList.add("hidemoon");
    lilclouds.classList.add("hidelilclouds");
    nightsky.classList.add("hidenightsky");
    daysky.classList.add("hidedaysky");
    lightning.classList.add("hidelightning");
    rain.classList.add("hiderain");

    //show
    vclouds.classList.remove("hidevclouds");
    snow.classList.remove("hidesnow");
    rainsky.classList.remove("hideskyrain");
  }
  //clear
  if (id === 800) {
    lilclouds.classList.add("hidelilclouds");
    nightsky.classList.add("hidenightsky");
    lightning.classList.add("hidelightning");
    rain.classList.add("hiderain");
    vclouds.classList.add("hidevclouds");
    snow.classList.add("hidesnow");
    rainsky.classList.add("hideskyrain");
  }
  if (id >= 801 && id <= 803) {
    //hide
    lightning.classList.add("hidelightning");
    rain.classList.add("hiderain");
    vclouds.classList.add("hidevclouds");
    snow.classList.add("hidesnow");

    //show
    lilclouds.classList.remove("hidelilclouds");
  }
  //overcast
  if (id === 804) {
    //hide
    lightning.classList.add("hidelightning");
    rain.classList.add("hiderain");
    snow.classList.add("hidesnow");
    lilclouds.classList.add("hidelilclouds");
    nightsky.classList.add("hidenightsky");
    daysky.classList.add("hidedaysky");
    sun.classList.add("hidesun");
    moon.classList.add("hidemoon");

    //show
    vclouds.classList.remove("hidevclouds");
    rainsky.classList.remove("hideskyrain");
  }
};

const weatherApp = (() => {
  const form = document.querySelector("#search-form");
  const search = document.querySelector("#city-search");

  const location = document.querySelector(".city");
  const tempEl = document.querySelector(".temp");
  const descEl = document.querySelector(".desc");
  initWeather("san francisco", location, tempEl, descEl);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    initWeather(search, location, tempEl, descEl);
  });
})();
