import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<h1 style={{textAlign:'center', marginTop:'50px'}}>Login Page</h1>} />
        <Route path="/" element={<h1 style={{textAlign:'center', marginTop:'50px'}}>Home</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;