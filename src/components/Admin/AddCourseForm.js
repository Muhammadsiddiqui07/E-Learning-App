import React from 'react';
import { Button, Form, Input } from 'antd';

function AddCourse({ handleSubmit, isLoading }) {
    const onFinish = async (values) => {
        handleSubmit(values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
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
                    remember: false,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
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
                    <Button type="primary" htmlType="submit" loading={isLoading} style={{ backgroundColor: "blueviolet" }}>
                        Add Course
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddCourse;
