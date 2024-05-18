import React from "react";
import Select from "react-select";

function MultiSelect({ title, options, data, setData, header }) {
  const styles = {
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
    },
  };
  return (
    <div>
      <label className="form-label" htmlFor="mul_1">
        {title}
      </label>
      <Select
        isClearable={false}
        styles={styles}
        isMulti
        name="colors"
        options={options}
        className="react-select"
        classNamePrefix="select"
        id="mul_1"
        onChange={(selectedOptions) => {
          setData((prevCredentials) => ({
            ...prevCredentials,
            [header]: selectedOptions.map((option) => option.value),
          }));
        }}
        // defaultValue={options.find}
        value={options.filter((option) =>
          data.classLevel.includes(option.value)
        )} // Assurez-vous que la valeur du Select correspond à la valeur dans l'état
      />
    </div>
  );
}

export default MultiSelect;
