export const localizePath = (pathname: string, locale: string, search = '') => {
  const [, , ...segments] = pathname.split('/');
  return `/${locale}/${segments.join('/')}${search}`;
};
