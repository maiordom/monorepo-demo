import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, matchPath } from 'react-router-dom';

import Icon from '../Icon';

import css from './Menu.css';

export interface IProps {
  iconClassName?: string;
  type: 'nav' | 'redirect';
  path: string;
  name: string;
  title: string;
  exact?: boolean;
  strict?: boolean;
  onActive?: (name: string) => void;
}

export default ({
  type,
  path,
  name,
  title,
  exact,
  strict,
  iconClassName,
  onActive,
}: IProps) => {
  const [state, setState] = useState(false);
  const location = useLocation();
  const isActive = Boolean(
    matchPath(location.pathname, { path, exact, strict })
  );

  useEffect(() => {
    if (isActive !== state) {
      setState(isActive);
    }

    if (isActive) {
      onActive(name);
    }
  }, [isActive]);

  let link = null;

  switch (type) {
    case 'nav':
      link = (
        <NavLink
          exact={exact}
          to={path}
          strict={strict}
          className={css.item}
          activeClassName={css.itemActive}
        >
          {state ? (
            <Icon className={iconClassName} name={`${name}-active`} />
          ) : (
            <Icon className={iconClassName} name={name}></Icon>
          )}
          <span className={css.title}>{title}</span>
        </NavLink>
      );
      break;
    case 'redirect':
      link = (
        <a
          className={css.item}
          href={path}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className={iconClassName} name={name}></Icon>
          <span className={css.title}>{title}</span>
        </a>
      );
      break;
  }

  return link;
};
