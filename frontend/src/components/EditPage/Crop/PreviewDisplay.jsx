import React from 'react';

export default function PreviewDisplay({ showPreview, previewDataUrl }) {
  if (!showPreview || !previewDataUrl) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-base-content/10">
      <h3 className="font-medium">Preview</h3>
      <img
        src={previewDataUrl}
        alt="preview"
        className="max-w-full rounded shadow mt-2 border border-base-content/10"
      />
    </div>
  );
}