
import { useSaveStory, useUpload } from '@/lib/react-query/queriesAndMutation';
import React, { useState, useRef } from 'react';

interface StoryUploadModalProps {
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const StoryUploadModal: React.FC<StoryUploadModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {mutateAsync : upload } = useUpload();
  const {mutateAsync : saveStory} = useSaveStory();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const UploadResponse = await upload(selectedFile);
      if (UploadResponse) {
        await saveStory({mediaUrl : UploadResponse.fileUrl , mediaType : selectedFile.type});
      }
      onClose();
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="file_uploader-box cursor-pointer min-w-96 bg-black rounded-xl"
        onClick={handleBoxClick}
      >
        {!previewUrl && (
          <>
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file-upload"
            />
            <h2 className="text-xl font-bold mb-4">Upload Story</h2>
            <p className="text-sm text-gray-500">Click to select a file</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*,video/*" 
          onChange={handleFileChange} 
          className="hidden"
        />
        {previewUrl && (
          <div className="mb-4 w-96 h-96 relative">
            {selectedFile?.type.startsWith('image/') ? (
              <img src={previewUrl} alt="Preview" className="max-w-full h-auto object-contain" />
            ) : (
              <video src={previewUrl} autoPlay className="max-w-96 h-96" />
            )}
          </div>
        )}
        <div className="flex justify-end mt-4 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            className="px-4 py-2 shad-button_primary text-white rounded"
            disabled={!selectedFile}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryUploadModal;
