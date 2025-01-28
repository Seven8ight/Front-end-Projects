const { DateTime } = require("luxon");

const dateInput = document.getElementById("date"),
  submitBtn = document.getElementById("submit"),
  parentElement = document.getElementById("result"),
  result = document.createElement("p");

const datepicker = require("js-datepicker"),
  picker = datepicker(document.querySelector("#calendar"), {
    onSelect: (instance, date) => {
      console.log(date.getDate());
      console.log(date.getMonth());

      let dateValue =
        (date.getDate() <= 9 ? `0${date.getDate()}` : `${date.getDate}`) +
        "-" +
        (date.getMonth() + 1 <= 9
          ? `0${date.getMonth() + 1}`
          : `${date.getMonth() + 1}`) +
        "-" +
        date.getFullYear();

      if (date) {
        console.log("Date has been entered" + date);
      }

      dateInput.value = dateValue;
    },
  });

result.style.fontFamily = "Oswald";
result.style.fontWeight = "lighter";

submitBtn.onclick = () => {
  let inputValue = dateInput.value;
  console.log(
    String(inputValue).substring(0, 2) +
      " : " +
      String(inputValue).substring(3, 5)
  );
  let dayValue = Number(String(inputValue).substring(0, 2)),
    monthValue = Number(String(inputValue).substring(3, 5)),
    yearValue = Number(String(inputValue).substring(6, 10));

  if (dayValue && monthValue && yearValue) {
    if (dayValue > 0 && monthValue > 0) {
      let fullBirthDate = DateTime.fromFormat(inputValue, "dd-mm-yyyy");
      let currentDate = DateTime.now(),
        currentAge = currentDate.diff(fullBirthDate, [
          "years",
          "months",
          "days",
        ]);

      result.innerHTML =
        `You are ${currentAge.years}` +
        `${currentAge.years == 1 ? " year" : " years"}` +
        ` and ${currentAge.months}` +
        `${currentAge.months == 1 ? " month" : " months"} old`;
    } else {
      result.innerHTML =
        "The values for months and days must be greater than 0";
    }
  } else {
    result.innerHTML = "Invalid input entered, please input accordingly.";
  }
  parentElement.append(result);
};
