"use strict";
const submitBtn = document.getElementById("submit"), tempInputValue = document.getElementById("input"), initialUnit = document.querySelector("#initial"), conversion = document.querySelector("#conversion"), resultsTag = document.querySelector("#results");
setInterval(() => {
    if (tempInputValue.value.length > 0 &&
        initialUnit.options[initialUnit.selectedIndex].value != "default" &&
        conversion.options[conversion.selectedIndex].value != "default") {
        submitBtn.disabled = false;
    }
    else {
        submitBtn.disabled = true;
    }
}, 500);
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const tempValue = Number.parseFloat(tempInputValue.value);
    resultsTag.style.color = "black";
    let initialUnitValue = initialUnit.options[initialUnit.selectedIndex].value, conversionUnitValue = conversion.options[conversion.selectedIndex].value, cToF = (temp) => ((temp * 9) / 5 + 32).toFixed(2), fToC = (temp) => (((temp - 32) * 5) / 9).toFixed(2), cToK = (temp) => (temp + 273.15).toFixed(2), kToC = (temp) => (temp - 273.15).toFixed(2), fToK = (temp) => (Number.parseFloat(fToC(temp)) + 273.15).toFixed(2), KtoF = (temp) => ((Number.parseFloat(kToC(temp)) * 9) / 5 + 32).toFixed(2);
    if (tempValue) {
        switch (conversionUnitValue) {
            case "F":
                if (initialUnitValue == "F") {
                    resultsTag.innerHTML = `${tempValue} in Farenheit remains ${tempValue}F`;
                    break;
                }
                else if (initialUnitValue == "C") {
                    resultsTag.innerHTML = `${tempValue} in Celcius to Farenheit becomes ${cToF(tempValue)}F`;
                    break;
                }
                else {
                    resultsTag.innerHTML = `${tempValue} in Kelvin to Farenheit becomes ${KtoF(tempValue)}F`;
                    break;
                }
            case "C":
                if (initialUnitValue == "C") {
                    resultsTag.innerHTML = `${tempValue} in Celcius remains ${tempValue}C`;
                    break;
                }
                else if (initialUnitValue == "F") {
                    resultsTag.innerHTML = `${tempValue} in Farenheit to Celcius becomes ${fToC(tempValue)}C`;
                    break;
                }
                else {
                    resultsTag.innerHTML = `${tempValue} in Kelvin to Celcius becomes ${kToC(tempValue)}C`;
                    break;
                }
            case "K":
                if (initialUnitValue == "K") {
                    resultsTag.innerHTML = `${tempValue} in Kelvin remains ${tempValue}K`;
                    break;
                }
                else if (initialUnitValue == "C") {
                    resultsTag.innerHTML = `${tempValue} in Celcius to Kelvin becomes ${cToK(tempValue)}K`;
                    break;
                }
                else {
                    resultsTag.innerHTML = `${tempValue} in Farenheit to Kelvin becomes ${fToK(tempValue)}K`;
                    break;
                }
            default:
                resultsTag.innerHTML = `Invalid units used please try again with selected values and inputted number`;
                break;
        }
    }
    else {
        resultsTag.style.color = "red";
        resultsTag.innerHTML = `Please enter a number`;
    }
});
