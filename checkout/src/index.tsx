import React from 'react';
import ReactDOM from 'react-dom';

import App from 'src/App';

require('./externalAPI');
require('./index.css');
require('./assets/fonts/styles.css');

const rootEl = document.getElementById('embed-tabby-checkout');

ReactDOM.render(<App />, rootEl);
