import React from "react";

function ProgrammeEdit() {
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card title="Modifier un niveau">
          <MultiValidation
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            loading={loading}
            title="Modifier"
          >
            <Textinput
              name="name"
              label="Classe"
              type="text"
              onChange={handleChange}
              defaultValue={credentials?.name}
              value={credentials?.name}
              register={register}
              error={errors.name}
            />
          </MultiValidation>
        </Card>
      </div>{" "}
    </div>
  );
}

export default ProgrammeEdit;
