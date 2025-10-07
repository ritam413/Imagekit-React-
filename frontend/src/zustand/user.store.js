import { persist } from 'zustand/middleware'
import {create} from 'zustand'
const useUserStore = create (
    persist(
        (set)=>({
        user:null,
        setUser:(user)=>set({user}),//login,signup
        logout:()=>set({user:null})//logout
        }), 
        {
            name:'user-storage'
        }
    )
);

export default useUserStore;
