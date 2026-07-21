  import { useEffect, useRef } from 'react';
  import * as echarts from 'echarts';
  import {categoryColors} from '../CategoryColors';

  export default function LowStockChart({ items }) {
    const ref = useRef(null);

    useEffect(() => {
      const chart = echarts.init(ref.current);


    

      // Filtering low stock items
      const lowStock = items.filter((i) => i.quantity <= i.reorderLevel);      


      // Preparing data
      const names = lowStock.map((i) => i.name);

      const quantities = lowStock.map((i) => i.quantity);

      const colors = lowStock.map(
        (i) => categoryColors[i.category] || categoryColors.Default
      );


      const option = {
        title: {
          text: 'Low Stock Items',
          left: 'center',
          top: 10,
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params) => {
            const { name, value } = params[0];
            return `<b>${name}</b><br/>Quantity: ${value}`;
          },
        },
        grid: {
          top: 60,
          left: 40,
          right: 20,
          bottom: 60,
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: 20,
            fontSize: 12,
            fontWeight: 500,
          },
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: 'value',
          name: 'Quantity',
          nameTextStyle: { fontSize: 13 },
        },
        series: [
          {
            data: quantities.map((v, i) => ({
              value: v,
              itemStyle: { color: colors[i] },
            })),
            type: 'bar',
            barWidth: '55%',
            borderRadius: [6, 6, 0, 0],
            label: {
              show: true,
              position: 'top',
              fontSize: 12,
              fontWeight: 500,
            },
          },
        ],
      };

      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }, [items]);

    return (
      <div
        ref={ref}
        style={{
          height: 400,
          width: '100%',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '12px',
        }}
      />
    );
  }
