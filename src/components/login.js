import React, { useState } from 'react';
import { Form, Input, Button, Row, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginForm = (props) => {

    const [errorMessage, setErrorMessage] = useState("");

    const onFinish = (values) => {
        if (values.username === 'admin' && values.password === 'admin') {
            props.history.push('/dashboard');
        } else {
            setErrorMessage("Invalid username / password")
        }
    }

    return(
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Card title="Log In" align="middle" headStyle={{backgroundColor: '#428bca', border: 1}}>
                <Form
                    name="basic"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your login id"
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="Login ID"
                            type="test"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password"
                            }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined/>}
                            placeholder="Password"
                            type="password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" >
                            Login
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <p style={{color: 'red'}}>{errorMessage}</p>
                    </Form.Item>
                </Form>
            </Card>
        </Row>
    )
}

export default LoginForm;