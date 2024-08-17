import React, { useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { db, doc, updateDoc } from '../../firebase-setup/firebase';

function UpdateCourse() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    const onFinish = async (values) => {
        console.log('Success:', values);
        const courseRef = doc(db, "Courses", values.id);

        setConfirmLoading(true);
        try {
            await updateDoc(courseRef, {
                CourseCategory: values.Category,
                AvaliableSeats: values.Seats,
                TeacherName: values.teacherName,
                CourseTitle: values.title,
            });
            console.log('Course updated successfully!');
            setOpen(false);
        } catch (error) {
            console.error('Error updating course:', error);
        } finally {
            setConfirmLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal} className='Courses-btn'>
                Update Course
            </Button>
            <Modal
                open={open}
                onOk={onFinish}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <p><b>Note:</b> Please enter course id to update further information about the course</p>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Course-Id"
                        name="id"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Course-Id!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Course-Category"
                        name="Category"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Course-Category!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Course-Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Course-Title!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Teacher-Name"
                        name="teacherName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Teacher-Name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Avaliable-Seats"
                        name="Seats"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Avaliable-Seats!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" loading={confirmLoading} style={{ backgroundColor: 'blueviolet' }}>
                            Update Course
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default UpdateCourse;
