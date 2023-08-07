chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkForVirus",
    title: "Check link for viruses",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "checkForVirus") {
    const url = info.linkUrl;
    const scanData = await getScanReport(url);
    console.log(scanData);
    const analysisData = await getAnalysisReport(scanData.id);
    console.log(analysisData);
  }
});

const getScanReport = async (link) => {
  const url = encodeURIComponent(link);
  return await fetch(
    `https://extension-checkvt-m7b2i77ilq-lm.a.run.app/scan?url=${url})}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data.data)
    .catch((error) => console.error("Error:", error));
};

const getAnalysisReport = async (id) => {
  return await fetch(
    `https://extension-checkvt-m7b2i77ilq-lm.a.run.app/report/${id}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => console.error("Error: ", error));
};
