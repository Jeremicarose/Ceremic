const React = require('react');
const { Provider } = require('@self.id/react');
require('@/styles/globals.css');

const App = (props) => {
const { Component, pageProps } = props;
return <Component {...pageProps} />;
};

module.exports = App;