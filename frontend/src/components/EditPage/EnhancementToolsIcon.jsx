// Reusable slider component to maintain consistent styling
const AdjustmentSlider = ({ label, value, min, max, step, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-300 font-medium flex justify-between">
            <span>{label}</span>
            <span className="text-purple-400">{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                       [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
        />
    </div>
);

// Reusable preset button component
const PresetButton = ({ label, isActive, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors text-sm
                    ${isActive ? 'bg-purple-700 text-white shadow-lg' : 'bg-slate-700/40 hover:bg-slate-600/60 text-slate-300'}`}
    >
        {icon && <div className="mb-1 text-xl">{icon}</div>} {/* Optional icon */}
        <span>{label}</span>
    </button>
);


export { AdjustmentSlider, PresetButton };