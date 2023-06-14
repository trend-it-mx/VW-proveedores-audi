const GridLayout = () => (
  <form>
    <table className="flex w-full flex-col justify-between border-2 border-t-0 border-stone-600">
      <thead className="flex w-full flex-col bg-vw_dark_blue px-10  text-white">
        <tr>
          <th>No.</th>
          <th>Nombre Campo</th>
          <th>Descripción</th>
          <th>Admisión de nulos</th>
        </tr>
      </thead>

      <tbody className="flex w-full flex-col border-2 border-t-0 border-stone-600 ">
        <tr>
          <th>1</th>
          <th>
            <input type="text" />
          </th>
          <th>
            <textarea />
          </th>
          <th>
            <select>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </th>
        </tr>
        <tr>
          <th>2</th>
          <th>
            <input type="text" />
          </th>
          <th>
            <textarea />
          </th>
          <th>
            <select>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </th>
        </tr>
        <tr>
          <th>3</th>
          <th>
            <input type="text" />
          </th>
          <th>
            <textarea />
          </th>
          <th>
            <select>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </th>
        </tr>
        <tr>
          <th>4</th>
          <th>
            <input type="text" />
          </th>
          <th>
            <textarea />
          </th>
          <th>
            <select>
              <option value="Si">Si</option>
              <option value="No">No</option>
            </select>
          </th>
        </tr>
      </tbody>
    </table>
  </form>
);
export default GridLayout;
// # sourceMappingURL=GridLayout.jsx.map
