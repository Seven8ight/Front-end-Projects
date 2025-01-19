"use strict";
const cookieDiv = document.getElementById("cookie"), acceptBtn = document.getElementById("accept"), rejectBtn = document.getElementById("reject");
let cookie;
let decoder = decodeURIComponent(document.cookie).split("=");
console.log(decoder);
if (decoder.length > 0) {
    if (decoder[1] == "Yes" || decoder[1] == "No")
        cookieDiv === null || cookieDiv === void 0 ? void 0 : cookieDiv.classList.add("notAllowed");
    else
        cookieDiv === null || cookieDiv === void 0 ? void 0 : cookieDiv.classList.add("original");
}
window.onload = () => {
    cookieDiv === null || cookieDiv === void 0 ? void 0 : cookieDiv.classList.add("original");
    cookieDiv === null || cookieDiv === void 0 ? void 0 : cookieDiv.classList.add("open");
};
if (rejectBtn instanceof HTMLButtonElement) {
    rejectBtn.onclick = () => {
        if (cookieDiv instanceof HTMLDivElement)
            cookieDiv.classList.add("close");
        cookie = false;
        document.cookie = `Accepted=${cookie ? "Yes" : "No"}; expires=Sun, 19 Jan 2025 15:19:00 EAT; path=/`;
    };
}
if (acceptBtn instanceof HTMLButtonElement) {
    acceptBtn.onclick = () => {
        if (cookieDiv instanceof HTMLDivElement)
            cookieDiv.classList.add("close");
        cookie = true;
        document.cookie = `Accepted=${cookie ? "Yes" : "No"}; expires=Sun, 19 Jan 2025 15:19:00 EAT; path=/`;
    };
}
