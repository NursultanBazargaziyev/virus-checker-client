// Constants
const GITHUB_URL = "https://github.com/NursultanBazargaziyev?tab=repositories";

// Function to get a DOM element by id
const getElemById = (id) => document.getElementById(id);

// Function to validate a URL
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Function to handle responses
const handleResponse = (response) => {
  if (response.error) {
    console.error("Error from background page:", response.error);
  } else {
    const resultsEl = getElemById("results");
    while (resultsEl.firstChild) {
      resultsEl.removeChild(resultsEl.firstChild);
    }
    Object.entries(response.data.attributes.results).forEach(
      ([engineName, result]) => {
        const li = document.createElement("li");
        li.textContent = `${engineName}: ${result.result}`;
        resultsEl.appendChild(li);
      }
    );
  }
};

// Event handlers setup
document.addEventListener("DOMContentLoaded", () => {
  const virusCheckerButton = getElemById("search-button");
  const linkInput = getElemById("link-holder");
  const link = document.querySelector(".github-link");

  link.addEventListener("click", () => {
    chrome.tabs.create({ url: GITHUB_URL });
  });

  virusCheckerButton.addEventListener("click", () => {
    const url = linkInput.value;
    if (isValidURL(url)) {
      chrome.runtime.sendMessage({ url: url }, handleResponse);
    } else {
      console.error(`Invalid URL provided: ${url}`);
    }
  });
});
