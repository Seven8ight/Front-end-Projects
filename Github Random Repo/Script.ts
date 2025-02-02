type language = {
  title: string;
  value: string;
};

type languages = language[];

//Fetching data
const languageSelection = async (): Promise<languages> => {
  try {
    let response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );

    if (!response.ok) {
      throw new Error("Error in url fetching");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
//Fetching a promise that resolves whenever the data has been retrieved otherwise rejects if only there is a network failure otherwise, if the url is wrong the response.ok is an error and an error can be popped up
const repoRetriever = async (language: string) => {
  try {
    let response = await fetch(
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`
    );
    if (!response.ok) {
      throw new Error(
        "Github error in fetching, incorrect url, Status Code: " +
          response.status +
          " : " +
          response.text
      );
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//The displayed information should include the repository name, description, number of stars, forks, and open issues
//items.description
//.name,.forks,.html_url,.stargazers_count
const eventListener = async (language: any): Promise<void> => {
  emptyTag?.classList.add("close");
  if (repositoryDiv) {
    repositoryDiv.innerHTML = "";
  }
  try {
    if (errorContainer?.classList.contains("open"))
      errorContainer.classList.remove("open");
    loaderDiv?.classList.add("open");

    let repoList = await repoRetriever(language.value),
      randomEnd = Math.random() * repoList.items.length,
      repos: [] = repoList.items.slice(randomEnd - 3, randomEnd);

    repos.forEach((repo: any) => {
      const repoContainer: HTMLDivElement = document.createElement("div"),
        infoDiv: HTMLDivElement = document.createElement("div"),
        nameHeader: HTMLHeadElement = document.createElement("h1"),
        desc: HTMLParagraphElement = document.createElement("p"),
        forks: HTMLParagraphElement = document.createElement("p"),
        url: HTMLParagraphElement = document.createElement("p"),
        stars: HTMLParagraphElement = document.createElement("p");

      nameHeader.innerHTML = `${
        repo.name == null ? "No name provided" : repo.name
      }`;
      desc.innerHTML = `${
        repo.description == null ? "No description provided" : repo.description
      }`;
      forks.innerHTML = `Number of forks: <u>${repo.forks}</u>`;
      stars.innerHTML = `Stars: <u>${repo.stargazers_count}</u>`;
      url.innerHTML = `Repo Url: <a target="_blank" href=${repo.html_url}>${repo.html_url}</a>`;

      infoDiv.append(forks, stars, url);
      repoContainer.append(nameHeader, desc, infoDiv);

      repositoryDiv?.appendChild(repoContainer);
    });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    errorContainer?.classList.add("open");
  } finally {
    loaderDiv?.classList.remove("open");
  }
};
//Dom Manipulation
const languagesDiv = document.querySelector<HTMLDivElement>("#languages"),
  searchInput = document.querySelector<HTMLInputElement>("#searchInput"),
  languageContainer = document.querySelector<HTMLDivElement>("#container"),
  errorContainer = document.querySelector<HTMLDivElement>("#error"),
  repositoryDiv = document.querySelector<HTMLDivElement>("#repositories"),
  loaderDiv = document.querySelector<HTMLDivElement>("#loader"),
  emptyTag = document.querySelector<HTMLParagraphElement>("#emptyList");

if (repositoryDiv) {
  if (repositoryDiv.innerHTML.length == 0) emptyTag?.classList.remove("close");
}

const initialList = (): void => {
  languageSelection().then((data) => {
    data.forEach((language) => {
      if (language.value != "") {
        const button: HTMLButtonElement = document.createElement("button");
        button.innerHTML = `${language.value}`;

        button.addEventListener("click", async () => eventListener(language));
        languagesDiv?.appendChild(button);
      }
    });
  });
};

searchInput?.addEventListener("input", (): void => {
  console.log("Inputted");
  if (languagesDiv) {
    languagesDiv.innerHTML = "";
  }
  languageSelection().then((data) => {
    data.forEach((language) => {
      const button: HTMLButtonElement = document.createElement("button");
      if (language.value != "") {
        if (
          language.value.toLowerCase().includes(searchInput.value.toLowerCase())
        ) {
          button.innerHTML = `${language.value}`;
          button.addEventListener("click", async () => eventListener(language));
          languagesDiv?.appendChild(button);
        }
      } else {
        initialList();
      }
    });
  });
});

initialList();
