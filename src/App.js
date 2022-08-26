import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";


export const asyncMiddleware = store => next => action => {
    if(typeof action === 'function') {
        return action(store.dispatch, store.getState)
    }
    
    return next(action)
}

export const fetchThunk = () => async dispatch => {
    dispatch({ type: 'todo/pending' })
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch({ type: 'todo/fullfilled', payload: todos})
    } catch (e) {
        dispatch({ type: 'todo/error', error: e.message})
    }
}

// const initialState = {
//     entities: [],
//     filter: 'all', // complete || incomplete
// }

export const filterReducer = (state = 'all', action) => {
    switch(action.type) {
        case 'filter/set': 
            return action.payload
        default:
            return state
    }
}

const initialFetching = { loading: 'idle', error: null }
export const fetchingReducer = (state = initialFetching, action) => {
    switch (action.type) {
        case 'todo/pending':
            return { ...state, loading: 'pending' }
        case 'todo/fullfilled':
            return { ...state, loading: 'succeded'}
        case 'todo/error':
            return { error: action.error , loading: 'rejected'}
        default:
            return state
    }
}

export const todosReducer = (state = [], action) => {
    switch(action.type) {
        case 'todo/fullfilled': {
            return action.payload
        }
        case 'todo/add': {
            return state.concat({ ...action.payload })
        }
        case 'todo/complete': {
            const newTodos = state.map(todo=>{
                if(todo.id === action.payload.id) {
                    return { ...todo, completed: !todo.completed}
                }
                return todo
            })

            return newTodos
        }
        default:
            return state
    }
}

export const reducer = combineReducers({
    todos: combineReducers({
        entities: todosReducer,
        status: fetchingReducer,
    }),
    filter: filterReducer
})

// <====>

// export const reducer = (state = initialState, action) => {
//     return {
//         entities: todosReducer(state.entities, action),
//         filter: filterReducer(state.filter, action)
//     }
// }

const selectTodos = state => {
    const { todos: { entities }, filter } = state

    if (filter === 'complete') {
        return entities.filter(todo => todo.completed)
    }
    if (filter === 'incomplete') {
        return entities.filter(todo => !todo.completed)
    }

    return entities
}

const selectStatus = state => state.todos.status

const TodoItem = ({ todo }) => {
    const dispatch = useDispatch()
    
    return (
        <li
            style={{ textDecoration: todo.completed ? 'line-through' : 'none'}}
            onClick={() => dispatch({ type: 'todo/complete', payload: todo})}
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
            <button onClick={() => dispatch({ type: 'filter/set', payload: 'all'})} >Mostrar todos</button>
            <button onClick={() => dispatch({ type: 'filter/set', payload: 'complete'})}>Completados</button>
            <button onClick={() => dispatch({ type: 'filter/set', payload: 'incomplete'})}>Incompletos</button>
            
            <button onClick={() => dispatch(fetchThunk())}>Fetch</button>
            
            <ul>
                {todos.map(todo => <TodoItem key={todo.id} todo={todo}></TodoItem>)}
            </ul>
        </div>
    )
}

export default App