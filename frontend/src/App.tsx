import { ThemeProvider } from "styled-components"
import { defaultTheme } from "./styles/themes/default"
import { GlobalStyle } from "./styles/global"
import { Router } from "./Router"
import {BrowserRouter} from 'react-router-dom'
function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <GlobalStyle/>
        <Router/>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
