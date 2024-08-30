import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

function FileUploader({ fieldChange, mediaUrl }: FileUploaderProps) {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const { toast } = useToast();
  // const [file, setfile] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      // setfile(acceptedFiles);
      fieldChange(acceptedFiles); //triggers the onChange for the form and rerender the form
      
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      const file = acceptedFiles[0];
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const data = await response.json();
        fieldChange(data.fileUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Error uploading file. Please try again.",
        });
      }
    },
    [fieldChange, toast]
  );
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpg", ".svg", ".jpeg"],
    },
  });
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or Drag Photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag Photo Here!
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG , PNG , JPEG</p>

          <button className="shad-button_dark_4">Select From Computer</button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
