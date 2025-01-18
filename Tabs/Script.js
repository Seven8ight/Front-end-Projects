"use strict";
var _a;
const btn = (_a = document.querySelector("ul")) === null || _a === void 0 ? void 0 : _a.childNodes;
const header = document.getElementById("tabHeader"), header2 = document.getElementById("tabHeader2");
btn === null || btn === void 0 ? void 0 : btn.forEach((btn) => {
    if ((btn === null || btn === void 0 ? void 0 : btn.firstChild) instanceof HTMLButtonElement) {
        btn.addEventListener("click", () => {
            const text = btn.textContent;
            if (header && header2) {
                if (text == "Tab 1") {
                    header.innerHTML = "Tab 1";
                    header2.innerHTML = "Content of Tab 1";
                }
                else if (text == "Tab 2") {
                    header.innerHTML = "Tab 2";
                    header2.innerHTML = "Content of Tab 2";
                }
                else if (text == "Tab 3") {
                    header.innerHTML = "Tab 3";
                    header2.innerHTML = "Content of Tab 3";
                }
                else {
                    header.innerHTML = "Tab 4";
                    header2.innerHTML = "Content of Tab 4";
                }
            }
        });
    }
});
