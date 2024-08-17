import React, { useEffect, useState } from 'react';
import { Form, Spin, TreeSelect, Button, Table } from 'antd';
import DropDown from "./dropDown";
import { db, collection, getDocs, query, where } from '../firebase-setup/firebase';

function DisplayContent() {
    const [Title, setTitle] = useState([]);
    const [Category, setCategory] = useState([]);
    const [contentCategory, setContentCategory] = useState([]);
    const [contentTitle, setContentTitle] = useState([]);
    const [Content, setContent] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [ContentType, setContentType] = useState([]);
    const [LoadingTitle, setLoadingTitle] = useState(false);
    const uid = localStorage.getItem('uid');
    const [checkTitle, setCheckTitle] = useState(false);

    const fetchContent = async () => {
        setLoadingTitle(true);

        const registeredCourseQuery = query(collection(db, "Registered-Course"), where("uid", "==", uid));
        const querySnapshot = await getDocs(registeredCourseQuery);
        const CourseTitle = [];
        const CourseCategory = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            CourseTitle.push({ title: data.courseTitle, value: data.courseTitle });
            CourseCategory.push(data.CourseCategory);
        });

        setTitle(CourseTitle);
        setCategory(CourseCategory);

        console.log('uid', uid);
        console.log('Registered title or category', CourseTitle, CourseCategory);

        const contentSnapshot = await getDocs(collection(db, "Content"));
        const content = [];
        const category = [];
        const title = [];
        const type = [];

        contentSnapshot.forEach((doc) => {
            const data = doc.data();
            category.push(data.Category);
            title.push(data.CourseTitle);
            type.push(data.Type);
            content.push({ key: doc.id, Title: data.CourseTitle, Type: data.Type, Content: data.YouTubeURL ? data.YouTubeURL : data.VideoURL });
        });

        setContentCategory(category);
        setContentTitle(title);
        setContent([]); // initialize with empty content
        setAllContent(content); // set all content initially
        setContentType(type);

        setLoadingTitle(false);
    };

    useEffect(() => {
        fetchContent();
    }, [uid]);

    const onFinish = (values) => {
        const selectedContent = allContent.filter(item => item.Title === values.Title);
        setContent(selectedContent);
        setCheckTitle(true);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            key: 'Title',
        },
        {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
        },
        {
            title: 'Content',
            dataIndex: 'Content',
            key: 'Content',
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            <div className='DashHeader'>
                <h1 style={{ color: 'blueviolet' }}>Content :</h1>
                <div>
                    <DropDown />
                </div>
            </div>
            <br />
            <br />
            <div>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Course Title"
                        name="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a course!',
                            },
                        ]}
                    >
                        {LoadingTitle ? (
                            <Spin />
                        ) : (
                            <TreeSelect
                                treeData={Title}
                                treeDefaultExpandAll
                            />
                        )}
                    </Form.Item>
                    <Button type='primary' htmlType="submit" style={{ backgroundColor: 'blueviolet' }}>Show Content</Button>
                </Form>
            </div>

            <div style={{ padding: '20px' }}>
                <Table dataSource={Content} columns={columns} />
            </div>
        </div>
    );
}

export default DisplayContent;
