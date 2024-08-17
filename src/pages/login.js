import React, { useState } from 'react';
import { Card } from 'antd';
import LoginForm from '../components/loginForm';
import loginImage from '../Assest/login-image.jpg'


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);

    };

    return (
        <div>
            <div className='header'>
                <h1>E-Learning App</h1>
                <div className='headerlinkPosition'></div>
            </div>
            <div className='loginContainer'>
                <Card
                    className='LoginForm'
                    bordered={true}
                    style={{
                        width: 900,
                    }}
                >
                    <div className='loginpart'>
                        <div className='loginImgDiv'>
                            <img src={loginImage} alt='login-Image' />
                        </div>
                        <LoginForm handleSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
