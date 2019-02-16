import en_US from './locales/en_US';
import ja_JP from './locales/ja_JP';

export class Util {
  public static chooseLocale(locale: string) {
    switch (locale) {
      case 'en':
        return en_US;
      case 'ja':
        return ja_JP;
      default:
        return ja_JP;
    }
  }
}
