import { AnimatePresence, motion } from "framer-motion";

import CustomModal from "@/components/ui/custom-modal";
import { usePopup } from "@/lib/contexts/popup/use-popup";

import LoadingRing from "../../animations/loading-ring";
import SuccessCheckmark from "../success-checkmark";

import {
  containerVariants,
  itemVariants,
  loadingVariants,
} from "../../animations/success-modal-variants";

type RegistrationSuccessModalProps = {
  existingAppointment?: boolean;
  loading: boolean;
  onOk?: () => void;
  onClose?: () => void;
};

export default function RegistrationSuccessModal({
  loading,
  existingAppointment = false,
  onOk,
  onClose,
}: RegistrationSuccessModalProps) {
  const { closeModal } = usePopup();

  const handleOk = () => {
    onOk?.();
    closeModal();
  };

  return (
    <CustomModal size="sm" onCancel={onClose} disableClose={loading}>
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

              <motion.p variants={itemVariants} className="text-[15px] font-medium">
                {existingAppointment ? "Opening your appointment..." : "Submitting your request..."}
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

              <motion.h3 variants={itemVariants} className="mt-4 text-[15px] font-medium">
                {existingAppointment ? "Appointment selected" : "Submitted Successfully"}
              </motion.h3>
            </motion.div>
          )}
        </AnimatePresence>
      </CustomModal.Body>

      {!loading && <CustomModal.Footer okText="OK" hideCancel onOk={handleOk} />}
    </CustomModal>
  );
}
