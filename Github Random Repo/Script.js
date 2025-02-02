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
//Fetching data
const languageSelection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fetch("https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json");
        if (!response.ok) {
            throw new Error("Error in url fetching");
        }
        return yield response.json();
    }
    catch (error) {
        throw error;
    }
});
//Fetching a promise that resolves whenever the data has been retrieved otherwise rejects if only there is a network failure otherwise, if the url is wrong the response.ok is an error and an error can be popped up
const repoRetriever = (language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fetch(`https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`);
        if (!response.ok) {
            throw new Error("Github error in fetching, incorrect url, Status Code: " +
                response.status +
                " : " +
                response.text);
        }
        return yield response.json();
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
//The displayed information should include the repository name, description, number of stars, forks, and open issues
//items.description
//.name,.forks,.html_url,.stargazers_count
const eventListener = (language) => __awaiter(void 0, void 0, void 0, function* () {
    emptyTag === null || emptyTag === void 0 ? void 0 : emptyTag.classList.add("close");
    if (repositoryDiv) {
        repositoryDiv.innerHTML = "";
    }
    try {
        if (errorContainer === null || errorContainer === void 0 ? void 0 : errorContainer.classList.contains("open"))
            errorContainer.classList.remove("open");
        loaderDiv === null || loaderDiv === void 0 ? void 0 : loaderDiv.classList.add("open");
        let repoList = yield repoRetriever(language.value), randomEnd = Math.random() * repoList.items.length, repos = repoList.items.slice(randomEnd - 3, randomEnd);
        repos.forEach((repo) => {
            const repoContainer = document.createElement("div"), infoDiv = document.createElement("div"), nameHeader = document.createElement("h1"), desc = document.createElement("p"), forks = document.createElement("p"), url = document.createElement("p"), stars = document.createElement("p");
            nameHeader.innerHTML = `${repo.name == null ? "No name provided" : repo.name}`;
            desc.innerHTML = `${repo.description == null ? "No description provided" : repo.description}`;
            forks.innerHTML = `Number of forks: <u>${repo.forks}</u>`;
            stars.innerHTML = `Stars: <u>${repo.stargazers_count}</u>`;
            url.innerHTML = `Repo Url: <a target="_blank" href=${repo.html_url}>${repo.html_url}</a>`;
            infoDiv.append(forks, stars, url);
            repoContainer.append(nameHeader, desc, infoDiv);
            repositoryDiv === null || repositoryDiv === void 0 ? void 0 : repositoryDiv.appendChild(repoContainer);
        });
    }
    catch (error) {
        console.error("Error fetching repositories:", error);
        errorContainer === null || errorContainer === void 0 ? void 0 : errorContainer.classList.add("open");
    }
    finally {
        loaderDiv === null || loaderDiv === void 0 ? void 0 : loaderDiv.classList.remove("open");
    }
});
//Dom Manipulation
const languagesDiv = document.querySelector("#languages"), searchInput = document.querySelector("#searchInput"), languageContainer = document.querySelector("#container"), errorContainer = document.querySelector("#error"), repositoryDiv = document.querySelector("#repositories"), loaderDiv = document.querySelector("#loader"), emptyTag = document.querySelector("#emptyList");
if (repositoryDiv) {
    if (repositoryDiv.innerHTML.length == 0)
        emptyTag === null || emptyTag === void 0 ? void 0 : emptyTag.classList.remove("close");
}
const initialList = () => {
    languageSelection().then((data) => {
        data.forEach((language) => {
            if (language.value != "") {
                const button = document.createElement("button");
                button.innerHTML = `${language.value}`;
                button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () { return eventListener(language); }));
                languagesDiv === null || languagesDiv === void 0 ? void 0 : languagesDiv.appendChild(button);
            }
        });
    });
};
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", () => {
    console.log("Inputted");
    if (languagesDiv) {
        languagesDiv.innerHTML = "";
    }
    languageSelection().then((data) => {
        data.forEach((language) => {
            const button = document.createElement("button");
            if (language.value != "") {
                if (language.value.toLowerCase().includes(searchInput.value.toLowerCase())) {
                    button.innerHTML = `${language.value}`;
                    button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () { return eventListener(language); }));
                    languagesDiv === null || languagesDiv === void 0 ? void 0 : languagesDiv.appendChild(button);
                }
            }
            else {
                initialList();
            }
        });
    });
});
initialList();
