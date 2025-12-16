import { useEffect, useState } from "react"
import { useUser } from "../hook/useUser"
import { Search } from "../components/search"
import { Filter } from "../components/filter"
import type { IUsers } from "../types/interface"
import { OrderName } from "../components/orderName"



export function UserPage(){

    const {fetch,userFilter,user,setUserFilter,showAllUsers} = useUser()

    useEffect(() => {
        fetch()
    }, [])


    const [searchResults, setSearchResults] = useState<IUsers[]>([])
    const [activeSearch, setActiveSearch] = useState<boolean>(false)

    const handleSearch = (searchTerms:string[]) => {
        if(searchTerms.length === 0) {
            // resetear Busqueda
            setSearchResults([])
            setActiveSearch(false)
            showAllUsers()
        }else{
            // filtrar los usuarios con sus coincidencias
            const result = user.filter(prod => 
                searchTerms.every(term => 
                    prod.name.toUpperCase().includes(term) ||
                    prod.salary.toString().includes(term) ||
                    prod.age.toString().includes(term) ||
                    prod.job.toUpperCase().includes(term) ||
                    prod.area.toUpperCase().includes(term)
                )
            )

            setSearchResults(result) // guarda resultados
            setActiveSearch(true)    // busqueda activa
            setUserFilter(result)   // mostrar resultados
        }
    }


    const handleCleanAll = () => {
        setSearchResults([])
        setActiveSearch(false)
        showAllUsers()
    }




    return(
        <div className="user-container">
            <h1>User Data</h1>

            <div>
                <Search placeholder="Buscar usuarios" filterData={handleSearch} />
            </div>

            <div>
                 <button onClick={handleCleanAll}> Mostrar todos</button>
                 <Filter userFilter={activeSearch ? searchResults:user} setUserFilter={setUserFilter} />

                

                
            </div>


            {userFilter.length === 0 ? (
                <p>No hay usuarios registrados</p>
            ) : (
                <div className="user-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name <OrderName userFilter={userFilter} setUserFilter={setUserFilter} /> </th>
                                <th>Job</th>
                                <th>Area</th>
                                <th>Age</th>
                                <th>Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userFilter.map((user) => (
                                <tr key={user.id}>
                                    <td data-label="Name">{user.name}</td>
                                    <td data-label="Job">{user.job}</td>
                                    <td data-label="Area">{user.area}</td>
                                    <td data-label="Age">{user.age}</td>
                                    <td data-label="Salary"> $ {user.salary}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}