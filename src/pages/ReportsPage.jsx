import { useQuery } from '@tanstack/react-query';
import { fetchInventory } from '../api/inventoryApi';
import { Row, Col, Card } from 'antd';
import LowStockChart from '../components/charts/LowStockChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';



export default function ReportsPage() {
  const { data: items = [] } = useQuery({
  queryKey: ['inventory'],
  queryFn: fetchInventory,
  staleTime: 1000 * 60 * 5,
});


  return (
    <div>
      <h2>Reports</h2>
      <Row gutter={[16,16]}>
        <Col span={12}>
          <Card title="Low Stock Items">
            <LowStockChart items={items} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Number of Items in each Category">
            <CategoryDonutChart items={items} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}