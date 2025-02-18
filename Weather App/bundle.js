(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pexels_1 = require("pexels");
//Fetching Data
const pexelsKey = "private api key here", visualCrossing = "private api key here", pexels = (0, pexels_1.createClient)(pexelsKey), loaderElement = document.querySelector("#loading"), errorElement = document.querySelector("#error"), noAccessElement = document.querySelector("#no-access"), reloadBtn = document.querySelectorAll("#reloadBtn");
let currentLocation, currentTimeChoice = "week", currentUnit = "C";
reloadBtn.forEach((element) => element.addEventListener("click", () => window.location.reload()));
const getPhotos = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return pexels.photos.search({ query: query, per_page: 7 });
    }
    catch (error) {
        return [];
    }
}), weatherFetcher = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loaderElement === null || loaderElement === void 0 ? void 0 : loaderElement.classList.add("loading");
        currentLocation = query;
        let weather = yield fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${visualCrossing}`);
        if (!weather.ok)
            throw "Invalid request sent";
        return yield weather.json();
    }
    catch (error) {
        errorElement === null || errorElement === void 0 ? void 0 : errorElement.classList.add("error");
    }
    finally {
        setTimeout(() => loaderElement === null || loaderElement === void 0 ? void 0 : loaderElement.classList.remove("loading"), 1000);
    }
}), getCountries = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fetch("http://localhost:3100/Countries");
        if (!response.ok)
            return [];
        return yield response.json();
    }
    catch (error) {
        console.log(error);
        return [];
    }
}), countryCaller = () => __awaiter(void 0, void 0, void 0, function* () {
    let countries = yield getCountries();
    return countries;
}), dateReturner = (day) => {
    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Unknown";
    }
}, cToF = (temp) => ((temp * 9) / 5 + 32).toFixed(2);
//Dom Manipulation
//Side bar Elements
const textDivSideBar = document.querySelector("#sidebar #today #brief #text"), locationCard = document.querySelector("#location-card"), weatherIcon = document.querySelector("#brief img"), formContainer = document.querySelector("form"), searchResults = document.createElement("div"), searchInput = document.querySelector("#places"), cloudyDiv = document.querySelector("#cloudy"), rainyDiv = document.querySelector("#rain");
const sideBarHtmlGenerator = (weather, photos, timeChoice, unit) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(weather);
    if (locationCard &&
        textDivSideBar &&
        cloudyDiv &&
        rainyDiv &&
        weatherIcon &&
        weather) {
        currentLocation = weather.timezone.split("/")[1];
        let childrenCard = [
            Array.from(locationCard.children)[0],
            Array.from(locationCard.children)[1],
            Array.from(locationCard.children)[2],
        ], texts = [
            Array.from(textDivSideBar.children)[0],
            Array.from(textDivSideBar.children)[1],
        ], cloudyChildren = [Array.from(cloudyDiv.children)[1]], rainyChildren = [Array.from(rainyDiv.children)[1]], date = new Date(), random = Math.floor(Math.random() * 7);
        let heading = childrenCard[0], img = childrenCard[1], creditsDiv = childrenCard[2], anchorElement = Array.from(creditsDiv.children)[0], tempP = texts[0], dateP = texts[1];
        let pCloudy = cloudyChildren[0], pRainy = rainyChildren[0];
        heading.innerHTML = `${weather.timezone.split("/")[1].includes("_")
            ? weather.timezone.split("/")[1].replace("_", " ")
            : weather.timezone.split("/")[1]}`;
        if (photos) {
            img.src = photos.photos[random].src.original;
            anchorElement.innerHTML = photos.photos[random].photographer;
            anchorElement.href = `${photos.photos[random].photographer_url}`;
        }
        else {
            return;
        }
        tempP.innerHTML =
            unit == "C"
                ? `${weather.currentConditions.temp}°<sup>c</sup>`
                : `${cToF(weather.currentConditions.temp)}°<sup>f</sup>`;
        dateP.innerHTML = `${dateReturner(date.getDay())}, <span>${weather.currentConditions.datetime.substring(0, 5)}</span>`;
        pCloudy.innerHTML = `${weather.currentConditions.conditions}`;
        pRainy.innerHTML = `${weather.description}`;
        //Clear,Partially Cloudy,Overcast,(Rain, overcast),Snow,Rain,"Snow, rain partially cloudy"
        if (weather.currentConditions.conditions == "Clear")
            weatherIcon.src = "./Icons/Sunny.svg";
        else if (weather.currentConditions.conditions == "Partially cloudy")
            weatherIcon.src = "./Icons/PartialClouds.svg";
        else if (weather.currentConditions.conditions == "Rain")
            weatherIcon.src = "./Icons/Rainy.svg";
        else if (weather.currentConditions.conditions == "Snow")
            weatherIcon.src = "./Icons/Snow.svg";
        else if (weather.currentConditions.conditions == "Overcast")
            weatherIcon.src = "./Icons/Cloudy.svg";
        else if (weather.currentConditions.conditions == "Snow")
            weatherIcon.src = "./Icons/Snow.svg";
        else if (weather.currentConditions.conditions.includes("Rain") &&
            weather.currentConditions.conditions.includes("Partially"))
            weatherIcon.src = "./Icons/RainyClouds.svg";
    }
    dashBoardHtmlGenerator(timeChoice, weather, unit);
}), initial = () => {
    navigator.geolocation.getCurrentPosition((position) => __awaiter(void 0, void 0, void 0, function* () {
        let currentWeather = yield weatherFetcher(position.coords.latitude + "," + position.coords.longitude), locationPhotos = yield getPhotos(currentWeather.timezone.split("/")[1]);
        currentLocation = currentWeather.timezone.split("/")[1];
        celciusBtn.classList.add("chosen");
        sideBarHtmlGenerator(currentWeather, locationPhotos, "week", "C");
    }), () => {
        noAccessElement === null || noAccessElement === void 0 ? void 0 : noAccessElement.classList.add("error");
    });
}, locationEventListener = (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    let btn = event.target;
    sideBarHtmlGenerator(yield weatherFetcher(btn.innerHTML.split(",")[0]), yield getPhotos(btn.innerHTML.split(",")[0]), currentTimeChoice, currentUnit);
});
searchInput &&
    (searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", (event) => __awaiter(void 0, void 0, void 0, function* () {
        let countries = yield countryCaller(), inputValue = event.target;
        searchResults.id = "searchResults";
        if (countries) {
            countries.forEach((country) => {
                if (typeof country.city == "string") {
                    if (inputValue.value.length != 0) {
                        if (country.city.includes(inputValue.value)) {
                            const button = document.createElement("button");
                            button.innerHTML = `${country.city}, ${country.country}`;
                            button.addEventListener("click", locationEventListener);
                            searchResults.appendChild(button);
                            formContainer === null || formContainer === void 0 ? void 0 : formContainer.appendChild(searchResults);
                            searchResults.classList.add("open");
                        }
                    }
                    else {
                        searchResults.classList.remove("open");
                        searchResults.innerHTML = "";
                    }
                }
            });
        }
    })));
//DashBoard
const todayBtn = document.getElementById("todayBtn"), weekBtn = document.getElementById("week"), underliner = document.getElementById("underliner"), daysDiv = document.getElementById("days"), celciusBtn = document.querySelector("#celcius"), farenheitBtn = document.querySelector("#farenheit");
weekBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    weekBtn.classList.add("chosen");
    if (todayBtn.classList.contains("chosen"))
        todayBtn.classList.remove("chosen");
    underliner.style.transform = "translateX(126px)";
    const weather = yield weatherFetcher(currentLocation);
    currentTimeChoice = "week";
    dashBoardHtmlGenerator("week", weather, currentUnit);
});
todayBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    todayBtn.classList.add("chosen");
    if (weekBtn.classList.contains("chosen"))
        weekBtn.classList.remove("chosen");
    underliner.style.transform = "translateX(27px)";
    const weather = yield weatherFetcher(currentLocation);
    currentTimeChoice = "today";
    dashBoardHtmlGenerator("today", weather, currentUnit);
});
celciusBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (farenheitBtn.classList.contains("chosen"))
        farenheitBtn.classList.remove("chosen");
    celciusBtn.classList.add("chosen");
    const weather = yield weatherFetcher(currentLocation), photos = yield getPhotos(currentLocation);
    currentUnit = "C";
    sideBarHtmlGenerator(weather, photos, currentTimeChoice, "C");
});
farenheitBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (celciusBtn.classList.contains("chosen"))
        celciusBtn.classList.remove("chosen");
    farenheitBtn.classList.add("chosen");
    const weather = yield weatherFetcher(currentLocation), photos = yield getPhotos(currentLocation);
    currentUnit = "F";
    sideBarHtmlGenerator(weather, photos, currentTimeChoice, "F");
});
const timelineHTMLGenerator = (timeChoice, weather, unit) => {
    daysDiv.innerHTML = "";
    if (weather) {
        if (timeChoice == "week") {
            weekBtn.classList.add("chosen");
            weather.days.slice(0, 7).forEach((day, _) => {
                const dayDiv = document.createElement("div"), dataDiv = document.createElement("div"), dayHeadElement = document.createElement("h2"), weatherIcon = document.createElement("img"), tempDiv = document.createElement("div"), pTemp = document.createElement("p");
                dayHeadElement.innerHTML = `${dateReturner(new Date(day.datetime).getDay())}`;
                if (day.conditions == "Clear")
                    weatherIcon.src = "./Icons/Sunny.svg";
                else if (day.conditions == "Partially cloudy")
                    weatherIcon.src = "./Icons/PartialClouds.svg";
                else if (day.conditions == "Rain")
                    weatherIcon.src = "./Icons/Rainy.svg";
                else if (day.conditions == "Snow")
                    weatherIcon.src = "./Icons/Snow.svg";
                else if (day.conditions == "Overcast")
                    weatherIcon.src = "./Icons/Cloudy.svg";
                else if (day.conditions == "Snow")
                    weatherIcon.src = "./Icons/Snow.svg";
                else if (day.conditions.includes("Rain") &&
                    day.conditions.includes("Partially"))
                    weatherIcon.src = "./Icons/RainyClouds.svg";
                else if (day.conditions.includes("Rain") &&
                    day.conditions.includes("Overcast"))
                    weatherIcon.src = "./Icons/OvercastRain.svg";
                dayDiv.id = "day";
                dataDiv.id = "data";
                tempDiv.id = "temp";
                pTemp.innerHTML = unit == "C" ? `${day.temp}°` : `${cToF(day.temp)}°`;
                tempDiv.appendChild(pTemp);
                dataDiv.append(dayHeadElement, weatherIcon, tempDiv);
                dayDiv.appendChild(dataDiv);
                daysDiv.appendChild(dayDiv);
            });
        }
        else if (timeChoice == "today") {
            todayBtn.classList.add("chosen");
            underliner.style.transform = "translate(27px)";
            let todayHours = weather.days[0].hours;
            todayHours.forEach((hour) => {
                const hourDiv = document.createElement("div"), dataDiv = document.createElement("div"), hourHeadElement = document.createElement("h2"), weatherIcon = document.createElement("img"), tempDiv = document.createElement("div"), pTemp = document.createElement("p");
                hourHeadElement.innerHTML = `${hour.datetime.substring(0, 5)}`;
                if (hour.conditions == "Clear")
                    weatherIcon.src = "./Icons/Sunny.svg";
                else if (hour.conditions == "Partially cloudy")
                    weatherIcon.src = "./Icons/PartialClouds.svg";
                else if (hour.conditions == "Rain")
                    weatherIcon.src = "./Icons/Rainy.svg";
                else if (hour.conditions == "Snow")
                    weatherIcon.src = "./Icons/Snow.svg";
                else if (hour.conditions == "Overcast")
                    weatherIcon.src = "./Icons/Cloudy.svg";
                else if (hour.conditions == "Snow")
                    weatherIcon.src = "./Icons/Snow.svg";
                else if (hour.conditions.includes("Rain") &&
                    hour.conditions.includes("Partially"))
                    weatherIcon.src = "./Icons/RainyClouds.svg";
                else if (hour.conditions.includes("Rain") &&
                    hour.conditions.includes("Overcast"))
                    weatherIcon.src = "./Icons/OvercastRain.svg";
                hourDiv.id = "hour";
                dataDiv.id = "dataHours";
                tempDiv.id = "tempHours";
                pTemp.innerHTML =
                    unit == "C" ? `${hour.temp}°C` : `${cToF(hour.temp)}°F`;
                tempDiv.appendChild(pTemp);
                dataDiv.append(hourHeadElement, weatherIcon, tempDiv);
                hourDiv.appendChild(dataDiv);
                daysDiv.appendChild(hourDiv);
            });
        }
    }
}, highlightsHTMLGenerator = (weather) => {
    const uvStatus = document.querySelector(".uv div p"), windSpeed = document.querySelector(".wind div p:first-of-type"), windStrength = document.querySelector(".wind div #strength p"), sunriseTime = document.querySelector(".sunsetting #sunrise div p"), sunsettingTime = document.querySelector(".sunsetting #sunset div p"), humidityValue = document.querySelector(".humidity div p"), humidityRange = document.querySelector(".humidity #RangeContainer #position"), humidityStatus = document.querySelector(".humidity #condition p"), visibilityValue = document.querySelector(".visibility div p"), visibilityStatus = document.querySelector(".visibility #condition p"), pressureQualityRange = document.querySelector(".air-quality #RangeContainer #position"), pressureQualityValue = document.querySelector(".air-quality div p"), pressureQualityStatus = document.querySelector(".air-quality #condition p");
    if (weather) {
        uvStatus.innerHTML = `${weather.currentConditions.uvindex}<span> cd/m<sup>2</sup</span>`;
        windSpeed.innerHTML = `${weather.currentConditions.windspeed} <span>Km/h</span>`;
        windStrength.innerHTML = `${weather.currentConditions.winddir} <span>m/s<span>`;
        sunriseTime.innerHTML = `${weather.currentConditions.sunrise.slice(0, 5)} ${Number.parseInt(weather.currentConditions.sunrise.slice(0, 2)) >= 12
            ? "Pm"
            : "Am"}`;
        sunsettingTime.innerHTML = `${weather.currentConditions.sunset.slice(0, 5)} ${Number.parseInt(weather.currentConditions.sunset.slice(0, 2)) >= 12
            ? "Pm"
            : "Am"}`;
        humidityValue.innerHTML = `${weather.currentConditions.humidity} <span>%</span>`;
        humidityRange.style.bottom = `${weather.currentConditions.humidity - 10}%`;
        if (weather.currentConditions.humidity < 35)
            humidityStatus.innerHTML = `Unhealthy 👎`;
        else if (weather.currentConditions.humidity < 50)
            humidityStatus.innerHTML = `Normal 👍`;
        else
            humidityStatus.innerHTML = `Extreme 🥵`;
        visibilityValue.innerHTML = `${weather.currentConditions.visibility} <span>Km</span>`;
        if (weather.currentConditions.visibility < 3)
            visibilityStatus.innerHTML = `Not visible 👎`;
        else if (weather.currentConditions.visibility < 5)
            visibilityStatus.innerHTML = `Normal 👍`;
        else
            visibilityStatus.innerHTML = `Ultra vision 🤩`;
        pressureQualityValue.innerHTML = `${weather.currentConditions.pressure}`;
        if (weather.currentConditions.pressure < 35)
            pressureQualityStatus.innerHTML = `Unhealthy 👎`;
        else if (weather.currentConditions.pressure < 50)
            pressureQualityStatus.innerHTML = `Normal 👍`;
        else
            humidityStatus.innerHTML = `Extreme 🥵`;
        pressureQualityRange.style.bottom = `${((weather.currentConditions.pressure - 300) / 1028) * 100}%`;
        if (weather.currentConditions.pressure < 1017)
            pressureQualityStatus.innerHTML = `Typically Low`;
        else if (weather.currentConditions.pressure == 1017)
            pressureQualityStatus.innerHTML = `Normal 👍`;
        else
            pressureQualityStatus.innerHTML = `Typically high`;
    }
}, dashBoardHtmlGenerator = (timeChoice, weather, unit) => {
    timelineHTMLGenerator(timeChoice, weather, unit);
    highlightsHTMLGenerator(weather);
};
initial();

},{"pexels":3}],2:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":4}],3:[function(require,module,exports){
var t={photo:"https://api.pexels.com/v1/",video:"https://api.pexels.com/videos/",collections:"https://api.pexels.com/v1/collections/"};function r(r,e){var n={method:"GET",headers:{Accept:"application/json","Content-Type":"application/json","User-Agent":"Pexels/JavaScript",Authorization:r}},o=t[e];return function(t,r){return fetch(""+o+t+"?"+function(t){return Object.keys(t).map(function(r){return r+"="+t[r]}).join("&")}(r||{}),n).then(function(t){if(!t.ok)throw new Error(t.statusText);return t.json()})}}function e(t){var e=r(t,"collections");return{all:function(t){return void 0===t&&(t={}),e("",t)},media:function(t){var r=t.id,n=function(t,r){if(null==t)return{};var e,n,o={},i=Object.keys(t);for(n=0;n<i.length;n++)r.indexOf(e=i[n])>=0||(o[e]=t[e]);return o}(t,["id"]);return e(""+r,n)},featured:function(t){return void 0===t&&(t={}),e("featured",t)}}}function n(t){return!(!t||!t.photos)}var o={__proto__:null,isPhotos:n,isVideos:function(t){return!(!t||!t.videos)},isError:function(t){return!!t.error}};function i(t){var e=r(t,"photo");return{search:function(t){return e("/search",t)},curated:function(t){return void 0===t&&(t={}),e("/curated",t)},show:function(t){return e("/photos/"+t.id)},random:function(){try{var t=Math.floor(1e3*Math.random());return Promise.resolve(this.curated({page:t,per_page:1})).then(function(t){return n(t)?t.photos[0]:t})}catch(t){return Promise.reject(t)}}}}function u(t){var e=r(t,"video");return{search:function(t){return e("/search",t)},popular:function(t){return void 0===t&&(t={}),e("/popular",t)},show:function(t){return e("/videos/"+t.id)}}}require("isomorphic-fetch"),exports.createClient=function(t){if(!t||"string"!=typeof t)throw new TypeError("An ApiKey must be provided when initiating the Pexel's client.");return{typeCheckers:o,photos:i(t),videos:u(t),collections:e(t)}};


},{"isomorphic-fetch":2}],4:[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  /* eslint-disable no-prototype-builtins */
  var g =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof self !== 'undefined' && self) ||
    // eslint-disable-next-line no-undef
    (typeof global !== 'undefined' && global) ||
    {};

  var support = {
    searchParams: 'URLSearchParams' in g,
    iterable: 'Symbol' in g && 'iterator' in Symbol,
    blob:
      'FileReader' in g &&
      'Blob' in g &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in g,
    arrayBuffer: 'ArrayBuffer' in g
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
      throw new TypeError('Invalid character in header field name: "' + name + '"')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        if (header.length != 2) {
          throw new TypeError('Headers constructor: expected name/value pair to be length 2, found' + header.length)
        }
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body._noBody) return
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
    var encoding = match ? match[1] : 'utf-8';
    reader.readAsText(blob, encoding);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      /*
        fetch-mock wraps the Response object in an ES6 Proxy to
        provide useful test harness features such as flush. However, on
        ES5 browsers without fetch or Proxy support pollyfills must be used;
        the proxy-pollyfill is unable to proxy an attribute unless it exists
        on the object before the Proxy is created. This change ensures
        Response.bodyUsed exists on the instance, while maintaining the
        semantic of setting Request.bodyUsed in the constructor before
        _initBody is called.
      */
      // eslint-disable-next-line no-self-assign
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._noBody = true;
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);
        if (isConsumed) {
          return isConsumed
        } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else if (support.blob) {
        return this.blob().then(readBlobAsArrayBuffer)
      } else {
        throw new Error('could not read as ArrayBuffer')
      }
    };

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT', 'TRACE'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }

    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal || (function () {
      if ('AbortController' in g) {
        var ctrl = new AbortController();
        return ctrl.signal;
      }
    }());
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);

    if (this.method === 'GET' || this.method === 'HEAD') {
      if (options.cache === 'no-store' || options.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
        }
      }
    }
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
    // https://github.com/github/fetch/issues/748
    // https://github.com/zloirock/core-js/issues/751
    preProcessedHeaders
      .split('\r')
      .map(function(header) {
        return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
      })
      .forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          try {
            headers.append(key, value);
          } catch (error) {
            console.warn('Response ' + error.message);
          }
        }
      });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
    }
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    if (this.status < 200 || this.status > 599) {
      throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].")
    }
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 200, statusText: ''});
    response.ok = false;
    response.status = 0;
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = g.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        // This check if specifically for when a user fetches a file locally from the file system
        // Only if the status is out of a normal range
        if (request.url.indexOf('file://') === 0 && (xhr.status < 200 || xhr.status > 599)) {
          options.status = 200;
        } else {
          options.status = xhr.status;
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };

      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError('Network request failed'));
        }, 0);
      };

      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError('Network request timed out'));
        }, 0);
      };

      xhr.onabort = function() {
        setTimeout(function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        }, 0);
      };

      function fixUrl(url) {
        try {
          return url === '' && g.location.href ? g.location.href : url
        } catch (e) {
          return url
        }
      }

      xhr.open(request.method, fixUrl(request.url), true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr) {
        if (support.blob) {
          xhr.responseType = 'blob';
        } else if (
          support.arrayBuffer
        ) {
          xhr.responseType = 'arraybuffer';
        }
      }

      if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers || (g.Headers && init.headers instanceof g.Headers))) {
        var names = [];
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          names.push(normalizeName(name));
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
        request.headers.forEach(function(value, name) {
          if (names.indexOf(name) === -1) {
            xhr.setRequestHeader(name, value);
          }
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!g.fetch) {
    g.fetch = fetch;
    g.Headers = Headers;
    g.Request = Request;
    g.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
