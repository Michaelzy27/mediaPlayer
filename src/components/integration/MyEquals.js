import React from 'react';
import axios from 'axios';
import { Form, Button, Table, Divider, Input } from 'antd';

const MYEQUALS_API_URL = 'http://localhost:9001/api/myequals/docs';

class MyEquals extends React.Component {
  state = { loading: false, documents: [] };

  Header = () => {
    return (
      <>
        <div className="background-trick-container">
          <h1>Integration</h1>
          <div className="background-trick-color"></div>
        </div>
      </>
    );
  };

  onFinish = (values) => {
    this.setState({ loading: true });

    axios.post(MYEQUALS_API_URL + '/list', values, {}).then((response) => {
      this.setState({
        documents: response.data.documents.documents,
        loading: false,
        user: values,
      });
    });
  };

  viewPdf = (docId) => {
    const data = { ...this.state.user, docId: docId };

    // It is important to receive the response data in 'blob' type
    axios
      .post(MYEQUALS_API_URL + '/show', data, { responseType: 'blob' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((e) => {
        alert('Cannot open PDF file');
      });
  };

  viewAttachment = (docId) => {
    const data = { ...this.state.user, docId: docId };

    // It is important to receive the response data in 'blob' type
    axios
      .post(MYEQUALS_API_URL + '/attachment', data, { responseType: 'blob' })
      .then((response) => {
        const file = new Blob([response.data], { type: 'text/xml' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch((e) => {
        alert('Cannot open attachment file');
      });
  };

  render() {
    const { loading, documents } = this.state;

    const columns = [
      {
        title: 'Document name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Document type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Issuer',
        dataIndex: 'org_name',
        key: 'org_name',
      },
      {
        title: 'Student ID',
        dataIndex: 'learner_internal_id',
        key: 'learner_internal_id',
      },
      {
        title: 'Actions',
        key: 'id',
        dataIndex: 'id',
        render: (id) => (
          <>
            <Button onClick={() => this.viewPdf(id)}>PDF</Button>
            <Divider type="vertical" />
            <Button onClick={() => this.viewAttachment(id)}>XML</Button>
          </>
        ),
      },
    ];

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };

    const buttonItemLayout = {
      wrapperCol: { span: 10, offset: 4 },
    };

    return (
      <>
        <this.Header />

        <h2>MyEquals</h2>

        <Form layout="horizontal" {...formItemLayout} onFinish={this.onFinish}>
          <Form.Item
            label="Username"
            name="email"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="e.g david@gmail.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>

        {documents && documents.length > 0 && (
          <div>
            <Divider />
            <Table columns={columns} dataSource={documents} />
          </div>
        )}
      </>
    );
  }
}

export default MyEquals;
