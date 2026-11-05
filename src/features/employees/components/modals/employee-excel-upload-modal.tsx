import { Button, Upload, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";
import { InboxOutlined, FileExcelOutlined, CloseCircleOutlined } from "@ant-design/icons";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";
import { useUploadEmployeeExcelSheetMutation } from "../../api/admin-employees-api-slice";
import type { EmployeeUploadResponse } from "../../types/api-types";
import { getVisitActionErrorMessage } from "@/utils/visit-action-error";

const { Dragger } = Upload;

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_ERRORS_SHOWN = 3;

function summarizeImport(result: EmployeeUploadResponse): string {
  const summary = `Imported: ${result.imported}, updated: ${result.updated}, skipped: ${result.skipped}.`;
  const errors = result.errors ?? [];

  if (errors.length === 0) {
    return summary;
  }

  const shown = errors
    .slice(0, MAX_ERRORS_SHOWN)
    .map((error) => `Row ${error.row}: ${error.message}`)
    .join(" ");
  const more =
    errors.length > MAX_ERRORS_SHOWN ? ` (+${errors.length - MAX_ERRORS_SHOWN} more)` : "";

  return `${summary} ${shown}${more}`;
}

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

      if (result.skipped > 0 || result.errors?.length) {
        message.warning({
          content: `Import finished with issues. ${summarizeImport(result)}`,
          duration: 8,
        });
      } else {
        message.success(`Employees uploaded successfully. ${summarizeImport(result)}`);
      }

      setFile(null);
      closeModal();
    } catch (error) {
      console.error("Employee upload failed:", error);
      message.error(
        getVisitActionErrorMessage(
          error,
          "Unable to upload employees. Please check the file and try again.",
        ),
      );
    }
  };

  return (
    <CustomModal size="lg" onCancel={() => setFile(null)} disableClose={isLoading}>
      <CustomModal.Header
        title="Upload employee data"
        subtitle="Import employees from an Excel spreadsheet."
      />

      <CustomModal.Body>
        <div>
          <div className="mb-5 rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3.5 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="flex items-start gap-2.5">
              <FileExcelOutlined className="mt-0.5 text-[15px] text-sky-500 dark:text-sky-400" />
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-slate-800 dark:text-zinc-100">
                  Supported formats:{" "}
                  <span className="font-normal text-slate-600 dark:text-zinc-300">
                    .xlsx (max 2 MB)
                  </span>
                </p>
                <p className="text-[13px] text-slate-700 dark:text-zinc-300">
                  <span className="font-semibold">Required:</span> Employee ID, First Name, Last
                  Name, Email
                </p>
                <p className="text-[13px] text-slate-700 dark:text-zinc-300">
                  <span className="font-semibold">Optional:</span> Role, Department, Phone
                </p>
                <p className="text-[12px] text-slate-500 dark:text-zinc-400">
                  Column order and header case do not matter.
                </p>
              </div>
            </div>
          </div>

          {!file ? (
            <Dragger
              accept=".xlsx"
              maxCount={1}
              showUploadList={false}
              disabled={isLoading}
              beforeUpload={(selectedFile) => {
                if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
                  message.error("Please choose an .xlsx file.");
                  return Upload.LIST_IGNORE;
                }

                if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
                  message.error("The file is larger than 2 MB.");
                  return Upload.LIST_IGNORE;
                }

                setFile({
                  uid: selectedFile.uid,
                  name: selectedFile.name,
                  status: "done",
                  originFileObj: selectedFile,
                });
                return false;
              }}
              className="rounded-xl! border-slate-200! bg-slate-50! hover:border-sky-300! hover:bg-sky-50/40! dark:border-zinc-700! dark:bg-zinc-800/30!"
            >
              <p className="mb-1 text-2xl text-slate-400 dark:text-zinc-500">
                <InboxOutlined />
              </p>
              <p className="mb-0.5 text-[13px] font-medium text-slate-700 dark:text-zinc-200">
                Click or drag file to this area
              </p>
              <p className="text-[12px] text-slate-500 dark:text-zinc-400">
                Supports a single .xlsx file
              </p>
            </Dragger>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileExcelOutlined className="text-[16px] text-emerald-500" />
                <span className="truncate text-[13px] font-medium text-slate-800 dark:text-zinc-100">
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

      <CustomModal.Footer
        okText="Upload employees"
        loading={isLoading}
        disabled={!file}
        onOk={() => void handleUpload()}
      />
    </CustomModal>
  );
}
