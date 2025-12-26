import React, { useEffect, useState } from 'react';
import { Layout, Button } from 'antd';
import { db, doc, getDoc } from '../firebase-setup/firebase';
import ProAndCourView from '../pages/proAndcourView';
import RegistrationForm from '../components/RegCorForm';
import DisplayContent from '../components/showContent';

const { Content, Sider, Header } = Layout;

const DashLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const uid = localStorage.getItem('uid');
            if (uid) {
                try {
                    const docRef = doc(db, "Users", uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUserName(userData.firstname);
                        localStorage.setItem('userFirstName', JSON.stringify(userData.firstname));
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            }
        };
        getUser();
    }, []);

    const sideBtnStyle = (tabName) => ({
        color: activeTab === tabName ? "blueviolet" : "#fff",
        background: activeTab === tabName ? "#fff" : "transparent",
        textAlign: "left",
        padding: "14px 24px",
        fontSize: 22,
        borderRadius: 0,
        marginBottom: 10,
    });

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ProAndCourView />;
            case 'courses':
                return <RegistrationForm />;
            case 'content':
                return <DisplayContent />;
            default:
                return <ProAndCourView />;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider width={260} style={{ background: "blueviolet", padding: "30px 0" }}>
                <div style={{ textAlign: "center", marginBottom: 30 }}>
                    <h1 style={{ color: "#fff", marginBottom: 0 }}>E-Learning</h1>
                    <p style={{ color: "#bfbfff" }}>Learn From Home</p>
                    {userName && <p style={{ color: "#fff", marginTop: 10 }}>Hi, {userName}</p>}
                </div>

                <Button type="text" block style={sideBtnStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                </Button>
                <Button type="text" block style={sideBtnStyle('courses')} onClick={() => setActiveTab('courses')}>
                    Courses
                </Button>
                <Button type="text" block style={sideBtnStyle('content')} onClick={() => setActiveTab('content')}>
                    Content
                </Button>
            </Sider>

            {/* Main Layout */}
            <Layout>
                <Content style={{ padding: 24, background: "#f5f7fb" }}>
                    <div style={{
                        background: "#fff",
                        padding: 24,
                        borderRadius: 12,
                        minHeight: 360,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
                    }}>
                        {renderActiveComponent()}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashLayout;
