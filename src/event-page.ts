chrome.tabs.onUpdated.addListener(() => {
  chrome.storage.sync.set({ running: false });
});

chrome.runtime.onMessage.addListener(async (message, _2, sendResponse) => {
  try {
    sendResponse(true);
    const tabs = (await chrome.tabs.query({ active: true, currentWindow: true })) as chrome.tabs.Tab[];
    if (message.status === 'mouseUp') {
      const base64Img = await chrome.tabs.captureVisibleTab();
      await chrome.tabs.sendMessage(tabs[0].id!, {
        base64Img,
        status: 'mouseUp',
      });
    } else if (message.status === 'imageComplete') {
      const store = await chrome.storage.sync.get('apiKey');
      const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${store.apiKey}`, {
        body: JSON.stringify({
          requests: [
            {
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
              image: {
                content: message.image,
              },
            },
          ],
        }),
        method: 'POST',
      });
      const json = await res.json();
      await chrome.tabs.sendMessage(tabs[0].id!, {
        json,
        status: 'imageComplete',
      });
    }
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
