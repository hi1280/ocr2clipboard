import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import * as en from 'react-intl/locale-data/en';
import * as ja from 'react-intl/locale-data/ja';
import { Util } from '../util';
import './popup.scss';

class Popup extends React.Component {
  private locale = navigator.language.split('_')[0];

  constructor(props: object) {
    super(props);
    addLocaleData([...en, ...ja]);
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
      <IntlProvider locale={this.locale} messages={Util.chooseLocale(this.locale)}>
        <React.Fragment>
          <div className="popupContainer">
            <div className="option" onClick={() => this.openOption()}>
              <FormattedMessage id="popup_main" />
            </div>
            <a
              className="link"
              href="https://cloud.google.com/docs/authentication/api-keys?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="popup_sub" />
            </a>
          </div>
        </React.Fragment>
      </IntlProvider>
    );
  }

  public openOption() {
    chrome.runtime.openOptionsPage();
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
