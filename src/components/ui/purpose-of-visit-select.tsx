import { useState } from "react";
import { Input, Select } from "antd";

const PURPOSE_OF_VISIT_OPTIONS = [
  "Interview",
  "Vendor",
  "Business Meeting",
  "Delivery",
  "Contractor / Maintenance",
  "Official Visit",
  "Training",
  "Event",
  "Personal Visit",
];

const OTHERS = "Others";

interface PurposeOfVisitSelectProps {
  /** Supplied by Form.Item: the purpose as plain text. */
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
}

/**
 * Common purposes to pick from, plus "Others" for typing a custom one.
 * Use inside a Form.Item; the field's value is always the purpose text.
 */
export function PurposeOfVisitSelect({
  value,
  onChange,
  maxLength,
  placeholder = "Select purpose of visit",
}: PurposeOfVisitSelectProps) {
  const [othersPicked, setOthersPicked] = useState(false);
  // A saved purpose that isn't in the list was typed by hand.
  const isCustom = othersPicked || (Boolean(value) && !PURPOSE_OF_VISIT_OPTIONS.includes(value ?? ""));

  const handleSelect = (option: string) => {
    const pickedOthers = option === OTHERS;
    setOthersPicked(pickedOthers);
    onChange?.(pickedOthers ? "" : option);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        showSearch
        value={isCustom ? OTHERS : value || undefined}
        placeholder={placeholder}
        onChange={handleSelect}
        options={[...PURPOSE_OF_VISIT_OPTIONS, OTHERS].map((option) => ({
          label: option,
          value: option,
        }))}
      />

      {isCustom && (
        <Input
          autoFocus={othersPicked}
          value={value}
          maxLength={maxLength}
          placeholder="Type the purpose of visit"
          aria-label="Purpose of visit"
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}
    </div>
  );
}
