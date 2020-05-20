import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import Button from 'ui-kit/components/Button';
import { Belt, Logo } from 'src/components/Layout';

import model from 'src/model';
import i18n from 'src/locales';
import css from './ScanError.css';
import analytics from 'src/analytics';

export default observer(() => {
  const handleUploadAgainClick = () => {
    model.pushHistory('upload');
    analytics.events.scanError.uploadAgain();
  };

  return (
    <Belt className={classnames(css.container, css.failed)}>
      <Logo className={css.logo} />
      <div className={css.depressedCat} />
      <div className={css.title}>{i18n().scanError.title}</div>
      <Button className={css.back} onClick={handleUploadAgainClick}>
        {i18n().scanError.callToAction}
      </Button>
    </Belt>
  );
});
