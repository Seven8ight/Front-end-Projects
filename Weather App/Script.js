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
const pexelsKey = "0tOAdsHjY29NMWloE9V2YQdbg017o4n2Fm7wHcw0hQ3R8hws2OeqL1lk", visualCrossing = "5CYLFE3XDEKDJR85WMN6NLEPU", pexels = (0, pexels_1.createClient)(pexelsKey), loaderElement = document.querySelector("#loading"), errorElement = document.querySelector("#error"), noAccessElement = document.querySelector("#no-access"), reloadBtn = document.querySelectorAll("#reloadBtn");
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
