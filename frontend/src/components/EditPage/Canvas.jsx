// Create a new file: src/components/Canvas.jsx

import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useImageStore } from "../../zustand/image.store.js";
import { useEditStore } from "../../zustand/editpage.store.js";
import * as fabric from "fabric";
import fabricJsBackend from "../../utils/fabricjsBackend.js";
import "../../utils/VignetteFilter.js";
export default function Canvas({ }) {

  const fabricRef = useRef(null)
  const canvasRef = useRef(null)
  const activeImage = useImageStore((state) => state.activeImage)
  const setActiveImage = useImageStore((state) => state.setActiveImage);
  const imageStates = useImageStore((state) => state.imageStates)
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const vignetteControlRef = useRef(null)
  const [cropBox, setCropBox] = useState(null);
  const visiblePanel = useEditStore((state) => state.visiblePanel);
  const presetfilter = imageStates[activeImage]?.presetFilter
  const updateActiveImageState = useImageStore((state) => state.updateActiveImageState)

  console.log("visiblePanel: ", visiblePanel)
  //! Setting UP my Canvas to Use in Editing
  useEffect(() => {

    if (!canvasRef.current) return
    const { clientWidth, clientHeight } = containerRef.current

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: clientWidth,
      height: clientHeight
    })

    fabricRef.current = canvas
    fabricJsBackend();

    console.log("Backend being used is: ", fabric.getFilterBackend())

    const handleResize = () => {
      const { clientHeight: newHeight, clientWidth: newWidth } = containerRef.current
      canvas.setDimensions({ width: newWidth, height: newHeight })
      canvas.renderAll()
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
      removeVignetteControl()
      canvas.dispose()
    }
  }, [])

  const getDefaultVignetteState = (img) => {
    if (!img) return null
    const width = img.width
    const height = img.height
    const minDim = Math.min(width, height)
    const maxDim = Math.max(width, height)
    return {
      enabled: false,
      centerX: width / 2,
      centerY: height / 2,
      innerRadius: minDim * 0.15,
      featherRadius: minDim * 0.4,
      outerRadius: maxDim * 0.7,
      intensity: 0.6,
      continueFading: false,
      initialized: true
    }
  }

  const ensureDefaultVignetteState = (img) => {
    if (!img) return
    const { activeImage: currentId, imageStates: states } = useImageStore.getState()
    if (!currentId) return
    const existing = states[currentId]?.vignette
    if (existing?.initialized) return
    const defaults = getDefaultVignetteState(img)
    if (!defaults) return
    updateActiveImageState({ vignette: defaults })
  }

  const imageToCanvasSpace = (imageX, imageY) => {
    const img = imgRef.current
    if (!img) return { x: 0, y: 0 }
    const scaleX = img.scaleX || 1
    const scaleY = img.scaleY || 1
    return {
      x: img.left + (imageX - img.width / 2) * scaleX,
      y: img.top + (imageY - img.height / 2) * scaleY
    }
  }

  const canvasToImageSpace = (canvasX, canvasY) => {
    const img = imgRef.current
    if (!img) return { x: 0, y: 0 }
    const scaleX = img.scaleX || 1
    const scaleY = img.scaleY || 1
    return {
      x: ((canvasX - img.left) / scaleX) + img.width / 2,
      y: ((canvasY - img.top) / scaleY) + img.height / 2
    }
  }

  const updateVignetteState = (updates) => {
    const { activeImage: currentId, imageStates: states } = useImageStore.getState()
    if (!currentId) return
    const existing = states[currentId]?.vignette || {}
    updateActiveImageState({
      vignette: {
        ...existing,
        ...updates,
        initialized: true
      }
    })
  }

  const removeVignetteFilter = () => {
    const img = imgRef.current
    const canvas = fabricRef.current
    if (!img || !canvas) return
    const before = img.filters.length
    img.filters = img.filters.filter(f => f.type !== 'Vignette')
    if (img.filters.length !== before) {
      img.applyFilters()
      canvas.requestRenderAll()
    }
  }

  const removeVignetteControl = () => {
    const canvas = fabricRef.current
    if (!canvas || !vignetteControlRef.current) return
    vignetteControlRef.current.off('moving', handleVignetteMove)
    vignetteControlRef.current.off('scaling', handleVignetteScale)
    canvas.remove(vignetteControlRef.current)
    vignetteControlRef.current = null
  }

  const handleVignetteMove = (event) => {
    const circle = event.target
    if (!circle) return
    const { x, y } = canvasToImageSpace(circle.left, circle.top)
    updateVignetteState({ centerX: x, centerY: y })
  }

  const handleVignetteScale = (event) => {
    const circle = event.target
    const img = imgRef.current
    if (!circle || !img) return
    const uniformScale = circle.scaleX
    circle.scaleY = uniformScale
    const scaledRadius = circle.radius * uniformScale
    circle.set({
      radius: scaledRadius,
      scaleX: 1,
      scaleY: 1
    })
    circle.setCoords()

    const { activeImage: currentId, imageStates: states } = useImageStore.getState()
    if (!currentId) return
    const current = states[currentId]?.vignette
    if (!current) return

    const canvasScale = img.scaleX || 1
    const newOuterRadius = scaledRadius / canvasScale
    const prevOuter = current.outerRadius || 1
    const proportionate = !(event.e && (event.e.altKey || event.e.ctrlKey))
    const scaleRatio = prevOuter > 0 ? newOuterRadius / prevOuter : 1

    const next = {
      outerRadius: newOuterRadius
    }

    if (proportionate) {
      next.innerRadius = Math.min(current.innerRadius * scaleRatio, newOuterRadius)
      next.featherRadius = Math.min(current.featherRadius * scaleRatio, newOuterRadius)
    }

    updateVignetteState(next)
  }

  const toggleVignetteControl = (isActive, vignetteState) => {
    const canvas = fabricRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    if (!isActive || !vignetteState) {
      removeVignetteControl()
      return
    }

    const { x, y } = imageToCanvasSpace(vignetteState.centerX, vignetteState.centerY)
    const radius = Math.max(10, vignetteState.outerRadius * (img.scaleX || 1))

    if (!vignetteControlRef.current) {
      const circle = new fabric.Circle({
        left: x,
        top: y,
        radius,
        fill: 'rgba(59,130,246,0.08)',
        stroke: '#2563eb',
        strokeDashArray: [6, 4],
        strokeWidth: 1.5,
        selectable: true,
        evented: true,
        hasBorders: false,
        hasControls: true,
        lockRotation: true,
        lockScalingFlip: true,
        originX: 'center',
        originY: 'center',
        name: 'vignetteControl',
        cornerColor: '#2563eb',
        cornerStrokeColor: '#1d4ed8',
        borderColor: '#1d4ed8',
        cornerStyle: 'circle',
        cornerSize: 12,
        transparentCorners: false
      })
      circle.setControlVisible('mtr', false)
      circle.on('moving', handleVignetteMove)
      circle.on('scaling', handleVignetteScale)
      vignetteControlRef.current = circle
      canvas.add(circle)
    }

    const circle = vignetteControlRef.current
    circle.set({
      left: x,
      top: y,
      radius
    })
    circle.set({ scaleX: 1, scaleY: 1 })
    circle.setCoords()
    canvas.bringToFront(circle)
    canvas.requestRenderAll()
  }
  //! FUnction to actaully load the Image in the Canvas
  const loadImageFromUrl = async (url) => {
    const canvas = fabricRef.current

    if (!canvas) return;
    try {
      canvas.clear();
      removeVignetteControl()
      imgRef.current = null
      // 1. Load the image
      const img = await fabric.FabricImage.fromURL(url, {
        controls: fabric.FabricImage.createControls().controls,
        crossOrigin: 'anonymous'
      })

      // 2. Calculate scale factors (using 0.9 to leave a 10% padding buffer)
      const scaleX = ((containerRef.current.clientWidth) * 0.9) / img.width;
      const scaleY = ((containerRef.current.clientHeight) * 0.9) / img.height;

      // 3. Use the smaller scale factor to ensure it fits both ways
      const finalScale = Math.min(scaleX, scaleY);

      img.set({
        originX: 'center',
        originY: 'center'
      })
      img.scale(finalScale);
      // img.isMoving=false;
      // img.selectable=false
      canvas.add(img)
      canvas.centerObject(img)
      canvas.setActiveObject(img)
      imgRef.current = img
      ensureDefaultVignetteState(img)
      canvas.requestRenderAll()
      // if(imgRef)
      // console.log("ImageObj: ",imgRef.current)
    } catch (err) {
      console.log("Couldnt load Image from url", err)
    }
  }
  //*Looking for changes in active image and calling my display function to display theimage
  useEffect(() => {
    if (activeImage) loadImageFromUrl(activeImage)
  }, [activeImage])

  //* Checking the current ImageState , observe if it is being set or not
  useEffect(() => {
    if (imageStates) {
      console.log("Sates of Image current image is: Present ")
    }
  }, [imageStates])



  const applyFabricFilter = (filterName, propName, value) => {
    const canvas = fabricRef.current
    const img = imgRef.current

    if (!canvas || !img) return

    if (filterName === 'Vignette') {
      const config = { ...(value || {}) }
      delete config.enabled
      let filter = img.filters.find(f => f.type === 'Vignette')
      if (!filter) {
        filter = new fabric.filters.Vignette(config)
        img.filters.push(filter)
      } else if (typeof filter.setOptions === 'function') {
        filter.setOptions(config)
      } else {
        Object.assign(filter, config)
      }
      img.applyFilters()
      canvas.requestRenderAll()
      return
    }

    let filter = img.filters.find(f => f instanceof fabric.filters[filterName]);
    // img.filters = img.filters.filter(f=>f.type !== filterName)

    if (filterName === 'Gamma' && !Array.isArray(value)) {
      value = [value, value, value]
      console.log("value of G value : ", value)
    }

    if (filter) {
      filter[propName] = value
    } else {
      const newFilter = new fabric.filters[filterName]({
        [propName]: value
      })
      img.filters.push(newFilter)
    }
    img.applyFilters()
    canvas.requestRenderAll()
  }
  //! this handles variable filters
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return
    const states = imageStates[activeImage]
    if (!states) return

    const filterMap = {
      brightness: { class: 'Brightness', prop: 'brightness' },
      contrast: { class: 'Contrast', prop: 'contrast' },
      saturation: { class: 'Saturation', prop: 'saturation' },
      gamma: { class: 'Gamma', prop: 'gamma' }
      // warmth:{class : 'WarmFilter' , prop:'warmth'}
    }


    Object.keys(filterMap).forEach((key) => {
      const { class: fclass, prop: fprop } = filterMap[key]

      let value = states[key] ?? (fclass === 'Gamma' ? 1 : 0)

      applyFabricFilter(fclass, fprop, value)
    })
  }, [imageStates, activeImage])

  useEffect(() => {
    if (!canvasRef.current || !imgRef.current) return
    const states = imageStates[activeImage]
    const vignetteState = states?.vignette
    if (!vignetteState) {
      removeVignetteFilter()
      toggleVignetteControl(false)
      return
    }

    if (!vignetteState.enabled || (vignetteState.intensity ?? 0) <= 0) {
      removeVignetteFilter()
      toggleVignetteControl(false)
      return
    }

    applyFabricFilter('Vignette', null, vignetteState)
    if (visiblePanel === 'vignette') {
      toggleVignetteControl(true, vignetteState)
    } else {
      toggleVignetteControl(false)
    }
  }, [imageStates, activeImage, visiblePanel])


  useEffect(() => {
    // implementation of apply convolute filter is left do it , head is paingin now ....

    if (!canvasRef.current || !imgRef.current) return;

    const states = imageStates[activeImage]
    if (!states) return

    const filterMap = {
      sharpen: { class: 'sharpenFilter', prop: 'clariy' },
      blur: { class: 'blurfilter', prop: 'blur' }
    }

    Object.keys(filterMap).forEach((key) => {
      applyConvoluteFilter(key, states[key])
    })
  }, [activeImage, imageStates])


  const applyStaticFilter = (filtername, filterMap) => {
    if (!canvasRef.current || !imgRef.current) return

    const canvas = fabricRef.current
    const img = imgRef.current


    const existingVignette = img.filters.find(f => f.type === 'Vignette')
    img.filters = existingVignette ? [existingVignette] : []

    if (filtername === 'none') {
      for (let i in filterMap) {
        img.filters = img.filters.filter(
          f => !(f instanceof fabric.filters[filterMap[i]])
        )
      }

      img.applyFilters()
      canvas.requestRenderAll()
      return;
    }
    //! fix ti there cant fix it today anymore
    console.log("new fabric.filters.", filterMap[filtername])
    //* 1. check if a filter is already active 
    //* 2. remove the activated filter 
    //* 3. Check with the filtername i.e be applied and apply the filter  
    const filterTypes = new Set(Object.values(filterMap))
    img.filters = img.filters.filter(
      f => !filterTypes.has(f.constructor)
    )

    let newFilterClass = filterMap[filtername]
    if (!newFilterClass) return;
    img.filters.push(new newFilterClass())
    img.applyFilters()
    canvas.requestRenderAll()
  }
  //! this handles only the preset filters
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current || !activeImage) return;
    console.log("Preset Filter : ", presetfilter)

    const staticFilterMap = {
      none: "none",
      vintage: fabric.filters.Vintage,
      polaroid: fabric.filters.Polaroid,
      sepia: fabric.filters.Sepia,
      technicolor: fabric.filters.Technicolor,
      brownie: fabric.filters.Brownie,
      kodachrome: fabric.filters.Kodachrome,
      pixelate: fabric.filters.Pixelate,
      bw: fabric.filters.Grayscale,
    }

    applyStaticFilter(presetfilter, staticFilterMap)
  }, [presetfilter, activeImage])


  const applyConvoluteFilter = (type, value) => {
    if (!imgRef.current || !canvasRef.current) return
    const img = imgRef.current
    const canvas = fabricRef.current
    console.log("Value of convolute filter are: ",value)
    img.filters = img.filters || []

    let sharpen = img.filters.find(f => f.name === 'sharpenFilter')
    let blur = img.filters.find(f => f.name === 'blurfilter')


    if (type === 'sharpen') {
      // value = value 
      if (!sharpen) {
        const sharpFilter = new fabric.filters.Convolute({
          matrix: [
            0, -value, 0,
            -value, (4 * value) + 1, -value,
            0, -value, 0
          ]
        })
        sharpFilter.name = 'sharpenFilter'
        img.filters.push(sharpFilter)
      } else {
        sharpen.matrix = [
          0, -value, 0,
          -value, (4 * value) + 1, -value,
          0, -value, 0
        ]
      }
    }
    if (type === 'blur') {
      value = value*5.5
      if (!blur) {
        const blurFilter = new fabric.filters.Convolute({
          matrix: [
            value / 9, value / 9, value / 9,
            value / 9, (1 - value) + value / 9, value / 9,
            value / 9, value / 9, value / 9,
          ],
        })
        blurFilter.name = 'blurfilter'
        img.filters.push(blurFilter)
      } else {
        blur.matrix = [
          value / 9, value / 9, value / 9,
          value / 9, (1 - value) + value / 9, value / 9,
          value / 9, value / 9, value / 9,
        ]
      }

    }

    img.applyFilters()
    canvas.requestRenderAll()
  }

  const getLiveDimensions = () => {
    if (!imgRef.current) return

    const obj = imgRef.current

    return {
      displayWidth: obj.getScaledWidth(),
      displayHeight: obj.getScaledHeight(),

      left: obj.left,
      top: obj.top,

      scaleX: obj.scaleX,
      scaleY: obj.scaleY
    }

  }

  //! Actuall CropBox Overlay which we can see
  const toggleCropbox = (isActive) => {
    const canvas = fabricRef.current
    if (!canvas) return;

    const dimestions = getLiveDimensions()

    if (isActive) {
      const rect = new fabric.Rect({
        width: dimestions.displayWidth,
        height: dimestions.displayHeight,
        fill: 'rgba(0,0,0,0.1)',
        stroke: '#fff',
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        cornerColor: '#3b82f6',
        transparentCorners: false,
        RotatingPoint: false,
      })
      rect.setControlVisible('mtr', false)
      canvas.add(rect)
      canvas.centerObject(rect)
      canvas.setActiveObject(rect)
      setCropBox(rect);
    } else {
      if (cropBox) {
        canvas.remove(cropBox)
        setCropBox(null)
      }
    }

  }
  //*Toggling ON/OFF CropBox according to the Current Panel
  useEffect(() => {
    toggleCropbox(visiblePanel === 'crop')
  }, [visiblePanel])


  return (
    <div
      ref={containerRef}
      className="flex-1 bg-base-100 rounded-lg flex items-center justify-center shadow-inner overflow-auto relative">
      {!activeImage ?
        <p className="text-base-content/50">Your Image Will Appear Here</p>
        :
        <>
          <RxCross2
            size={30}
            className="absolute top-3 right-3 text-xl text-base-content/70 cursor-pointer hover:text-base-content transition hover:scale-105" onClick={() => { setActiveImage('') }} />
          <div

            className="max-w-full max-h-full"
          >
            <canvas ref={canvasRef} />
          </div>

        </>
      }
    </div>
  );
}