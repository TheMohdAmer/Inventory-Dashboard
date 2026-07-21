import { useState } from 'react';
import { Button, Row, Col } from 'antd';
import InventoryTable from '../components/InventoryTable';
import ItemFormModal from '../components/ItemFormModal';

export default function InventoryPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const role = localStorage.getItem('role'); // 'admin' or 'user'

  const handleAdd = () => {
    if (role === 'admin') {
      setEditingItem(null);
      setModalVisible(true);
    } else {
      alert("Only admin can add new items!");
    }
  };

  const handleEdit = (item) => {
    if (role === 'admin') {
      setEditingItem(item);
      setModalVisible(true);
    } else {
      alert("Only admin can edit items!");
    }
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col><h2>Inventory</h2></Col>
        <Col>
          {role === 'admin' && (
            <Button type="primary" onClick={handleAdd} >
              Add Item
            </Button>
            
          )}
          {/* <Loadingbutton /> */}
        </Col>
      </Row>

      <InventoryTable onEdit={handleEdit} />

      <ItemFormModal
        visible={modalVisible}
        initialValues={editingItem}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

























// import { useState } from 'react';
// import { Button, Row, Col } from 'antd';
// import InventoryTable from '../components/InventoryTable';
// import ItemFormModal from '../components/ItemFormModal';




// export default function InventoryPage() {
//   const [modalVisible, setModalVisible] = useState(false);   // form Modal 
//   const [editingItem, setEditingItem] = useState(null);




//   return (
//     <div>
//       <Row justify="space-between" style={{ marginBottom: 16 }}>
//         <Col>
//           <h2>Inventory</h2>
//         </Col>
//         <Col>
//           <Button type="primary" onClick={() => { setEditingItem(null); setModalVisible(true); }}>
//             Add Item
//           </Button>
//         </Col>
//       </Row>

//       <InventoryTable onEdit={(item) => { setEditingItem(item); setModalVisible(true); }} />

//       <ItemFormModal
//         visible={modalVisible}          //    true/false
//         initialValues={editingItem}
//         onClose={() => setModalVisible(false)}
        
//       />
//     </div>
//   );
// }