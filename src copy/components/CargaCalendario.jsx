const CargaCalendario = () => (
  <div className="w-full">
    <div className="flex w-full justify-between border-2  border-stone-600 bg-vw_dark_blue px-10 text-white">
      <div>Cargar Calendario Volkwagen</div>
      <div>▼</div>
    </div>
    <form>
      <div className="flex border-2 border-t-0 border-stone-600">
        <div className="flex w-8/12 justify-between bg-vw_dark_blue  px-10 text-white">
          Año que desea cargar
        </div>
        <div className="flex w-1/2 items-center justify-center bg-white text-vw_dark_blue">
          <div className="flex w-full">
            <select className="flex w-full">
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex border-2 border-t-0 border-stone-600">
        <div className="flex w-8/12 justify-between bg-vw_dark_blue  px-10 text-white">
          Seleccione un archivo de su dispositivo
        </div>
        <div>
          <input type="file" accept=".csv" id="carga" name="carga" />
        </div>
      </div>
    </form>
  </div>
);
export default CargaCalendario;
// # sourceMappingURL=CargaCalendario.jsx.map
