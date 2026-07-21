import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, themeQuartz } from "ag-grid-community";
import { Button, Modal, Form, Input, Row, Col, Select, Space, message } from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';



const { confirm } = Modal;
const { Option } = Select;
ModuleRegistry.registerModules([AllCommunityModule]);

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const isAdmin = localStorage.getItem("role") === "admin";
    const currentLogin = localStorage.getItem("username");

    // Load from LocalStorage
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(stored);
    }, []);


    // upadtes the localStorage and users(array)
    const saveUsers = (updated) => {
        localStorage.setItem("users", JSON.stringify(updated));
        setUsers([...updated]);
    };



    //  Add or Update User
    const handleSaveUser = async () => {
        try {
            const values = await form.validateFields();
            const allUsers = JSON.parse(localStorage.getItem("users")) || [];


            // Unique validation for username and email
            const duplicate = allUsers.find(
                (u) =>
                    (u.username.toLowerCase() === values.username.toLowerCase() ||
                        u.email.toLowerCase() === values.email.toLowerCase()) &&
                    (!editingUser || u.id !== editingUser.id)
            );
            if (duplicate) {
                message.error("Username or Email already exists");
                return;
            }

            if (editingUser) {
                // Update existing user
                const updated = allUsers.map((u) =>
                    u.id === editingUser.id
                        ? { ...u, ...values, fullName: `${values.firstName} ${values.lastName}` }
                        : u
                );

                saveUsers(updated);
                message.success("User updated successfully");
            } else {
                // Add new user
                const newUser = {
                    id: Date.now(),
                    fullName: `${values.firstName} ${values.lastName}`,
                    createdOn: new Date().toLocaleString(),
                    ...values,
                };
                saveUsers([newUser, ...allUsers]);
                message.success("User added successfully");
            }

            form.resetFields();
            setModalVisible(false);
            setEditingUser(null);
        } catch {
            // validation error ignored
        }
    };


    //  Delete User
    const handleDelete = (record) => {
        if (record.username === "Admin") {
            message.warning("You cannot delete Admin. It is the main account!");
            return;
        }

        if (record.username === currentLogin) {
            message.warning("You cannot delete your own account!");
            return;
        }

        const updated = users.filter((u) => u.id !== record.id);
        saveUsers(updated);
        message.success(`User "${record.username}" deleted successfully`);

        if (gridApi) {
            gridApi.applyTransaction({ remove: [record] });
        }
    };


    // Confirm delete panel
    const handleDeleteConfirm = (record) => {
        confirm({
            title: "Confirm Deletion",
            content: `Are you sure you want to delete "${record.username}"?`,
            okText: "Yes, Delete",
            cancelText: "Cancel",
            centered: true,
            width: 500,
            onOk: async () => handleDelete(record),
        });
    };



    //  Columns for AG Grid
    const columnDefs = useMemo(() => {
        const baseColumns = [
            { field: "fullName", headerName: "Full Name", flex: 1 },
            { field: "username", headerName: "Username", flex: 1 },
            { field: "email", headerName: "Email", flex: 1.5 },
            { field: "role", headerName: "Role", flex: 0.8 },
            { field: "createdOn", headerName: "Created On", flex: 1 },
        ];

        if (isAdmin) {
            baseColumns.push({
                headerName: "Actions",
                flex: 1,
                cellRenderer: ({ data }) => (
                    <Space>
                        <Button
                            size="small"
                            type="default"
                            onClick={() => {
                                setEditingUser(data);
                                setModalVisible(true);
                                form.setFieldsValue({
                                    firstName: data.fullName.split(" ")[0],
                                    lastName: data.fullName.split(" ")[1] || "",
                                    ...data,
                                });
                            }}
                            style={{ width:'40px', color: "#2b2828ff" }}
                        >
                            <EditOutlined />
                        </Button>

                        <Button
                            size="small"
                            type="default"
                            style={{
                                width:'40px',
                                marginLeft: "10px",
                                color: "#ad6938f7",
                            }}
                            onClick={() => handleDeleteConfirm(data)}
                        >
                            
                            <DeleteOutlined Delete/>
                        </Button>
                    </Space>
                ),
            });
        }

        return baseColumns;
    }, [isAdmin, users]);

    return (
        <div style={{ height: 520, width: "100%" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                }}
            >
                <h2>Users</h2>
                {isAdmin && (
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingUser(null);
                            form.resetFields();
                            setModalVisible(true);
                        }}
                    >
                        Add User
                    </Button>
                )}
            </div>


            <AgGridReact
                rowData={users}
                columnDefs={columnDefs}
                defaultColDef={{ resizable: true }}
                theme={themeQuartz}
                onGridReady={(params) => setGridApi(params.api)}
            />

            <Modal
                title={editingUser ? "Edit User" : "Add New User"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditingUser(null);
                    form.resetFields();
                }}

                onOk={handleSaveUser}
                centered
                width={700}
                styles={{
                    body: {
                        maxHeight: "70vh",
                        marginTop: "15px",
                    },
                }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                rules={[
                                    { required: true, message: "Please enter First name" },
                                    {
                                        pattern: /^[A-Za-z][A-Za-z0-9_-]{2,12}$/,   // a-z, - hyphen, forward slash (js takes the line bw //   as regExpression) 
                                        message:
                                            'First name must be start with a Alphabet (Length 3 – 12 characters )',
                                    },
                                ]
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                rules={[{ required: true, message: "Please enter last name" },{min:2, max:8}]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    { required: true, message: "Please enter a username" },
                                    {
                                        pattern: /^[A-Za-z][A-Za-z0-9_-]{2,63}$/,   // a-z, - hyphen, forward slash (js takes the line bw //   as regExpression) 
                                        message:
                                            'Username must be start with a Alphabet (between 3 – 64 characters )',
                                    },
                                ]
                                }
                            >
                                <Input disabled={!!editingUser} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: "Please enter password" },{min:5} ,{max:10}]}
                            >
                                <Input.Password 
                                    disabled={!!editingUser && editingUser.username !== currentLogin}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dob" label="Date of Birth">
                                <Input type="date" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: "Select a role" }]}
                            >
                                <Select>
                                    <Option value="admin">Admin</Option>
                                    <Option value="user">User</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div>
    );
}
