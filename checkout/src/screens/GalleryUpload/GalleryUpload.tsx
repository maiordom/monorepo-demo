import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import Progress from 'src/components/Progress';
import Timeline from 'ui-kit/components/Timeline';
import { Belt } from 'src/components/Layout';
import Button from 'ui-kit/components/Button';

import journalModel from 'core/entities/Journal/model';
import css from './GalleryUpload.css';
import i18n from 'src/locales';
import model from 'src/model';
import analytics from 'src/analytics';

const MAX_FILE_SIZE = 20;

const GalleryButton = ({ onChange }: { onChange: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>();

  const handleChange = event => {
    const file = event.target.files[0];

    fileInputRef.current.value = '';

    onChange(file);
    analytics.events.scan.takePhotoClick();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={classnames(css.button, css.galleryButton)}>
      <Button onClick={handleClick}>{i18n().galleryUpload.takePhoto}</Button>
      <input
        className={css.fileInput}
        onChange={handleChange}
        type="file"
        ref={fileInputRef}
        accept="image/*"
      />
    </div>
  );
};

export default observer(() => {
  const [error, setError] = useState(null);

  const upload = (file: File) => {
    setError(null);

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

  const handleGalleryChange = (file: File) => {
    if (file.size / (1024 * 1024) > MAX_FILE_SIZE) {
      setError(i18n().galleryUpload.errors.sizeLimit);
      return;
    }

    upload(file);
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
    <div className={css.container}>
      <Belt>
        <Progress className={css.progress} progress={getProgress()} />
        <div className={css.title}>{i18n().galleryUpload.title}</div>
        <div className={css.description}>
          <div>{i18n().galleryUpload.description}</div>
        </div>
        <div className={css.card}>
          <div className={css.cardTitle}>{i18n().galleryUpload.card.title}</div>
          <div className={css.cardImage} />
          {journalModel.journal?.scan?.isLoading && (
            <div className={css.overlay}>
              <Timeline />
            </div>
          )}
          {error && (
            <div className={classnames(css.error, css.overlay)}>{error}</div>
          )}
        </div>
        <GalleryButton onChange={handleGalleryChange} />
      </Belt>
    </div>
  );
});
