import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context';

export default function AuthTemp({ children, roles }) {
  const userDetails = useContext(UserContext);
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    if (!userDetails.user_name) {
      router.push('/login');
      return;
    }
    if (roles) {
      if (userDetails.roles.some((r) => roles.indexOf(r) >= 0)) {
        setAutenticado(true);
        return;
      }
    } else {
      setAutenticado(true);
      return;
    }

    router.push('/login');
  }, [roles, router, userDetails, userDetails.roles, userDetails.user_name]);

  if (autenticado) {
    return children;
  }
  return <></>;
}
