import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, TreeSelect, Form, Spin, Input, Table } from 'antd';
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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        setLoading(true);
        console.log('Success:', values);
        await addDoc(collection(db, "Registered-Course"), {
            CourseCategory: values.Category,
            courseTitle: values.Course,
            uid: uid,
            email: values.Email
        });
        console.log('Data submitted');
        setLoading(false);
        setIsModalOpen(false);
        fetchRegisteredCourses(); // Fetch the updated registered courses
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const q = query(collection(db, "Users"), where("id", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUserData(doc.data());
            });
        };

        fetchUserData();
    }, [uid]);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            const querySnapshot = await getDocs(collection(db, "Courses"));
            const uniqueCategories = new Set();

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                uniqueCategories.add(data.CourseCategory);
            });

            const formattedCategories = Array.from(uniqueCategories).map(category => ({
                value: category,
                title: category
            }));
            setCategories(formattedCategories);
            setLoadingCategories(false);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedCategory) return;

            setLoadingCourses(true);
            const q = query(collection(db, "Courses"), where("CourseCategory", "==", selectedCategory));
            const querySnapshot = await getDocs(q);
            const coursesData = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                coursesData.push({ value: data.CourseTitle, title: data.CourseTitle });
            });

            setCourses(coursesData);
            setLoadingCourses(false);
        };

        fetchCourses();
    }, [selectedCategory]);

    const fetchRegisteredCourses = async () => {
        setTableLoading(true); // Set table loading to true
        const q = query(collection(db, "Registered-Course"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        const registeredCoursesData = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            registeredCoursesData.push({
                key: doc.id,
                Categories: data.CourseCategory,
                Title: data.courseTitle,
                Description: "Course Description" // Assuming you have a description field
            });
        });

        setRegisteredCourses(registeredCoursesData);
        setTableLoading(false); // Set table loading to false
    };

    useEffect(() => {
        fetchRegisteredCourses();
    }, []);

    useEffect(() => {
        if (userData.id && userData.email) {
            form.setFieldsValue({
                id: userData.id,
                Email: userData.email,
            });
        }
    }, [userData, form]);

    const columns = [
        {
            title: 'Categories',
            dataIndex: 'Categories',
            key: 'Categories',
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            key: 'Title',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            <div className='DashHeader'>
                <h1 style={{ color: 'blueviolet' }}>Course :</h1>
                <div>
                    <DropDown />
                </div>
            </div>
            <br />
            <br />
            <Card
                title="Register Course :"
                bordered={true}
                style={{
                    width: 300,
                }}
            >
                <Button type="primary" onClick={showModal} style={{ backgroundColor: 'blueviolet' }}>
                    Enroll Through Form
                </Button>
                <Modal title="Fill Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
                    {loading ? (
                        <Spin tip="Loading...">
                            <div style={{ height: '200px' }}></div>
                        </Spin>
                    ) : (
                        <Form
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            initialValues={{ id: userData.id, Email: userData.email }}
                        >
                            <Form.Item
                                label="Select Category"
                                name="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a category!',
                                    },
                                ]}
                            >
                                {loadingCategories ? (
                                    <Spin />
                                ) : (
                                    <TreeSelect
                                        treeData={categories}
                                        treeDefaultExpandAll
                                        onChange={handleCategoryChange}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="Select Course"
                                name="Course"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select a course!',
                                    },
                                ]}
                            >
                                {loadingCourses ? (
                                    <Spin />
                                ) : (
                                    <TreeSelect
                                        treeData={courses}
                                        treeDefaultExpandAll
                                    />
                                )}
                            </Form.Item>

                            <Form.Item
                                label="Your ID"
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your ID!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Email!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 6,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit" style={{ backgroundColor: 'blueviolet' }}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Modal>
            </Card>
            <div style={{ padding: '20px' }}>
                {tableLoading ? (
                    <Spin tip="Loading table data..." />
                ) : (
                    <Table dataSource={registeredCourses} columns={columns} />
                )}
            </div>
        </div>
    );
};

export default RegistrationForm;
