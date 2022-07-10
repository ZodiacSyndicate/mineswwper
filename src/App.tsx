import { useState } from 'react'
import { RecoilRoot } from 'recoil'
import { generateGameBoard } from './utils/common'
import logo from './logo.svg'
import './App.css'
import { BlockType } from './utils/const'

function App() {
  const [count, setCount] = useState(0)
  const board = generateGameBoard(16, 30, 99)
  console.log(
    board.map((r) =>
      r.map((b) => (b.type === BlockType.Mine ? 'X' : b.count ? b.count : ''))
    )
  )

  return (
    <RecoilRoot>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Hello Vite + React!</p>
          <p>
            <button
              type="button"
              onClick={() => setCount((count) => count + 1)}
            >
              count is: {count}
            </button>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
          </p>
        </header>
      </div>
    </RecoilRoot>
  )
}

export default App
