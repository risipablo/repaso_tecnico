
export interface ITask{
    _id:string
    date:Date;
    title:string;
    priority: string;
    completed?:boolean
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