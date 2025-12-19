import { useEffect, useState } from "react"
import { useUser } from "../hook/useUser"
import { Search } from "../components/search"
import { Filter } from "../components/filter"
import type { IUsers } from "../types/interface"
import { OrderName } from "../components/orderName"
import { Promedios } from "../components/promedios"
import "../style/userPage.css"

export function UserPage() {
    const { fetch, userFilter, user, setUserFilter, showAllUsers } = useUser()
    const [searchResults, setSearchResults] = useState<IUsers[]>([])
    const [hasActiveSearch, setHasActiveSearch] = useState<boolean>(false)
    
    // Estado de filtros en el padre
    const [filterJobs, setFilterJobs] = useState<string>("")
    const [filterAreas, setFilterAreas] = useState<string>("")
    const [filterSalaryMax, setFilterSalaryMax] = useState<boolean>(false)
    const [filterSalaryMin, setFilterSalaryMin] = useState<boolean>(false)
    const [orderAge, setOrderAge] = useState<boolean>(false)
    const [orderSalary, setOrderSalary] = useState<boolean>(false)

    useEffect(() => {
        fetch()
    }, [])

    // Manejar búsqueda
    const handleSearch = (searchTerms: string[]) => {
        if (searchTerms.length === 0) {
            // Resetear TODO
            setSearchResults([])
            setHasActiveSearch(false)
            resetAllFiltersAndSearch()
        } else {
            // Aplicar búsqueda
            const results = user.filter(prod => 
                searchTerms.every(term => 
                    prod.name.toUpperCase().includes(term) ||
                    prod.salary.toString().includes(term) ||
                    prod.age.toString().includes(term) ||
                    prod.job.toUpperCase().includes(term) ||
                    prod.area.toUpperCase().includes(term)
                )
            )
            
            setSearchResults(results)
            setHasActiveSearch(true)
            applyAllFilters(results)
        }
    }

    // Aplicar todos los filtros a una lista base
    const applyAllFilters = (baseUsers: IUsers[]) => {
        let filtered = [...baseUsers]


        if(orderAge){
            filtered = filtered.sort((a,b) => {
                return b.age - a.age
            })
        }

        if(orderSalary){
            filtered = filtered.sort((a,b) => {
                return b.salary - a.salary
            })

        }
        
        if (filterJobs.trim() !== '') {
            filtered = filtered.filter(p => 
                p.job.toUpperCase().includes(filterJobs.toUpperCase())
            )
        }

        
        if (filterAreas.trim() !== '') {
            filtered = filtered.filter(p => 
                p.area.toUpperCase().includes(filterAreas.toUpperCase())
            )
        }

        
        if (filterSalaryMax && filtered.length > 0) {
            const max = filtered.reduce((max, user) => 
                user.salary > max.salary ? user : max,
                filtered[0]
            )
            filtered = filtered.filter(p => p.salary === max.salary)
        }


        if (filterSalaryMin && filtered.length > 0) {
            const min = filtered.reduce((minus, user) => 
                user.salary < minus.salary ? user : minus,
                filtered[0]
            )
            filtered = filtered.filter(p => p.salary === min.salary)
        }

        setUserFilter(filtered)
    }

    // Resetear TODO (búsqueda y filtros)
    const resetAllFiltersAndSearch = () => {
        setFilterJobs("")
        setFilterAreas("")
        setOrderAge(false)
        setOrderSalary(false)
        setFilterSalaryMax(false)
        setFilterSalaryMin(false)
        showAllUsers()
    }

    // Resetear solo filtros (mantener búsqueda)
    const resetOnlyFilters = () => {
        setFilterJobs("")
        setFilterAreas("")
        setFilterSalaryMax(false)
        setFilterSalaryMin(false)
        setOrderSalary(false)
        setOrderAge(false)
        
        // Re-aplicar solo búsqueda si existe
        if (hasActiveSearch && searchResults.length > 0) {
            setUserFilter([...searchResults])
        } else {
            showAllUsers()
        }
    }

    // Cuando cambia cualquier filtro, aplicarlos
    useEffect(() => {
        const baseUsers = hasActiveSearch ? searchResults : user
        applyAllFilters(baseUsers)
    }, [filterJobs, filterAreas, filterSalaryMax, filterSalaryMin, orderAge, orderSalary])

    return (
        <div className="user-container">
            <h1>User Data</h1>

            <div>
                <Search 
                    placeholder="Buscar usuarios..." 
                    filterData={handleSearch} 
                />
            </div>

            <div>
                <button onClick={resetAllFiltersAndSearch}>Limpiar TODO</button>
                
                <Filter 
                    jobs={filterJobs}
                    setJobs={setFilterJobs}
                    areas={filterAreas}
                    setAreas={setFilterAreas}
                    salaryMax={filterSalaryMax}
                    setSalaryMax={setFilterSalaryMax}
                    salaryMin={filterSalaryMin}
                    setSalaryMin={setFilterSalaryMin}
                    ages={orderAge}
                    setAges={setOrderAge}
                    salarys={orderSalary}
                    setSalarys={setOrderSalary}
                    onReset={resetOnlyFilters}
                />
            </div>

            {userFilter.length === 0 ? (
                <p>No hay usuarios</p>
            ) : (
                <div className="user-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name <OrderName userFilter={userFilter} setUserFilter={setUserFilter}/></th>
                                <th>Job</th>
                                <th>Area</th>
                                <th>Age</th>
                                <th>Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userFilter.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.job}</td>
                                    <td>{user.area}</td>
                                    <td>{user.age}</td>
                                    <td>${user.salary.toLocaleString()}</td>
        
                                </tr>
                            ))}

                            
                        </tbody>
                        
                    </table>
                    <Promedios userFilter={userFilter} />
                </div>
            )}
        </div>
    )
}