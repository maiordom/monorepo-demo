import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import Progress from 'src/components/Progress';
import Timeline from 'ui-kit/components/Timeline';
import Input from 'ui-kit/components/Input';
import Button from 'ui-kit/components/Button';
import { Belt } from 'src/components/Layout';

import plural from 'ui-kit/utils/Plural';
import installmentRegularity from 'core/utils/InstallmentRegularity';
import t from 'ui-kit/utils/Interpolate';
import journalModel from 'core/entities/Journal/model';
import model from 'src/model';
import i18n from 'src/locales';
import css from './ScanConfirm.css';
import analitycs from 'src/analytics';

export default observer(() => {
  const { scanData } = model.store;

  const handleCallToAction = () => {
    model.updateCheckout();
    analitycs.events.scanConfirm.buyNow();
  };

  const handleUploadAgainClick = () => {
    model.pushHistory('upload');
  };

  useEffect(() => {
    analitycs.events.scanConfirm.pageOpen();

    return () => {
      analitycs.events.scanConfirm.pageClose();
    };
  }, []);

  const getProgress = () => {
    if (model.store.productType === 'payLater') {
      return 100 * (2 / 3);
    } else {
      if (model.store.configuration.newCustomer) {
        return 100;
      }
    }
  };

  const isLoading = journalModel.journal?.updateCheckout?.isLoading;

  return (
    <>
      <div className={css.progress}>
        <Progress progress={getProgress()} />
      </div>
      <Belt>
        <div className={css.title}>{i18n().scanConfirm.title}</div>
        <div className={css.description}>{i18n().scanConfirm.description}</div>
        <Input
          wrapperClassName={css.field}
          status="accepted"
          value={scanData.name}
          onChange={() => undefined}
          title={i18n().scanConfirm.fields.name.title}
        />
        <Input
          wrapperClassName={css.field}
          status="accepted"
          value={scanData.nationalId}
          onChange={() => undefined}
          title={i18n().scanConfirm.fields.nationalId.title}
        />
        <Button
          disabled={isLoading}
          className={css.callToAction}
          onClick={handleCallToAction}
        >
          {i18n().scanConfirm.callToAction}
        </Button>
        <Button
          theme="gray"
          className={css.back}
          onClick={handleUploadAgainClick}
        >
          {i18n().scanConfirm.back}
        </Button>
        {isLoading ? (
          <>
            <div className={css.spinner}>
              <Timeline />
            </div>
            <div className={css.uploadTitle}>
              {i18n().scanConfirm.uploadTitle}
            </div>
          </>
        ) : (
          <Promt />
        )}
      </Belt>
    </>
  );
});

const Promt = () => {
  if (model.store.productType === 'payLater') {
    return (
      <div className={css.promt}>{i18n().scanConfirm.prompt.payLater}</div>
    );
  }

  if (model.store.productType === 'installments') {
    const {
      period: { weeks, months },
    } = installmentRegularity(model.selectedProductOption.installmentPeriod);
    let periodType = i18n().common.plurals.month;
    let period;

    if (months && weeks) {
      period = months + weeks / 4;
    } else if (weeks) {
      periodType = i18n().common.plurals.week;
      period = weeks;
    } else {
      period = months;
    }

    return (
      <div className={css.promt}>
        {t(i18n().scanConfirm.prompt.installments, {
          period: period + ' ' + plural(period, periodType),
        })}
      </div>
    );
  }
};
