chrome.tabs.onUpdated.addListener(() => {
  chrome.storage.sync.set({ running: false });
});

chrome.runtime.onMessage.addListener(async (_1, _2, sendResponse) => {
  try {
    sendResponse(true);
    const base64Img = await chrome.tabs.captureVisibleTab();
    const tabs = (await chrome.tabs.query({ active: true, currentWindow: true })) as chrome.tabs.Tab[];
    await chrome.tabs.sendMessage(tabs[0].id!, {
      base64Img,
    });
  } catch (e) {
    console.log(e);
  }
  return true;
});

declare const ENV: {
  API_KEY: string;
};

declare const NODE_ENV: any;

if (NODE_ENV === 'development') {
  chrome.storage.sync.set({ apiKey: ENV.API_KEY });
}
