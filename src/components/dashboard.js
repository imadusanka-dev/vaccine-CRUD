import React, {useEffect, useState} from "react";
import {Layout,Table, Button, Modal, Form, Input, DatePicker, Alert} from 'antd';
import {
    LogoutOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { db } from "../services/firebase";

const { Header, Content, Sider } = Layout;

const { RangePicker } = DatePicker;

const Dashboard = (props) => {

    const [data, setData] = useState([]);

    const [addModalState, setAddModalState] = useState(false);

    const [updateModalState, setUpdateModalState] = useState(false);

    const [successAlert, setSuccessAlert] = useState(false);

    const [error, setError] = useState(false);

    const [errorAlert, setErrorAlert] = useState(false);

    const [singleRecord, setSingleRecord] = useState(null);

    const [dates, setDates] = useState([]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date of Vaccinated',
            dataIndex: 'dateOfVaccinated',
            key: 'dateOfVaccinated',
        },
        {
            title: 'Next date to be vaccinated',
            dataIndex: 'nextDate',
            key: 'nextDate',
        },
        {
            title: '',
            dataIndex: 'indicator',
            key: 'indicator'
        },
        {
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit'
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete'
        }

    ];

    useEffect(() => {
        getData();
    },[])

    const getData = () => {
        db.collection('record').orderBy('id')
            .get()
            .then( snapshot => {
                snapshot.docs.forEach(record => {
                    const r = record.data();
                    setData(data => [...data, {
                        id: r.id,
                        dateOfVaccinated: r.dateOfVaccinated,
                        nextDate: r.nextDate,
                        indicator: (Date.parse(r.nextDate) - new Date()) / (1000 * 60 * 60 * 24) <= 10 ? <Button type="danger" shape="circle"><WarningOutlined /></Button> : '',
                        edit: <Button key={r.id} type="primary" shape="circle" title="Edit" onClick={() => showUpdateModal(r.id, record.id)}><EditOutlined /></Button>,
                        delete: <Button key={r.id} type="danger" shape="circle" title="Delete" onClick={() => deleteRecord(record.id) }><DeleteOutlined /></Button>
                    }])
                })
            })
    }

    const showAddModal = () => {
        setAddModalState(true);
    }

    const addNewPerson = (values) => {
        let dateOfVaccinated = new Date(values.dates[0]);
        let nextDate = new Date(values.dates[1]);

        db.collection('record')
            .add({
                id: values.id,
                dateOfVaccinated: dateOfVaccinated.toDateString(),
                nextDate: nextDate.toDateString()
            })
            .then(documentReference => {
                setAddModalState(false);
                setSuccessAlert(true);
                setData([]);
                getData();
            })
            .catch(error => {
                setError(error);
                setErrorAlert(false);
            })
    }

    const updateRecord = (values) => {
        let dateOfVaccinated = new Date(values.dates[0]);
        let nextDate = new Date(values.dates[1]);

        db.collection('record').doc(singleRecord.docId)
            .update({
                dateOfVaccinated: dateOfVaccinated.toDateString(),
                nextDate: nextDate.toDateString()
            })
            .then(documentReference => {
                setUpdateModalState(false);
                setSuccessAlert(true);
                setData([]);
                getData();
            })
            .catch(error => {
                setError(error);
                setErrorAlert(false);
            })
    }

    const deleteRecord = (docId) => {
        db.collection('record').doc(docId)
            .delete()
            .then(() => {
                setSuccessAlert(true);
                setData([]);
                getData();
            })
            .catch(error => {
                setError(error);
                setErrorAlert(true);
            })
    }

    const showUpdateModal = (id, docId) => {
        setSingleRecord({
            id: id,
            docId: docId
        });
        setUpdateModalState(true);
    }

    const disabledDate = current => {
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 20;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 20;
        return tooEarly || tooLate;
    };

    const logout = () => {
        props.history.push('/');
    }

    return(
        <Layout>
            <Sider className="sider">
                <p className="username">Welcome Admin</p>
                <p className="logout"><a title="Logout" onClick={logout}><LogoutOutlined/>Logout</a></p>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background">
                    <Button className="add-button" type="primary" shape="round" onClick={showAddModal}><PlusOutlined/>Add New</Button>
                </Header>
                {
                    successAlert &&
                    <Alert message="Operation Successful" type="success" showIcon onClose={() => setSuccessAlert(false)} closable/>
                }
                {
                    errorAlert &&
                    <Alert message={error} type="error" showIcon onClose={() => setErrorAlert(false)} closable/>
                }
                <Content className="content">
                    <Table dataSource={data} columns={columns} pagination={false}/>
                </Content>
            </Layout>
            <Modal
                title="Add New Record"
                visible={addModalState}
                footer={false}
                closable={false}
            >
                <Form
                    onFinish={addNewPerson}
                >
                    <Form.Item
                        name="id"
                        label="ID"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="ID"/>
                    </Form.Item>
                    <Form.Item
                        name="dates"
                        label="Date of Vaccinated"
                        rules={[{ required: true }]}
                    >
                        <RangePicker
                            disabledDate={disabledDate}
                            onCalendarChange={value => {
                                setDates(value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add</Button>
                        <Button onClick={ ()=> setAddModalState(false)}>Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
            {
                singleRecord &&
                <Modal
                    title="Update Record"
                    visible={updateModalState}
                    footer={false}
                    closable={false}
                >
                    <Form
                        onFinish={updateRecord}
                    >
                        <Form.Item
                            name="id"
                            label="ID"
                            rules={[{ required: true }]}
                            initialValue={singleRecord.id}
                        >
                            <Input placeholder="ID" disabled/>
                        </Form.Item>
                        <Form.Item
                            name="dates"
                            label="Date of Vaccinated"
                            rules={[{ required: true }]}
                        >
                            <RangePicker
                                disabledDate={disabledDate}
                                onCalendarChange={value => {
                                    setDates(value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Update</Button>
                            <Button onClick={ ()=> setUpdateModalState(false)}>Cancel</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </Layout>
    )
}

export default Dashboard;