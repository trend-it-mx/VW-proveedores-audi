import '../styles/global.css';
import '@/styles/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
// import Auth from '@/components/auth/Auth';
import AuthTemp from '@/components/auth/AuthTemp';
import { UserProvider } from '@/components/context';
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <UserProvider>
      <SessionProvider session={session}>
        {Component.auth ? (
          // <Auth>
          <AuthTemp roles={Component.roles}>
            <Component {...pageProps} />
          </AuthTemp>
        ) : (
          // </Auth>
          <Component {...pageProps} />
        )}

        <ToastContainer />
      </SessionProvider>
    </UserProvider>
  );
};
export default MyApp;
