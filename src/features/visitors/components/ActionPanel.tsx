import { ArrowRight } from "lucide-react";
import { Button } from "antd";
import type { StatusMeta } from "../types/statusMeta";

type Props = {
  meta: StatusMeta;
  isPending: boolean;
  onAction: () => void;
};

export default function ActionPanel({ meta, isPending, onAction }: Props) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
      {isPending && (
        <div className="absolute inset-0 z-10 flex cursor-not-allowed items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]" />
      )}
      <p className="mb-4 text-sm font-bold text-slate-900">Next steps</p>
      <Button
        type="primary"
        block
        size="large"
        disabled={isPending}
        className="h-11 rounded-xl font-semibold disabled:opacity-50"
        icon={<ArrowRight size={18} />}
        iconPosition="end"
        onClick={onAction}
      >
        {meta.actionLabel}
      </Button>
      <Button
        block
        size="large"
        disabled={isPending}
        className="mt-3 h-11 rounded-xl font-semibold disabled:opacity-50"
      >
        {meta.secondaryLabel}
      </Button>
    </div>
  );
}
