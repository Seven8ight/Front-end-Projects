import { createClient } from "pexels";

type geoLocation = {
  coords: {
    latitude: number;
    longitude: number;
  };
};
type Hourconditions = {
  conditions: string;
  hours: string;
  visibility: number;
  sunrise: string;
  sunset: string;
  humidity: number;
  temp: number;
  uvindex: number;
  windspeed: number;
  winddir: number;
  dew: number;
  pressure: number;
  datetime: string;
};
type day = {
  datetime: string;
  visibility: number;
  sunrise: string;
  sunset: string;
  humidity: number;
  temp: number;
  uvindex: number;
  windspeed: number;
  winddir: number;
  dew: number;
  conditions: string;
  pressure: number;
  hours: Hourconditions[];
};
type weather = {
  currentConditions: {
    visibility: number;
    sunrise: string;
    sunset: string;
    humidity: number;
    temp: number;
    uvindex: number;
    windspeed: number;
    winddir: number;
    dew: number;
    conditions: string;
    datetime: string;
    pressure: number;
  };
  days: day[];
  timezone: string;
  description: string;
};
type photos = {
  next_page: string;
  page: number;
  per_page: number;
  photos: photo[];
  total_results: 747;
};
type photo = {
  alt: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    small: string;
    medium: string;
    large: string;
  };
  url: string;
};
type country = {
  country: string;
  city: string;
};

//Fetching Data
const pexelsKey = "private api key here",
  visualCrossing = "private api key here",
  pexels = createClient(pexelsKey),
  loaderElement = document.querySelector<HTMLDivElement>("#loading"),
  errorElement = document.querySelector<HTMLDivElement>("#error"),
  noAccessElement = document.querySelector<HTMLDivElement>("#no-access"),
  reloadBtn = document.querySelectorAll<HTMLButtonElement>("#reloadBtn");

let currentLocation: string,
  currentTimeChoice: string = "week",
  currentUnit: string = "C";

reloadBtn.forEach((element) =>
  element.addEventListener("click", () => window.location.reload())
);

const getPhotos = async (query: string): Promise<any | []> => {
    try {
      return pexels.photos.search({ query: query, per_page: 7 });
    } catch (error) {
      return [];
    }
  },
  weatherFetcher = async (query: string): Promise<any> => {
    try {
      loaderElement?.classList.add("loading");
      currentLocation = query;
      let weather = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${visualCrossing}`
      );
      if (!weather.ok) throw "Invalid request sent";
      return await weather.json();
    } catch (error) {
      errorElement?.classList.add("error");
    } finally {
      setTimeout(() => loaderElement?.classList.remove("loading"), 1000);
    }
  },
  getCountries = async (): Promise<country[] | []> => {
    try {
      let response = await fetch("http://localhost:3100/Countries");
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  countryCaller = async (): Promise<country[]> => {
    let countries = await getCountries();
    return countries;
  },
  dateReturner = (day: number): string => {
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
  },
  cToF = (temp: number): string => ((temp * 9) / 5 + 32).toFixed(2);

//Dom Manipulation
//Side bar Elements
const textDivSideBar = document.querySelector<HTMLElement>(
    "#sidebar #today #brief #text"
  ),
  locationCard = document.querySelector<HTMLElement>("#location-card"),
  weatherIcon = document.querySelector<HTMLImageElement>("#brief img"),
  formContainer = document.querySelector<HTMLFormElement>("form"),
  searchResults: HTMLDivElement = document.createElement("div"),
  searchInput = document.querySelector<HTMLInputElement>("#places"),
  cloudyDiv = document.querySelector<HTMLDivElement>("#cloudy"),
  rainyDiv = document.querySelector<HTMLDivElement>("#rain");

const sideBarHtmlGenerator = async (
    weather: weather,
    photos: photos,
    timeChoice: string,
    unit: string
  ): Promise<void> => {
    console.log(weather);
    if (
      locationCard &&
      textDivSideBar &&
      cloudyDiv &&
      rainyDiv &&
      weatherIcon &&
      weather
    ) {
      currentLocation = weather.timezone.split("/")[1];
      let childrenCard = [
          Array.from(locationCard.children)[0],
          Array.from(locationCard.children)[1],
          Array.from(locationCard.children)[2],
        ],
        texts = [
          Array.from(textDivSideBar.children)[0],
          Array.from(textDivSideBar.children)[1],
        ],
        cloudyChildren = [Array.from(cloudyDiv.children)[1]],
        rainyChildren = [Array.from(rainyDiv.children)[1]],
        date = new Date(),
        random = Math.floor(Math.random() * 7);

      let heading = childrenCard[0] as HTMLHeadElement,
        img = childrenCard[1] as HTMLImageElement,
        creditsDiv = childrenCard[2] as HTMLDivElement,
        anchorElement = Array.from(creditsDiv.children)[0] as HTMLAnchorElement,
        tempP = texts[0] as HTMLParagraphElement,
        dateP = texts[1] as HTMLParagraphElement;

      let pCloudy = cloudyChildren[0] as HTMLParagraphElement,
        pRainy = rainyChildren[0] as HTMLParagraphElement;

      heading.innerHTML = `${
        weather.timezone.split("/")[1].includes("_")
          ? weather.timezone.split("/")[1].replace("_", " ")
          : weather.timezone.split("/")[1]
      }`;
      if (photos) {
        img.src = photos.photos[random].src.original;
        anchorElement.innerHTML = photos.photos[random].photographer;
        anchorElement.href = `${photos.photos[random].photographer_url}`;
      } else {
        return;
      }
      tempP.innerHTML =
        unit == "C"
          ? `${weather.currentConditions.temp}°<sup>c</sup>`
          : `${cToF(weather.currentConditions.temp)}°<sup>f</sup>`;
      dateP.innerHTML = `${dateReturner(
        date.getDay()
      )}, <span>${weather.currentConditions.datetime.substring(0, 5)}</span>`;

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
      else if (
        weather.currentConditions.conditions.includes("Rain") &&
        weather.currentConditions.conditions.includes("Partially")
      )
        weatherIcon.src = "./Icons/RainyClouds.svg";
    }
    dashBoardHtmlGenerator(timeChoice, weather, unit);
  },
  initial = (): void => {
    navigator.geolocation.getCurrentPosition(
      async (position: geoLocation) => {
        let currentWeather: weather = await weatherFetcher(
            position.coords.latitude + "," + position.coords.longitude
          ),
          locationPhotos: photos | any = await getPhotos(
            currentWeather.timezone.split("/")[1]
          );
        currentLocation = currentWeather.timezone.split("/")[1];
        celciusBtn.classList.add("chosen");
        sideBarHtmlGenerator(currentWeather, locationPhotos, "week", "C");
      },
      () => {
        noAccessElement?.classList.add("error");
      }
    );
  },
  locationEventListener = async (event: Event): Promise<void> => {
    event.preventDefault();
    let btn = event.target as HTMLButtonElement;

    sideBarHtmlGenerator(
      await weatherFetcher(btn.innerHTML.split(",")[0]),
      await getPhotos(btn.innerHTML.split(",")[0]),
      currentTimeChoice,
      currentUnit
    );
  };

searchInput &&
  searchInput?.addEventListener(
    "input",
    async (event: Event): Promise<void> => {
      let countries = await countryCaller(),
        inputValue = event.target as HTMLInputElement;

      searchResults.id = "searchResults";

      if (countries) {
        countries.forEach((country) => {
          if (typeof country.city == "string") {
            if (inputValue.value.length != 0) {
              if (country.city.includes(inputValue.value)) {
                const button: HTMLButtonElement =
                  document.createElement("button");
                button.innerHTML = `${country.city}, ${country.country}`;
                button.addEventListener("click", locationEventListener);

                searchResults.appendChild(button);
                formContainer?.appendChild(searchResults);
                searchResults.classList.add("open");
              }
            } else {
              searchResults.classList.remove("open");
              searchResults.innerHTML = "";
            }
          }
        });
      }
    }
  );

//DashBoard
const todayBtn = document.getElementById("todayBtn") as HTMLButtonElement,
  weekBtn = document.getElementById("week") as HTMLButtonElement,
  underliner = document.getElementById("underliner") as HTMLDivElement,
  daysDiv = document.getElementById("days") as HTMLDivElement,
  celciusBtn = document.querySelector("#celcius") as HTMLButtonElement,
  farenheitBtn = document.querySelector("#farenheit") as HTMLButtonElement;

weekBtn.onclick = async () => {
  weekBtn.classList.add("chosen");
  if (todayBtn.classList.contains("chosen"))
    todayBtn.classList.remove("chosen");
  underliner.style.transform = "translateX(126px)";

  const weather: weather = await weatherFetcher(currentLocation);
  currentTimeChoice = "week";
  dashBoardHtmlGenerator("week", weather, currentUnit);
};
todayBtn.onclick = async () => {
  todayBtn.classList.add("chosen");
  if (weekBtn.classList.contains("chosen")) weekBtn.classList.remove("chosen");
  underliner.style.transform = "translateX(27px)";

  const weather: weather = await weatherFetcher(currentLocation);
  currentTimeChoice = "today";
  dashBoardHtmlGenerator("today", weather, currentUnit);
};
celciusBtn.onclick = async () => {
  if (farenheitBtn.classList.contains("chosen"))
    farenheitBtn.classList.remove("chosen");
  celciusBtn.classList.add("chosen");
  const weather: weather = await weatherFetcher(currentLocation),
    photos: photos = await getPhotos(currentLocation);
  currentUnit = "C";
  sideBarHtmlGenerator(weather, photos, currentTimeChoice, "C");
};
farenheitBtn.onclick = async () => {
  if (celciusBtn.classList.contains("chosen"))
    celciusBtn.classList.remove("chosen");
  farenheitBtn.classList.add("chosen");

  const weather: weather = await weatherFetcher(currentLocation),
    photos: photos = await getPhotos(currentLocation);
  currentUnit = "F";
  sideBarHtmlGenerator(weather, photos, currentTimeChoice, "F");
};

const timelineHTMLGenerator = (
    timeChoice: string,
    weather: weather,
    unit: string
  ) => {
    daysDiv.innerHTML = "";
    if (weather) {
      if (timeChoice == "week") {
        weekBtn.classList.add("chosen");
        weather.days.slice(0, 7).forEach((day: day, _: number) => {
          const dayDiv: HTMLDivElement = document.createElement("div"),
            dataDiv: HTMLDivElement = document.createElement("div"),
            dayHeadElement: HTMLHeadElement = document.createElement("h2"),
            weatherIcon = document.createElement("img") as HTMLImageElement,
            tempDiv: HTMLDivElement = document.createElement("div"),
            pTemp: HTMLParagraphElement = document.createElement("p");

          dayHeadElement.innerHTML = `${dateReturner(
            new Date(day.datetime).getDay()
          )}`;

          if (day.conditions == "Clear") weatherIcon.src = "./Icons/Sunny.svg";
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
          else if (
            day.conditions.includes("Rain") &&
            day.conditions.includes("Partially")
          )
            weatherIcon.src = "./Icons/RainyClouds.svg";
          else if (
            day.conditions.includes("Rain") &&
            day.conditions.includes("Overcast")
          )
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
      } else if (timeChoice == "today") {
        todayBtn.classList.add("chosen");
        underliner.style.transform = "translate(27px)";
        let todayHours = weather.days[0].hours;
        todayHours.forEach((hour) => {
          const hourDiv: HTMLDivElement = document.createElement("div"),
            dataDiv: HTMLDivElement = document.createElement("div"),
            hourHeadElement: HTMLHeadElement = document.createElement("h2"),
            weatherIcon = document.createElement("img") as HTMLImageElement,
            tempDiv: HTMLDivElement = document.createElement("div"),
            pTemp: HTMLParagraphElement = document.createElement("p");

          hourHeadElement.innerHTML = `${hour.datetime.substring(0, 5)}`;

          if (hour.conditions == "Clear") weatherIcon.src = "./Icons/Sunny.svg";
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
          else if (
            hour.conditions.includes("Rain") &&
            hour.conditions.includes("Partially")
          )
            weatherIcon.src = "./Icons/RainyClouds.svg";
          else if (
            hour.conditions.includes("Rain") &&
            hour.conditions.includes("Overcast")
          )
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
  },
  highlightsHTMLGenerator = (weather: weather) => {
    const uvStatus = document.querySelector(".uv div p") as HTMLHeadElement,
      windSpeed = document.querySelector(
        ".wind div p:first-of-type"
      ) as HTMLParagraphElement,
      windStrength = document.querySelector(
        ".wind div #strength p"
      ) as HTMLParagraphElement,
      sunriseTime = document.querySelector(
        ".sunsetting #sunrise div p"
      ) as HTMLParagraphElement,
      sunsettingTime = document.querySelector(
        ".sunsetting #sunset div p"
      ) as HTMLParagraphElement,
      humidityValue = document.querySelector(
        ".humidity div p"
      ) as HTMLParagraphElement,
      humidityRange = document.querySelector<HTMLDivElement>(
        ".humidity #RangeContainer #position"
      ) as HTMLDivElement,
      humidityStatus = document.querySelector(
        ".humidity #condition p"
      ) as HTMLParagraphElement,
      visibilityValue = document.querySelector<HTMLParagraphElement>(
        ".visibility div p"
      ) as HTMLParagraphElement,
      visibilityStatus = document.querySelector(
        ".visibility #condition p"
      ) as HTMLParagraphElement,
      pressureQualityRange = document.querySelector(
        ".air-quality #RangeContainer #position"
      ) as HTMLDivElement,
      pressureQualityValue = document.querySelector<HTMLParagraphElement>(
        ".air-quality div p"
      ) as HTMLParagraphElement,
      pressureQualityStatus = document.querySelector(
        ".air-quality #condition p"
      ) as HTMLParagraphElement;

    if (weather) {
      uvStatus.innerHTML = `${weather.currentConditions.uvindex}<span> cd/m<sup>2</sup</span>`;
      windSpeed.innerHTML = `${weather.currentConditions.windspeed} <span>Km/h</span>`;
      windStrength.innerHTML = `${weather.currentConditions.winddir} <span>m/s<span>`;
      sunriseTime.innerHTML = `${weather.currentConditions.sunrise.slice(
        0,
        5
      )} ${
        Number.parseInt(weather.currentConditions.sunrise.slice(0, 2)) >= 12
          ? "Pm"
          : "Am"
      }`;
      sunsettingTime.innerHTML = `${weather.currentConditions.sunset.slice(
        0,
        5
      )} ${
        Number.parseInt(weather.currentConditions.sunset.slice(0, 2)) >= 12
          ? "Pm"
          : "Am"
      }`;
      humidityValue.innerHTML = `${weather.currentConditions.humidity} <span>%</span>`;
      humidityRange.style.bottom = `${
        weather.currentConditions.humidity - 10
      }%`;
      if (weather.currentConditions.humidity < 35)
        humidityStatus.innerHTML = `Unhealthy 👎`;
      else if (weather.currentConditions.humidity < 50)
        humidityStatus.innerHTML = `Normal 👍`;
      else humidityStatus.innerHTML = `Extreme 🥵`;

      visibilityValue.innerHTML = `${weather.currentConditions.visibility} <span>Km</span>`;
      if (weather.currentConditions.visibility < 3)
        visibilityStatus.innerHTML = `Not visible 👎`;
      else if (weather.currentConditions.visibility < 5)
        visibilityStatus.innerHTML = `Normal 👍`;
      else visibilityStatus.innerHTML = `Ultra vision 🥵`;

      pressureQualityValue.innerHTML = `${weather.currentConditions.pressure}`;
      if (weather.currentConditions.pressure < 35)
        pressureQualityStatus.innerHTML = `Unhealthy 👎`;
      else if (weather.currentConditions.pressure < 50)
        pressureQualityStatus.innerHTML = `Normal 👍`;
      else humidityStatus.innerHTML = `Extreme 🥵`;

      pressureQualityRange.style.bottom = `${
        ((weather.currentConditions.pressure - 300) / 1028) * 100
      }%`;
      if (weather.currentConditions.pressure < 1017)
        pressureQualityStatus.innerHTML = `Typically Low`;
      else if (weather.currentConditions.pressure == 1017)
        pressureQualityStatus.innerHTML = `Normal 👍`;
      else pressureQualityStatus.innerHTML = `Typically high`;
    }
  },
  dashBoardHtmlGenerator = (
    timeChoice: string,
    weather: weather,
    unit: string
  ): void => {
    timelineHTMLGenerator(timeChoice, weather, unit);
    highlightsHTMLGenerator(weather);
  };

initial();
