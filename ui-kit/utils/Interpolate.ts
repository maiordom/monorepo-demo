import React from 'react';

export default (
  text: string,
  translations: Record<string, string | number | React.ReactElement>
) => {
  const array = text.split(/{{([a-zA-Z]*)}}/g);

  const formated: (string | number | React.ReactElement)[] = array.map(word => {
    if (word in translations) {
      return translations[word];
    }

    return word;
  });

  return formated;
};
