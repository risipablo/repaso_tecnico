
import { MoveDown, MoveUp } from 'lucide-react'
import type { Props } from './orderName'
import { useState } from 'react'



export const OrderSalary = ({userFilter,setUserFilter}:Props) => {

    
    const [orderSalary, setOrderSalary] = useState<boolean>(false)

    const handleSalary = () => {
        const order = [...userFilter].sort((a,b) => {
            return orderSalary ? a.salary - b.salary : b.salary - a.salary
        })
        setUserFilter(order)
        setOrderSalary(!orderSalary)
    }


  return (
    <div>
      <button onClick={handleSalary}>{orderSalary ? <MoveUp/> : <MoveDown/>}</button>
    </div>
  )
}


