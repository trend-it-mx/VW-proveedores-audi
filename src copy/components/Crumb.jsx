import Link from 'next/link';

function Crumb({ text, href, last = false }) {
  if (last) {
    return <h3 className="text-vw_blue font-bold">{text}</h3>;
  }
  return (
    <>
      <Link href={href}>{text}</Link> <p>&gt;</p>
    </>
  );
}
export default Crumb;
// # sourceMappingURL=Crumb.jsx.map
