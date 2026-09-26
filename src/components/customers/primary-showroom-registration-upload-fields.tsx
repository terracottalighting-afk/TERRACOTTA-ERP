"use client";

import { useState } from "react";

type UploadFieldsProps = {
  accept: string;
  label: string;
  name: string;
};

export function PrimaryShowroomRegistrationUploadFields({ accept, label, name }: UploadFieldsProps) {
  const [fieldCount, setFieldCount] = useState(1);

  return (
    <div className="registration-upload-fields">
      <span className="registration-upload-fields__label">{label}</span>
      {Array.from({ length: fieldCount }, (_, index) => (
        <input accept={accept} key={index} multiple name={name} type="file" />
      ))}
      <button className="text-action" onClick={() => setFieldCount((count) => count + 1)} type="button">
        Add another {label.toLowerCase()}
      </button>
    </div>
  );
}
