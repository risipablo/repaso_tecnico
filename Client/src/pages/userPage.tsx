import { useEffect } from "react"
import { useUser } from "../hook/useUser"



export function UserPage(){

    const {fetch,user} = useUser()

    useEffect(() => {
        fetch()
    })

    return(
        <div className="user-container">
            <h1> User Data </h1>


            {user.length === 0 ? <p> No hay usuarios registrados</p> :
            
            user.map((user) => (
                <div key={user.id}>
                    <td>Name</td>
                    <td>Job</td>
                    <td>Age</td>
                    <td>Salary</td>
                    <p>{user.name}</p>
                    <p>{user.job}</p>
                    <p>{user.age}</p>
                    <p>$ {user.salary}</p>
                </div>
            ))}
        </div>
    )
}