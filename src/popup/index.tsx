import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './popup.scss';

class Popup extends React.Component {
  constructor(props: object) {
    super(props);
  }

  public async componentDidMount() {
    const item = await chrome.storage.sync.get('apiKey');
    const status = await chrome.storage.sync.get('running');
    if (item && item.apiKey && status && !status.running) {
      chrome.storage.sync.set({ running: true });
      chrome.tabs.executeScript({ file: 'js/content-script.js' });
      window.close();
    } else if (item && item.apiKey && status && status.running) {
      window.close();
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className="popupContainer">
          <div className="option" onClick={() => this.openOption()}>
            オプション画面でAPIキーを設定してください
          </div>
          <a
            className="link"
            href="https://cloud.google.com/docs/authentication/api-keys?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            APIキーの説明
          </a>
        </div>
      </React.Fragment>
    );
  }

  public openOption() {
    chrome.runtime.openOptionsPage();
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
