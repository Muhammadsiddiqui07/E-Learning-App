import React, { useState } from 'react';
import { Layout, Button, Tabs } from 'antd';
import AdminCourseView from './course';
import StdView from '../studentView';
import ShowContent from '../showContent';
import { NavLink } from 'react-router-dom';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const AdminDashLayout = () => {
    const [activeTab, setActiveTab] = useState('courses');

    const sideBtnStyle = (active = false) => ({
        color: active ? 'blueviolet' : '#fff',
        background: active ? '#fff' : 'transparent',
        textAlign: 'left',
        padding: '14px 24px',
        fontSize: 22,
        borderRadius: 6,
        marginBottom: 10,
    });

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* ===== Sidebar ===== */}
            <Sider width={260} style={{ background: 'blueviolet', padding: '20px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h1 style={{ color: '#fff', marginBottom: 0 }}>E-Learning</h1>
                    <p style={{ color: '#bfbfff' }}>Learn From Home</p>
                </div>

                <Button
                    type="text"
                    block
                    style={sideBtnStyle(activeTab === 'courses')}
                    onClick={() => setActiveTab('courses')}
                >
                    Courses
                </Button>

                <Button
                    type="text"
                    block
                    style={sideBtnStyle(activeTab === 'students')}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </Button>

                <Button
                    type="text"
                    block
                    style={sideBtnStyle(activeTab === 'content')}
                    onClick={() => setActiveTab('content')}
                >
                    Content
                </Button>

                <NavLink to="/">
                    <Button type="text" block style={sideBtnStyle()}>
                        Logout
                    </Button>
                </NavLink>
            </Sider>

            {/* ===== Main Content ===== */}
            <Layout>
                <Layout.Header
                    style={{
                        background: '#fff',
                        padding: '0 24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'blueviolet'
                    }}
                >
                    <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
                </Layout.Header>

                <Content
                    style={{
                        padding: 24,
                        background: '#f5f7fb',
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: 24,
                            borderRadius: 12,
                            minHeight: 360,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                        }}
                    >
                        {activeTab === 'courses' && <AdminCourseView />}
                        {activeTab === 'students' && <StdView />}
                        {activeTab === 'content' && <ShowContent />}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashLayout;
