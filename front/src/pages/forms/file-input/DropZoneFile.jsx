import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

// image import
import uploadSvgImage from "@/assets/images/svg/upload.svg";

const DropZoneFile = ({ data, setData }) => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      if (acceptedFiles.length > 0) {
        // setFileName(acceptedFiles[0].name);
        console.log(acceptedFiles[0]);
        // console.log(acceptedFiles[0].name);
        setData({ ...data, photo: acceptedFiles[0] });
        // setFile(acceptedFiles[0]);
      }
    //   onChange(acceptedFiles[0].name);
    },
  });
  return (
    <div>
      <div className="w-full text-center border-dashed border border-secondary-500 rounded-md py-[52px] flex flex-col justify-center items-center">
        {files.length === 0 && (
          <div {...getRootProps({ className: "dropzone" })}>
            <input className="hidden" {...getInputProps()} />
            <img src={uploadSvgImage} alt="" className="mx-auto mb-4" />
            {isDragAccept ? (
              <p className="text-sm text-slate-500 dark:text-slate-300 ">
                Déposez les fichiers ici ..
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300 f">
                Déposez les fichiers ici ou cliquez pour les télécharger.
              </p>
            )}
          </div>
        )}
        <div className="flex space-x-4">
          {files.map((file, i) => (
            <div key={i} className="mb-4 flex-none">
              <div className="h-[300px] w-[300px] mx-auto mt-6 rounded-md">
                <img
                  src={file.preview}
                  className=" object-contain h-full w-full block rounded-md"
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropZoneFile;
