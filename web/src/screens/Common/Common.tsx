import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router';
import { observer } from 'mobx-react';
import queryString from 'query-string';

import analytics from 'src/analytics';
import clientRoutes from 'src/routes/client';
import authModel from 'core/entities/Auth/model';

import { Content } from 'src/components/Layout';
import PayAll from 'src/screens/PayAll';
import Profile from 'src/screens/Profile';
import Main from 'src/screens/Main';
import Nav from 'src/components/Nav';
import Header from 'src/components/Header';
import PayPurchase from 'src/screens/PayPurchase';
import PayPurchaseCancel from 'src/screens/PayPurchaseCancel';
import PayPurchaseSuccess from 'src/screens/PayPurchaseSuccess';

import css from './Common.css';

export default observer(() => {
  const hasToken = authModel.store.authToken;
  const history = useHistory();
  const { search } = useLocation();

  useEffect(() => {
    if (!authModel.store.authToken) {
      history.push(clientRoutes.auth);
    }

    const { deviceId } = queryString.parse(search);

    if (deviceId) {
      analytics.setDeviceId(deviceId as string);
    }
  }, []);

  if (!hasToken) {
    return null;
  }

  return (
    <div className={css.container}>
      <Nav />
      <div className={css.content}>
        <Header />
        <Content>
          <Switch>
            <Route
              path={clientRoutes.payPurchaseCancel}
              component={PayPurchaseCancel}
            />
            <Route
              path={clientRoutes.payPurchaseSuccess}
              component={PayPurchaseSuccess}
            />
            <Route exact path={clientRoutes.common} component={Main} />
            <Route exact path={clientRoutes.profile} component={Profile} />
            <Route exact path={clientRoutes.payAll} component={PayAll} />
            <Route
              exact
              path={clientRoutes.payPurchase}
              component={PayPurchase}
            />
          </Switch>
        </Content>
      </div>
    </div>
  );
});
