
import { MoveDown, MoveUp } from 'lucide-react'
import type { Props } from './orderName'
import { useState } from 'react'



export const OrderAge = ({userFilter,setUserFilter}:Props) => {

    
    const [ageOrder, setAgeOrder] = useState<boolean>(false)

    const handleOrder = () => {

      const order = [...userFilter].sort((a,b) => {
        return ageOrder ? a.age - b.age : b.age - a.age
      })
      setUserFilter(order)
      setAgeOrder(!ageOrder)
    }



  return (
    <div>
      <button onClick={handleOrder}>{ageOrder ? <MoveUp/> : <MoveDown/>}</button>
    </div>
  )
}


