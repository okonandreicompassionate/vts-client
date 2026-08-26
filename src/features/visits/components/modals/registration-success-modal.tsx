import { AnimatePresence, motion } from "framer-motion";
import { Button } from "antd";

import CustomModal from "../../../../components/ui/custom-modal";
import { usePopup } from "@/features/popup/hooks/use-popup";

import LoadingRing from "../../animations/loading-ring";
import SuccessCheckmark from "../success-checkmark";

import {
  containerVariants,
  itemVariants,
  loadingVariants,
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
    <CustomModal
      width={340}
      onCancel={loading ? undefined : handleClose}
    >
      <CustomModal.Body>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-4 pt-8 pb-4 text-center"
            >
              <LoadingRing size={64} />

              <motion.p
                variants={itemVariants}
                className="text-[15px] font-medium text-slate-700"
              >
                Submitting your registration...
              </motion.p>
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
              <SuccessCheckmark size={64} />

              <motion.h3
                variants={itemVariants}
                className="mt-4 text-[15px] font-medium text-slate-700"
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
              className="mt-5 w-full"
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