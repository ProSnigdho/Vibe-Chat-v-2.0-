import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const { Title, Text } = Typography;

const Login = ({ onSwitchToSignup }) => {
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post('auth/login/', values);
      const token = res.data.access;
      localStorage.setItem('token', token);
      
      const profileRes = await api.get('auth/profile/');
      const userData = {
        id: profileRes.data.user_id,
        username: profileRes.data.username,
        email: profileRes.data.email,
        profile: profileRes.data
      };
      setAuth(userData, token);
      message.success('Welcome back!');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      message.error(errorMsg);
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
          <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700 }}>Vibe Chat</Title>
          <Text style={{ color: 'var(--text-secondary)' }}>Log in to your workspace</Text>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username is required!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              placeholder="Username" 
              size="large"
              style={{ borderRadius: '12px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.45)' }} />} 
              placeholder="Password" 
              size="large"
              style={{ borderRadius: '12px' }}
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
              Sign In <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>NEW TO VIBE?</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'var(--text-secondary)' }}>Don't have an account? </Text>
          <Button 
            type="link" 
            onClick={onSwitchToSignup} 
            style={{ color: 'var(--primary)', fontWeight: 600, padding: 0 }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
