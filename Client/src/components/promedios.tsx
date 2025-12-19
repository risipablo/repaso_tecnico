import type { IUsers } from "../types/interface"

export type Props = {
    userFilter:IUsers[]
    
}

export const Promedios = ({userFilter}:Props) => {


    const handlerProm = () => {
        const prom = [...userFilter].reduce((acc, curr) => acc + curr.salary,0) / userFilter.length
        return prom
   }

   const sumSalary = () => {
        const sum = [...userFilter].reduce((acc,curr) => acc + curr.salary,0 )
        return sum
   }


   const areaJobs = () => {
        // crear un objeto para contar las ocurrencias de cada area
        const areaCounts: {[key:string]:number} = {}
        // las key represetan los nombre de las areas 
        // los values son la cantidad de usuarios en cada area

        // Se recorre todo el array de usuarios 
        userFilter.forEach(user => {
            // Se extrae el area del usuario actual
            const area = user.area

            // Contamos la ocurrencia del area. Si existe en el obeto tendra un numero 
            areaCounts[area] = (areaCounts[area] || 0 ) + 1 // si no existe sera undefined 
            // Luego se suma un 1 para contar 
        })


        // Encontrar el area que tenga mas usuarios
        const maxArea = Object.entries(areaCounts) // con Object.enteries convertimos el objeto en array de pares
                        .reduce((max, [area,count]) => // procesamos cada elemento del array  
            
            // Si el conteo actual es mayor que el conteo maximo almacenado se devuelve un nuevo objeto con el area actual sino mantemos el anterio
            count > max.count ? {area,count} : max,
            // Se inicia vacio el area y 0 para asegurar que la primera comparacion sea verdadera
            {area: '', count: 0} // Luego se ira actualizando el valor

        )
        return maxArea.area
   }

   const totalWorker = () => {
        const worker = [...userFilter].length
        return worker
   }

   const promAge = () => {
        const promA = [...userFilter].reduce((acc,curr) => acc + curr.age, 0) / userFilter.length
        return promA
   }


    return(
        <div className="container-prom">
            <p style={{color:'black'}}> Promedio de edad: {promAge()}</p>
            <p style={{color:'black'}}> Promedio: $ {handlerProm()}</p>
            <p style={{color:'black'}}> Suma Total: ${sumSalary()}</p>
            <p style={{color:'black'}}> Area con mas presencia: {areaJobs()}</p>
            <p style={{color:'black'}}>  Actualmente tiene: {totalWorker()} Trabajadores</p>
            
        </div>
    )
}