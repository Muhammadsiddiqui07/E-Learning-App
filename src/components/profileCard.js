import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Spin } from 'antd';
import { IoCamera } from "react-icons/io5";
import profilePicture from '../Assest/profile-pic.webp';
import { db, storage, doc, setDoc, ref, uploadBytesResumable, getDownloadURL, getDoc } from '../firebase-setup/firebase';

const ProfileCard = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(profilePicture);
    const [loading, setLoading] = useState(false); // For form submission
    const [fetching, setFetching] = useState(true); // For fetching user data
    const [proError, setProError] = useState('');
    const uid = localStorage.getItem('uid');
    const [userData, setUserData] = useState({});

    const [form] = Form.useForm(); // Create form instance

    const fetchUserData = async () => {
        setFetching(true);
        try {
            const docRef = doc(db, "Users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setImageUrl(data.imageUrl || profilePicture); // Set image URL if available
                form.setFieldsValue({
                    firstName: data.firstname,
                    LastName: data.lastname,
                    Email: data.email,
                    PhoneNumber: data.phonenumber
                });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            setProError('Failed to fetch user data.');
            console.error('Error fetching user data:', error);
        } finally {
            setFetching(false);
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    setProError('Failed to upload image.');
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (image) {
                const downloadURL = await uploadFile(image);
                values.imageUrl = downloadURL;
            } else {
                values.imageUrl = imageUrl; // Use existing image URL if no new image
            }

            await setDoc(doc(db, "Users", uid), {
                firstname: values.firstName,
                lastname: values.LastName,
                email: values.Email,
                phonenumber: values.PhoneNumber,
                imageUrl: values.imageUrl,
                id: uid
            });

            setProError('User profile updated successfully.');
        } catch (error) {
            setProError('Failed to update user profile.');
            console.error('Error updating user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        setProError('Failed to submit the form.');
        console.error('Failed:', errorInfo);
        setLoading(false);
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const selectedImage = event.target.files[0];
            setImage(selectedImage);
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className='profileCard'>
            <Card
                title="Profile Details"
                bordered={true}
                style={{
                    width: '60%',
                    height: '100%',
                    textAlign: 'center'
                }}
            >
                <Spin spinning={loading || fetching}>
                    {proError && <p style={{ color: 'blueviolet' }}>{proError}</p>}
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 12 }}
                        style={{ maxWidth: 800 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div className='ProfilePicture'>
                            <img src={imageUrl} alt='Profile-Picture' style={{ width: '100px', height: '100px', borderRadius: '50%', margin:'20px' , marginTop:'-150px' }} />
                            <div className='image-upload'>
                                <label htmlFor="file-input">
                                    <IoCamera style={{ marginTop: '-70px', marginLeft: '-20px' }} />
                                </label>
                                <input id="file-input" type="file" onChange={onImageChange} className="filetype" />
                            </div>
                        </div>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[{ required: true, message: 'Please input your First Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Last Name"
                            name="LastName"
                            rules={[{ required: true, message: 'Please input your Last Name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="Email"
                            rules={[{ required: true, message: 'Please input your Email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="PhoneNumber"
                            rules={[{ required: true, message: 'Please input your Phone Number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{ span: 28 }}
                        >
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default ProfileCard;
