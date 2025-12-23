

type Props = {
    jobs: string
    setJobs: React.Dispatch<React.SetStateAction<string>>
    areas: string
    setAreas: React.Dispatch<React.SetStateAction<string>>
    salaryMax: boolean
    setSalaryMax: React.Dispatch<React.SetStateAction<boolean>>
    salaryMin: boolean
    setSalaryMin: React.Dispatch<React.SetStateAction<boolean>>
    onReset: () => void
}

export function Filter({
    jobs, setJobs,
    areas, setAreas,
    salaryMax, setSalaryMax,
    salaryMin, setSalaryMin,
    onReset
}: Props) {
    
    const handleSalaryMax = () => {
        setSalaryMax(!salaryMax)
        setSalaryMin(false)
    }

    const handleSalaryMin = () => {
        setSalaryMin(!salaryMin)
        setSalaryMax(false)
    }


    // Determinar si hay filtros activos
    const hasActiveFilters = jobs !== "" || areas !== "" || salaryMax || salaryMin 
    return (
        <div className="container-filter">
            {hasActiveFilters && (
                <button onClick={onReset}>Reset Filters</button>
            )}

            <button 
                onClick={handleSalaryMax} 
                className={salaryMax ? 'active' : ''}
            >
                {salaryMax ? 'Mostrar todos' : 'Salario Máximo'}
            </button>
            
            <button 
                onClick={handleSalaryMin}
                className={salaryMin ? 'active' : ''}
            >
                {salaryMin ? 'Mostrar todos' : 'Salario Mínimo'}
            </button>

           

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

            
        </div>
    )
}