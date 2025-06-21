import {create} from 'zustand'
import { persist,createJSONStorage } from 'zustand/middleware'

interface CategoryType {
    category:string
}


const initialCategory = ''


interface CategoryStore{
    category:string,
    setCategory:(category:string)=>void,
}

const useCategory = create<CategoryStore>()(
        (set)=>({
            category:initialCategory,
            setCategory:(category:string)=>set(()=>({category})),
        }),           
)

export default useCategory