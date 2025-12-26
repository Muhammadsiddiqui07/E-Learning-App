import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Space } from 'antd';

import AddCourse from './AddCourseForm';
import UpdateCourse from './UpdateCourse';
import { db, getDocs, collection, setDoc, doc, deleteDoc } from '../../firebase-setup/firebase';

const AdminCourseView = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCourse, setEditCourse] = useState(null);

    // Fetch courses from Firestore
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "Courses"));
            const coursesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
            message.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Add Course
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
            message.success("Course added successfully!");
        } catch (error) {
            console.error("Error adding course:", error);
            message.error("Failed to add course");
        } finally {
            setIsAddLoading(false);
        }
    };

    // Delete Course
    const handleDeleteCourse = async (id) => {
        setActionLoadingId(id);
        try {
            await deleteDoc(doc(db, "Courses", id));
            setCourses(prev => prev.filter(course => course.id !== id));
            message.success("Course deleted successfully!");
        } catch (error) {
            console.error("Error deleting course:", error);
            message.error("Failed to delete course");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Open Edit Modal
    const openEditModal = (course) => {
        setEditCourse(course);
        setIsEditModalOpen(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = async (values) => {
        setIsAddLoading(true);
        try {
            await setDoc(doc(db, "Courses", values.id), {
                CourseCategory: values.Category,
                CourseTitle: values.title,
                CourseId: values.id,
                TeacherName: values.teacherName,
                AvailableSeats: values.Seats
            });
            setIsEditModalOpen(false);
            setEditCourse(null);
            fetchCourses();
            message.success("Course updated successfully!");
        } catch (error) {
            console.error("Error updating course:", error);
            message.error("Failed to update course");
        } finally {
            setIsAddLoading(false);
        }
    };

    // Table Columns
    const columns = [
        { title: "Course Title", dataIndex: "CourseTitle", key: "CourseTitle" },
        { title: "Course ID", dataIndex: "id", key: "id" },
        { title: "Category", dataIndex: "CourseCategory", key: "Category" },
        { title: "Teacher Name", dataIndex: "TeacherName", key: "TeacherName" },
        { title: "Seats", dataIndex: "AvailableSeats", key: "Seats" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (

                <Space style={{
                    display: 'flex',
                    justifyContent: "space-evenly"
                }}>
                    <Button
                        type="primary"
                        style={{ backgroundColor: 'blueviolet' }}
                        onClick={() => openEditModal(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        loading={actionLoadingId === record.id}
                        onClick={() => handleDeleteCourse(record.id)}
                    >
                        Delete
                    </Button>
                </Space>

            )
        }
    ];

    return (
        <div>
            {/* Add Course Button */}
            <Button
                type="primary"
                style={{ marginBottom: 20, backgroundColor: 'blueviolet' }}
                onClick={() => setIsAddModalOpen(true)}
            >
                Add Course
            </Button>

            {/* Courses Table */}
            <Table
                dataSource={courses}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            {/* Add Course Modal */}
            <Modal
                title="Add Course"
                open={isAddModalOpen}
                footer={null}
                onCancel={() => setIsAddModalOpen(false)}
            >
                <AddCourse handleSubmit={handleAddCourseSubmit} isLoading={isAddLoading} />
            </Modal>

            {/* Edit Course Modal */}
            {editCourse && (
                <UpdateCourse
                    visible={isEditModalOpen}
                    courseData={editCourse}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setEditCourse(null);
                    }}
                    handleUpdate={fetchCourses}
                />
            )}
        </div>
    );
};

export default AdminCourseView;
