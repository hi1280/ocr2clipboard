import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './popup.scss';

class Popup extends React.Component {
  constructor(props: object) {
    super(props);
  }

  public async componentDidMount() {
    const item = await chrome.storage.sync.get('apiKey');
    if (item && item.apiKey) {
      chrome.tabs.executeScript({ file: 'js/chrome-extension-async.js' });
      chrome.tabs.executeScript({ file: 'js/content-script.js' });
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className="popupContainer">
          <div className="option" onClick={() => this.click()}>
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

  public click() {
    chrome.runtime.openOptionsPage();
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
