import Link from 'next/link';
import { catOpciones } from '@/utils/opcionesMenu';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BotonesIntermedias = () => {
  const [opcBotones, setOpcBotones] = useState();
  const router = useRouter();
  useEffect(() => {
    const ruta = catOpciones.find((opc) => opc.ruta === router.pathname);
    setOpcBotones(
      ruta.hijos.map((hijo) => catOpciones.find((opc) => opc.ruta === hijo))
    );
  }, [router.pathname]);

  return (
    <>
      <h1 className="mb-6 font-bold">Seleccione una opción:</h1>
      <div className="grid grid-cols-2 gap-y-6 gap-x-4 pl-4">
        {opcBotones &&
          opcBotones.map((opc) => (
            <Link key={opc.nombre} href={opc.ruta}>
              <a className="rounded-xl border-2 border-black py-2 text-center shadow-lg hover:bg-black">
                {opc.nombre}
              </a>
            </Link>
          ))}
      </div>
    </>
  );
};
export default BotonesIntermedias;
