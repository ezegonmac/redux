import { combineReducers } from "redux"
import { mac, mat, asyncMac, makeCrudReducer, makeFetchingReducer, makeSetReducer, reduceReducers } from "./utils"


const asyncTodos = mat('todos')

// Action creators

const [setPending, setFulfilled, setError] = asyncMac(asyncTodos)

// ==>
// ==>

// export const setPending = mac('todos/pending')

// <====>
// export const setPending = () => {
//     return {
//         type: 'todos/pending'
//     }
// }
        
// export const setFulfilled = mac('todos/fulfilled', 'payload' )        
        
// <====>
// export const setFulfilled = payload => ({ type: 'todos/fulfilled', payload })

// export const setError = mac('todo/error', 'error')

// <====>
// export const setError = e => ({ type: 'todo/error', error: e.message })

export const setComplete = mac('todo/complete', 'payload')
export const setFilter = mac('filter/set', 'payload')

//  ------

export const fetchThunk = () => async dispatch => {
    dispatch(setPending())
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch(setFulfilled(todos))
    } catch (e) {
        dispatch(setError(e.message))
    }
}

// reducers

export const filterReducer = makeSetReducer([
    'filter/set'
]) 

export const fetchingReducer = makeFetchingReducer(asyncTodos)

const fulfilledReducer = makeSetReducer(['todos/fulfilled'])
const crudReducer = makeCrudReducer(['todo/add', 'todo/complete'])

export const todosReducer = reduceReducers(crudReducer, fulfilledReducer)
    
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


// selectors

export const selectTodos = state => {
    const { todos: { entities }, filter } = state

    if (filter === 'complete') {
        return entities.filter(todo => todo.completed)
    }
    if (filter === 'incomplete') {
        return entities.filter(todo => !todo.completed)
    }

    return entities
}

export const selectStatus = state => state.todos.status