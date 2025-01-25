const btn = document.querySelectorAll("button");

btn.forEach((button) => {
  button.onclick = () => {
    let parentElement = button.parentElement.parentElement,
      innerDiv = Array.from(parentElement.children).find(
        (element) => element.id == "inner"
      );
    if (innerDiv.classList.contains("open")) innerDiv.classList.remove("open");
    else innerDiv.classList.add("open");

    //Check the others are closed when one is open
    [...document.querySelectorAll("#inner")]
      .filter((element) => element != innerDiv)
      .forEach((element) => {
        if (element.classList.contains("open"))
          element.classList.remove("open");
      });
  };
});
