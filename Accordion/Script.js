const btn = document.querySelectorAll("button");

btn.forEach((button) => {
  button.onclick = () => {
    button.classList.add("rotate");
    let parentElement = button.parentElement.parentElement,
      innerDiv = Array.from(parentElement.children).find(
        (element) => element.id == "inner"
      );
    if (innerDiv.classList.contains("open")) {
      innerDiv.classList.remove("open");
      button.classList.remove("rotate");
    } else {
      innerDiv.classList.add("open");
      button.classList.add("rotate");
    }

    //Check the others are closed when one is open
    [...document.querySelectorAll("#inner")]
      .filter((element) => element != innerDiv)
      .forEach((element) => {
        let childBtn = Array.from(element.parentElement.children).find(
          (element) => element instanceof HTMLSpanElement
        ).children;

        if (element.classList.contains("open")) {
          element.classList.remove("open");
          childBtn[0].classList.remove("rotate");
        }
      });
  };
});
