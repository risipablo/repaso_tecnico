import { useState } from "react"
import type { ISearchProps } from "../types/interface"
import { Search as SearchIcon, X } from "lucide-react"

export function Search({filterData, placeholder}: ISearchProps){
    const [inputValue, setInputValue] = useState<string>('')
    const [searching, setSearching] = useState<boolean>(false)

    const searchData = (event: React.FormEvent) => {
        event.preventDefault()

        if(!inputValue.trim()){
            reset()
            return
        }

        const dataSearch = inputValue.toLocaleUpperCase()
        .normalize("NFD")
        .replace(/[\\u0300-\\u036f]/g, "")
        .split(/\s+/)
        .filter(palabra => palabra.trim() !== '')
        filterData(dataSearch)
        setSearching(true)
    }

    const reset = () => {
        setInputValue('')
        filterData([])
        setSearching(false)
    }

    return(
        <div className="container-seach">
            <div className="buscador-wrapper">
                <input 
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchData(e)}
                />
                
                {searching && (
                    <button onClick={reset} title="Limpiar búsqueda">
                        <X />
                    </button>
                )}
                
                <button onClick={searchData} title="Buscar">
                    <SearchIcon />
                </button>
            </div>
        </div>
    )
}