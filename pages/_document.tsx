import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head></Head>
        <body className="bg-white overflow-x-hidden">
          <Main />
          <NextScript />
          <div id="page-loader">
            <div className="lds-ripple">
              <div></div>
              <div></div>
            </div>
          </div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
