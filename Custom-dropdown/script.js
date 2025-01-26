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

//Drop down 2
const parentP = document.querySelector("#actual-dropdown p"),
  options = document.getElementById("options"),
  btns = document.querySelectorAll("#options button");

let open = false;

parentP.addEventListener("click", () => {
  if (!open) {
    options.classList.add("drop");
    open = true;
  } else {
    options.classList.remove("drop");
    open = false;
  }
});

Array.from(btns).forEach((button) => {
  button.addEventListener("click", () => {
    let currentBtn = button;
    let text = button.innerHTML;
    parentP.innerText = `${text}`;
    if (options.classList.contains("drop")) options.classList.remove("drop");
    button.style.textDecoration = "underline";

    [...document.querySelectorAll("#options button")]
      .filter((buttons) => buttons != currentBtn)
      .forEach((btn) => {
        if (btn.style.textDecoration == "underline")
          btn.style.textDecoration = "none";
      });
  });
});

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const name = document.getElementById("name"),
    email = document.getElementById("email");

  alert(`
    Submitted the details successfuly,
    Name: ${name.value ? name.value : "No name entered"}
    Email: ${email.value ? email.value : "No email entered"}
    Occupation: ${
      parentP.innerHTML != "Select a role"
        ? parentP.innerHTML
        : "No role specified"
    }
  `);

  name.value = "";
  email.value = "";
  parentP.innerHTML = "Select an option";

  Array.from(document.querySelectorAll("#options button")).forEach((button) => {
    if (button.style.textDecoration == "underline")
      button.style.textDecoration = "none";
  });
});
