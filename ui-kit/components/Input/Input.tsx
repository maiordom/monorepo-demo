import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import inputmask from 'inputmask';
const languageModel = {
  currentLang: 'en',
};

import css from './Input.css';

export interface IProps {
  testId?: string;
  theme?: 'default' | 'white';
  type?: 'text' | 'number' | 'password' | 'tel' | string;
  status?: 'error' | 'accepted' | 'pending' | string;
  errorMessage?: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  wrapperClassName?: string;
  title?: string;
  placeholder?: string;
  formatOptions?: {
    regex?: string;
    placeholder?: string;
    autoUnmask?: boolean;
    unmask?: (value: string) => string;
  };
  value?: string;
}

export default ({
  title,
  wrapperClassName,
  className,
  placeholder,
  formatOptions = {},
  onChange,
  onBlur = () => undefined,
  onFocus = () => undefined,
  type,
  theme = 'default',
  errorMessage,
  status: initialStatus = 'pending',
  value: initialValue = '',
}: IProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setFocus] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [isDeleteButtonPressed, setDeleteButtonPressed] = useState(false);
  const inputRef = useRef<any>();

  const initMask = () => {
    inputmask({
      ...formatOptions,
    }).mask(inputRef.current);
  };

  useEffect(() => {
    if (formatOptions.regex && languageModel.currentLang !== 'ar') {
      initMask();
    }
  }, []);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus, initialValue]);

  useEffect(() => {
    if (!formatOptions.unmask) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleBlur = () => {
    if (isDeleteButtonPressed) {
      return;
    }

    setFocus(false);
    onBlur();
  };

  const handleFocused = () => {
    setFocus(true);
    onFocus();
  };

  const handleChange = (event: React.ChangeEvent<any>) => {
    if (formatOptions.unmask) {
      onChange(formatOptions.unmask(event.target.value));
    } else {
      onChange(event.target.value);
    }

    setValue(event.target.value);
  };

  const handleDeleteClick = () => {
    setValue('');
    onChange('');
    inputRef.current.focus();
  };

  const handleDeleteMouseDown = () => {
    setDeleteButtonPressed(true);
  };

  const handleDeleteMouseUp = () => {
    setDeleteButtonPressed(false);
  };

  return (
    <div className={classnames(css.wrapper, wrapperClassName)}>
      {title && <div className={css.title}>{title}</div>}
      <div
        className={classnames(
          css.container,
          css[theme],
          status === 'error' && css.error,
          status === 'accepted' && css.accepted,
          className,
          isFocused && css.focused
        )}
      >
        <input
          ref={inputRef}
          value={value}
          type={type}
          onInput={handleChange}
          placeholder={placeholder}
          className={css.input}
          onBlur={handleBlur}
          onFocus={handleFocused}
        />
        {status === 'accepted' && (
          <div className={classnames(css.acceptedIcon, css.icon)} />
        )}
        {['pending', 'error'].includes(status) && value && (
          <div
            className={classnames(css.deleteIcon, css.icon)}
            onClick={handleDeleteClick}
            onMouseDown={handleDeleteMouseDown}
            onMouseUp={handleDeleteMouseUp}
          />
        )}
      </div>
      {status === 'error' && errorMessage && (
        <div className={css.errorMessage}>{errorMessage}</div>
      )}
    </div>
  );
};
