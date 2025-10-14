import { useImageStore } from "../../zustand/image.store";

export const TransformationThumbnails = () => {
  const transformations = useImageStore((state) => state.transformations);
  const activeImage = useImageStore((state) => state.activeImage);
  const setActiveImage = useImageStore((state) => state.setActiveImage);

  if (!activeImage || !transformations[activeImage]) return null;

  const currentTransforms = transformations[activeImage];

  return (
    <div className="flex gap-2 justify-center p-2 bg-gray-800 rounded-lg mt-2">
      {currentTransforms.map((item, index) => (
        <img
          key={`transformation-${activeImage}-${index}`}
          src={item.url}
          alt={`${item.type} ${index}`}
          onClick={() => setActiveImage(item.url)}
          className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${
            activeImage === item.url ? "border-blue-500" : "border-transparent"
          }`}
        />
      ))}
    </div>
  );
};
