import { h, Component, render } from 'preact'
import { useState } from 'preact/hooks'

type EventTarget = { value: string } | null
type EventTargetCheckbox = { checked: boolean } | null

// const TodoStyled = styled.div`
//     background-color: #02c2d2;
//     display: flex;
// `

type TodoItemBoolean = { id: number; kind: 'boolean'; done: boolean; description: string }
type TodoItemNumeric = { id: number; kind: 'numeric'; target: number; progress: number; description: string }

type TodoItem =
    | TodoItemBoolean
    | TodoItemNumeric

function isDone(item: TodoItem): boolean {
    switch (item.kind) {
        case "boolean": return item.done
        case "numeric": return item.progress >= item.target
    }
}

const App = () => {
    const [items, setItems] = useState<TodoItem[]>([
        { id: Date.now() + 10, kind: 'boolean', done: false, description: "Feed the cat"},
        { id: Date.now() + 20, kind: 'boolean', done: false, description: "Feed Jonatan as well"},
        { id: Date.now() + 30, kind: 'numeric', target: 5, progress: 1, description: "Watch (inappropriate) memes" },
        { id: Date.now() + 40, kind: 'numeric', target: 5, progress: 6, description: "Test the numeric todo" },
        { id: Date.now() + 50, kind: 'boolean', done: false, description: "Do the thing"},
        { id: Date.now() + 60, kind: 'boolean', done: false, description: "Learn to love Haskell as much as Jonatan does"},
        { id: Date.now() + 80, kind: 'boolean', done: true, description: "Eat a banana"},
    ])

    const [newTodo, setNewTodo] = useState('')

    return (
        <div>
            <h2>Tododoro</h2>
            <ul>
                {[...items]
                .sort((a, b) => { 
                    return Number(isDone(a)) - Number(isDone(b))
                 })
                .map((item) => <TodoEntry key={item.id} model={item} onEntryChanged={(entry) => {
                    setItems(currentItems => currentItems.map((item) => entry.id === item.id ? entry : item)) }
                } />)}
            </ul>
            <input type="text" value={newTodo} onInput={(event) => setNewTodo((event.target as EventTarget)?.value ?? '')} />
            <button onClick={() => {
                setItems(currentItems => [...currentItems, { id: Date.now(), kind: 'boolean', done: false, description: newTodo }])
                setNewTodo('')
            }}>add</button>
        </div>
    )
}

const TodoEntryNumeric = ({ model, onEntryChanged }: { model: TodoItemNumeric; onEntryChanged: (item: TodoItemNumeric) => void }) => {
    const [raw, setRaw] = useState(`${model.progress}`)

    return (
        <li>
            <input disabled type="checkbox" checked={model.progress >= model.target} />
            {/* <button onClick={() => onEntryChanged({ ...model, progress: model.progress + 1 })}>{model.progress}/{model.target}</button> */}
            <input type="number" value={raw} onInput={(event) => {
                const newRaw = (event.target as EventTarget)?.value ?? ''
                setRaw(newRaw)
                const n = parseFloat(newRaw)
                if (!isNaN(n)) {
                    onEntryChanged({ ...model, progress: n })
                }
            }} />/{model.target}
            {model.description}
        </li>
    )
}

const TodoEntry = ({ model, onEntryChanged }: { model: TodoItem; onEntryChanged: (item: TodoItem) => void }) => {
    switch (model.kind) {
        case "boolean": return <li><input type="checkbox" checked={model.done} onChange={
            (event) => onEntryChanged({ ...model, done: (event.target as EventTargetCheckbox)?.checked ?? false })
        }  />{model.description}</li>
        // TODO: Show the /X inside of the text field
        case "numeric": return <TodoEntryNumeric model={model} onEntryChanged={onEntryChanged} />
    }
}

window.addEventListener('DOMContentLoaded', function() {
    const parent = document.body
    if (parent === null) {
        console.error('Could not find parent node')
        return
    }

    render(<App />, parent)
})
