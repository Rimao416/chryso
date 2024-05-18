import React from "react";
import Button from "../../components/ui/Button";

const MultiValidation = ({ handleSubmit, loading, children }) => {
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 "
      >
        {children}

        <div className="lg:col-span-2 col-span-1">
          <div className="ltr:text-right rtl:text-left">
            <Button
              type="submit"
              className="btn btn-dark  text-center"
              isLoading={loading}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MultiValidation;
