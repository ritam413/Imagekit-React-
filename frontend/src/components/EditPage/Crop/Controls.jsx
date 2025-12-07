import React from 'react';

export default function Controls({
  rotation,
  onRotationChange,
  onPreview,
  onGenerate,
  showPreview,
  onShowPreviewChange,
  disabled,
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <label className="flex items-center gap-2">
        <span>Rotation</span>
        <input
          type="range"
          min={-180}
          max={180}
          value={rotation}
          onChange={(e) => onRotationChange(Number(e.target.value))}
          className="range range-xs"
          disabled={disabled}
        />
        <span className="ml-2 w-10 text-right">{rotation}°</span>
      </label>

      <div className="flex-grow flex gap-2">
        <button className="btn btn-primary btn-sm" onClick={onPreview} disabled={disabled}>
          Preview
        </button>
        <button className="btn btn-accent btn-sm" onClick={onGenerate} disabled={disabled}>
          Generate
        </button>
      </div>

      <label className="ml-auto flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="toggle toggle-sm"
          checked={showPreview}
          onChange={(e) => onShowPreviewChange(e.target.checked)}
        />
        <span>Show preview</span>
      </label>
    </div>
  );
}