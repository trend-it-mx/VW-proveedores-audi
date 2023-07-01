import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '@/utils/constants';
import { formatField } from '@/utils/formatField';
import { Tema } from '@/utils/Types';
import Select from 'react-select';
import { useEffect, useState, useContext } from 'react';
// import { useSession } from 'next-auth/react';
import { UserContext } from '@/components/context';
import Boton from '@/components/Boton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload, faClose   
} from "@fortawesome/free-solid-svg-icons";

const Registro = ({ actualizar, setActualizar, setData }) => {
  // const { data: session } = useSession();
  const userDetails = useContext(UserContext);

  const [opcUsuarios, setOpcUsuarios] = useState();
  const [opcNombres, setOpcNombres] = useState();
  const [opcCorreos, setOpcCorreos] = useState();
  const [opcRoles, setOpcRoles] = useState([]);
  const [usuariosCompletos, setUsuariosCompletos] = useState();

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const res = await axios.get(
        `${config.url.API_URL}/api/seguridad/catalogo_usuarios`
      );

      const datosUsuarios = res.data;

      setUsuariosCompletos(
        datosUsuarios.map((data) => ({
          usuario: data.USER_NAME,
          nombre: data.FULL_NAME,
          correo_electronico: data.E_MAIL,
        }))
      );

      setOpcUsuarios(
        datosUsuarios.map((data) => ({
          value: data.USER_NAME,
          label: data.USER_NAME,
        }))
      );

      setOpcNombres(
        datosUsuarios.map((data) => ({
          value: data.FULL_NAME,
          label: data.FULL_NAME,
        }))
      );

      setOpcCorreos(
        datosUsuarios.map((data) => ({
          value: data.E_MAIL,
          label: data.E_MAIL,
        }))
      );
    };

    const obtenerRoles = async () => {
      const res = await axios.get(`${config.url.API_URL}/api/roles_plataforma`);

      const rolesUsuario = res.data;

      setOpcRoles(
        rolesUsuario.map((rol) => ({ value: rol.ID_ROL, label: rol.ROL }))
      );
    };

    obtenerUsuarios();

    obtenerRoles();
  }, []);

  return (
    <div
      className={`${
        !actualizar.activo && 'hidden'
      } fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/40`}
    >
      <div className="relative flex flex-col bg-white border border-solid pointer-events-auto dark:bg-slate-850 bg-clip-padding border-black/20 rounded-xl outline-0">
        <div class="flex items-center justify-between p-4 border-b border-solid shrink-0 border-slate-100 rounded-t-xl">
          <h5 class="mb-0 leading-normal dark:text-white" >Registro de usuarios</h5>
          <button type="button" 
          onClick={() =>
            setActualizar((prev) => ({
              ...prev,
              activo: false,
              dato: {
                usuario: '',
                nombre: '',
                correo_electronico: '',
                roles: [''],
                estatus: '',
              },
              idx: undefined,
            }))
          }>
            <FontAwesomeIcon icon={faClose} className="w-4 h-4 ml-auto box-content p-2 text-black dark:text-white border-0 rounded-1.5 opacity-50 cursor-pointer -m-2"/>
          </button>
          </div>
        <div className="">
          <div className=" max-w-full px-3 flex-0">
              <label
                htmlFor={'usuario'} className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >
                {formatField('usuario')}
              </label>
              <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
                  <Select
                    className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                    name={'usuario'}
                    noOptionsMessage={() => 'No hay usuarios por agregar'}
                    instanceId={'usuario'}
                    value={
                      actualizar.dato.usuario !== '' && {
                        value: actualizar.dato.usuario,
                        label: actualizar.dato.usuario,
                      }
                    }
                    isDisabled={actualizar.idx !== undefined}
                    placeholder="Usuario..."
                    onChange={(e) => {
                      setActualizar((previo) => {
                        const objetoNuevo = {
                          ...previo.dato,
                          ...usuariosCompletos.filter(
                            (usuario) => usuario.usuario === e.value
                          )[0],
                        };
                        return { ...previo, dato: { ...objetoNuevo } };
                      });
                    }}
                    options={opcUsuarios}
                  />
              </div>
          </div>
          <div className=" max-w-full px-3 flex-0">
            <label htmlFor={'nombre'} className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >
              {formatField('nombre')}
            </label>
            <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
              <Select
                className="w-full pl-4"
                className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                name={'nombre'}
                instanceId={'nombre'}
                value={
                  actualizar.dato.nombre !== '' && {
                    value: actualizar.dato.nombre,
                    label: actualizar.dato.nombre,
                  }
                }
                isDisabled={actualizar.idx !== undefined}
                placeholder="Nombre..."
                noOptionsMessage={() => 'No hay usuarios por agregar'}
                onChange={(e) => {
                  setActualizar((previo) => {
                    const objetoNuevo = {
                      ...previo.dato,
                      ...usuariosCompletos.filter(
                        (usuario) => usuario.nombre === e.value
                      )[0],
                    };
                    return { ...previo, dato: { ...objetoNuevo } };
                  });
                }}
                options={opcNombres}
              />
            </div>
          </div>
          <div className=" max-w-full px-3 flex-0">
            <label htmlFor={'correo_electronico'} className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80" >
              {formatField('correo_electronico')}
            </label>
            <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
              <Select
                className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                name={'correo_electronico'}
                noOptionsMessage={() => 'No hay usuarios por agregar'}
                instanceId={'correo_electronico'}
                value={
                  actualizar.dato.correo_electronico !== '' && {
                    value: actualizar.dato.correo_electronico,
                    label: actualizar.dato.correo_electronico,
                  }
                }
                isDisabled={actualizar.idx !== undefined}
                placeholder="Email..."
                onChange={(e) => {
                  setActualizar((previo) => {
                    const objetoNuevo = {
                      ...previo.dato,
                      ...usuariosCompletos.filter(
                        (usuario) => usuario.correo_electronico === e.value
                      )[0],
                    };
                    return { ...previo, dato: { ...objetoNuevo } };
                  });
                }}
                options={opcCorreos}
              />
          </div>   
          </div>
          <div className=" max-w-full px-3 flex-0">
            <label
              htmlFor={'roles'}
              className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80"
            >
              {formatField('roles')}
            </label>
                    
            
            <div className="relative flex flex-wrap items-stretch w-full rounded-lg">
              <Select
                className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
                name={'roles'}
                instanceId={'roles'}
                value={
                  actualizar.dato.roles?.[0] !== '' &&
                  opcRoles.find((rol) => rol.value === actualizar.dato.roles[0])
                }
                placeholder="Rol..."
                onChange={(e) => {
                  setActualizar((previo) => {
                    const objetoNuevo = {
                      ...previo.dato,
                      roles: [e.value],
                    };
                    return { ...previo, dato: { ...objetoNuevo } };
                  });
                }}
                options={opcRoles}
              />

              {actualizar.dato?.roles?.some(
                (rol) => ['Comprador', 'Solicitante'].indexOf(rol) >= 0
              ) && (
                <div className="flex gap-4 px-8  text-white h-full items-center">
                  <label htmlFor={'visualizador'}  className="mb-3 py-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80">
                    Acceso a tableros                  
                  <input
                    type="checkbox"
                    class="w-5 h-5 ease text-base -ml-7 rounded-1.4  checked:bg-gradient-to-tl checked:from-black checked:to-black after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-150 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100"
                    checked={actualizar.dato.roles?.[1] === 'Analista'}
                    onChange={(e) => {
                      setActualizar((previo) => {
                        const objetoNuevo = {
                          ...previo.dato,
                          roles: e.target.checked
                            ? [actualizar.dato.roles[0], 'Analista']
                            : [actualizar.dato.roles[0]],
                        };
                        return { ...previo, dato: { ...objetoNuevo } };
                      });
                    }}
                  />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-center gap-10 py-2 pl-20 pr-20">
          <Boton
            texto="Cancelar"
            tema={Tema.blanco}
            onClick={() =>
              setActualizar((prev) => ({
                ...prev,
                activo: false,
                dato: {
                  usuario: '',
                  nombre: '',
                  correo_electronico: '',
                  roles: [''],
                  estatus: '',
                },
                idx: undefined,
              }))
            }
          />
          <Boton
            texto="Guardar"
            tema={Tema.azul}
            onClick={async () => {
              if (
                !actualizar.dato.usuario ||
                !actualizar.dato.nombre ||
                !actualizar.dato.correo_electronico ||
                actualizar.dato.roles.length === 0
              ) {
                toast.error('Seleccione un usuario y un rol');
                return;
              }
              const actualizarIdx = actualizar.idx;
              if (actualizarIdx !== undefined) {
                setData((prev) => [
                  ...prev.slice(0, actualizarIdx),
                  {
                    ...prev[actualizarIdx],
                    ...actualizar.dato,
                  },
                  ...prev.slice(actualizarIdx + 1),
                ]);
                await toast.promise(
                  axios.put(
                    `${config.url.API_URL}/api/seguridad/usuario/${actualizar.dato.usuario}`,
                    {
                      roles: actualizar.dato.roles,
                      estatus: actualizar.dato.estatus,
                    }
                  ),
                  {
                    pending: 'Actualizando usuario',
                    success: 'Usuario actualizado',
                    error: 'Error actualizando el usuario',
                  }
                );
              } else {
                setActualizar((previo) => {
                  const objetoNuevo = previo.dato;
                  objetoNuevo.estatus = 'Activo';
                  return { ...previo, dato: { ...objetoNuevo } };
                });
                const res = await toast.promise(
                  axios.post(`${config.url.API_URL}/api/seguridad/usuarios`, {
                    usuario: actualizar.dato.usuario,
                    nombre: actualizar.dato.nombre,
                    correo_electronico: actualizar.dato.correo_electronico,
                    roles: actualizar.dato.roles,
                    // user_name: session.user.user_name,
                    user_name: userDetails.user_name,
                  }),
                  {
                    pending: 'Agregando usuario',
                    success: 'Usuario agregado',
                    error: 'Error agregando el usuario',
                  }
                );
                const { usuario } = res.data;
                setData((prev) => [...prev, { ...actualizar.dato, usuario }]);
              }
              setActualizar((prev) => ({
                ...prev,
                activo: false,
                dato: {
                  usuario: '',
                  nombre: '',
                  correo_electronico: '',
                  roles: [''],
                  estatus: '',
                },
                idx: undefined,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Registro;
