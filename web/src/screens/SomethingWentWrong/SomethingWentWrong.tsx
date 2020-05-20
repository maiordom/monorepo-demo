import React from 'react';

import Button from 'ui-kit/components/Button';

import i18n from 'src/locales';

import css from './SomethingWentWrong.css';

export default () => {
  const handleBackClick = () => {
    history.back();
  };

  return (
    <div className={css.container}>
      <div className={css.title}>
        {i18n().somethingWentWrong.title.map(word => (
          <div key={word}>{word}</div>
        ))}
      </div>
      <div className={css.picture} />
      <Button className={css.back} onClick={handleBackClick}>
        {i18n().somethingWentWrong.back}
      </Button>
    </div>
  );
};
