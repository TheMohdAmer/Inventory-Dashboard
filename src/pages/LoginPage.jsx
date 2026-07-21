import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, message, Select, Alert, Flex } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleLogin = () => {
    if (!username || !password) {
      message.warning('Please enter both username and password');
      return;
    }

    // Load all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find user by username, password, and role
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (user) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      message.success(`Welcome ${user.fullName || user.username}!`);
      navigate('/');
    } else {
      message.error('Invalid credentials or incorrect role');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '82vh',
        background: '#0d1c33ff',    
    
      }}
    >
      <Card
        title={<Title level={3}>Inventory Login</Title>}
        style={{
          width: 380,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <Select
          value={role}
          onChange={(value) => setRole(value)}
          style={{ width: '100%', marginBottom: 20 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>

        <Input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        <Input.Password
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <Button type="primary" block onClick={handleLogin}>
          Login as {role}
        </Button>

        
      
      <div
  style={{
    marginTop: 20,
    padding: "12px",
    border: "1px solid #d9d9d9",
    borderRadius: 8,
    background: "#fafafa",
    fontSize: 13,
    textAlign: "left",
  }}
>
  <div
    style={{
      fontWeight: 600,
      marginBottom: 8,
      color: "#1677ff",
    }}
  >
    🔑 Demo Credentials
  </div>

  <div style={{ marginBottom: 8}}>
    <strong>Admin</strong><br />
    Username: <code>admin1</code><br />
    Password: <code>admin123</code>
  </div>

  <div>
    <strong>User</strong><br />
    Username: <code>amzath</code><br />
    Password: <code>am123</code>
  </div>
</div></Card>
    </div>
    
  );
}
