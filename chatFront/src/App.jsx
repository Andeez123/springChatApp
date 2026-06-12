import ChatComp from './components/ChatComp'

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

import "primereact/resources/themes/lara-dark-blue/theme.css"; // theme - swap for others
import "primereact/resources/primereact.min.css";               // core styles
import "primeicons/primeicons.css"; 

function App() {

  return (
    <div>
      <PrimeReactProvider>
        <ChatComp></ChatComp>
      </PrimeReactProvider>
    </div>
  )
}

export default App
