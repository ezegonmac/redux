import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchThunk, setComplete, setFilter, selectTodos, selectStatus } from "./features/todos";

// const initialState = {
//     entities: [],
//     filter: 'all', // complete || incomplete
// }

const TodoItem = ({ todo }) => {
    const dispatch = useDispatch()
    
    return (
        <li
            style={{ textDecoration: todo.completed ? 'line-through' : 'none'}}
            onClick={() => dispatch(setComplete(todo))}
        >{todo.title}</li>
    )
}

const App = () => {
    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    const todos = useSelector(selectTodos)
    const status = useSelector(selectStatus)

    const submit = e => {
        e.preventDefault()
        if(!value.trim()) {
            return 
        }

        const id = Math.random().toString(36)
        const todo = { title: value, completed: false, id }
        dispatch({ type: 'todo/add', payload: todo })
        setValue('')
    }
    
    if(status.loading === 'pending') {
        return <p>Cargando...</p>
    }
    if(status.loading === 'rejected') {
        return <p>{status.error}</p>
    }
    return(
        <div>
            <form onSubmit={submit}>
                <input value={value} onChange={e => setValue(e.target.value)}/>
            </form>
            <button onClick={() => dispatch(setFilter('all'))} >Mostrar todos</button>
            <button onClick={() => dispatch(setFilter('complete'))}>Completados</button>
            <button onClick={() => dispatch(setFilter('incomplete'))}>Incompletos</button>
            
            <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
            
            <ul>
                {todos.map(todo => <TodoItem key={todo.id} todo={todo}></TodoItem>)}
            </ul>
        </div>
    )
}

export default App