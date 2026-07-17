import { CustomModal } from "../../global/CustomModal";

const ReviewFeedBackModal = () => {
  return (
    <CustomModal title="Review Feedback" onCancel={() => {}} onOk={() => {}}>
      <div className="px-2 py-3 text-sm text-slate-600">
        Feedback content goes here.
      </div>
    </CustomModal>
  );
};

export default ReviewFeedBackModal;
