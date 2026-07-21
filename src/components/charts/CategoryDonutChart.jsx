import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import {categoryColors} from '../CategoryColors';

export default function CategoryDonutChart({ items }) {
  const ref = useRef(null);

  useEffect(() => {
    const chart = echarts.init(ref.current);



    // Count items by category
    const counts = items.reduce((acc, it) => {
      acc[it.category] = (acc[it.category] || 0) + 1;
      return acc;
    }, {});

    const data = Object.keys(counts).map((k) => ({
      name: k,
      value: counts[k],
      itemStyle: { color: categoryColors[k] || categoryColors.Default },
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} items ({d}%)',
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: { color: '#333', fontSize: 13 },
      },
      series: [
        {
          name: 'Items by Category',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          // remove borders so slices touch cleanly
          itemStyle: {
            borderRadius: 0,
            borderColor: 'transparent',
            borderWidth: 0,

          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            scale: true,
            scaleSize: 8,
            label: {
              show: true,
              fontSize: 22,
              fontWeight: 'bold',
              color: '#333',
              formatter: '{b}',
            },
          },
          labelLine: {
            show: true,     // must be true to see any effect
            length: 8,      // distance from donut edge to first turn
            length2: 12,    // distance from turn to label text
            smooth: true,   // makes connector slightly curved
          },
          data,
        },
      ],
      animationDuration: 800,
      animationEasing: 'cubicOut',
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
        // marginTop:20,
        height: 400,
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '1px',
      }}
    />
  );
}










// import { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// export default function CategoryDonutChart({ items }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const chart = echarts.init(ref.current);


//     // Group item counts by category
//     const counts = items.reduce((acc, it) => {
//       acc[it.category] = (acc[it.category] || 0) + 1;
//       return acc;
//     }, {});


//     const data = Object.keys(counts).map(k => ({ name: k, value: counts[k] }));


//     // Same style as your example
//     const option = {
//       tooltip: {
//         trigger: 'item'
//       },
//       legend: {
//         top: '5%',
//         left: 'center'
//       },
//       series: [
//         {
//           name: 'Items by Category',
//           type: 'pie',
//           radius: ['40%', '70%'],
//           avoidLabelOverlap: false,
//           label: {
//             show: false,
//             position: 'center'
//           },
//           emphasis: {
//             label: {
//               show: true,
//               fontSize: 40,
//               fontWeight: 'bold'
//             }
//           },
//           labelLine: {
//             show: false
//           },
//           data
//         }
//       ]
//     };

//     chart.setOption(option);

//     const handleResize = () => chart.resize();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.dispose();
//     };
//   }, [items]);

//   return <div ref={ref} style={{ height: 320, width: '100%' }} />;
// }
