import { useState } from 'react'
import './components/MovieApp.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <MovieApp></MovieApp>
    </div>  

  )
}

export default App
