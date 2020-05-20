import React from 'react';
import { observer } from 'mobx-react';

import Timeline from 'ui-kit/components/Timeline';

import journalModel from 'core/entities/Journal/model';
import css from './Initial.css';

export default observer(() => {
  return (
    <div className={css.container}>
      {journalModel.journal?.getCheckout?.isLoading && <Timeline />}
      {journalModel.journal?.getCheckout?.hasError && (
        <div>Something went wrong</div>
      )}
    </div>
  );
});
