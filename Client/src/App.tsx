import { BrowserRouter, Route, Routes } from "react-router-dom"
import { TODO } from "./pages/todo"

import { Home } from "./pages/home"
import { Menu } from "./components/menu"
import { UserPage } from "./pages/userPage"




function App() {
  

  return (
    <BrowserRouter>
    
   

      <Menu/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/todo" element={<TODO/>} />
        <Route path="/api-local" element={<UserPage/>} />

      </Routes>
      
    </BrowserRouter>
  )
}

export default App
