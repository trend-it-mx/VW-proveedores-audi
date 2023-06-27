const BotonesLayout = ({ texto }) => {
  return (
    <button className="flex h-10 w-full items-center justify-between gap-2 rounded-3xl border-2 bg-vw_dark_blue px-10 text-center text-lg text-white hover:bg-slate-400 hover:text-vw_dark_blue">
      <div>
        <span className="-mt-1">{texto}</span>
      </div>
      <div>
        <span className="-mt-1">{'▶'}</span>
      </div>
    </button>
  );
};
export default BotonesLayout;
// # sourceMappingURL=BotonesLayout.jsx.map
