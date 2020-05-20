import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import authModel from 'core/entities/Auth/model';
import clientRoutes from 'src/routes/client';
import request, { IRequestError } from 'core/utils/Request';

import Auth from 'src/screens/Auth';
import Common from 'src/screens/Common';
import SomethingWentWrong from 'src/screens/SomethingWentWrong';

export const Interceptor = () => {
  const history = useHistory();

  useEffect(() => {
    const requestInstance = request.getInstance();

    requestInstance.interceptors.response.use(
      response => response,
      (error: IRequestError) => {
        if (error?.response?.status === 401) {
          authModel.logout();
          history.push(clientRoutes.auth);
        }

        if (error?.response?.status >= 500) {
          history.push(clientRoutes.somethingWentWrong);
        }

        return Promise.reject(error);
      }
    );
  }, []);

  return null;
};

export default () => {
  return (
    <>
      <Router>
        <Interceptor />
        <Switch>
          <Route exact path={clientRoutes.auth} component={Auth} />
          <Route
            exact
            path={clientRoutes.somethingWentWrong}
            component={SomethingWentWrong}
          />
          <Route path={clientRoutes.common} component={Common} />
        </Switch>
      </Router>
    </>
  );
};
