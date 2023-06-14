export const opciones = [
  {
    nombre: 'Ingesta',
    ruta: '/ingesta',
    roles: ['Key user'],
    subopciones: [
      {
        nombre: 'Órdenes de compra',
        ruta: '/ingesta/ordenes_de_compra',
        roles: ['Key user'],
      },
      {
        nombre: 'Usuarios',
        ruta: '/ingesta/usuarios',
        roles: ['Key user'],
      },
      {
        nombre: 'Escalamiento',
        ruta: '/ingesta/escalamiento',
        roles: ['Key user'],
      },
      {
        nombre: 'Facturación',
        ruta: '/ingesta/facturacion',
        roles: ['Key user'],
      },
    ],
  },
  // {
  //   nombre: 'Administración',
  //   ruta: '/administracion',
  //   roles: ['Administrador'],
  //   subopciones: [
  //     {
  //       nombre: 'Parámetros',
  //       ruta: '/administracion/parametros',
  //       roles: ['Administrador'],
  //       subopciones: [
  //         {
  //           nombre: 'Parámetros generales',
  //           ruta: '/administracion/parametros/parametros_generales',
  //           roles: ['Administrador'],
  //         },
  //         {
  //           nombre: 'Consultar tipo de cambio',
  //           ruta: '/administracion/parametros/consultar_tipo_de_cambio',
  //           roles: ['Administrador'],
  //         },
  //         // {
  //         //   nombre: 'Layout de archivos',
  //         //   ruta: '/administracion/parametros/layout_de_archivos',
  //         // },
  //       ],
  //     },
  //     {
  //       nombre: 'Encuestas',
  //       ruta: '/administracion/encuestas',
  //       roles: ['Administrador'],
  //       subopciones: [
  //         {
  //           nombre: 'Preguntas',
  //           ruta: '/administracion/encuestas/preguntas',
  //           roles: ['Administrador'],
  //         },
  //         {
  //           nombre: 'Rubros',
  //           ruta: '/administracion/encuestas/rubros',
  //           roles: ['Administrador'],
  //         },
  //         {
  //           nombre: 'Templates',
  //           ruta: '/administracion/encuestas/templates',
  //           roles: ['Administrador'],
  //         },
  //       ],
  //     },
  //     {
  //       nombre: 'Calendario',
  //       ruta: '/administracion/calendario',
  //       roles: ['Administrador'],
  //       subopciones: [
  //         {
  //           nombre: 'Cargar calendario',
  //           ruta: '/administracion/calendario/cargar_calendario',
  //           roles: ['Administrador'],
  //         },
  //         {
  //           nombre: 'Consultar calendario',
  //           ruta: '/administracion/calendario/consultar_calendario',
  //           roles: ['Administrador'],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   nombre: 'Seguridad',
  //   ruta: '/seguridad',
  //   roles: ['Administrador'],
  //   subopciones: [
  //     {
  //       nombre: 'Usuarios',
  //       ruta: '/seguridad/usuarios',
  //       roles: ['Administrador'],
  //     },
  //   ],
  // },
  // {
  //   nombre: 'Transformación',
  //   ruta: '/transformación',
  //   roles: ['Key user'],
  //   subopciones: [
  //     {
  //       nombre: 'Cálculo de tipo de cambio',
  //       ruta: '/transformacion/calculo_de_tipo_de_cambio',
  //       roles: ['Key user'],
  //     },
  //     {
  //       nombre: 'Suma total del pedido',
  //       ruta: '/transformacion/suma_total_del_pedido',
  //       roles: ['Key user'],
  //     },
  //     {
  //       nombre: 'Total Facturado',
  //       ruta: '/transformacion/total_facturado',
  //       roles: ['Key user'],
  //     },
  //     {
  //       nombre: 'Ingesta de Usuarios y Roles',
  //       ruta: '/transformacion/ingesta_de_usuarios_y_roles',
  //       roles: ['Key user'],
  //     },
  //     {
  //       nombre: 'Generación de Encuestas',
  //       ruta: '/transformacion/generacion_de_encuestas',
  //       roles: ['Key user'],
  //     },
  //   ],
  // },
  // {
  //   nombre: 'Analítica',
  //   ruta: '/analitica',
  //   roles: ['Key user'],
  //   subopciones: [
  //     {
  //       nombre: 'Operativo',
  //       ruta: '/analitica/operativo',
  //       roles: ['Key user'],
  //     },
  //     {
  //       nombre: 'Evaluación de proveedores',
  //       ruta: '/analitica/evaluacion_de_proveedores',
  //       roles: ['Key user'],
  //     },
  //   ],
  // },
  {
    nombre: 'Encuestas',
    ruta: '/encuestas',
    roles: ['Solicitante', 'Comprador'],
  },
];

export const catOpciones = [
  {
    nombre: 'Inicio',
    ruta: '/',
    padre: '/',
    hijos: [
      '/ingesta',
      // '/administracion',
      // '/seguridad',
      // '/transformacion',
      // '/analitica',
      '/encuestas',
    ],
  },
  {
    nombre: 'Ingesta',
    ruta: '/ingesta',
    padre: '/',
    hijos: [
      '/ingesta/ordenes_de_compra',
      '/ingesta/usuarios',
      '/ingesta/escalamiento',
      '/ingesta/facturacion',
    ],
  },
  {
    nombre: 'Órdenes de compra',
    ruta: '/ingesta/ordenes_de_compra',
    padre: '/ingesta',
    hijos: [],
  },
  {
    nombre: 'Usuarios',
    ruta: '/ingesta/usuarios',
    padre: '/ingesta',
    hijos: [],
  },
  {
    nombre: 'Escalamiento',
    ruta: '/ingesta/escalamiento',
    padre: '/ingesta',
    hijos: [],
  },
  {
    nombre: 'Facturación',
    ruta: '/ingesta/facturacion',
    padre: '/ingesta',
    hijos: [],
  },
  {
    nombre: 'Administración',
    ruta: '/administracion',
    padre: '/',
    hijos: [
      '/administracion/parametros',
      '/administracion/encuestas',
      '/administracion/calendario',
    ],
  },
  {
    nombre: 'Parámetros',
    ruta: '/administracion/parametros',
    padre: '/administracion',
    hijos: [
      '/administracion/parametros/parametros_generales',
      '/administracion/parametros/consultar_tipo_de_cambio',
      // '/administracion/parametros/layout_de_archivos',
    ],
  },
  {
    nombre: 'Parámetros generales',
    ruta: '/administracion/parametros/parametros_generales',
    padre: '/administracion/parametros',
    hijos: [],
  },
  {
    nombre: 'Consultar tipo de cambio',
    ruta: '/administracion/parametros/consultar_tipo_de_cambio',
    padre: '/administracion/parametros',
    hijos: [],
  },
  // {
  //   nombre: 'Layout de archivos',
  //   ruta: '/administracion/parametros/layout_de_archivos',
  //   padre: '/administracion/parametros',
  //   hijos: [
  //     '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_ordenes',
  //     '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_usuarios',
  //     '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_escalamiento',
  //     '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_facturas',
  //   ],
  // },
  // {
  //   nombre: 'Layout de archivos de órdenes',
  //   ruta: '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_ordenes',
  //   padre: '/administracion/parametros/layout_de_archivos',
  //   hijos: [],
  // },
  // {
  //   nombre: 'Layout de archivos de usuarios',
  //   ruta: '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_usuarios',
  //   padre: '/administracion/parametros/layout_de_archivos',
  //   hijos: [],
  // },
  // {
  //   nombre: 'Layout de archivos de escalamiento',
  //   ruta: '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_escalamiento',
  //   padre: '/administracion/parametros/layout_de_archivos',
  //   hijos: [],
  // },
  // {
  //   nombre: 'Layout de archivos de facturas',
  //   ruta: '/administracion/parametros/layout_de_archivos/layout_de_archivos_de_facturas',
  //   padre: '/administracion/parametros/layout_de_archivos',
  //   hijos: [],
  // },
  {
    nombre: 'Encuestas',
    ruta: '/administracion/encuestas',
    padre: '/administracion',
    hijos: [
      '/administracion/encuestas/preguntas',
      '/administracion/encuestas/rubros',
      '/administracion/encuestas/templates',
    ],
  },
  {
    nombre: 'Preguntas',
    ruta: '/administracion/encuestas/preguntas',
    padre: '/administracion/encuestas',
    hijos: [],
  },
  {
    nombre: 'Rubros',
    ruta: '/administracion/encuestas/rubros',
    padre: '/administracion/encuestas',
    hijos: [],
  },
  {
    nombre: 'Templates',
    ruta: '/administracion/encuestas/templates',
    padre: '/administracion/encuestas',
    hijos: [],
  },
  {
    nombre: 'Calendario',
    ruta: '/administracion/calendario',
    padre: '/administracion',
    hijos: [
      '/administracion/calendario/cargar_calendario',
      '/administracion/calendario/consultar_calendario',
    ],
  },
  {
    nombre: 'Cargar calendario',
    ruta: '/administracion/calendario/cargar_calendario',
    padre: '/administracion/calendario',
    hijos: [],
  },
  {
    nombre: 'Consultar calendario',
    ruta: '/administracion/calendario/consultar_calendario',
    padre: '/administracion/calendario',
    hijos: [],
  },
  {
    nombre: 'Seguridad',
    ruta: '/seguridad',
    padre: '/',
    hijos: ['/seguridad/usuarios'],
  },
  {
    nombre: 'Usuarios',
    ruta: '/seguridad/usuarios',
    padre: '/seguridad',
    hijos: [],
  },
  {
    nombre: 'Transformación',
    ruta: '/transformacion',
    padre: '/',
    hijos: [
      '/transformacion/calculo_de_tipo_de_cambio',
      '/transformacion/suma_total_del_pedido',
      '/transformacion/total_facturado',
      '/transformacion/ingesta_de_usuarios_y_roles',
      '/transformacion/generacion_de_encuestas',
    ],
  },
  {
    nombre: 'Cálculo de tipo de cambio',
    ruta: '/transformacion/calculo_de_tipo_de_cambio',
    padre: '/transformacion',
    hijos: [],
  },
  {
    nombre: 'Suma total del pedido',
    ruta: '/transformacion/suma_total_del_pedido',
    padre: '/transformacion',
    hijos: [],
  },
  {
    nombre: 'Total Facturado',
    ruta: '/transformacion/total_facturado',
    padre: '/transformacion',
    hijos: [],
  },
  {
    nombre: 'Ingesta de Usuarios y Roles',
    ruta: '/transformacion/ingesta_de_usuarios_y_roles',
    padre: '/transformacion',
    hijos: [],
  },
  {
    nombre: 'Generación de Encuestas',
    ruta: '/transformacion/generacion_de_encuestas',
    padre: '/transformacion',
    hijos: [],
  },
  {
    nombre: 'Analítica',
    ruta: '/analitica',
    padre: '/',
    hijos: ['/analitica/operativo', '/analitica/evaluacion_de_proveedores'],
  },
  {
    nombre: 'Operativo',
    ruta: '/analitica/operativo',
    padre: '/analitica',
    hijos: [],
  },
  {
    nombre: 'Evaluación de proveedores',
    ruta: '/analitica/evaluacion_de_proveedores',
    padre: '/analitica',
    hijos: [],
  },
  {
    nombre: 'Encuestas',
    ruta: '/encuestas',
    padre: '/',
    hijos: [],
  },
];
