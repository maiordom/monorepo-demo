import React, { useState } from 'react';
import classnames from 'classnames';

interface IProps {
  testId?: string;
  onChange: (checked: boolean) => void;
  value?: string;
  children?: React.ReactNode;
  className?: string;
  checked?: boolean;
}

import css from './Checkbox.css';

let id = 0;

export default ({
  value,
  testId,
  children,
  className,
  onChange,
  checked: initialValue,
}: IProps) => {
  const [checked, setChecked] = useState(!!initialValue);
  const key = 'label' + id++;

  const handleChange = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <label
      htmlFor={key}
      test-id={testId}
      className={classnames(css.container, className)}
    >
      <span className={css.control}>
        <div
          className={classnames(
            css.checkbox,
            checked ? css.checked : css.default
          )}
        />
        <input
          id={key}
          className={css.input}
          defaultChecked={checked}
          type="checkbox"
          onChange={handleChange}
        />
      </span>
      {value ? <span className={css.value}>{value}</span> : children}
    </label>
  );
};
