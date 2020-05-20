import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { useHistory } from 'react-router';

import Menu from 'ui-kit/components/Menu';

import clientRoutes from 'src/routes/client';
import analytics from 'src/analytics';
import commonModel from 'src/entities/Common/model';
import css from './Nav.css';

export default observer(() => {
  const [isVisible, setVisibility] = useState(false);
  const [isShow, setShow] = useState(false);
  const history = useHistory();

  const hide = () => {
    setVisibility(false);

    setTimeout(() => {
      setShow(false);
      commonModel.toggleMenu();
    }, 400);
  };

  const handleParanjaClick = () => {
    hide();
  };

  const handleActiveMenuItem = (name: string) => {
    if (isVisible) {
      analytics.events.menu.clickOnItem(name);
      hide();
    }
  };

  const handleLogoClick = () => {
    history.push(clientRoutes.common);

    if (isVisible) {
      hide();
    }
  };

  useEffect(() => {
    if (commonModel.isMenuOpened) {
      analytics.events.menu.open();
      document.body.classList.add('block-scroll');
    } else {
      document.body.classList.remove('block-scroll');
    }

    if (!commonModel.isMenuOpened) {
      return;
    }

    setShow(commonModel.isMenuOpened);

    const timeout = setTimeout(() => {
      setVisibility(commonModel.isMenuOpened);
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [commonModel.isMenuOpened]);

  return (
    <>
      <div
        onClick={handleParanjaClick}
        className={classnames(
          css.paranja,
          isShow && css.show,
          isVisible && css.visible
        )}
      />
      <div className={classnames(css.container, isVisible && css.visible)}>
        <div className={css.inner}>
          <div onClick={handleLogoClick} className={css.logo} />
          <Menu
            onActive={handleActiveMenuItem}
            items={[
              {
                type: 'nav',
                name: 'home',
                path: clientRoutes.common,
                title: 'Home',
                exact: true,
              },
              {
                type: 'nav',
                name: 'profile',
                iconClassName: css.defaultAvatar,
                path: clientRoutes.profile,
                title: 'Profile',
                exact: true,
              },
              {
                type: 'redirect',
                name: 'support',
                path: 'https://help.tabby.ai',
                title: 'Support',
                exact: true,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
});
