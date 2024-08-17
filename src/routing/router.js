import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Dashboard from '../pages/dashboard'
import Profile from '../pages/profile'
import AdminDash from '../pages/AdminDash'
import AdminCourse from '../pages/AdminCourse'
import StdView from '../pages/AdminStudentView'
import AdminContent from '../pages/AdminContent'
import RegisterCourse from '../components/RegisterCourse'
import ProAndCourView from '../components/profileView'
import ShowContent from '../pages/content'

function MyRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/Signup' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/adminDashboard' element={<AdminDash />} />
                <Route path='/AdminCourse' element={<AdminCourse />} />
                <Route path='/StudentView' element={<StdView />} />
                <Route path='/AdminContent' element={<AdminContent />} />
                <Route path='/RegisterCourse' element={<RegisterCourse />} />
                <Route path='/RegisterCourse' element={<RegisterCourse />} />
                <Route path='/ProfileOverview' element={<ProAndCourView />} />
                <Route path='/showContent' element={<ShowContent />} />



            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes