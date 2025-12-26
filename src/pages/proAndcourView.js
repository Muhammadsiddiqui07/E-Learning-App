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
        <div style={{ width: "100%" }}>
            {/* ===== Header ===== */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                }}
            >
                <h2 style={{ margin: 0, color: "#1f1f3d" }}>Dashboard</h2>
                <DropDown />
            </div>

            {/* ===== Content ===== */}
            <Row gutter={[24, 24]}>
                {/* ===== Profile Card ===== */}
                <Col xs={24} md={8}>
                    <Card
                        bordered={false}
                        style={{
                            borderRadius: 12,
                            textAlign: "center",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        }}
                    >
                        <img
                            src={data.imageUrl || proPic}
                            alt="profile"
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: 16,
                                border: "3px solid #e6f4ff",
                            }}
                        />

                        <h3 style={{ marginBottom: 4 }}>
                            {data.firstname || "First Name"} {data.lastname || ""}
                        </h3>

                        <p style={{ color: "#8c8c8c", marginBottom: 16 }}>
                            {data.email || "Email"}
                        </p>

                        <div style={{ textAlign: "left" }}>
                            <p><strong>Phone:</strong> {data.phonenumber || "N/A"}</p>
                            <p><strong>User ID:</strong> {uid?.slice(0, 10)}...</p>
                        </div>
                    </Card>
                </Col>

                {/* ===== Courses Table ===== */}
                <Col xs={24} md={16}>
                    <Card
                        bordered={false}
                        title="Registered Courses"
                        style={{
                            borderRadius: 12,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                        }}
                    >
                        {tableLoading ? (
                            <div style={{ textAlign: "center", padding: 40 }}>
                                <Spin tip="Loading courses..." />
                            </div>
                        ) : (
                            <Table
                                dataSource={registeredCourses}
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                                bordered
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );

}

export default ProAndCourView;
