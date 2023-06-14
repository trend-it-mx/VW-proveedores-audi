import { useContext, useState, useEffect } from 'react';
import { UserDispatchContext, UserContext } from '@/components/context';
import axios from 'axios';
import { config } from '@/utils/constants';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Login = () => {
  const setUserDetails = useContext(UserDispatchContext);
  const userDetails = useContext(UserContext);
  const [datos, setDatos] = useState({ userName: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    // console.log(userDetails);
    if (userDetails.user_name) {
      router.push('/');
    }
  }, [router, userDetails]);

  const iniciarSesion = async () => {
    try {
      const { data } = await toast.promise(
        axios.get(`${config.url.API_URL}/api/tempAuth/`, {
          params: {
            userName: datos.userName,
            password: datos.password,
          },
        }),
        {
          pending: 'Iniciando sesión',
          success: 'Sesión iniciada',
          error: {
            render(res) {
              return res?.data?.response?.data;
            },
          },
        }
      );
      // console.log(data);
      setUserDetails(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <main className="mt-0 transition-all duration-200 ease-in-out">
      <section>
        <div className="relative flex items-center min-h-screen p-0 overflow-hidden bg-center bg-cover">
          <div className="container z-1">
            <div className="flex flex-wrap -mx-3">
              <div className="flex flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
                <div className="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none lg:py4 dark:bg-slate-850 rounded-2xl bg-clip-border">
                  <div className="p-6 pb-0 mb-0">
                    <h4 className="font-bold">Login</h4>
                  </div>
                  <div className="flex-auto p-6">
                    <form role="form">
                      <div className="mb-4">
                        <input
                          id="userName"
                          placeholder="Username"
                          value={datos.userName}
                          onChange={(e) =>setDatos((prev) => ({ ...prev, userName: e.target.value }))}
                          className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" 
                          type="text" />
                      </div>
                      <div className="mb-4">
                      <input
                          id="password"
                          type="password"
                          value={datos.password}
                          onChange={(e) => setDatos((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Password"
                          className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding p-3 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>                    
                      <div className="text-center">
                        <button onClick={iniciarSesion} type="button" className="inline-block w-full px-16 py-3.5 mt-6 mb-0 text-sm font-bold leading-normal text-center text-white align-middle transition-all ease-in bg-black border-0 rounded-lg shadow-md cursor-pointer hover:-translate-y-px active:opacity-85 hover:shadow-xs tracking-tight-rem bg-150 bg-x-25">Entrar</button>
                      </div>
                    </form>
                  </div>                
                </div>
              </div>
              <div className="absolute top-0 right-0 flex-col justify-center hidden w-6/12 h-full max-w-full px-3 pr-0 my-auto text-center flex-0 lg:flex">
                <div className="relative flex flex-col justify-center h-full px-24 m-4 bg-cover rounded-xl bg-[url('/assets/images/audi_login.jpg')]"></div>
              </div>
            </div>
          </div>
      </div>
    </section>
  </main>
  );
};

export default Login;
