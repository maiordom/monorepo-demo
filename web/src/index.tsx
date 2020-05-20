import React from 'react';
import ReactDOM from 'react-dom';

import App from 'src/App';

require('./index.css');
require('./assets/fonts/styles.css');

const rootEl = document.getElementById('tabby-web');

ReactDOM.render(<App />, rootEl);
