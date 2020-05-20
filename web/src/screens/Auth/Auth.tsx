import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router';

import AuthForm from 'src/components/AuthForm';
import CodeForm from 'src/components/CodeForm';

import analytics from 'src/analytics';
import authModel from 'core/entities/Auth/model';
import i18n from 'src/locales';
import css from './Auth.css';
import clientRoutes from 'src/routes/client';

export default observer(() => {
  const history = useHistory();
  const handleLogin = () => {
    history.push(clientRoutes.common);
  };

  const handleLogoClick = () => {
    location.href = __APP_URL__;
  };

  useEffect(() => {
    analytics.events.login.pageOpen();
  }, []);

  return (
    <div className={css.container}>
      <div className={css.content}>
        <div className={css.logo} onClick={handleLogoClick} />
        <div className={css.title}>{i18n().auth.title}</div>
        {authModel.store.isSMSSent ? (
          <CodeForm className={css.codeForm} onLogin={handleLogin} />
        ) : (
          <AuthForm className={css.authForm} />
        )}
        <div className={css.description}>{i18n().auth.description}</div>
      </div>
      <div className={css.welcome} />
    </div>
  );
});
