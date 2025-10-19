import { useState, useEffect } from 'react'
import QSLForm from './components/QSLForm'
import QSLCard from './components/QSLCard'
import './App.css'

function App() {
  const [qslData, setQslData] = useState(null)
  const [showForm, setShowForm] = useState(true)

  const handleFormSubmit = (data) => {
    setQslData(data)
    setShowForm(false)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleNewCard = () => {
    setQslData(null)
    setShowForm(true)
  }

  // Anti-right-click and copy protection
  useEffect(() => {
    // Disable console and add warning
    console.clear()
    console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;')
    console.log('%cThis is a browser feature intended for developers. Do not enter any code here.', 'color: red; font-size: 16px;')
    
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Disable copy, cut, paste, select all, and developer tools
    const handleKeyDown = (e) => {
      // Disable Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S, F12, and dev tools
      if (
        (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 's' || e.key === 'u')) ||
        e.key === 'F12' ||
        e.key === 'F5' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I (DevTools)
        (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C (DevTools)
        (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J (Console)
        (e.ctrlKey && e.key === 'u') || // Ctrl+U (View Source)
        (e.ctrlKey && e.key === 'h') || // Ctrl+H (History)
        (e.ctrlKey && e.key === 'r') || // Ctrl+R (Refresh)
        (e.ctrlKey && e.key === 'f') || // Ctrl+F (Find)
        (e.altKey && e.key === 'F4')    // Alt+F4 (Close)
      ) {
        e.preventDefault()
        return false
      }
    }

    // Disable text selection
    const handleSelectStart = (e) => {
      e.preventDefault()
      return false
    }

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return (
    <div className="app">
      {showForm ? (
        <QSLForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
      ) : (
        <div className="app-content">
          <div className="app-header">
            <h1>QSL Card Generator</h1>
            <button onClick={handleNewCard} className="new-card-btn">
              Create New Card
            </button>
          </div>
          {qslData && <QSLCard data={qslData} />}
          
          {/* Footer */}
          <div className="app-footer">
            <p>QSL Card Generator System done by E26AFI ❤️</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
