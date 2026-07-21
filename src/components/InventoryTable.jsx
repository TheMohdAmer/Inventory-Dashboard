import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, deleteItem } from '../api/inventoryApi';
import { Button, Space, Modal, message } from 'antd';
import {EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {categoryColors} from './CategoryColors';

const {confirm}=Modal;

ModuleRegistry.registerModules([AllCommunityModule]);


// App starts from here
export default function InventoryTable({ onEdit }) {
  const queryClient = useQueryClient();



  // Load items from LocalStorage via React Query
  const { data: items = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Handle delete directly using API
  const handleDelete = async (id) => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      message.warning('Only admin can delete items!');
      return;
    }
    await deleteItem(id);
    queryClient.invalidateQueries(['inventory']); // refresh grid instantly
  };


  // Confirm delete
  const handleDeleteConfirm = (item) => {
    confirm({
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete the item "${item.name}"?`,
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      centered: true, // centers the modal
      width:500,
      
      onOk: async () => {
        await handleDelete(item.id);
        message.success(`Item "${item.name}" deleted successfully`);
      },
    });
  };



  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  // Common columns (visible for all users)
  const baseColumns = [
    { field: 'id', headerName: 'Item ID', sortable: true, filter: true, flex: 1 / 3 },
    { field: 'name', headerName: 'Item Name', sortable: true, filter: true, flex: 1 / 3 },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      cellRenderer: (params) => {
        const color = categoryColors[params.value] || categoryColors.Default;
        return (
          <span style={{ color, fontWeight: 600 }}>
            {params.value}
          </span>
        );
      },
    },
    { field: 'price', headerName: 'Price', valueFormatter: (params) =>  `₹ ${params.value}.00` , width: 110, sortable: true, filter: true },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    { field: 'reorderLevel', headerName: 'Reorder Level', width: 120 },
    { field: 'supplier', headerName: 'Supplier', flex: 1 / 3 },
    { field: 'lastUpdated', headerName: 'Last Updated', flex: 1 / 2 },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      cellRenderer: (params) => {
        const color = params.value === 'Low Stock' ? 'red' : 'green';
        return <span style={{ color, fontWeight: 450 }}>{params.value}</span>;
      },
    },
  ];



  // Add “Actions” column only if Admin
  const columnDefs = useMemo(() => {
    if (!isAdmin) return baseColumns;

    return [
      ...baseColumns,
      {
        headerName: 'Actions',
        flex: 1 / 2,
        cellRenderer: ({ data }) => (
          <Space>
            <Button
              size="small"
              type="default"
              onClick={() => onEdit(data)}
              style={{ width: "40px" }}
            >
              <EditOutlined />  
            </Button>

            <Button
              size="small"
              type="default"
              style={{
                marginLeft: '15px',
                width: '40px',
                color:'#670c0cff'
              }}
              onClick={() => handleDeleteConfirm(data)} // pasing full item
            >
              <DeleteOutlined/>

            </Button>
          </Space>
        ),
      },
    ];
  }, [isAdmin, onEdit]);


  const rowData = items.map((i) => ({
    ...i,
    status: i.quantity <= i.reorderLevel ? 'Low Stock' : 'In Stock',
  }));


  return (
    <div style={{ height: 520, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ resizable: true }}
        theme={themeQuartz}
      />
    </div>
  );
}
