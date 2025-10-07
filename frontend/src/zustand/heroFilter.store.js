import { create } from "zustand";

const useFilterStore = create((set)=>({
    filter : "all",
    setFilter:(f)=>set({filter:f})
}))

export default useFilterStore