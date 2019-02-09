export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextDetection {
  responses: Response[];
}

export interface Response {
  textAnnotations: TextAnnotation[];
  fullTextAnnotation: FullTextAnnotation;
}

export interface FullTextAnnotation {
  pages: Page[];
  text: string;
}

export interface Page {
  property: ParagraphProperty;
  width: number;
  height: number;
  blocks: Block[];
}

export interface Block {
  property: ParagraphProperty;
  boundingBox: Bounding;
  paragraphs: Paragraph[];
  blockType: string;
}

export interface Bounding {
  vertices: Vertex[];
}

export interface Vertex {
  x: number;
  y: number;
}

export interface Paragraph {
  property: ParagraphProperty;
  boundingBox: Bounding;
  words: Word[];
}

export interface ParagraphProperty {
  detectedLanguages: DetectedLanguage[];
}

export interface DetectedLanguage {
  languageCode: Locale;
}

export enum Locale {
  En = 'en',
}

export interface Word {
  property: ParagraphProperty;
  boundingBox: Bounding;
  symbols: Symbol[];
}

export interface Symbol {
  property: SymbolProperty;
  boundingBox: Bounding;
  text: string;
}

export interface SymbolProperty {
  detectedLanguages: DetectedLanguage[];
  detectedBreak?: DetectedBreak;
}

export interface DetectedBreak {
  type: string;
}

export interface TextAnnotation {
  locale?: Locale;
  description: string;
  boundingPoly: Bounding;
}

export interface Navigator
  extends NavigatorID,
    NavigatorOnLine,
    NavigatorContentUtils,
    NavigatorStorageUtils,
    MSNavigatorDoNotTrack,
    MSFileSaver,
    NavigatorBeacon,
    NavigatorConcurrentHardware,
    NavigatorUserMedia,
    NavigatorLanguage,
    NavigatorStorage,
    NavigatorAutomationInformation {
  clipboard: any;
  readonly activeVRDisplays: ReadonlyArray<VRDisplay>;
  readonly authentication: WebAuthentication;
  readonly cookieEnabled: boolean;
  readonly doNotTrack: string | null;
  gamepadInputEmulation: GamepadInputEmulationType;
  readonly geolocation: Geolocation;
  readonly maxTouchPoints: number;
  readonly mimeTypes: MimeTypeArray;
  readonly msManipulationViewsEnabled: boolean;
  readonly msMaxTouchPoints: number;
  readonly msPointerEnabled: boolean;
  readonly plugins: PluginArray;
  readonly pointerEnabled: boolean;
  readonly serviceWorker: ServiceWorkerContainer;
  readonly webdriver: boolean;
  getGamepads(): Array<Gamepad | null>;
  getVRDisplays(): Promise<VRDisplay[]>;
  javaEnabled(): boolean;
  msLaunchUri(uri: string, successCallback?: MSLaunchUriCallback, noHandlerCallback?: MSLaunchUriCallback): void;
  requestMediaKeySystemAccess(
    keySystem: string,
    supportedConfigurations: MediaKeySystemConfiguration[],
  ): Promise<MediaKeySystemAccess>;
  vibrate(pattern: number | number[]): boolean;
}
