const CargaLayout = () => (
  <div>
    <div className="flex w-full justify-between border-2  border-stone-600 bg-vw_dark_blue px-10 text-white">
      <div>Layout para archivos de ordenes</div>
      <div>▼</div>
    </div>

    <form className="flex border-2 border-t-0 border-stone-600">
      <div className="flex w-4/12 justify-between bg-vw_dark_blue  px-10 text-white">
        Ambiente de Desarrollo
      </div>
      <div className="flex w-2/12">
        <div className="flex w-full items-center bg-white text-vw_dark_blue">
          <select className="flex w-full">
            <option value="Desarrollo">Desarrollo</option>
            <option value="Pruebas">Pruebas</option>
            <option value="Producción">Producción</option>
          </select>
        </div>
      </div>
      <div className="flex w-5/12 justify-between bg-vw_dark_blue  px-10 text-white">
        Total de campos/columnas del archivo
      </div>
      <div className="flex w-1/12 bg-white  px-4 text-vw_dark_blue">
        <input type="number" min="0" max="10" className="flex w-fit" />
      </div>
    </form>
  </div>
);
export default CargaLayout;
// # sourceMappingURL=CargaLayout.jsx.map
