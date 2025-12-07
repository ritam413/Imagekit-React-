import  { useRef, useState, useEffect } from 'react';
import { useImageStore } from '../../../zustand/image.store';

export default function CropContainer({
  fileSrc,
  rotation,
  crop,
  onCropChange,
  onImageLoad,
}) {
  const imgRef = useRef(null);
  const cropRef = useRef(crop)
  const [isDragging, setIsDragging] = useState(false);
  const [startPointer, setStartPointer] = useState(null); // { x, y, crop, action }
  
  // --- Drag & Resize Handlers ---
  useEffect(()=>{cropRef.current=crop},[crop]);

  const cropS= useImageStore((state) => state.crop);
  // console.log("cropS: ",cropS)
  
  //Preparing a requestAnimationFrame so that we only update crop state once per animation frame
  const rafRef = useRef(null);
  function emitRealtime(displayCrop){
    if(rafRef.current) return ; 

    rafRef.current = requestAnimationFrame(
      ()=>{ 
        rafRef.current=null; 
        
        if(typeof onCropRealTime === 'function'){
          onCropRealTime(displayCrop,displayToImageCoords(displayCrop));
        }
      }
    )
  }

  function displayToImageCoords(displayCrop){
    const img = imgRef.current;

    if(!img) return displayCrop;

    const rx = img.naturalWidth/img.clientWidth;
    const ry = img.naturalHeight/img.clientHeight;

    return{
      y: Math.round(displayCrop.y*ry),
      x: Math.round(displayCrop.x*rx),
      w: Math.round(displayCrop.w*rx),
      h: Math.round(displayCrop.h*ry), //To ensure that the height is always an integer, we round
    }
  }

  function onPointerMove(e) {
    if (!isDragging || !startPointer || startPointer.action !== 'move') return;
    const dx = e.clientX - startPointer.x;
    const dy = e.clientY - startPointer.y;
    const img = imgRef.current;
    if (!img) return;

    const boundedX = Math.max(0, Math.min(startPointer.crop.x + dx, img.clientWidth - startPointer.crop.w));
    const boundedY = Math.max(0, Math.min(startPointer.crop.y + dy, img.clientHeight - startPointer.crop.h));
    const newCrop = {...startPointer.crop,x:boundedX,y:boundedY};
    
    onCropChange(c => ({ ...c, x: boundedX, y: boundedY }));
    cropRef.current=newCrop
    emitRealtime(newCrop);
  }

  function onResizeMove(e) {
    if (!isDragging || !startPointer || startPointer.action !== 'resize') return;
    const dx = e.clientX - startPointer.x;
    const dy = e.clientY - startPointer.y;
    const img = imgRef.current;
    if (!img) return;

    const newW = Math.max(20, Math.min(startPointer.crop.w + dx, img.clientWidth - startPointer.crop.x));
    const newH = Math.max(20, Math.min(startPointer.crop.h + dy, img.clientHeight - startPointer.crop.y));
    const newCrop = { ...startPointer.crop, w: newW, h: newH };

    onCropChange(c => ({ ...c, w: newW, h: newH }));
    cropRef.current=newCrop
    emitRealtime(newCrop);
  }

  function onPointerUp() {
    setIsDragging(false);
    setStartPointer(null);

    if(rafRef.current){
      cancelAnimationFrame(rafRef.current);
      rafRef.current=null;
    }

    if(typeof onCropRealTime === 'function'){
      const final = cropRef.current
      onCropRealTime(final,displayToImageCoords(cropRef.current));
    }
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointermove', onResizeMove);
    window.removeEventListener('pointerup', onPointerUp); // Single 'up' handles both
  }
  
  function handleRealTime(display,imagePixels){
    console.log('display',display)
    console.log('imagePixels',imagePixels)
  }
  // Add/remove global listeners
  useEffect(() => {
    if (isDragging && startPointer) {
      if (startPointer.action === 'move') {
        window.addEventListener('pointermove', onPointerMove);
      } else if (startPointer.action === 'resize') {
        window.addEventListener('pointermove', onResizeMove);
      }
      window.addEventListener('pointerup', onPointerUp);
    }
    // Cleanup
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointermove', onResizeMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, startPointer]);


  function onPointerDownCrop(e) {
    e.preventDefault();
    setIsDragging(true);
    setStartPointer({ x: e.clientX, y: e.clientY, crop: { ...crop }, action: 'move' });
  }

  function onPointerDownResize(e) {
    e.stopPropagation();
    setIsDragging(true);
    setStartPointer({ x: e.clientX, y: e.clientY, crop: { ...crop }, action: 'resize' });
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-2 md:p-4" style={{ minHeight: 300 }}>
      {fileSrc ? (
        <div className="relative w-full sm:w-auto max-w-[95vw] sm:max-w-[90vw] max-h-[75vh] sm:max-h-[80vh] overflow-hidden" style={{ transform: `rotate(${rotation}deg)` }}>
          <img
            ref={imgRef}
            src={fileSrc}
            alt="to-edit"
            crossOrigin="anonymous" // Important for canvas
            onLoad={(e) => onImageLoad(e.currentTarget)}
            className="block w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain mx-auto rounded"
          />

          {/* Overlay container */}
          <div
            style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
          >
            {/* This extra div is needed so 'left'/'top' of crop box are relative to image */}
            <div style={{ position: 'absolute', left: 0, top: 0 }}>
              <div
                onPointerDown={onPointerDownCrop}
                style={{
                  position: 'absolute',
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                  border: '2px dashed rgba(255,255,255,0.95)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  pointerEvents: 'auto',
                }}
                title="Drag to move crop"
              >
                {/* Resize Handle */}
                <div
                  onPointerDown={onPointerDownResize}
                  style={{
                    position: 'absolute',
                    right: -8,
                    bottom: -8,
                    width: 16,
                    height: 16,
                    background: 'white',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    cursor: 'nwse-resize',
                    pointerEvents: 'auto',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-60 text-base-content/50">
          Drop or paste an image to start
        </div>
      )}
    </div>
  );
}