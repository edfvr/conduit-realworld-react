import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Settings from './routes/Settings';
import Editor from './routes/Editor';
import Article from './routes/Article';
import Profile from './routes/Profile';

export default function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:slug" element={<Editor />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile/:username/favorites" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}