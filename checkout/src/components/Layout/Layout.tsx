import React from 'react';
import classnames from 'classnames';

import css from './Layout.css';

export const Page = ({
  theme,
  children,
  className,
  testId,
}: {
  theme?: string;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  testId?: string;
}) => (
  <div className={classnames(css.page, css[theme], className)} test-id={testId}>
    {children}
    <div className={css.spacer} />
  </div>
);

export const Logo = ({ className }: { className?: string }) => (
  <div className={classnames(css.logo, className)} />
);

export const Belt = ({
  children,
  className,
  testId,
}: {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
  testId?: string;
}) => (
  <div className={classnames(className, css.belt)} test-id={testId}>
    {children}
  </div>
);
