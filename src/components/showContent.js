import React, { useEffect, useState } from 'react';
import { Form, Spin, TreeSelect, Button, Table, Card, Typography } from 'antd';
import DropDown from "./dropDown";
import { db, collection, getDocs, query, where } from '../firebase-setup/firebase';

function DisplayContent() {
    const [Title, setTitle] = useState([]);
    const [Content, setContent] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [LoadingTitle, setLoadingTitle] = useState(false);
    const uid = localStorage.getItem('uid');

    const fetchContent = async () => {
        setLoadingTitle(true);

        // Fetch registered courses
        const registeredCourseQuery = query(collection(db, "Registered-Course"), where("uid", "==", uid));
        const querySnapshot = await getDocs(registeredCourseQuery);
        const CourseTitle = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            CourseTitle.push({ title: data.courseTitle, value: data.courseTitle });
        });
        setTitle(CourseTitle);

        // Fetch all content
        const contentSnapshot = await getDocs(collection(db, "Content"));
        const content = [];
        contentSnapshot.forEach((doc) => {
            const data = doc.data();
            content.push({
                key: doc.id,
                Title: data.CourseTitle,
                Type: data.Type,
                Content: data.YouTubeURL || data.VideoURL
            });
        });
        setAllContent(content);
        setLoadingTitle(false);
    };

    useEffect(() => {
        fetchContent();
    }, [uid]);

    const onFinish = (values) => {
        const selectedContent = allContent.filter(item => item.Title === values.Title);
        setContent(selectedContent);
    };

    const columns = [
        { title: 'Title', dataIndex: 'Title', key: 'Title' },
        { title: 'Type', dataIndex: 'Type', key: 'Type' },
        { title: 'Content', dataIndex: 'Content', key: 'Content' },
    ];

    return (
        <div style={{ width: '100%', padding: 20 }}>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography.Title level={3} style={{ color: 'blueviolet' }}>Content</Typography.Title>
                <DropDown />
            </div>

            <Card
                title="Select Course"
                style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Course Title"
                        name="Title"
                        rules={[{ required: true, message: 'Please select a course!' }]}
                    >
                        {LoadingTitle ? <Spin /> : <TreeSelect treeData={Title} treeDefaultExpandAll placeholder="Select Course" />}
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: 'blueviolet' }}>
                        Show Content
                    </Button>
                </Form>
            </Card>

            <Card
                title="Content Details"
                style={{ borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
                <Table dataSource={Content} columns={columns} pagination={{ pageSize: 5 }} />
            </Card>
        </div>
    );
}

export default DisplayContent;
