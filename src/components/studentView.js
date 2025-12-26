import React, { useState, useEffect } from 'react';
import { Space, Table, Button, message, Spin } from 'antd';
import { collection, getDocs, db, deleteDoc, doc, query, where } from '../firebase-setup/firebase';

const StdTableView = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);

    // Fetch users and their courses once on mount
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all users
            const usersSnapshot = await getDocs(collection(db, "Users"));
            const usersData = usersSnapshot.docs.map(doc => ({ key: doc.id, ...doc.data() }));

            // Fetch all registered courses
            const coursesSnapshot = await getDocs(collection(db, "Registered-Course"));
            const coursesData = coursesSnapshot.docs.map(doc => ({ key: doc.id, ...doc.data() }));

            // Merge courses with users
            const mergedData = usersData.map(user => {
                const userCourses = coursesData.filter(course => course.uid === user.key);
                return { ...user, courses: userCourses };
            });

            setData(mergedData);
        } catch (error) {
            message.error('Failed to fetch data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        setLoadingId(id);
        try {
            // Delete user
            await deleteDoc(doc(db, "Users", id));

            // Delete user's registered courses
            const coursesQuery = query(collection(db, "Registered-Course"), where("uid", "==", id));
            const coursesSnapshot = await getDocs(coursesQuery);
            const deletePromises = coursesSnapshot.docs.map(docSnapshot =>
                deleteDoc(doc(db, "Registered-Course", docSnapshot.id))
            );
            await Promise.all(deletePromises);

            // Remove from local state instead of re-fetching
            setData(prev => prev.filter(user => user.key !== id));

            message.success('User and their courses deleted successfully');
        } catch (error) {
            message.error('Failed to delete user');
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    const columns = [
        { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Courses',
            dataIndex: 'courses',
            key: 'courses',
            render: courses => (
                <ul>
                    {courses.map(course => (
                        <li key={course.key}>{course.courseTitle}</li>
                    ))}
                </ul>
            )
        },
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
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
        <Spin spinning={loading}>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="key"
                pagination={{ pageSize: 5 }}
            />
        </Spin>
    );
};

export default StdTableView;
