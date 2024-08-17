import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from '../firebase-setup/firebase'
import DashLayout from '../components/dashboardLayout';

function Dashboard() {
    const navigate = useNavigate();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            localStorage.setItem('uid', uid)
        } else {
            navigate("/");
        }
    });
    return (
        <div>
            <div>
                <DashLayout />
            </div>

        </div>
    )
}
export default Dashboard