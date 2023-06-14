/* eslint-disable class-methods-use-this */
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { AppConfig } from '@/utils/AppConfig';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head />
        <body className="m-0 font-sans text-base antialiased font-normal text-left leading-default dark:bg-slate-950 bg-gray-50 text-slate-500 dark:bg-slate-900 dark:text-white">
          <Main/>
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;
// # sourceMappingURL=_document.jsx.map
