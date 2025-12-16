
import { useEffect, useState } from "react"
import type { IUsers } from "../types/interface"


type Props = {
    userFilter:IUsers[]
    setUserFilter: React.Dispatch<React.SetStateAction<IUsers[]>>
    
}

export function Filter({userFilter,setUserFilter}:Props){



    const [jobs,setJobs] = useState<string>("")
    const [areas, setAreas] = useState<string>("")
    const [salaryMax,setSalaryMax] = useState<boolean>(false)
    const [salaryMin,setSalaryMin] = useState<boolean>(false)
    const [salaryMa, setSalaryMa] = useState<number | null>(null)
    const [salaryMi, setSalaryMi] = useState<number | null>(null)
    

    const filter = () => {
        let userFiltered = [...userFilter]

        if (jobs.trim() !== ''){
            userFiltered = userFiltered.filter(p => p.job.toUpperCase().includes(jobs.toUpperCase()))
        }


        if (areas.trim() !== ''){
            userFiltered = userFiltered.filter(p => p.area.toUpperCase().includes(areas.toUpperCase()))
        }


        if(salaryMax && userFiltered.length > 0){
            // se recorre todo el array para encontrar el mayor salario y ser guardo en una constante para usarla mas adelante
            const max = userFiltered.reduce((max, user) => user.salary > max.salary ? user : max,userFiltered[0])

            // Filtrar el array para averiguar el usuario de mayor salario
            userFiltered = userFiltered.filter(p => p.salary === max.salary)

        }

        if(salaryMin && userFiltered.length > 0){
            const min = userFiltered.reduce((minus, user) => user.salary < minus.salary ? user : minus, userFiltered[0] )
            userFiltered = userFiltered.filter(p => p.salary === min.salary)
        }

        if(salaryMa !== null){
            userFiltered = userFiltered.filter(p => p.salary <= salaryMa)
        }

        if(salaryMi !== null){
            userFiltered = userFiltered.filter(p => p.salary >= salaryMi)
        }



        setUserFilter(userFiltered)
    }


    const handleSalaryMax = () =>{
        setSalaryMax(!salaryMax)
        setSalaryMin(false)
    }

    const handleSalaryMin = () =>{
        setSalaryMin(!salaryMin)
        setSalaryMax(false)
    }



     const activeFilters = jobs !== "" || areas !== "" || salaryMax || salaryMin || salaryMa !== null || salaryMi !== null

    const resetFilters = () => {
        setJobs("")
        setAreas("")
        setSalaryMax(false)
        setSalaryMin(false)
        setSalaryMa(null)
        setSalaryMi(null)

    }



    useEffect(() => {
        filter()
    },[jobs,salaryMax,salaryMin,areas,salaryMa,salaryMi])



    return(
        <div className="container-filter">

            {activeFilters && <button onClick={resetFilters}>Reset Filters</button>}

            <button onClick={handleSalaryMax}> Salario Maximo </button>
            <button onClick={handleSalaryMin}> Salario Minimo </button>
            

            <label>
                Ocupations:
                <select value={jobs} onChange={(e) => setJobs(e.target.value)}>
                    <option value="">All</option>
                    <option value="Developer Front End">Developer Front End</option>
                    <option value="Developer Back End">Developer Back End</option>
                    <option value="Enginer Software">Enginer Software</option>
                    <option value="Cibersecurity">Cibersecurity</option>
                    <option value="CEO">CEO</option>
                    <option value="Developer Jr">Developer Jr</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="UX/UI Designer">UX/UI Designer</option>
                    <option value="QA Automation">QA Automation</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Sales Executive">Sales Executive</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="SEO Specialist">SEO Specialist</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Training Specialist">Training Specialist</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                    <option value="Accountant">Accountant</option>
                    <option value="CFO">CFO</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Logistics Coordinator">Logistics Coordinator</option>
                    <option value="Legal Counsel">Legal Counsel</option>
                    <option value="Research Scientist">Research Scientist</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Office Administrator">Office Administrator</option>
                </select>
            </label>

            <label>
                Areas:
                <select value={areas} onChange={(e) => setAreas(e.target.value)}>
                    <option value="">All</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Producto">Producto</option>
                    <option value="Diseño">Diseño</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Logística">Logística</option>
                    <option value="Legal">Legal</option>
                    <option value="I+D">I+D</option>
                    <option value="Atención al Cliente">Atención al Cliente</option>
                    <option value="Administración">Administración</option>
                </select>
            </label>

            
            <label>
                Salario Minimo:
                <input 
                    type="number"
                    value={salaryMi ?? ''}
                    onChange={(e) => setSalaryMi(e.target.value ? parseInt(e.target.value) : null)}
                />
                <option value=""> Hasta </option>
                
            </label>


            <label>
                Salario Máximo:
                <input 
                    type="number"
                    value={ salaryMa ?? ''}
                    onChange={(e) => setSalaryMa(e.target.value ? parseInt(e.target.value) : null)}
                />
                <option value=""> Hasta </option>

            </label>


        </div>
        
    )
}