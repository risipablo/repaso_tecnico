
import { MoveDown, MoveUp } from 'lucide-react'
import type { IUsers } from '../types/interface'
import { useState } from 'react'

type Props = {
    userFilter:IUsers[]
    setUserFilter: React.Dispatch<React.SetStateAction<IUsers[]>>
    
}


export const OrderName = ({userFilter,setUserFilter}:Props) => {

    
    const [nameOrder, setNameOrder] = useState<boolean>(false)

    const handleOrder = () => {

      const order = [...userFilter].sort((a,b) => {
        return nameOrder ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      })
      setUserFilter(order)
      setNameOrder(!nameOrder)
    }



  return (
    <div>
      <button onClick={handleOrder}>{nameOrder ? <MoveUp/> : <MoveDown/>}</button>
    </div>
  )
}


