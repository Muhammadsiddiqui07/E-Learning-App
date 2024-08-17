import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal, Table } from 'antd';
import AddCourse from './AddCourseForm';
import DelCourse from './DeleteCourse';
import UpdateCourse from './UpdateCourse';
import { db, getDocs, collection, setDoc, doc } from '../../firebase-setup/firebase';

const AdminCourseView = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false); // Loading state for Add Course modal
    const [courses, setCourses] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(true); // Loading state for the table

    const fetchCourses = async () => {
        setIsTableLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "Courses"));
            const coursesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setIsTableLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [isAddModalOpen]);

    const dataSource = courses.map((course, index) => ({
        key: index.toString(),
        title: course.CourseTitle,
        id: course.id,
        name: course.TeacherName,
        Category: course.CourseCategory,
    }));

    const columns = [
        {
            title: 'Course Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Course ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Course Category',
            dataIndex: 'Category',
            key: 'Category',
        },
        {
            title: 'Teacher Name',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    const showAddModal = () => setIsAddModalOpen(true);
    const handleAddModalCancel = () => setIsAddModalOpen(false);

    const handleAddCourseSubmit = async (values) => {
        setIsAddLoading(true);
        try {
            await setDoc(doc(db, "Courses", values.id), {
                CourseCategory: values.Category,
                CourseTitle: values.title,
                CourseId: values.id,
                TeacherName: values.teacherName,
                AvailableSeats: values.Seats
            });
            setIsAddModalOpen(false);
            fetchCourses();
        } catch (error) {
            console.error("Error adding course:", error);
        } finally {
            setIsAddLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', padding: '10px' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Add Course" bordered={false}>
                        <Button type="primary" onClick={showAddModal} className='Courses-btn' style={{ backgroundColor: 'blueviolet' }}>
                            Add Course
                        </Button>
                        <Modal
                            title="Fill Form!"
                            open={isAddModalOpen}
                            confirmLoading={isAddLoading}
                            onCancel={handleAddModalCancel}
                            footer={null} // Footer is removed to handle form submission through form's own button
                        >
                            <AddCourse handleSubmit={handleAddCourseSubmit} isLoading={isAddLoading} />
                        </Modal>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Delete Course" bordered={false}>
                        <DelCourse />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Update Course" bordered={false}>
                        <UpdateCourse />
                    </Card>
                </Col>
            </Row>
            <div style={{ margin: '20px' }}>
                <Table dataSource={dataSource} columns={columns} loading={isTableLoading} />
            </div>
        </div>
    );
};

export default AdminCourseView;
