import { CrudTask } from "../components/crudTask";

export function TODO(){

    return(
        <div className="todo-container">
            <h2> TODO LIST </h2>
            <CrudTask/>
        </div>
    )
}