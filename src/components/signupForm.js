import React, { useState } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { app, getAuth, createUserWithEmailAndPassword, db, doc, setDoc } from '../firebase-setup/firebase';

const SignupForm = () => {
    const navigate = useNavigate();
    const [signupError, setSignupError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state


    const onFinish = async (values) => {
        setLoading(true);
        console.log('Success:', values);
        const auth = getAuth(app);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;
            await setDoc(doc(db, "Users", user.uid), {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
            });
            localStorage.setItem("uid", user.uid);
            console.log('user', user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Signup error:", error.message);
            setSignupError(error.message);
        } finally {
            setLoading(false);
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setSignupError("Failed to submit the form. Please check the fields and try again.");
    };

    return (
        <div>
            <Spin spinning={loading} />
            <p>{signupError}</p>
            <Form
                name="signup"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h2>Signup Form</h2>
                <Form.Item
                    label="First Name"
                    name="firstname"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastname"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4 }}>
                    <p>Already have an account? <NavLink to="/">Login</NavLink> here!</p>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SignupForm;
