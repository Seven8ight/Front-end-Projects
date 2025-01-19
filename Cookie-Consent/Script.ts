const cookieDiv: HTMLElement | null = document.getElementById("cookie"),
  acceptBtn: HTMLElement | null = document.getElementById("accept"),
  rejectBtn: HTMLElement | null = document.getElementById("reject");

let cookie: Boolean;

let decoder: string[] = decodeURIComponent(document.cookie).split("=");
console.log(decoder);
if (decoder.length > 0) {
  if (decoder[1] == "Yes" || decoder[1] == "No")
    cookieDiv?.classList.add("notAllowed");
  else cookieDiv?.classList.add("original");
}

window.onload = (): void => {
  cookieDiv?.classList.add("original");
  cookieDiv?.classList.add("open");
};

if (rejectBtn instanceof HTMLButtonElement) {
  rejectBtn.onclick = (): void => {
    if (cookieDiv instanceof HTMLDivElement) cookieDiv.classList.add("close");
    cookie = false;
    document.cookie = `Accepted=${
      cookie ? "Yes" : "No"
    }; expires=Sun, 19 Jan 2025 15:19:00 EAT; path=/`;
  };
}

if (acceptBtn instanceof HTMLButtonElement) {
  acceptBtn.onclick = (): void => {
    if (cookieDiv instanceof HTMLDivElement) cookieDiv.classList.add("close");
    cookie = true;
    document.cookie = `Accepted=${
      cookie ? "Yes" : "No"
    }; expires=Sun, 19 Jan 2025 15:19:00 EAT; path=/`;
  };
}
