import { IPayment } from 'core/entities/Checkout/types/Payment';

require('./integration.css');

declare global {
  interface Window {
    Tabby: ITabby;
  }
}

const checkoutHost = __CHECKOUT_IFRAME_HOST__;

interface ITabby extends Tabby {}

interface ICheckoutSession {
  id: string;
  status: string;
  payment: IPayment;
  errors?: { code: string; field: string }[];
}

interface IConfig {
  nodeId?: string;
  direction: 'ltr' | 'rtl';
  lightboxLayout?: boolean;
  payment: IPayment;
  apiKey: string;
  sessionId?: string;
  onClose?: () => void;
  onChange?: (session: ICheckoutSession) => void;
}

import css from './integration.css';

class Tabby {
  config: IConfig = null;
  iframeWrapper: HTMLDivElement = null;
  iframe: HTMLIFrameElement = null;
  isCSSInjected = false;
  meta: HTMLMetaElement;

  warnings: {
    code: string;
    field: string;
    type: 'pending' | 'error' | 'resolved';
  }[] = [];

  get container() {
    return document.getElementById(this.config.nodeId);
  }

  onClose({ redirectUrl }: { redirectUrl?: string } = {}) {
    if (this.config.lightboxLayout) {
      this.stopBodyScrolling(false);
    }

    this.removeMetaTag();
    this.removeWindowListener();
    this.container.removeChild(this.iframeWrapper);
    this.config.onClose && this.config.onClose();

    if (redirectUrl) {
      location.href = redirectUrl;
    }
  }

  onContainerClick = event => {
    if (event.target.className === css.paranja) {
      this.onClose();
    }
  };

  createMetaTag() {
    if (this.meta) {
      return;
    }

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0'
    );

    document.getElementsByTagName('head')[0].appendChild(meta);
    this.meta = meta;
  }

  removeMetaTag() {
    document.getElementsByTagName('head')[0].removeChild(this.meta);
    this.meta = null;
  }

  onChange(params: ICheckoutSession) {
    this.config.onChange && this.config.onChange(params);
  }

  createIframe() {
    const iframe = document.createElement('iframe');

    iframe.src = checkoutHost;
    iframe.classList.add(css.iframe);
    iframe.setAttribute('border', '0');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('cellspacing', '0');

    return iframe;
  }

  createIframeWrapper() {
    const wrapper = document.createElement('div');

    wrapper.className = `
      ${css.tabby}
      ${this.config.lightboxLayout ? css.lightbox : ''}
    `;

    wrapper.innerHTML = `
      <div class="${css.paranja}"></div>
    `;

    return wrapper;
  }

  init(config: IConfig) {
    this.config = Object.assign({
      direction: 'ltr',
      nodeId: 'tabby-checkout',
      lightboxLayout: true,
      ...config,
    });
  }

  createWrapper() {
    let node = this.container;

    if (!node) {
      node = document.createElement('div');
      node.setAttribute('id', this.config.nodeId);
      node.style.display = 'none';

      document.body.appendChild(node);
    } else {
      node.innerHTML = '';
    }

    return node;
  }

  create() {
    this.iframeWrapper = this.createIframeWrapper();
    this.iframe = this.createIframe();
    this.iframeWrapper.appendChild(this.iframe);

    this.removeWindowListener();
    this.addWindowListener();
    this.createWrapper().appendChild(this.iframeWrapper);
  }

  initCheckout() {
    this.iframe.contentWindow.postMessage(
      JSON.stringify({
        type: 'init',
        data: {
          merchant: location.origin,
          sessionId: this.config.sessionId,
          apiKey: this.config.apiKey,
          direction: this.config.direction,
          payment: this.config.payment,
        },
      }),
      '*'
    );
  }

  stopBodyScrolling(stop: boolean) {
    if (stop) {
      document.body.classList.add(css.scrollingStop);
    } else {
      document.body.classList.remove(css.scrollingStop);
    }
  }

  launch({ route, product }: { route?: string; product?: string } = {}) {
    if (this.config.lightboxLayout) {
      this.stopBodyScrolling(true);
    }

    this.iframe.contentWindow.postMessage(
      JSON.stringify({ type: 'launch', data: { route, product } }),
      '*'
    );
    this.createMetaTag();
  }

  onMessage = (event: MessageEvent) => {
    try {
      const { type, data } = JSON.parse(event.data);

      switch (type) {
        case 'loaded':
          this.initCheckout();
          break;

        case 'close':
          this.onClose(data);
          break;

        case 'checkout':
          this.onChange(data);
          break;
      }
    } catch (exx) {}
  };

  addWindowListener() {
    window.addEventListener('message', this.onMessage, false);
    document.addEventListener('click', this.onContainerClick, false);
  }

  removeWindowListener() {
    window.removeEventListener('message', this.onMessage, false);
    document.removeEventListener('click', this.onContainerClick, false);
  }
}

window.Tabby = new Tabby();
