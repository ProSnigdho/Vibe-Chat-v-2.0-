import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Space, Divider, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowRightOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../../api';

const { Title, Text } = Typography;

const Signup = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('auth/register/', values);
      message.success('Registration successful! Please login.');
      onSwitchToLogin();
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        // If it's a field-specific error (like username already exists)
        const firstError = Object.values(errorData)[0];
        message.error(Array.isArray(firstError) ? firstError[0] : 'Registration failed');
      } else {
        message.error('Registration failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--dark-bg)',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(142, 45, 226, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 0, 122, 0.1) 0px, transparent 50%)'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '430px', 
        padding: '40px', 
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>Join the Vibe</Title>
          <Text style={{ color: 'var(--text-secondary)' }}>Create your account to start chatting</Text>
        </div>

        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              placeholder="Username" 
              size="large"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              placeholder="Email address" 
              size="large"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              placeholder="Password" 
              size="large"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="user"
          >
            <Select 
              suffixIcon={<TeamOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              size="large"
              style={{ borderRadius: '12px' }}
              options={[
                { label: 'Standard User', value: 'user' },
                { label: 'Staff Member', value: 'staff' },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{ 
                height: '50px', 
                borderRadius: '12px', 
                fontWeight: 600,
                marginTop: '10px'
              }}
            >
              Sign Up <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>OR</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'var(--text-secondary)' }}>Already have an account? </Text>
          <Button 
            type="link" 
            onClick={onSwitchToLogin} 
            style={{ color: 'var(--primary)', fontWeight: 600, padding: 0 }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
