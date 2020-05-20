import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useMediaPredicate } from 'react-media-hook';

import AuthorizationCode from 'src/screens/AuthorizationCode';
import Header from 'src/components/Header';
import { Page } from 'src/components/Layout';
import Checkout from 'src/screens/Checkout';
import Controls from 'src/components/Controls';
import ConfirmationCode from 'src/screens/ConfirmationCode';
import { FinalPayLater, FinalInstallments } from 'src/screens/Final';
import Rejected from 'src/screens/Rejected';
import DropzoneUpload from 'src/screens/DropzoneUpload';
import GalleryUpload from 'src/screens/GalleryUpload';
import WelcomeBack from 'src/screens/WelcomeBack';
import ScanConfirm from 'src/screens/ScanConfirm';
import ScanError from 'src/screens/ScanError';
import Initial from 'src/screens/Initial';
import InternalServerError from 'src/screens/InternalServerError';
import InstallmentPlan from 'src/screens/InstallmentPlan';
import Downpayment from 'src/screens/Downpayment';

import request, { IRequestError } from 'core/utils/Request';
import { MIN_WIDTH } from 'src/constants';
import model from 'src/model';
import clientRoutes from 'src/routes/client';

export default observer(() => {
  let component = null;
  const { route } = model.store;
  const isMinWidth = useMediaPredicate(`(max-width: ${MIN_WIDTH}px)`);

  useEffect(() => {
    const requestInstance = request.getInstance();

    requestInstance.interceptors.response.use(
      response => response,
      (error: IRequestError) => {
        if (error?.response?.status >= 500) {
          model.pushHistory(clientRoutes.internalServerError);
        }

        return Promise.reject(error);
      }
    );
  }, []);

  switch (model.store.route) {
    case clientRoutes.downpayment:
      component = <Downpayment />;
      break;
    case clientRoutes.installmentPlan:
      component = <InstallmentPlan />;
      break;
    case clientRoutes.authorizationCode:
      component = <AuthorizationCode />;
      break;
    case clientRoutes.confirmationCode:
      component = <ConfirmationCode />;
      break;
    case clientRoutes.internalServerError:
      component = <InternalServerError />;
      break;
    case clientRoutes.scanConfirm:
      component = <ScanConfirm />;
      break;
    case clientRoutes.initial:
      component = <Initial />;
      break;
    case clientRoutes.scanError:
      component = <ScanError />;
      break;
    case clientRoutes.upload:
      component = isMinWidth ? <GalleryUpload /> : <DropzoneUpload />;
      break;
    case clientRoutes.finalPayLater:
      component = <FinalPayLater />;
      break;
    case clientRoutes.finalInstallments:
      component = <FinalInstallments />;
      break;
    case clientRoutes.rejected:
      component = <Rejected />;
      break;
    case clientRoutes.checkout:
      component = <Checkout />;
      break;
    case clientRoutes.welcomeBack:
      component = <WelcomeBack />;
      break;
  }

  return (
    <>
      {[clientRoutes.checkout, clientRoutes.welcomeBack].includes(
        model.store.route
      ) ? (
        <Header />
      ) : (
        <Controls />
      )}
      <Page
        theme={
          [clientRoutes.checkout, clientRoutes.welcomeBack].includes(route)
            ? 'gray'
            : 'default'
        }
      >
        {component}
      </Page>
    </>
  );
});
