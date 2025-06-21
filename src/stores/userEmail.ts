import {create} from 'zustand'
import { persist,createJSONStorage } from 'zustand/middleware'

interface EmailType {
    email:string
}


const initialEmail = ''


interface EmailStore{
    email:string,
    setEmail:(email:string)=>void,
    clearEmail:()=>void
}

const useEmail = create<EmailStore>()(
    persist(
        (set)=>({
            email:initialEmail,
            setEmail:(email:string)=>set(()=>({email})),
            clearEmail:()=>set(()=>({email:initialEmail}))
        }),
        {
            name:'userEmail',
            storage:createJSONStorage(()=>localStorage),
        }
    )
)

export default useEmail