import React, { useState, useEffect } from 'react';
import { Space, Table, Button, message } from 'antd';
import { collection, getDocs, db, deleteDoc, doc, getAuth, deleteUser as authDeleteUser, where } from '../firebase-setup/firebase';

const StdTableView = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "Users"));
                const querySnapshot1 = await getDocs(collection(db, "Registered-Course"));
                const usersData = querySnapshot.docs.map((doc) => ({
                    key: doc.id,
                    ...doc.data(),
                }));
                const registeredCoursesData = querySnapshot1.docs.map((doc) => ({
                    key: doc.id,
                    ...doc.data(),
                }));

                const mergedData = usersData.map(user => {
                    const userCourses = registeredCoursesData.filter(course => course.uid === user.key);
                    return {
                        ...user,
                        courses: userCourses
                    };
                });

                setData(mergedData);
            } catch (error) {
                message.error('Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        setLoadingId(id);
        try {
            await deleteDoc(doc(db, "Users", id));
            const registeredCoursesSnapshot = await getDocs(
                collection(db, "Registered-Course"),
                where("uid", "==", id)
            );
            const deletePromises = registeredCoursesSnapshot.docs.map(docSnapshot =>
                deleteDoc(doc(db, "Registered-Course", docSnapshot.id))
            );
            await Promise.all(deletePromises);
            setData((prevData) => prevData.filter((item) => item.key !== id));
            message.success('User and associated registered courses deleted successfully');
        } catch (error) {
            message.error('Failed to delete user');
            console.error('Error deleting user:', error);
        } finally {
            setLoadingId(null);
        }
    };



    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Courses',
            dataIndex: 'courses',
            key: 'courses',
            render: (courses) => (
                <ul>
                    {courses.map(course => (
                        <li key={course.key}>{course.courseTitle}</li>
                    ))}
                </ul>
            )
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type='primary'
                        danger
                        loading={loadingId === record.key}
                        onClick={() => handleDeleteUser(record.key)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table columns={columns} dataSource={data} loading={loading} />
    );
};

export default StdTableView;
