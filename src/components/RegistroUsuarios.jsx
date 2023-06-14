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
      <div className="flex w-2/3 flex-col divide-y-2 bg-white">
        <div className="w-full bg-vw_dark_blue pl-4 pt-2 pb-1 text-white">
          Registro de usuarios
        </div>

        <div className="flex">
          <label
            htmlFor={'usuario'}
            className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
          >
            {formatField('usuario')}
          </label>

          <Select
            className="w-full pl-4"
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
        <div className="flex">
          <label
            htmlFor={'nombre'}
            className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
          >
            {formatField('nombre')}
          </label>
          <Select
            className="w-full pl-4"
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
        <div className="flex">
          <label
            htmlFor={'correo_electronico'}
            className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
          >
            {formatField('correo_electronico')}
          </label>

          <Select
            className="w-full pl-4"
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
        <div className="flex">
          <label
            htmlFor={'roles'}
            className="w-1/4 bg-vw_dark_blue pl-4 pt-2 pb-1 font-light text-white"
          >
            {formatField('roles')}
          </label>

          <div className="flex w-full justify-between gap-4 items-center">
            <Select
              className="w-full pl-4"
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
              <div className="flex gap-4 px-8 bg-vw_dark_blue text-white h-full items-center">
                <label htmlFor={'visualizador'} className="whitespace-nowrap">
                  Acceso a tableros
                </label>
                <input
                  type="checkbox"
                  className="h-6 w-6"
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
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-10 py-2">
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
