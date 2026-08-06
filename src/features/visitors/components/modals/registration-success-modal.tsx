import { AnimatePresence, motion } from "framer-motion";
import { Button } from "antd";
import CustomModal from "../../../../components/custom-modal";
import { usePopup } from "../../../../hooks/use-popup";
import LoadingRing from "../loading-ring";
import SuccessCheckmark from "../success-checkmark";
import { loadingVariants } from "../../animations/success-modal-variants";
import {
  containerVariants,
  itemVariants,
} from "../../animations/success-modal-variants";

type RegistrationSuccessModalProps = {
  loading: boolean;
  onOk?: () => void;
  onClose?: () => void;
};

export default function RegistrationSuccessModal({
  loading,
  onOk,
  onClose,
}: RegistrationSuccessModalProps) {
  const { closeModal } = usePopup();

  const handleClose = () => {
    if (loading) return;
    onClose?.();
    closeModal();
  };

  const handleOk = () => {
    onOk?.();
    closeModal();
  };

  return (
    <CustomModal width={340} onCancel={loading ? undefined : handleClose}>
      <CustomModal.Body>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
            variants={loadingVariants}
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 pt-8 pb-4 text-center"
            >
              <LoadingRing />
              <p className="text-[14px] font-medium text-slate-500">
                Submitting your registration...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center pt-6 pb-2 text-center"
            >
              <div className="mb-4">
                <SuccessCheckmark />
              </div>

              <motion.h3
                variants={itemVariants}
                className="text-[15px] font-medium text-slate-700"
              >
                Submitted Successfully
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomModal.Body>

      <CustomModal.Footer>
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5"
            >
              <Button
                type="link"
                block
                onClick={handleOk}
                className="h-11! font-normal text-sky-500!"
              >
                Ok
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomModal.Footer>
    </CustomModal>
  );
}