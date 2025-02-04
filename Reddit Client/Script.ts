interface posts {
  subreddit_name_prefixed: string;
  author: string;
  title: string;
  score: number;
  url: string;
}

interface array {
  kind: string;
  data: posts;
}

const modal = document.querySelector("#modal") as HTMLDivElement,
  modalElementIds: string[] = ["modal", "subbreddit", "search", "text"],
  openModalBtn = document.querySelector("#modalOpener") as HTMLButtonElement,
  containerDiv = document.querySelector("#container") as HTMLDivElement,
  noRedditInfo = document.querySelector("#no-reddits") as HTMLDivElement,
  inputReddit = document.querySelector("#subbreddit") as HTMLInputElement,
  searchRedditBtn = document.querySelector("#search") as HTMLButtonElement,
  addMoreDiv = document.querySelector("#addMore") as HTMLDivElement,
  addMoreBtn = addMoreDiv.children[0] as HTMLElement,
  loaderElement = document.querySelector("#loading") as HTMLDivElement,
  errorElement = document.querySelector("#error") as HTMLDivElement,
  duplicateDiv = document.querySelector("#alreadyPresent") as HTMLDivElement,
  reloadButton = ((
    document.querySelector("#reload") as HTMLButtonElement
  ).onclick = (): void => window.location.reload()),
  reddits: string[] = [];

const modalHandler = (status: boolean): void => {
  if (status) {
    modal.classList.add("open");
    containerDiv.classList.add("blur");
  } else {
    modal.classList.remove("open");
    containerDiv.classList.remove("blur");
  }
};

//Modal Events
openModalBtn.addEventListener("click", (event: MouseEvent): void => {
  event.stopPropagation();
  modalHandler(true);
});

document.addEventListener("click", (event: MouseEvent) => {
  if (modal.classList.contains("open")) {
    let element = event.target as HTMLElement;
    if (!modalElementIds.includes(element.id)) {
      modalHandler(false);
    }
  }
});
//Fetching
const redditClient = async (subreddit: string): Promise<any> => {
  try {
    loaderElement.classList.add("open");
    modalHandler(false);
    containerDiv.classList.add("blur");
    noRedditInfo.classList.add("close");

    let response = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
    if (!response.ok) {
      modalHandler(false);
      noRedditInfo.classList.add("close");
      errorElement.classList.add("open");
    }

    return await response.json();
  } catch (error) {
    errorElement.classList.add("open");
    noRedditInfo.classList.add("close");
    modalHandler(false);
    throw error;
  } finally {
    modalHandler(false);
    loaderElement.classList.remove("open");
  }
};

const caller = async (subreddit: string): Promise<posts[]> => {
  const results = await redditClient(subreddit);
  let returnValue: posts[] = [];
  console.log(results);
  results?.data.children.forEach((element: array) => {
    let obj: posts = {
      subreddit_name_prefixed: element.data.subreddit_name_prefixed,
      author: element.data.author,
      title: element.data.title,
      score: element.data.score,
      url: element.data.url,
    };
    returnValue.push(obj);
  });

  return returnValue;
};

const htmlGenerator = (redditHeader: string, response: posts[]) => {
  reddits.push(redditHeader);
  if (response) {
    //Set inside cookie
    document.cookie = `reddits=${reddits};expires=${new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    ).toUTCString()};path=/`;

    noRedditInfo.classList.add("close");
    modalHandler(false);
    addMoreDiv.classList.add("open");

    const redditGroup: HTMLDivElement = document.createElement("div"),
      redditGroupHeader: HTMLHeadElement = document.createElement("h1"),
      optionsElement: HTMLButtonElement = document.createElement("button");

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
      let tabsDiv = optionsElement.children[1] as HTMLDivElement;
      if (tabsDiv.classList.contains("open")) tabsDiv.classList.remove("open");
      else tabsDiv.classList.add("open");
    });

    optionsElement.id = "options";

    redditGroup.append(redditGroupHeader, optionsElement);

    response.forEach((post: posts) => {
      const redditContainerDiv: HTMLDivElement = document.createElement("div"),
        titleTag: HTMLHeadElement = document.createElement("h2"),
        authorTag: HTMLParagraphElement = document.createElement("p"),
        scoreTag: HTMLParagraphElement = document.createElement("p"),
        urlTag: HTMLParagraphElement = document.createElement("p");

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

const cookieChecker = async (): Promise<void> => {
  let redditsAvailable =
    decodeURIComponent(document.cookie).length > 0
      ? decodeURIComponent(document.cookie).split("=")[0].split(",")
      : [];
  console.log(redditsAvailable);
  if (redditsAvailable.length > 0) {
    console.log("They are present");
    redditsAvailable.forEach(async (reddit: string): Promise<void> => {
      try {
        let response = await caller(reddit);
        if (response) {
          htmlGenerator(reddit, response);
        }
      } catch (error) {
        console.error(error);
      }
    });
  } else {
    console.log("They are empty");
  }
};

cookieChecker();

addMoreBtn.onclick = (event: Event): void => {
  event.stopPropagation();
  modalHandler(true);
};
//Search Up reddit
searchRedditBtn.addEventListener("click", async (): Promise<void> => {
  let inputValue =
      inputReddit.value.length > 0 ? inputReddit.value.toLowerCase() : "",
    duplicateFinder: boolean = false;

  Array.from(containerDiv.children).forEach((element) => {
    if (/^reddit_.+/.test(element.id)) {
      let reddit = element.id.split("_")[1];
      if (reddit == inputValue) {
        duplicateFinder = true;
      }
    }
  });

  if (!duplicateFinder) {
    let results = await caller(inputValue);
    if (results) {
      htmlGenerator(inputValue, results);
    }
  } else {
    modalHandler(false);
    duplicateDiv.classList.add("open");
    setTimeout(() => {
      duplicateDiv.classList.remove("open");
    }, 2000);
  }

  inputReddit.value = "";
});
