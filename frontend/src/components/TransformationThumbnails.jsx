export const TransformationThumbnails = ({ transformations = [], activeImage, setActiveImage }) => {
    return (
        <div className="flex gap-2 justify-center p-2 bg-gray-800 rounded-lg mt-2">
            {transformations.map((item, idx) => (
                <img
                    key={idx}
                    src={item.url}
                    alt={`Transform ${idx}`}
                    onClick={() => setActiveImage(item.url)}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer border ${activeImage === item.url ? 'border-blue-500' : 'border-transparent'
                        }`}
                />
            ))}
        </div>

    )
}

