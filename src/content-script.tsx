import { Close } from '@material-ui/icons';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Measure from 'react-measure';
import styled from 'styled-components';
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  cursor: crosshair;
`;

const TextArea = styled.div`
  position: absolute;
  background: #fff;
  border: 1px solid #000;
`;

const RightAlignDiv = styled.div`
  text-align: right;
`;

class Main extends React.Component {
  public state = {
    apiKey: '',
    drag: false,
    mouse: {
      x: 0,
      y: 0,
    },
    rectangle: {
      height: 0,
      left: 0,
      rgb: { red: '255', green: '0', blue: '0' },
      top: 0,
      width: 0,
    },
    textarea: {
      style: {
        display: 'none',
        left: 0,
        top: 0,
      },
      value: '',
    },
    wrapper: {
      height: 0,
      left: 0,
      top: 0,
      width: 0,
    },
  };
  public imageCanvasRef: React.RefObject<HTMLCanvasElement>;
  public textareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: object) {
    super(props);
    this.imageCanvasRef = React.createRef();
    this.textareaRef = React.createRef();
    chrome.storage.sync.get('apiKey', v => {
      this.setState({ apiKey: v.apiKey });
    });
  }

  public render() {
    return (
      <React.Fragment>
        <Measure
          offset={true}
          onResize={contentRect => {
            this.setState({
              wrapper: contentRect.offset,
            });
          }}
        >
          {({ measureRef }) => (
            <Wrapper ref={measureRef}>
              <Canvas
                width={this.state.wrapper.width}
                height={this.state.wrapper.height}
                onMouseDown={e => this.onMouseDown(e.clientX, e.clientY)}
                onMouseUp={e => this.onMouseUp(e.target as HTMLCanvasElement)}
                onMouseMove={e => {
                  if (this.state.drag) {
                    this.onMouseMove(e.target as HTMLCanvasElement, e.clientX, e.clientY);
                  }
                }}
              />
              <TextArea style={this.state.textarea.style} onClick={() => this.exit()}>
                <RightAlignDiv>
                  <Close style={{ fontSize: 18 }} />
                </RightAlignDiv>
                <textarea
                  ref={this.textareaRef}
                  value={this.state.textarea.value}
                  readOnly={true}
                  onClick={e => e.stopPropagation()}
                />
              </TextArea>
            </Wrapper>
          )}
        </Measure>
        <canvas ref={this.imageCanvasRef} width={this.state.rectangle.width} height={this.state.rectangle.height} />
      </React.Fragment>
    );
  }

  private onMouseDown(x: number, y: number) {
    const rectangle = this.state.rectangle;
    rectangle.left = x;
    rectangle.top = y;
    this.setState({
      drag: true,
      rectangle,
    });
  }

  private onMouseUp(canvasEl: HTMLCanvasElement) {
    const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
    this.setState({
      drag: false,
    });
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    if (this.state.rectangle.width > 0 && this.state.rectangle.height > 0) {
      chrome.runtime.sendMessage({});
      this.addMessageListener();
    }
  }

  private addMessageListener() {
    const listener = (request: { base64Img: string }, _: any, sendResponse: (response: any) => void) => {
      const base64Img = request.base64Img;
      const canvas = this.imageCanvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const img = new Image();
      img.src = base64Img;
      img.addEventListener('load', async () => {
        ctx.drawImage(
          img,
          this.state.rectangle.left,
          this.state.rectangle.top,
          this.state.rectangle.width,
          this.state.rectangle.height,
          0,
          0,
          this.state.rectangle.width,
          this.state.rectangle.height,
        );
        const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.state.apiKey}`, {
          body: JSON.stringify({
            requests: [
              {
                features: [
                  {
                    type: 'TEXT_DETECTION',
                  },
                ],
                image: {
                  content: canvas.toDataURL('image/png').split(',')[1],
                },
              },
            ],
          }),
          method: 'POST',
        });
        const json = await res.json();
        if (json && json.responses && json.responses[0].textAnnotations) {
          const textarea = this.textareaRef.current as HTMLTextAreaElement;
          this.setState({
            textarea: {
              style: {
                display: 'block',
                left: `${this.state.mouse.x}px`,
                top: `${this.state.mouse.y}px`,
              },
              value: json.responses[0].textAnnotations[0].description,
            },
          });
          textarea.select();
        }
      });
      chrome.runtime.onMessage.removeListener(listener);
      sendResponse(true);
      return true;
    };
    chrome.runtime.onMessage.addListener(listener);
  }

  private onMouseMove(canvasEl: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
    const rectangle = this.state.rectangle;
    rectangle.width = x - this.state.rectangle.left;
    rectangle.height = y - this.state.rectangle.top;
    this.setState({
      mouse: {
        x,
        y,
      },
      rectangle,
    });
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.strokeStyle = `rgb(${this.state.rectangle.rgb.red}, ${this.state.rectangle.rgb.green}, ${
      this.state.rectangle.rgb.blue
    })`;
    ctx.strokeRect(
      this.state.rectangle.left,
      this.state.rectangle.top,
      this.state.rectangle.width,
      this.state.rectangle.height,
    );
  }

  private exit() {
    document.body.removeChild(app);
    chrome.storage.sync.set({ running: false });
  }
}

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
