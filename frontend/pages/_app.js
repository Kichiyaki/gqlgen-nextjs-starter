import "react-toastify/dist/ReactToastify.min.css";
import React from "react";
import App, { Container } from "next/app";
import { ToastContainer } from "react-toastify";
import withApollo from "../hocs/withApollo";
import TranslationProvider from "../lib/i18n/Provider";
import ApolloProvider from "../common/ApolloProvider/ApolloProvider";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <TranslationProvider locale="pl">
            <Component {...pageProps} />
          </TranslationProvider>
        </ApolloProvider>
        <ToastContainer />
      </Container>
    );
  }
}

export default withApollo(MyApp);
