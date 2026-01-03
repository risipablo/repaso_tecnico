import { useState } from "react"
import type{ IUsers } from "../types/interface"
import { users } from "../data/data"


export const useUser = () => {
    const [user, setUser] = useState<IUsers[]>([])
    const [userFilter, setUserFilter] = useState<IUsers[]>([])
    

    const fetch = ():Promise<IUsers[]> => {

        return new Promise<IUsers[]>((resolve) => {
            const userData = (users as IUsers[]) // convierte los datos importados al tipo de interfaz. AS funciona para realizar esa conversion 

            setUserFilter(userData)
            setUser(userData) // Actualizar el estado con los productos
            resolve(userData) // Resuelve la promesa con los datos
        })
    }

     const showAllUsers = () => {
        setUserFilter([...users])
    }




    return{fetch,user,userFilter,setUserFilter,showAllUsers}
}



  