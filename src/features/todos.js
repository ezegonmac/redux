import { combineReducers } from "redux"

// Action creators

export const setPending = () => {
    return {
        type: 'todos/pending'
    }
}

export const setFullfilled = payload => ({ type: 'todo/fullfilled', payload })

export const setError = e => ({ type: 'todo/error', error: e.message })

export const setComplete = payload => ({ type: 'todo/complete', payload })

export const setFilter = payload => ({ type: 'filter/set', payload })


//  --

export const fetchThunk = () => async dispatch => {
    dispatch(setPending())
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch(setFullfilled(todos))
    } catch (e) {
        dispatch(setError())
    }
}

// reducers

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