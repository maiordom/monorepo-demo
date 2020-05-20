import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';

export interface IProps {
  theme?: 'default' | 'white';
  testId?: string;
  status: 'pending' | 'rejected' | 'fulfilled' | string;
  statusMessage: string;
  className?: string;
  onCodeFulfilled: (code: string) => void;
  onCodeChange?: () => void;
  onCodeFocus: () => void;
  i18n: {
    title: string;
    wrongCode: string;
    somethingWrong: string;
  };
}

import css from './CodeForm.css';

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_BACK = 8;

export default ({
  theme = 'default',
  testId,
  i18n,
  className,
  onCodeFulfilled,
  onCodeFocus,
  status,
  statusMessage,
  onCodeChange = () => undefined,
}: IProps) => {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [focusId, setFocusId] = useState<number>(0);
  const fieldRefs = useRef(code.map(() => React.createRef<HTMLInputElement>()));

  const checkCode = () => {
    if (code.join('').length === 4 && status === 'pending') {
      onCodeFulfilled(code.join(''));
      setFocusId(null);
    }
  };

  const handleChange = (id: number, value: string) => {
    code[id] = value;
    setCode(code);

    if (!value) {
      return;
    }

    if (id < code.length - 1) {
      setFocusId(id + 1);
      fieldRefs.current[id + 1].current.focus();
    }

    onCodeChange();
    checkCode();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    keyCode: number
  ) => {
    const value = String.fromCharCode(keyCode);

    if (keyCode === KEY_LEFT) {
      if (id > 0) {
        setFocusId(id - 1);
        fieldRefs.current[id - 1].current.focus();
      }
    } else if (keyCode === KEY_RIGHT) {
      if (id < code.length - 1) {
        setFocusId(id + 1);
        fieldRefs.current[id + 1].current.focus();
      }
    } else if (keyCode === KEY_BACK) {
      if (id >= 0) {
        fieldRefs.current[id].current.value = '';
        code[id] = '';
        setCode(code);
      }

      if (id > 0) {
        setTimeout(() => {
          setFocusId(id - 1);
          fieldRefs.current[id - 1].current.focus();
        }, 0);
      }
    } else {
      if (!/\d/.test(value)) {
        event.preventDefault();
        return;
      }

      handleChange(id, value);
    }
  };

  const handleFocus = (id: number) => {
    onCodeFocus();
    setFocusId(id);

    if (code[id]) {
      setTimeout(() => {
        fieldRefs.current[id].current.select();
      }, 0);
    }
  };

  const handleBlur = (id: number) => {
    if (id === focusId) {
      setFocusId(-1);
    }
  };

  useEffect(() => {
    fieldRefs.current[focusId].current.focus();
  }, []);

  useEffect(() => {
    if (status === 'rejected') {
      setCode(['', '', '', '']);
    }
  }, [status]);

  return (
    <div
      test-id={testId}
      className={classnames(className, css[theme], css.container)}
    >
      <div className={css.title}>{i18n.title}</div>
      <div className={css.fields}>
        {[0, 1, 2, 3].map(id => (
          <input
            value={code[id]}
            disabled={status === 'fulfilled'}
            key={id}
            onFocus={() => handleFocus(id)}
            ref={fieldRefs.current[id]}
            maxLength={1}
            className={classnames(
              css.field,
              status === 'rejected' && css.error,
              status === 'pending' && focusId === id && css.active
            )}
            type="tel"
            onBlur={() => handleBlur(id)}
            onKeyDown={event => {
              handleKeyDown(event, id, event.keyCode);
            }}
          />
        ))}
      </div>
      {status === 'rejected' && (
        <div className={css.errorMessage}>{i18n[statusMessage]}</div>
      )}
    </div>
  );
};
