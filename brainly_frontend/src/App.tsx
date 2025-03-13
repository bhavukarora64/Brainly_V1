import './App.css'
import { RecoilRoot} from 'recoil';
import Dashboard from './components/Dashboard';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SharedDashboard from './components/SharedDashboard';

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Routes> 
          <Route path='/dashboard' element= {<Dashboard />} />
          <Route path='/shared-dashboard/:sharableLink' element= {<SharedDashboard />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  )
}

export default App
