/* eslint-disable import/no-extraneous-dependencies */

module.exports = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_SISTEMA: process.env.NEXT_PUBLIC_SISTEMA
  },
  distDir: 'build',
};
