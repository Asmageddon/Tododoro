import { h, Component, render } from 'preact'
import { useState } from 'preact/hooks'

type EventTarget = { value: string } | null

// const TodoStyled = styled.div`
//     background-color: #02c2d2;
//     display: flex;
// `

type TodoItem =
    | { kind: 'boolean'; done: boolean; description: string }
    | { kind: 'numeric'; target: number; progress: number; description: string }

const App = () => {
    const [items, setItems] = useState<TodoItem[]>([
        { kind: 'boolean', done: false, description: "Feed the cat"},
        { kind: 'boolean', done: false, description: "Feed Jonatan as well"},
        { kind: 'numeric', target: 5, progress: 1, description: "Watch (inappropriate) memes" },
        { kind: 'numeric', target: 5, progress: 6, description: "Test the numeric todo" }
    ])
    const [newTodo, setNewTodo] = useState('')

    return (
        <div>
            <h2>Tododoro</h2>
            <ul>
                {items.map(item => <TodoEntry model={item} />)}
            </ul>
            <input type="text" value={newTodo} onInput={(event) => setNewTodo((event.target as EventTarget)?.value ?? '')} />
            <button onClick={() => setItems(currentItems => [...currentItems, { kind: 'boolean', done: false, description: 'bla' }])}>add</button>
        </div>
    )
}

const TodoEntry = ({ model }: { model: TodoItem }) => {
    switch (model.kind) {
        case "boolean": return <li><input type="checkbox" checked={model.done} />{model.description}</li>
        // TODO: onClick handler for button
        case "numeric": return (
            <li>
                <input disabled type="checkbox" checked={model.progress >= model.target} />
                <button onClick={() => TODO}>{model.progress}/{model.target}</button>
                {model.description}
            </li>
        )
    }
    // return (
    //     <li><input type="checkbox"></input>{item}</li>
    // )
}

window.addEventListener('DOMContentLoaded', function() {
    const parent = document.body
    if (parent === null) {
        console.error('Could not find parent node')
        return
    }

    render(<App />, parent)
})
