import React, { useState } from 'react';
import { Button, Form, Input, Spin, Alert } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import goo from '../Assest/google-logo.png';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, doc, setDoc, db } from '../firebase-setup/firebase';

const LoginForm = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Googleuser, setGoogleUser] = useState([])

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem("uid", user.uid);
            console.log('Google user:', user);

            const displayName = user.displayName || '';
            const [firstName, lastName = ''] = displayName.split(' ');

            await setDoc(doc(db, "Users", user.uid), {
                firstname: firstName,
                lastname: lastName,
                id: user.uid,
                imageUrl: user.photoURL,
                email: user.email,
                phonenumber: user.phoneNumber
            });

            navigate("/dashboard");
        } catch (error) {
            console.error('Google login error:', error.message);
            setLoginError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const onFinish = async (values) => {
        console.log('Form values:', values);
        setIsLoading(true);
        if (values.username === 'Admin@gmail.com' && values.password === '12345') {
            navigate("/adminDashboard");
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, values.username, values.password);
                const user = userCredential.user;
                console.log('Email/password user:', user);
                localStorage.setItem("uid", user.uid);
                navigate("/dashboard");
            } catch (error) {
                console.error('Email/password login error:', error.message);
                setLoginError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.error('Form submission error:', errorInfo);
        setLoginError('Failed to submit the form. Please check the fields and try again.');
    };

    return (
        <div style={{ maxWidth: 500, margin: 'auto', padding: '20px' }}>
            <Spin spinning={isLoading}>
                {loginError && <Alert message={loginError} type="error" showIcon />}
                <Form
                    name="login"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <h2>Login Form</h2>
                    <p>Note: Admin also log in from this form with email.</p>
                    <Form.Item
                        label="Email"
                        name="username"
                        rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
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
                    <br />
                    <Form.Item wrapperCol={{ offset: 2 }}>
                        <p>Don't have an account? <NavLink to="/Signup">Signup</NavLink> here!</p>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ width: '80%' }}>
                            Login
                        </Button>
                        <hr style={{ width: '300px' }} />
                        <div className='btn-main'>
                            <Button onClick={loginWithGoogle}><img className='img-btn' src={goo} alt='google' />Login With Google</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default LoginForm;
