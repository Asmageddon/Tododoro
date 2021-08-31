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

// TODO: How would I do an enum for the state, if at all?

type PomodoroModel = { active: boolean; time: number; target_time: number; task_id: number | null; task_description: string }

function isDone(item: TodoItem): boolean {
    switch (item.kind) {
        case "boolean": return item.done
        case "numeric": return item.progress >= item.target
    }
}

type PomodoroAction = 
    | {type: "start_pause"}
    | {type: "complete"}

const App = () => {
    const [items, setItems] = useState<TodoItem[]>([
        { id: Date.now() + 10, kind: 'boolean', done: false, description: 'Feed the cat' },
        { id: Date.now() + 20, kind: 'boolean', done: false, description: 'Feed Jonatan as well' },
        { id: Date.now() + 30, kind: 'numeric', target: 5, progress: 1, description: 'Watch (inappropriate) memes' },
        { id: Date.now() + 40, kind: 'numeric', target: 5, progress: 6, description: 'Test the numeric todo' },
        { id: Date.now() + 50, kind: 'boolean', done: false, description: 'Do the thing' },
        { id: Date.now() + 60, kind: 'boolean', done: false, description: 'Learn to love Haskell as much as Jonatan does' },
        { id: Date.now() + 80, kind: 'boolean', done: true, description: 'Eat a banana' },
    ])

    const [newTodo, setNewTodo] = useState('')

    const [pomodoro, setPomodoro] = useState<PomodoroModel>({active: false, time: 0, target_time: 15*60*1000, task_id: null, task_description: ""})

    // TODO: Make the Pomodoro actually update based on a timer.
        // Q: Do I want to use some standard JavaScript timer, or some sorta library wizardry?
    
    return (
        <div>
            <h2>Tododoro</h2>
            <PomodoroComponent model={pomodoro} onInteract={
                (action: PomodoroAction) => {
                    switch(action.type) {
                        case "start_pause": setPomodoro({...pomodoro, active: !pomodoro.active})
                        case "complete": /* We know the user hasn't done it, the lazy bum */
                    }
                }
            } />
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

const PomodoroComponent = ({model, onInteract}: {model: PomodoroModel; onInteract: (action: PomodoroAction) => void }) => {
    // TODO: Make this a snazzy-looking radial clock thingy
    // TODO: Format the text bit as MM:SS/MM:SS instead of just numbers
    return (
        <div>
            {model.time}/{model.target_time} {model.active ? "" : "(Paused)"} <br/>
            {model.task_description} <br/>
            <button onClick={() => onInteract({type: "start_pause"})}>Start/Pause</button>
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
