import { Button, Form, Input, message, Select, Alert } from 'antd';
import React, { useState } from 'react';
import axios from 'axios'

import { useNavigate } from 'react-router-dom';
const { Option } = Select;
import classNames from 'classnames/bind';
import styles from './register.module.scss';


const cx = classNames.bind(styles);

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 10,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};



const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};



const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const onFinish = async (values) => {
        try {
            const response = await axios.post("http://localhost:3010/register", values);
            if (response.status === 401) {
                return console.log(response.data);
            }

            if (response.status === 200) {
                return navigate('/login')
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={cx('container')}>
            <div className={cx('form')}>
                <h1>Register</h1>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}

                    style={{
                        maxWidth: 600,
                    }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },

                        ]}
                    >
                        <Input />

                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        tooltip="Used to Sign in"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your nickname!',
                                whitespace: true,
                            },
                            {
                                type: 'any',
                                message: 'Da co tai khoan',
                            },
                        ]}
                    >
                        <Input />

                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: true,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select placeholder="select your gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">BeDe</Option>
                        </Select>
                    </Form.Item>



                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
export default Register;