// src/components/Editor/ImageEditor.jsx
// MODIFIED to accept fileSrc as a prop and remove file inputs

import React, { useState, useEffect } from 'react';
// Note: We are NOT importing ImageInput
import { useImageStore } from '../../../zustand/image.store';
import PreviewDisplay from './PreviewDisplay.jsx';
import CropContainer from './CropContainer.jsx';
// Accept fileSrc from props
export default function ImageEditor() {
  // UI state
  const [fileSrc, setFileSrc] = useState(''); // data URL or external url
  const [showPreview, setShowPreview] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState('');

  const activeImage = useImageStore((state) => state.activeImage)
  // setFileSrc(activeImage);
  // console.log("This is the active image : ", activeImage)
  // console.log("This is the fileSrc image : ", fileSrc)

  // Image state
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [displayedSize, setDisplayedSize] = useState({ w: 0, h: 0 });

  // Edit state
  const rotationState = useImageStore((state) => state.rotation);
  const setRotationState = useImageStore((state) => state.setRotation);
  const [rotation, setRotation] = useState(0);


  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 })

  const setCropState = useImageStore((state) => state.setCrop);
  // When the prop from Zustand changes, update the internal state
  useEffect(() => {
    if (activeImage) {
      setFileSrc(activeImage);
      resetState();
    }
  }, [activeImage]); // Re-run when the active image changes

  function resetState() {
    setShowPreview(false);
    setPreviewDataUrl('');
    setRotation(0);
  }

  // 2. --- Image Load Handler ---
  function onImageLoad(img) {
    const dispW = img.clientWidth;
    const dispH = img.clientHeight;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setDisplayedSize({ w: dispW, h: dispH });
    const size = Math.min(dispW, dispH) * 0.6;
    setCrop({
      x: (dispW - size) / 2,
      y: (dispH - size) / 2,
      w: size,
      h: size,
    });
  }

  // 3. --- Client-Side Preview (Canvas) ---
  async function handlePreview() {
    // (This logic remains exactly the same as before)
    if (!fileSrc || !naturalSize.w) return;
    const fullImg = new Image();
    fullImg.crossOrigin = 'anonymous';
    fullImg.src = fileSrc;
    await new Promise((resolve, reject) => {
      fullImg.onload = resolve;
      fullImg.onerror = reject;
    });
    const scaleX = naturalSize.w / displayedSize.w;
    const scaleY = naturalSize.h / displayedSize.h;
    const cropPx = {
      x: Math.round(crop.x * scaleX),
      y: Math.round(crop.y * scaleY),
      w: Math.round(crop.w * scaleX),
      h: Math.round(crop.h * scaleY),
    };
    const angleRad = (rotation % 360) * (Math.PI / 180);
    const sin = Math.abs(Math.sin(angleRad));
    const cos = Math.abs(Math.cos(angleRad));
    const rotW = Math.round(naturalSize.w * cos + naturalSize.h * sin);
    const rotH = Math.round(naturalSize.w * sin + naturalSize.h * cos);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rotW;
    tempCanvas.height = rotH;
    const tctx = tempCanvas.getContext('2d');
    if (!tctx) return;
    tctx.translate(rotW / 2, rotH / 2);
    tctx.rotate(angleRad);
    tctx.drawImage(fullImg, -naturalSize.w / 2, -naturalSize.h / 2);
    const cx = naturalSize.w / 2;
    const cy = naturalSize.h / 2;
    const vX = cropPx.x - cx;
    const vY = cropPx.y - cy;
    const rx = vX * Math.cos(angleRad) - vY * Math.sin(angleRad);
    const ry = vX * Math.sin(angleRad) + vY * Math.cos(angleRad);
    const cropRotX = Math.round(rotW / 2 + rx);
    const cropRotY = Math.round(rotH / 2 + ry);
    const outCanvas = document.createElement('canvas');
    outCanvas.width = cropPx.w;
    outCanvas.height = cropPx.h;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return;
    outCtx.drawImage(tempCanvas, cropRotX, cropRotY, cropPx.w, cropPx.h, 0, 0, cropPx.w, cropPx.h);
    const dataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
    setPreviewDataUrl(dataUrl);
    setShowPreview(true);
    console.log("Crop X: ", crop.x, "Crop Y: ", crop.y, "Crop W: ", crop.w, "Crop H: ", crop.h, "Rotation: ", rotation);
  }

  // 4. --- Server-Side Generate (Fetch) ---
  async function handleGenerate() {
    // (This logic remains exactly the same as before)
    if (!fileSrc || !naturalSize.w) return;
    const scaleX = naturalSize.w / displayedSize.w;
    const scaleY = naturalSize.h / displayedSize.h;
    const payload = {
      imageSrc: fileSrc,
      x: Math.round(crop.x * scaleX),
      y: Math.round(crop.y * scaleY),
      w: Math.round(crop.w * scaleX),
      h: Math.round(crop.h * scaleY),
      rotation: Math.round(rotation),
    };
    try {
      const res = await fetch('http://localhost:3001/api/transform-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'server error');
      }
      const json = await res.json();
      if (json.url) {
        setPreviewDataUrl(json.url);
        setShowPreview(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate image: ' + (err.message || err));
    }
  }

  // 5. --- Render ---
  return (
    // This component now just renders the editor UI, not the page title or file inputs
    <div className="bg-base-200 rounded p-3 max-w-full max-h-full flex flex-col">
          <CropContainer
            fileSrc={fileSrc}
            rotation={rotation}
            crop={crop}
            onCropChange={setCrop}
            onImageLoad={onImageLoad}
          />


      {/* <Controls
        rotation={rotation}
        onRotationChange={setRotation}
        onPreview={handlePreview}
        onGenerate={handleGenerate}
        showPreview={showPreview}
        onShowPreviewChange={setShowPreview}
        disabled={!fileSrc}
      /> */}

      <PreviewDisplay
        showPreview={showPreview}
        previewDataUrl={fileSrc}
      />
    </div>
  );
}