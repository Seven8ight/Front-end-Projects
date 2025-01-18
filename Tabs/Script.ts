const btn = document.querySelector("ul")?.childNodes;

const header: HTMLElement | null = document.getElementById("tabHeader"),
  header2: HTMLElement | null = document.getElementById("tabHeader2");

btn?.forEach((btn) => {
  if (btn?.firstChild instanceof HTMLButtonElement) {
    btn.addEventListener("click", () => {
      const text: string | null = btn.textContent;
      if (header && header2) {
        if (text == "Tab 1") {
          header.innerHTML = "Tab 1";
          header2.innerHTML = "Content of Tab 1";
        } else if (text == "Tab 2") {
          header.innerHTML = "Tab 2";
          header2.innerHTML = "Content of Tab 2";
        } else if (text == "Tab 3") {
          header.innerHTML = "Tab 3";
          header2.innerHTML = "Content of Tab 3";
        } else {
          header.innerHTML = "Tab 4";
          header2.innerHTML = "Content of Tab 4";
        }
      }
    });
  }
});
