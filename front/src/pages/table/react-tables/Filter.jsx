import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
const Filter = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    console.log(e)
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  return (
    <div>
      <Textinput
        value={value || ""}
        onChange={onChange}
        placeholder="Tapez une valeur..."
      />
    </div>
  );
};

export default Filter;
