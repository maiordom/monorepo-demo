import React from 'react';
import { useMediaPredicate } from 'react-media-hook';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router';

import Icon from 'ui-kit/components/Icon';

import commonModel from 'src/entities/Common/model';
import i18n from 'src/locales';
import clientRoutes from 'src/routes/client';
import { MIN_WIDTH } from 'src/constants';
import css from './Header.css';

export default () => {
  const isMinWidth = useMediaPredicate(`(max-width: ${MIN_WIDTH - 1}px)`);
  const history = useHistory();

  const handleBurgerClick = () => {
    commonModel.toggleMenu();
  };

  const handleLogoClick = () => {
    history.push(clientRoutes.common);
  };

  const title = (
    <>
      <Switch>
        <Route
          exact
          path={clientRoutes.common}
          render={() => i18n().main.header}
        />
        <Route
          exact
          path={clientRoutes.profile}
          render={() => i18n().profile.header}
        />
        <Route
          exact
          path={clientRoutes.payAll}
          render={() => i18n().payAll.header}
        />
        <Route
          exact
          path={clientRoutes.payPurchase}
          render={() => i18n().payPurchase.header}
        />
      </Switch>
    </>
  );

  return (
    <div>
      {isMinWidth ? (
        <>
          <div className={css.row}>
            <Icon
              className={css.burger}
              onClick={handleBurgerClick}
              name="burger"
            />
            <div className={css.logo} />
          </div>
          <div className={css.title}>{title}</div>
        </>
      ) : (
        <div className={css.row}>
          <Icon
            onClick={handleBurgerClick}
            className={css.burger}
            name="burger"
          />
          <div className={css.title}>{title}</div>
          <div className={css.logo} onClick={handleLogoClick} />
        </div>
      )}
    </div>
  );
};
