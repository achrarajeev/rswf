import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Hub from './pages/Hub'
import Issues from './pages/Issues'
import IssueDetail from './pages/IssueDetail'
import Join from './pages/Join'
import Research from './pages/Research'
import MapView from './pages/MapView'
import Contribute from './pages/Contribute'
import Reviewer from './pages/Reviewer'
import Admin from './pages/Admin'
import Forum from './pages/Forum'
import ForumThread from './pages/ForumThread'
import ForumNew from './pages/ForumNew'
import Tracker from './pages/Tracker'
import Me from './pages/Me'
import About from './pages/About'
import Rti from './pages/Rti'
import Register from './pages/Register'
import Login from './pages/Login'
import Institute from './pages/Institute'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hub" element={<Hub />} />
        <Route path="issues" element={<Issues />} />
        <Route path="issues/:id" element={<IssueDetail />} />
        <Route path="issues/:id/join" element={<Join />} />
        <Route path="research" element={<Research />} />
        <Route path="map" element={<MapView />} />
        <Route path="contribute" element={<Contribute />} />
        <Route path="reviewer" element={<Reviewer />} />
        <Route path="admin" element={<Admin />} />
        <Route path="forum" element={<Forum />} />
        <Route path="forum/new" element={<ForumNew />} />
        <Route path="forum/:id" element={<ForumThread />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="about" element={<About />} />
        <Route path="rti" element={<Rti />} />
        <Route path="me" element={<Me />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="institutes/:id" element={<Institute />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  </HashRouter>
)
