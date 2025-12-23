
export interface ITask {
    _id: string;
    date: Date;
    title: string | string[];        // Puede ser string O array
    priority: string | string[];     // Puede ser string O array
    completed?: boolean;
    amount: number | number[];       // Puede ser number O array
     subtaskCompleted?: boolean[]
}

export interface IUsers{
    id:number
    name:string
    job:string
    age:number
    salary:number
    area:string
}

export interface ISearchProps{
    placeholder: string;
    filterData: (searchterms: string[]) => void
    
}