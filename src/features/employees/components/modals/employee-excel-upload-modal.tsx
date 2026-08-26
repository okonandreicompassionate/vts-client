import { Button, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import { InboxOutlined, FileExcelOutlined, CloseCircleOutlined } from "@ant-design/icons";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";
import { useUploadEmployeeExcelSheetMutation } from "../../api/admin-employees-api-slice";

const { Dragger } = Upload;

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
          <div className="mb-5 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-start gap-2.5">
              <FileExcelOutlined className="mt-0.5 text-[15px] text-sky-500 dark:text-sky-400" />
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                  Supported formats: <span className="font-normal text-slate-600 dark:text-slate-300">.xlsx, .xls</span>
                </p>
                <p className="text-[13px] text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Required:</span> Employee ID, First Name, Last Name
                </p>
                <p className="text-[13px] text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Optional:</span> Role, Department
                </p>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Column order does not matter.
                </p>
              </div>
            </div>
          </div>

          {!file ? (
            <Dragger
              accept=".xlsx,.xls"
              maxCount={1}
              showUploadList={false}
              disabled={isLoading}
              beforeUpload={(selectedFile) => {
                setFile({
                  uid: selectedFile.uid,
                  name: selectedFile.name,
                  status: "done",
                  originFileObj: selectedFile,
                });
                return false;
              }}
              className="rounded-xl! border-slate-200! bg-slate-50! hover:border-sky-300! hover:bg-sky-50/40! dark:border-slate-700! dark:bg-slate-800/30!"
            >
              <p className="mb-1 text-2xl text-slate-400 dark:text-slate-500">
                <InboxOutlined />
              </p>
              <p className="mb-0.5 text-[13px] font-medium text-slate-700 dark:text-slate-200">
                Click or drag file to this area
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                Supports a single .xlsx or .xls file
              </p>
            </Dragger>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileExcelOutlined className="text-[16px] text-emerald-500" />
                <span className="truncate text-[13px] font-medium text-slate-800 dark:text-slate-100">
                  {file.name}
                </span>
              </div>
              <Button
                type="text"
                size="small"
                disabled={isLoading}
                icon={<CloseCircleOutlined />}
                onClick={() => setFile(null)}
                className="text-slate-400! hover:text-red-500!"
              />
            </div>
          )}
        </div>
      </CustomModal.Body>

      <CustomModal.Footer>
        <div className="flex w-full items-center gap-3 px-6 pt-1 pb-5">
          <Button onClick={handleCancel} disabled={isLoading} className="h-9! flex-1! rounded-lg!">
            Cancel
          </Button>

          <Button
            type="primary"
            loading={isLoading}
            disabled={!file}
            onClick={handleUpload}
            className="h-9! flex-1! rounded-lg!"
          >
            Upload Employees
          </Button>
        </div>
      </CustomModal.Footer>
    </CustomModal>
  );
}