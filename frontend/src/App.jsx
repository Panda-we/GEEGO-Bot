

import './App.css'
import AppRoutes from './AppRoutes'
import { ThemeProvider } from './components/ThemeProvider'
import { ThemeToggle } from './components/ThemeToggle'
import "./styles/theme.css";
import "./styles/modal.css";

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
