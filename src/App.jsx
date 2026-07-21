import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import './index.css';



const { Header, Content } = Layout;


//  Protected Route Logic
function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  if (!loggedIn) return <Navigate to="/login" replace />;
  return children;
}


//  Header Component
function AppHeader() {
  const location = useLocation();
  const onLoginPage = location.pathname === '/login';
  const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

  const loggedIn = localStorage.getItem('loggedIn') === 'true';



  // Only show menu if not on login page
  const menuItems = !onLoginPage
    ? [
        { key: 'inventory', label: <Link to="/">Inventory</Link> },
        { key: 'reports', label: <Link to="/reports">Reports</Link> },
        { key: 'users', label: <Link to="/users">Users</Link> }, 
        {
          key: 'logout',
          label: (
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem('role');
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('username');
              }}
            >
              Logout
            </Link>
          ),
        },
      ]
    : [];

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingInline: 24,
        background: '#001529',
        overflow: 'hidden',
      }}
    >
      {/* Left title */}
      <div
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        Inventory Dashboard
      </div>



      {/* Right section */}
      {!onLoginPage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'nowrap',
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            selectable={false}
            items={menuItems}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              background: 'transparent',
              borderBottom: 'none',
              gap: '16px',
              flexWrap: 'nowrap',
            }}
          />
          {loggedIn && (
            <div style={{ color: '#fff', fontWeight: 500, whiteSpace: 'nowrap',marginRight:'20px' }}>
              👤 {username || 'User'} {`( ${role} )`}
            </div>
          )}
        </div>
      )}
    </Header>
  );
}


//  Main App
export default function App() {

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />

        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UsersPage /> </ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}


