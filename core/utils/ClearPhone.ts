export default (phone = '') => {
  const match = phone
    .replace(/[ _-]*/g, '')
    .match(/^(00971|\+?971|0?)(5\d{8})$/);

  if (match) {
    return match[2];
  }

  return phone;
};
