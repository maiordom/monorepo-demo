import React, { useRef, useEffect, useState } from 'react';
import classnames from 'classnames';

import Timeline from '../Timeline';

import t from '../../utils/Interpolate';

interface IProps {
  className?: string;
  isLoading?: boolean;
  onDrop: (image: File) => void;
  i18n: {
    title: string[];
    callToAction: string;
    description: string;
  };
}

import css from './Dropzone.css';

export default ({ i18n, className, onDrop, isLoading }: IProps) => {
  const containerRef = useRef<HTMLDivElement>();
  const fileInputRef = useRef<HTMLInputElement>();
  const [isDragOver, setIsDragOver] = useState(false);

  const dragover = () => {
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const dragleave = event => {
    if (isDragOver && !containerRef.current.contains(event.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const drop = event => {
    const file = event.dataTransfer.files[0];

    setIsDragOver(false);
    fileInputRef.current.value = '';

    onDrop(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = event => {
    const file = event.target.files[0];
    fileInputRef.current.value = '';

    onDrop(file);
  };

  const preventDefaults = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const bindEvents = () => {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      containerRef.current.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });
  };

  const unbindEvents = () => {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      containerRef.current.removeEventListener(
        eventName,
        preventDefaults,
        false
      );
      document.body.removeEventListener(eventName, preventDefaults, false);
    });
  };

  useEffect(() => {
    containerRef.current.addEventListener('dragover', dragover, false);
    containerRef.current.addEventListener('dragleave', dragleave, false);
    containerRef.current.addEventListener('drop', drop, false);

    return () => {
      containerRef.current.removeEventListener('dragover', dragover, false);
      containerRef.current.removeEventListener('dragleave', dragleave, false);
      containerRef.current.removeEventListener('drop', drop, false);
    };
  }, [isDragOver]);

  useEffect(() => {
    bindEvents();

    return unbindEvents;
  }, []);

  return (
    <div
      onClick={handleClick}
      ref={containerRef}
      className={classnames(
        css.container,
        className,
        isDragOver && css.isDragOver,
        isLoading && css.isLoading
      )}
    >
      <input
        ref={fileInputRef}
        onChange={handleFileInputChange}
        type="file"
        accept="image/*"
        className={css.file}
      />
      {isLoading ? (
        <Timeline className={css.spinner} />
      ) : (
        <>
          <div className={css.formats} />
          <div className={css.snippet}>
            <div className={css.cloud} />
            <div className={css.title}>
              <div className={css.subTitle}>{i18n.title[0]}</div>
              <div>
                {t(i18n.title[1], {
                  browse: (
                    <span className={css.browse}>{i18n.callToAction}</span>
                  ),
                })}
              </div>
            </div>
            <div className={css.description}>{i18n.description}</div>
          </div>
        </>
      )}
    </div>
  );
};
