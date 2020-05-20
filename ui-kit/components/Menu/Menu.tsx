import React from 'react';
import classnames from 'classnames';

import css from './Menu.css';

import MenuItem, { IProps as IMenuItem } from './MenuItem';

interface IProps {
  className?: string;
  items: IMenuItem[];
  onActive?: (name: string) => void;
}

export default ({ items, className, onActive }: IProps) => (
  <div className={classnames(css.container, className)}>
    {items.map(item => (
      <MenuItem {...item} key={item.path} onActive={onActive} />
    ))}
  </div>
);
