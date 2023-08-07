chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkForVirus",
    title: "Check link for viruses",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkForVirus") {
    const url = info.linkUrl;
    getScanReport(url)
      .then((scanData) => {
        console.log(scanData);
        return getAnalysisReport(scanData.id);
      })
      .then((analysisData) => {
        const options = getNotificationOptions(analysisData);
        self.registration.showNotification(options.title, {
          body: options.message,
          icon: options.iconUrl,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

const getScanReport = (link) => {
  const url = encodeURIComponent(link);
  return fetch(
    `https://extension-checkvt-m7b2i77ilq-lm.a.run.app/scan?url=${url}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data.data)
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
};

const getAnalysisReport = (id) => {
  return fetch(`https://extension-checkvt-m7b2i77ilq-lm.a.run.app/report/${id}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error:", error);
      return error;
    });
};

const getNotificationOptions = (data) => {
  const stats = data.data.attributes.stats;
  console.log(stats);
  const message = `Harmless: ${stats.harmless} | Malicious: ${stats.malicious} | Suspicious: ${stats.suspicious} | Undetected: ${stats.undetected}`;
  let title;
  let iconUrl;
  if (stats.malicious) {
    iconUrl = "warning.png";
    title = "Malicious link detected";
  } else if (stats.suspicious) {
    iconUrl = "sus.webp";
    title = "Suspicious link detected";
  } else if (stats.harmless) {
    iconUrl = "checked.png";
    title = "Harmless link detected";
  } else {
    iconUrl = "undetected.png";
    title = "Unknown threats";
  }

  return {
    iconUrl: iconUrl,
    title: title,
    message: message,
  };
};
