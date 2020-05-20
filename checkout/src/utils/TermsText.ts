import i18n from 'src/locales';

export default (terms: number[]) =>
  terms.length
    ? terms
        .map((term, index) => {
          if (index === terms.length - 1) {
            return ' ' + i18n().common.or + ' ' + term;
          } else if (index) {
            return ', ' + term;
          }

          return term;
        })
        .join('')
    : terms.join(', ');
