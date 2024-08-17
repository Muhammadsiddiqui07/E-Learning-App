import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, query, collection, getDocs, where } from '../firebase-setup/firebase';
import DropDown from '../components/dropDown';
import proPic from '../Assest/profile-pic.webp'
import { Card, Col, Row, Table, Spin } from 'antd';

function ProAndCourView() {
    const [data, setData] = useState({});
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const uid = localStorage.getItem('uid');

    useEffect(() => {
        const fetchUserData = async () => {
            if (uid) {
                try {
                    const docRef = doc(db, "Users", uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                        setData(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching document:", error);
                }
            } else {
                console.log("No UID found in local storage");
            }
        };

        fetchUserData();
    }, [uid]);

    useEffect(() => {
        const fetchRegisteredCourses = async () => {
            setTableLoading(true);
            const q = query(collection(db, "Registered-Course"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            const registeredCoursesData = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                registeredCoursesData.push({
                    key: doc.id,
                    Categories: data.CourseCategory,
                    Title: data.courseTitle,
                    Description: "Course Description"
                });
            });

            setRegisteredCourses(registeredCoursesData);
            setTableLoading(false);
        };

        fetchRegisteredCourses();
    }, [uid]);

    const columns = [
        {
            title: 'Categories',
            dataIndex: 'Categories',
            key: 'Categories',
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            key: 'Title',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
        },
    ];

    return (
        <div className='pro-and-cour-view-container'>
            <div className='DashHeader'>
                <h1 style={{ color: 'blueviolet' }}>Dashboard :</h1>
                <div>
                    <DropDown />
                </div>
            </div>
            <Row gutter={[20, 20]} className='profile-row'>
                <Col xs={24} md={10}>
                    <Card title="Profile Details:" bordered={false} className='profile-card'>
                        {data && (
                            <div>
                                <img
                                    src={data.imageUrl ? data.imageUrl : proPic}
                                    alt='profile-picture'
                                    className='proViewImage'
                                    style={{ marginBottom: '20px' }}
                                />
                                <h6>First Name: {data.firstname || 'Your First Name'}</h6>
                                <h6>Last Name: {data.lastname || 'Your Last Name'}</h6>
                                <h6>Email: {data.email || 'Your Email'}</h6>
                                <h6>Number: {data.phonenumber || 'Your Phone Number'}</h6>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={14}>
                    <Card title="Courses Detail:" bordered={false} className='courses-card'>
                        {tableLoading ? (
                            <Spin tip="Loading table data..." />
                        ) : (
                            <Table dataSource={registeredCourses} columns={columns} pagination={false} />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default ProAndCourView;
