"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const modal = document.querySelector("#modal"), modalElementIds = ["modal", "subbreddit", "search", "text"], openModalBtn = document.querySelector("#modalOpener"), containerDiv = document.querySelector("#container"), noRedditInfo = document.querySelector("#no-reddits"), inputReddit = document.querySelector("#subbreddit"), searchRedditBtn = document.querySelector("#search"), addMoreDiv = document.querySelector("#addMore"), addMoreBtn = addMoreDiv.children[0], loaderElement = document.querySelector("#loading"), errorElement = document.querySelector("#error"), duplicateDiv = document.querySelector("#alreadyPresent"), reloadButton = (document.querySelector("#reload").onclick = () => window.location.reload()), reddits = [];
const modalHandler = (status) => {
    if (status) {
        modal.classList.add("open");
        containerDiv.classList.add("blur");
    }
    else {
        modal.classList.remove("open");
        containerDiv.classList.remove("blur");
    }
};
//Modal Events
openModalBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    modalHandler(true);
});
document.addEventListener("click", (event) => {
    if (modal.classList.contains("open")) {
        let element = event.target;
        if (!modalElementIds.includes(element.id)) {
            modalHandler(false);
        }
    }
});
//Fetching
const redditClient = (subreddit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loaderElement.classList.add("open");
        modalHandler(false);
        containerDiv.classList.add("blur");
        noRedditInfo.classList.add("close");
        let response = yield fetch(`https://www.reddit.com/r/${subreddit}.json`);
        if (!response.ok) {
            modalHandler(false);
            noRedditInfo.classList.add("close");
            errorElement.classList.add("open");
        }
        return yield response.json();
    }
    catch (error) {
        errorElement.classList.add("open");
        noRedditInfo.classList.add("close");
        modalHandler(false);
        throw error;
    }
    finally {
        modalHandler(false);
        loaderElement.classList.remove("open");
    }
});
const caller = (subreddit) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield redditClient(subreddit);
    let returnValue = [];
    console.log(results);
    results === null || results === void 0 ? void 0 : results.data.children.forEach((element) => {
        let obj = {
            subreddit_name_prefixed: element.data.subreddit_name_prefixed,
            author: element.data.author,
            title: element.data.title,
            score: element.data.score,
            url: element.data.url,
        };
        returnValue.push(obj);
    });
    return returnValue;
});
const htmlGenerator = (redditHeader, response) => {
    reddits.push(redditHeader);
    if (response) {
        //Set inside cookie
        document.cookie = `reddits=${reddits};expires=${new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toUTCString()};path=/`;
        noRedditInfo.classList.add("close");
        modalHandler(false);
        addMoreDiv.classList.add("open");
        const redditGroup = document.createElement("div"), redditGroupHeader = document.createElement("h1"), optionsElement = document.createElement("button");
        redditGroup.id = `reddit_${redditHeader}`;
        redditGroupHeader.innerHTML = `r/${redditHeader}`;
        optionsElement.innerHTML = `
      <i class="fa-solid fa-ellipsis-vertical"></i>
      <div id='tabs'>
        <button id='refresh'>Refresh</button>
        <button id='delete'>Delete</button>
      </div>
    `;
        optionsElement.addEventListener("click", () => {
            let tabsDiv = optionsElement.children[1];
            if (tabsDiv.classList.contains("open"))
                tabsDiv.classList.remove("open");
            else
                tabsDiv.classList.add("open");
        });
        optionsElement.id = "options";
        redditGroup.append(redditGroupHeader, optionsElement);
        response.forEach((post) => {
            const redditContainerDiv = document.createElement("div"), titleTag = document.createElement("h2"), authorTag = document.createElement("p"), scoreTag = document.createElement("p"), urlTag = document.createElement("p");
            titleTag.innerHTML = `${post.title}`;
            authorTag.innerHTML = `Author: <u>${post.author}</u>`;
            scoreTag.innerHTML = `Score: ${post.score}`;
            urlTag.innerHTML = `Url: <a href=${post.url} target="_blank">Post on reddit</a>`;
            redditContainerDiv.append(titleTag, authorTag, scoreTag, urlTag);
            redditGroup.appendChild(redditContainerDiv);
        });
        containerDiv.appendChild(redditGroup);
    }
};
const cookieChecker = () => __awaiter(void 0, void 0, void 0, function* () {
    let redditsAvailable = decodeURIComponent(document.cookie).length > 0
        ? decodeURIComponent(document.cookie).split("=")[0].split(",")
        : [];
    console.log(redditsAvailable);
    if (redditsAvailable.length > 0) {
        console.log("They are present");
        redditsAvailable.forEach((reddit) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let response = yield caller(reddit);
                if (response) {
                    htmlGenerator(reddit, response);
                }
            }
            catch (error) {
                console.error(error);
            }
        }));
    }
    else {
        console.log("They are empty");
    }
});
cookieChecker();
addMoreBtn.onclick = (event) => {
    event.stopPropagation();
    modalHandler(true);
};
//Search Up reddit
searchRedditBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    let inputValue = inputReddit.value.length > 0 ? inputReddit.value.toLowerCase() : "", duplicateFinder = false;
    Array.from(containerDiv.children).forEach((element) => {
        if (/^reddit_.+/.test(element.id)) {
            let reddit = element.id.split("_")[1];
            if (reddit == inputValue) {
                duplicateFinder = true;
            }
        }
    });
    if (!duplicateFinder) {
        let results = yield caller(inputValue);
        if (results) {
            htmlGenerator(inputValue, results);
        }
    }
    else {
        modalHandler(false);
        duplicateDiv.classList.add("open");
        setTimeout(() => {
            duplicateDiv.classList.remove("open");
        }, 2000);
    }
    inputReddit.value = "";
}));
