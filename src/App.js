import { useDispatch, useSelector } from "react-redux";

const initialState = {
    entities: [],
}

export const reducer = (state={initialState}, action) => {
    switch (action.type) {
        case 'todo/add':
            console.log("reducer")
            return {
                ...state,
                entities: [{}]
            }
    }
    return state
}

const App = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    console.log(state, 'rendering');
    return(
        <div>
            <form>
                <input/>
            </form>
            <button onClick={() => dispatch({ type: 'todo/add'})}>Mostrar todos</button>
            <button>Completados</button>
            <button>Incompletos</button>
            <ul>
                <li>todo 1</li>
                <li>todo 2</li>
            </ul>
        </div>
    )
}

export default App