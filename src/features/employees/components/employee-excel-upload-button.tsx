import { Alert, Button, Modal, Upload, message, Typography } from "antd";
import type { UploadFile } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useUploadEmployeeExcelSheetMutation } from "../api/admin-employees-api-slice";


const { Text } = Typography;
const { Dragger } = Upload;

export function EmployeeExcelUploadButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);

  const [uploadEmployeeExcelSheet, { isLoading }] = useUploadEmployeeExcelSheetMutation();

  const handleClose = () => {
    if (isLoading) return;

    setOpen(false);
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file?.originFileObj) {
      message.warning("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file.originFileObj);

    try {
      const result = await uploadEmployeeExcelSheet(formData).unwrap();

      if (result.errors?.length) {
        message.warning(
          `Employees uploaded with some issues. Imported: ${result.imported}, skipped: ${result.skipped}.`,
        );
      } else {
        message.success(`Employees uploaded successfully. Imported: ${result.imported}.`);
      }

      setFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Employee Excel upload failed:", error);

      message.error("Unable to upload employee data. Please check the file and try again.");
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={() => setOpen(true)}
        className="h-6 rounded-sm! py-2!"
      >
        Upload Employees
      </Button>

      <Modal
        title="Upload Employee Data"
        open={open}
        onCancel={handleClose}
        destroyOnHidden
        mask={{ closable: !isLoading }}
        closable={!isLoading}
        footer={[
          <Button key="cancel" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={isLoading}
            disabled={!file}
            onClick={handleUpload}
            className="h-6 rounded-lg! py-2!"
          >
            Upload
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <Alert
            type="info"
            showIcon
            message="Employee spreadsheet requirements"
            description={
              <div className="mt-1 space-y-1">
                <div>
                  <Text strong>Supported formats:</Text> .xlsx, .xls
                </div>

                <div>
                  <Text strong>Required columns:</Text> Employee ID, First Name, Last Name
                </div>

                <div>
                  <Text strong>Optional columns:</Text> Role, Department
                </div>

                <div>
                  <Text strong>Column order:</Text> Does not matter
                </div>
              </div>
            }
          />

          <Dragger
            accept=".xlsx,.xls"
            multiple={false}
            maxCount={1}
            fileList={file ? [file] : []}
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
            disabled={isLoading}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>

            <p className="ant-upload-text">Click or drag an Excel file here</p>

            <p className="ant-upload-hint">Upload your organization's employee spreadsheet.</p>
          </Dragger>
        </div>
      </Modal>
    </>
  );
}
