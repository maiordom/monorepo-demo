import React from 'react';

import css from './Layout.css';

export const Content = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => <div className={css.content}>{children}</div>;
