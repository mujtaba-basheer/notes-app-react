import './App.css';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from './components/Navbar';

import Home from './views/Home';
import Auth from './views/Auth/Auth';
import New from './views/New';
import ViewNote from './views/ViewNote';
import EditNote from './views/EditNote';

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/new' element={<New />} />
        <Route path='/view/:noteId' element={<ViewNote />} />
        <Route path='/edit/:noteId' element={<EditNote />} />
      </Route>
    </Routes>
  </BrowserRouter>);
}

function Layout() {
  return (
    <div className='App'>
      <Navbar />
      <main className='view'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
