import { catOpciones } from './opcionesMenu';

export default function generateBreadcrumbs(asPathWithoutQuery) {
  const asPathNestedRoutes = asPathWithoutQuery
    ? asPathWithoutQuery.split('/').filter((v) => v.length > 0)
    : [];
  const crumblist = asPathNestedRoutes.map((subpath, idx) => {
    const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;
    const text = catOpciones.filter((opc) => opc.ruta === href)[0]?.nombre;

    return {
      href,
      text:
        text ||
        (subpath.charAt(0).toUpperCase() + subpath.slice(1)).replaceAll(
          '_',
          ' '
        ),
    };
  });
  return [{ href: '/', text: 'Audi' }, ...crumblist];
}
