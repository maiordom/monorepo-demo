import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import Icon from 'ui-kit/components/Icon';

import commonModel from 'src/entities/Common/model';
import css from './Overlay.css';

interface IProps {
  children: React.ReactElement;
}

export default observer(({ children }: IProps) => {
  const [isVisible, setVisibility] = useState(false);
  const [isShow, setShow] = useState(false);
  const containerRef = useRef();

  const close = () => {
    setVisibility(false);

    setTimeout(() => {
      setShow(false);
      commonModel.toggleOverlay();
    }, 200);
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef?.current === event.target) {
      close();
    }
  };

  useEffect(() => {
    if (commonModel.isOverlayVisible) {
      document.body.classList.add('block-scroll');
    } else {
      document.body.classList.remove('block-scroll');
    }

    if (!commonModel.isOverlayVisible) {
      return;
    }

    setShow(commonModel.isOverlayVisible);

    const timeout = setTimeout(() => {
      setVisibility(commonModel.isOverlayVisible);
    }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [commonModel.isOverlayVisible]);

  return (
    <>
      <div
        className={classnames(
          css.paranja,
          isShow && css.show,
          isVisible && css.visible
        )}
      />
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={classnames(
          css.container,
          isShow && css.show,
          isVisible && css.visible
        )}
      >
        <div className={css.content}>
          <div className={css.inner}>
            {children}
            <Icon onClick={close} className={css.close} name="close-large" />
          </div>
        </div>
      </div>
    </>
  );
});
