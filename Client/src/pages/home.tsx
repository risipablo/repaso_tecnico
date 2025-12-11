import { NavLink } from "react-router-dom"

export const Home = () => {

    return(
        <div className="container-home">
             <h1> Prueba tecnicas</h1>
            <NavLink to="/todo">
                TODO
            </NavLink>

            <NavLink to="/products-stock">
                Gestion de productos
            </NavLink>

            <NavLink to="/api-local">
                API Local
            </NavLink>

        </div>
    )
}