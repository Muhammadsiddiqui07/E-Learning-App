import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, TreeSelect, Form, Spin, Input, Table, Typography } from 'antd';
import { db, collection, getDocs, query, where, addDoc } from '../firebase-setup/firebase';
import DropDown from './dropDown';

const RegistrationForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const uid = localStorage.getItem('uid');

    const [form] = Form.useForm();

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const fetchRegisteredCourses = async () => {
        setTableLoading(true);
        const q = query(collection(db, "Registered-Course"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        const registeredCoursesData = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            registeredCoursesData.push({
                key: doc.id,
                Categories: data.CourseCategory,
                Title: data.courseTitle,
                Description: "Course Description"
            });
        });

        setRegisteredCourses(registeredCoursesData);
        setTableLoading(false);
    };

    const fetchUserData = async () => {
        const q = query(collection(db, "Users"), where("id", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => setUserData(doc.data()));
    };

    const fetchCategories = async () => {
        setLoadingCategories(true);
        const querySnapshot = await getDocs(collection(db, "Courses"));
        const uniqueCategories = new Set();

        querySnapshot.forEach((doc) => uniqueCategories.add(doc.data().CourseCategory));
        setCategories(Array.from(uniqueCategories).map(cat => ({ title: cat, value: cat })));
        setLoadingCategories(false);
    };

    const fetchCourses = async () => {
        if (!selectedCategory) return;
        setLoadingCourses(true);
        const q = query(collection(db, "Courses"), where("CourseCategory", "==", selectedCategory));
        const querySnapshot = await getDocs(q);
        const coursesData = [];
        querySnapshot.forEach((doc) => coursesData.push({ title: doc.data().CourseTitle, value: doc.data().CourseTitle }));
        setCourses(coursesData);
        setLoadingCourses(false);
    };

    useEffect(() => { fetchUserData(); fetchCategories(); fetchRegisteredCourses(); }, [uid]);
    useEffect(() => { fetchCourses(); }, [selectedCategory]);
    useEffect(() => {
        if (userData.id && userData.email) form.setFieldsValue({ id: userData.id, Email: userData.email });
    }, [userData, form]);

    const onFinish = async (values) => {
        setLoading(true);
        await addDoc(collection(db, "Registered-Course"), {
            CourseCategory: values.Category,
            courseTitle: values.Course,
            uid: uid,
            email: values.Email
        });
        setLoading(false);
        setIsModalOpen(false);
        fetchRegisteredCourses();
    };

    const columns = [
        { title: 'Categories', dataIndex: 'Categories', key: 'Categories' },
        { title: 'Title', dataIndex: 'Title', key: 'Title' },
        { title: 'Description', dataIndex: 'Description', key: 'Description' },
    ];

    return (
        <div style={{ width: '100%' }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography.Title level={3} style={{ color: 'blueviolet' }}>Course Registration</Typography.Title>
                <DropDown />
            </div>

            <Card
                style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
                <Button type="primary" onClick={showModal} style={{ backgroundColor: 'blueviolet' }}>
                    Enroll Through Form
                </Button>
            </Card>

            <Modal
                title="Register Course"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                centered
                bodyStyle={{ padding: 20 }}
            >
                {loading ? (
                    <Spin tip="Submitting..." />
                ) : (
                    <Form
                        form={form}
                        onFinish={onFinish}
                        layout="vertical"
                        autoComplete="off"
                        initialValues={{ id: userData.id, Email: userData.email }}
                    >
                        <Form.Item
                            label="Select Category"
                            name="Category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            {loadingCategories ? <Spin /> :
                                <TreeSelect
                                    treeData={categories}
                                    treeDefaultExpandAll
                                    placeholder="Select Category"
                                    onChange={val => setSelectedCategory(val)}
                                />}
                        </Form.Item>

                        <Form.Item
                            label="Select Course"
                            name="Course"
                            rules={[{ required: true, message: 'Please select a course!' }]}
                        >
                            {loadingCourses ? <Spin /> :
                                <TreeSelect
                                    treeData={courses}
                                    treeDefaultExpandAll
                                    placeholder="Select Course"
                                />}
                        </Form.Item>

                        <Form.Item
                            label="Your ID"
                            name="id"
                            rules={[{ required: true, message: 'Please input your ID!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="Email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ backgroundColor: 'blueviolet' }} block>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <Card
                title="Registered Courses"
                style={{ borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            >
                {tableLoading ? <Spin tip="Loading table..." /> :
                    <Table dataSource={registeredCourses} columns={columns} pagination={{ pageSize: 5 }} />}
            </Card>
        </div>
    );
};

export default RegistrationForm;
