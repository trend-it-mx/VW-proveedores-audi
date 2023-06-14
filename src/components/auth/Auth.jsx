import { useSession, signIn } from 'next-auth/react';

export default function Auth({ children }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return children;
}
