import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItem, updateItem } from '../api/inventoryApi';

export default function ItemFormModal({ visible, initialValues, onClose }) {
  
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  // Mutations for adding and updating items
  const addMutation = useMutation({
    mutationFn: addItem,
    onSuccess: (newItem) => {
      queryClient.setQueryData(['inventory'], (old = []) => [newItem, ...old]);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: (updated) => {
      queryClient.setQueryData(['inventory'], (old = []) =>
        old.map((i) => (i.id === updated.id ? updated : i))
      );
      onClose();
    },
  });

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const role = localStorage.getItem('role');
      if (role !== 'admin') {
        alert('Only admin can save changes.');
        return;
      }

      if (initialValues?.id) {
        await updateMutation.mutateAsync({ ...initialValues, ...values });
      } else {
        await addMutation.mutateAsync(values);
      }
    } catch {
      console.log("Validatation failed");   // validation failed
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Item' : 'Add Item'}
      open={visible}
      onCancel={onClose}
      onOk={onOk}
      okText="Save"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || { price: 1, quantity: 0 , reorderLevel: 0 }}
      >
        <Form.Item name="name" label="Item Name" rules={
          [
            { required: true },
            {
              pattern: /^[A-Za-z][A-Za-z0-9_-]{2,63}$/,   // a-z, - hyphen, forward slash (js takes the line bw //   as regExpression) 
              message:
                'name must be start with a Alphabet (between 3 – 64 characters )',
            },
          ]}
             >

          <Input min={3} max={64}  />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select
            options={[
              { label: 'Electronics', value: 'Electronics' },
              { label: 'Stationary', value: 'Stationary' },
              { label: 'Food', value: 'Food' },
              { label: 'Clothes', value: 'Clothes' },
              { label: 'Sports', value: 'Sports' },
              { label: 'Grocery', value: 'Grocery' },
              
            ]}
          />
        </Form.Item>

        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={1} step={1} />
        </Form.Item>

        <Form.Item name="quantity" label="Quantity" rules={[{ required: true },{type:'number', min:1, max:1000}]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="reorderLevel" label="Reorder Level" rules={[{ required: true },{type:'number', min:10, max:100}]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="supplier" label="Supplier">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
















// import { useEffect } from 'react';
// import { Modal, Form, Input, Select, InputNumber } from 'antd';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { addItem, updateItem } from '../api/inventoryApi';


// let c=0;

// export default function ItemFormModal({ visible, initialValues, onClose }) {
//   const [form] = Form.useForm();
//   const queryClient = useQueryClient();
  
  

//   useEffect(() => {
//     if (visible) {
//       form.resetFields();
//       if (initialValues) form.setFieldsValue(initialValues);
      
//     }    
//   }, [visible, initialValues, form]);





//   const addMutation = useMutation({
//     mutationFn: addItem,
//     onSuccess(newItem) {
//       queryClient.setQueryData(['inventory'], (old = []) => [newItem, ...old]);
//       onClose();
//     },
//   });

  
  
//   const updateMutation = useMutation({
//     mutationFn: updateItem,
//     onSuccess(updated) {
//       queryClient.setQueryData(['inventory'], (old = []) =>
//         old.map(i => (i.id === updated.id ? updated : i))
//       );
//       onClose();
//     },
//   });


//   const onOk = async () => {
//     try {
//       const values = await form.validateFields();
//       if (initialValues?.id) {
//         await updateMutation.mutateAsync({ ...initialValues, ...values });
//       } else {
//         await addMutation.mutateAsync(values);
//       }
//     } catch {
//       // validation error
//     }
//   };






//   return (
//     <Modal
//       title={initialValues ? 'Edit Item' : 'Add Item'}
//       open={visible}
//       onCancel={onClose}
//       onOk={onOk}
//       okText="Save"
//       destroyOnHidden
//     >
      
//       <Form
//         form={form}
//         layout="vertical"
//         preserve={false}
//         initialValues={initialValues || { price: 0, quantity: 0, reorderLevel: 0 }}
//       >
//         <Form.Item name="name" label="Item Name" rules={[{ required: true }]}>
//           <Input />
//         </Form.Item>

//         <Form.Item name="category" label="Category" rules={[{ required: true }]}>
//           <Select
//             options={[
//               { label: 'Electronics', value: 'Electronics' },
//               { label: 'Stationery', value: 'Stationery' },
//               { label: 'Food', value: 'Food' },
//               { label: 'Sports', value: 'Sports' },
//               { label: 'Clothing', value: 'Clothing' },
//             ]}
//           />
//         </Form.Item>

//         <Form.Item name="price" label="Price" rules={[{ required: true }]}>
//           <InputNumber style={{ width: '100%' }} min={1} step={0.01} />
//         </Form.Item>

//         <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
//           <InputNumber style={{ width: '100%' }} min={0} />
//         </Form.Item>

//         <Form.Item name="reorderLevel" label="Reorder Level" rules={[{ required: true }]}>
//           <InputNumber style={{ width: '100%' }} min={0} />
//         </Form.Item>

//         <Form.Item name="supplier" label="Supplier">
//           <Input />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// }
