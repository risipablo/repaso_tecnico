import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TODO } from "./pages/todo"

import { Home } from "./pages/home"
import { Menu } from "./components/menu"




function App() {
  

  return (
    <BrowserRouter>
    
   

      <Menu/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/todo" element={<TODO/>} />

      </Routes>
      
    </BrowserRouter>
  )
}

export default App
