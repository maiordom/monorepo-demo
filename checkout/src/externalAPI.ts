import model from 'src/model';

window.addEventListener(
  'message',
  event => {
    try {
      const { type, data } = JSON.parse(event.data);

      switch (type) {
        case 'init':
          if (data.sessionId) {
            model.initBySession(data);
          } else {
            model.init(data);
          }
          break;

        case 'launch':
          model.launch(data);
          break;
      }
    } catch (exx) {}
  },
  false
);

model.emitter.on('close', data => {
  parent.postMessage(JSON.stringify({ type: 'close', data }), '*');
});

model.emitter.on('checkout', data => {
  parent.postMessage(JSON.stringify({ type: 'checkout', data }), '*');
});

parent.postMessage(JSON.stringify({ type: 'loaded' }), '*');
