import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Measure from 'react-measure';
import styled from 'styled-components';

declare const ENV: {
  API_KEY: string;
};

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

const TextArea = styled.textarea`
  position: absolute;
  display: none;
`;

class Main extends React.Component {
  public state = {
    drag: false,
    mouse: {
      x: 0,
      y: 0,
    },
    rectangle: {
      height: 0,
      left: 0,
      rgb: { red: '200', green: '0', blue: '0' },
      top: 0,
      width: 0,
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
        const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${ENV.API_KEY}`, {
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
          textarea.value = json.responses[0].textAnnotations[0].description;
          textarea.style.left = `${this.state.mouse.x}px`;
          textarea.style.top = `${this.state.mouse.y}px`;
          textarea.select();
          textarea.style.display = 'block';
        }
      });
      chrome.runtime.onMessage.removeListener(listener);
      sendResponse(true);
      return true;
    };
    chrome.runtime.onMessage.addListener(listener);
  }

  public render() {
    return (
      <div>
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
              <TextArea ref={this.textareaRef} onClick={() => document.body.removeChild(app)} />
            </Wrapper>
          )}
        </Measure>
        <canvas ref={this.imageCanvasRef} width={this.state.rectangle.width} height={this.state.rectangle.height} />
      </div>
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
    chrome.runtime.sendMessage({});
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
}

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(<Main />, app);
