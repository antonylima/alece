
import { useState, useEffect } from 'react'
import { supabase } from './util/supabase'
import Api from './Api'
import './App.css'


function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      console.log('Fetching from ctp table...')
      const { data: todos, error, status, statusText } = await supabase.
      from('ctp').
      select('*').
      order(['mesa','deputado'])
      //order([{column:'deputado'},{column:'role'}])


      console.log('Data:', todos)
      console.log('Error:', error)
      console.log('Status:', status, statusText)

      if (error) {
        console.error('Supabase Error Details:', error.message, error.details)
      }

      if (todos && todos.length > 0) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])
  let h = " "
  return (
    <div>
      <Api />
      {todos.map((todo) => (
        <li key={todo.id}>
          <a href={todo.link} target="blank">{todo.deputado}</a> - {todo.sigla}{todo.role? h : "" }<span class="role">{todo.role}</span><span class="lic">{todo.licenciado? " LICENCIADO" : "" }</span>
        </li>
      ))}
    </div>
  )
}
export default App
