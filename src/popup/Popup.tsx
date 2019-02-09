import * as React from 'react';
import './Popup.scss';

interface AppProps {}

interface AppState {}

export default class Popup extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  public componentDidMount() {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true });
  }

  public render() {
    return <div className="popupContainer">Hello, world!</div>;
  }
}
