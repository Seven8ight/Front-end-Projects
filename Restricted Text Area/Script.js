"use strict";
const textarea = document.querySelector("textarea"), parentElement = document.querySelector("#container"), pTag = document.querySelector("#count"), newpTage = document.createElement("p");
newpTage.innerHTML = "Exceeded the character limit";
let count = 0;
console.log(parentElement);
if (textarea && pTag) {
    textarea.addEventListener("input", () => {
        textarea.maxLength = 250;
        count = textarea.value.length;
        if (count >= 250) {
            textarea.classList.add("border", "border-red-500");
            pTag.classList.add("underline", "color-red-500");
            newpTage.classList.add("underline", "text-center", "relative", "left-[35px]");
            parentElement === null || parentElement === void 0 ? void 0 : parentElement.appendChild(newpTage);
        }
        else {
            if (parentElement) {
                if (Array.from(parentElement.children).includes(newpTage))
                    parentElement.removeChild(newpTage);
            }
        }
        pTag.innerHTML = `${count}/250`;
    });
}
