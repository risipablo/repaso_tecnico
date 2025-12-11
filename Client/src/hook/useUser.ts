import { useState } from "react"
import type{ IUsers } from "../types/interface"
import { users } from "../data/data"


export const useUser = () => {
    const [user, setUser] = useState<IUsers[]>([])

    const fetch = ():Promise<IUsers[]> => {

        return new Promise<IUsers[]>((resolve) => {
            const userData = (users as IUsers[])

            setUser(userData)
            resolve(userData)
        })
    }


    return{fetch,user}
}