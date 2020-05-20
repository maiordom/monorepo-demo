import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

import Notification from 'ui-kit/components/Notification';
import Progress from 'src/components/Progress';
import DropZone from 'ui-kit/components/Dropzone';
import { Belt } from 'src/components/Layout';

import journalModel from 'core/entities/Journal/model';
import model from 'src/model';
import i18n from 'src/locales';
import css from './DropzoneUpload.css';
import analytics from 'src/analytics';

const MAX_FILE_SIZE = 20;

export default observer(() => {
  const [error, setError] = useState(null);

  const handleDrop = (file: File) => {
    setError(null);
    analytics.events.scan.takePhotoClick();

    if (file.size / (1024 * 1024) > MAX_FILE_SIZE) {
      setError(i18n().galleryUpload.errors.sizeLimit);
      return;
    }

    model
      .scan(file)
      .then(() => {
        model.pushHistory('scanConfirm');
        analytics.events.scan.imageUploaded({ status: 'success' });
      })
      .catch(exx => {
        analytics.events.scan.imageUploaded({ status: 'failure' });

        if (exx.code === 400) {
          model.pushHistory('scanError');
        } else {
          setError(i18n().galleryUpload.errors.somethingWrog);
        }
      });
  };

  const handleNotificationClose = () => {
    setError(null);
  };

  useEffect(() => {
    analytics.events.scan.pageOpen();

    return () => {
      analytics.events.scan.pageClose();
    };
  }, []);

  const getProgress = () => {
    if (model.store.productType === 'payLater') {
      return 100 * (1 / 3);
    } else {
      if (model.store.configuration.newCustomer) {
        return 100 * (4 / 5);
      }
    }
  };

  return (
    <>
      <Progress className={css.progress} progress={getProgress()} />
      <Belt>
        <div className={css.title}>{i18n().dropzoneUpload.title}</div>
        <div className={css.description}>
          {i18n().dropzoneUpload.description}
        </div>
      </Belt>
      <DropZone
        className={css.dropzone}
        onDrop={handleDrop}
        i18n={i18n().dropzoneUpload.dropzone}
        isLoading={journalModel.journal?.scan?.isLoading}
      />
      {error && (
        <Notification
          onClose={handleNotificationClose}
          className={css.notification}
        >
          {error}
        </Notification>
      )}
    </>
  );
});
