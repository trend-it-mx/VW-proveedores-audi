import Crumb from '@/components/Crumb';

function Breadcrumbs({ breadcrumbs }) {
  return (
    <div className="flex gap-2">
      {breadcrumbs.map((crumb, idx) => {
        return (
          <Crumb {...crumb} key={idx} last={idx === breadcrumbs.length - 1} />
        );
      })}
    </div>
  );
}
export default Breadcrumbs;
