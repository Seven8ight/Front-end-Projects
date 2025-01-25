const dropdown = document.querySelector("#container ul"),
  droptagController = document.querySelector("#dropdown span"),
  arrow = document.getElementById("arrow");

droptagController.addEventListener("click", () => {
  if (dropdown.classList.contains("open")) {
    dropdown.classList.remove("open");
    arrow.style.transform = "rotateX(180deg)";
  } else {
    dropdown.classList.add("open");
    arrow.style.transform = "rotateX(0deg)";
  }
});
