import React, { useState } from 'react';
import { Card, Spin } from 'antd';
import SignupForm from '../components/signupForm';
import signupImg from '../Assest/signupImage.jpg';

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
    };

    return (
        <div>
            <div className='header'>
                <h1>E-Learning App</h1>
                <div className='headerlinkPosition'></div>
            </div>
            <div className='SignupContainer'>
                <Card
                    className='LoginForm'
                    bordered={true}
                    style={{
                        width: '80%',
                        padding: 5,
                        marginTop: 20

                    }}
                >
                    <Spin spinning={isLoading}>
                        <div className='signupPart'>
                            <div className='signupImg' style={{
                                width: '50%'
                            }}>
                                <img src={signupImg} alt='signupImage' />
                            </div>
                            <div style={{
                                width: '50%'
                            }}>
                                <SignupForm handleSubmit={handleSubmit} />
                            </div>
                        </div>
                    </Spin>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
