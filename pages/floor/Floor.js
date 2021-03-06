import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client';
import { UPSERT_FLOOR } from '../../constants/graphql/floor/mutations';
import FloorList from './FloorList';
import { Card, Input, Form, Button, Select, Col, Row, Modal, notification } from "antd";
import { SmileOutlined } from '@ant-design/icons';

const layout = {
    labelCol: {
        span: 5,
        // span: 8,
    },
    wrapperCol: {
        span: 20,
        // span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const addNotification = () => {
    notification.open({
        message: 'Floor added successfully.',
        description:
            '',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
};



const updateNotification = () => {
    notification.open({
        message: 'Floor updated successfully.',
        description:
            '',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
};


const Floor = () => {
    const intialState = {
        num: "",
        description: "",
        id: null,
    };
    const [formAnt] = Form.useForm();
    const [form, setForm] = useState(intialState);
    const [refetch, setFetch] = useState(false);

    const [upsertGenerator] = useMutation(UPSERT_FLOOR);

    const handleSubit = async (data) => {


        setVisible(false);

        const payload = data;

        if (form.id) {
            payload.id = form.id
            updateNotification();
        } else {
            addNotification();
        }

        try {
            upsertGenerator({
                variables: payload,
            })
                .then(resp => {
                    setForm(intialState)
                    setFetch(!refetch)
                    console.log("resp", resp)
                })
                .catch(error => {
                    console.log("error", error)
                });

        } catch (error) {
            console.log(error)
        }
    }

    const getForEdit = (data) => {
        console.log(data);
        formAnt.setFieldsValue({
            num: data.num,
            description: data.description
        });
        setVisible(true);
        setForm((p) => ({ ...p, id: data.id }))
    }


    const onFinish = values => {
        console.log("values", values)
    };

    const onReset = () => {
        formAnt.resetFields();
    };

    // const onFill = () => {
    //     formAnt.setFieldsValue({
    //         num: 'sample num',
    //         description: 'sample description'
    //     });
    // };

    const [visible, setVisible] = useState(false);


    return (
        <>





            <div>
                <Button type="primary" onClick={() => {
                    setVisible(true)
                    onReset()
                }}>Add Floor</Button>
                <Modal
                    centered
                    visible={visible}
                    footer={null}
                    onCancel={() => setVisible()}
                    okType={String}
                    okText={"Add"}
                    width={600}>
                    <br />
                    <h1 style={{ fontFamily: "Bold", alignContent: "center" }}>Floor Form</h1>
                    <br />
                    <Row>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Form {...layout} form={formAnt} name="control-hooks" onFinish={handleSubit} className="gx-form-row0">
                                <Form.Item
                                    name="num"
                                    label="Floor Number"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                    <Button htmlType="button" onClick={onReset}>
                                        Reset
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
            <FloorList refetch={refetch} forEdit={getForEdit} />
        </>
    )
}

export default Floor;