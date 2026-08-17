import { Button, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useUploadEmployeeExcelSheetMutation } from "../../api/admin-employees-api-slice";

export default function EmployeeExcelUploadModal() {
  const { closeModal } = usePopup();

  const [file, setFile] = useState<UploadFile | null>(null);

  const [uploadEmployeeExcelSheet, { isLoading }] = useUploadEmployeeExcelSheetMutation();

  const handleUpload = async () => {
    if (!file?.originFileObj) {
      message.warning("Please select an Excel file.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file.originFileObj);

    try {
      const result = await uploadEmployeeExcelSheet(formData).unwrap();

      if (result.skipped > 0) {
        message.warning(
          `Import completed. Imported: ${result.imported}, skipped: ${result.skipped}.`,
        );
      } else {
        message.success(`Employees uploaded successfully. Imported: ${result.imported}.`);
      }

      setFile(null);
      closeModal();
    } catch (error) {
      console.error("Employee upload failed:", error);

      message.error("Unable to upload employees. Please check the file and try again.");
    }
  };

  const handleCancel = () => {
    setFile(null);
    closeModal();
  };

  return (
    <CustomModal width={520}>
      <CustomModal.Header
        title="Upload Employee Data"
        subtitle="Import employees from an Excel spreadsheet."
      />

      <CustomModal.Body>
        <div className="px-2 pt-4 pb-2">
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 dark:bg-slate-700/50">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Supported formats:{" "}
              <span className="font-normal text-slate-600 dark:text-slate-300">.xlsx, .xls</span>
            </p>

            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Required columns:</span> Employee ID, First Name, Last
              Name
            </p>

            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Optional columns:</span> Role, Department
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Column order does not matter.
            </p>
          </div>

          <div className="flex justify-center">
            <Upload
              accept=".xlsx,.xls"
              maxCount={1}
              beforeUpload={(selectedFile) => {
                setFile({
                  uid: selectedFile.uid,
                  name: selectedFile.name,
                  status: "done",
                  originFileObj: selectedFile,
                });

                return false;
              }}
              onRemove={() => {
                setFile(null);
              }}
              fileList={file ? [file] : []}
              disabled={isLoading}
            >
              <Button disabled={isLoading} type="primary" className="h-7! rounded-lg!">
                Select Excel File
              </Button>
            </Upload>
          </div>

          {file && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Selected: {file.name}</p>
          )}
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="flex w-full items-center gap-3 px-6 pt-1 pb-5">
          <Button onClick={handleCancel} disabled={isLoading} className="h-9! flex-1! rounded-sm!">
            Cancel
          </Button>

          <Button
            type="primary"
            loading={isLoading}
            disabled={!file}
            onClick={handleUpload}
            className="h-9! flex-1! rounded-sm!"
          >
            Upload Employees
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}
