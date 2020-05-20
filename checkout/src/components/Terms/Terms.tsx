import React from 'react';
import classnames from 'classnames';

import Checkbox from 'ui-kit/components/Checkbox';

import css from './Terms.css';
import i18n from 'src/locales';

interface IProps {
  className?: string;
  onChange: (checked: boolean) => void;
}

export default ({ className, onChange }: IProps) => (
  <Checkbox
    testId="terms"
    onChange={onChange}
    className={classnames(css.container, className)}
  >
    <a
      className={css.terms}
      onClick={event => event.stopPropagation()}
      href="https://business.tabby.ai/termsandconditions"
      rel="noopener noreferrer"
      target="_blank"
    >
      {i18n().terms}
    </a>
  </Checkbox>
);
