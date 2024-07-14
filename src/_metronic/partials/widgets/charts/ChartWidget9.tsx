import React, { useEffect, useRef, useState } from 'react';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils';
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider';
import { Dropdown1 } from '../../content/dropdown/Dropdown1';
import axiosInstance from '../../../../app/helpers/axiosInstance';
import { KTIcon } from '../../../helpers';

type Props = {
  className: string;
};

const ChartsWidget9: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [supportData, setSupportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCount, setOpenCount] = useState<number>(0);
  const [closedCount, setClosedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [inProgressCount, setInProgressCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/fetch_all_visa');
        setSupportData(response.data.data);
        const applied = response.data.data.filter((ticket: any) => ticket.visa_status === 'Applied' || ticket.visa_status === 'Not Issued');
        const rejected = response.data.data.filter((ticket: any) => ticket.visa_status === 'Reject' || ticket.visa_status === 'Rejected');
        const pendingTickets = response.data.data.filter((ticket: any) => ticket.visa_status === 'Issue');
        const inProgressTickets = response.data.data.filter((ticket: any) => ticket.visa_status === 'Process' || ticket.visa_status === 'Waiting');
  
        setOpenCount(applied.length);
        setClosedCount(rejected.length);
        setPendingCount(pendingTickets.length);
        setInProgressCount(inProgressTickets.length);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const refreshChart = () => {
      if (!chartRef.current) {
        return;
      }

      const height = parseInt(getCSS(chartRef.current, 'height'));
      const chart = new ApexCharts(chartRef.current, getChartOptions(height));
      if (chart) {
        chart.render();
      }

      return chart;
    };

    const chart = refreshChart();
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [mode, openCount, closedCount, pendingCount, inProgressCount]);

  const getTotalVisasCount = () => {
    return openCount + closedCount + pendingCount + inProgressCount;
  };

  const getChartOptions = (height: number): ApexOptions => {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-400');
    const baseColors = ['#5CB270', '#A8D26D', '#CEE26B', '#F4F269'];
    const series = [openCount, closedCount, pendingCount, inProgressCount];
    const labels = ['Applied', 'Rejected', 'Pending', 'In Progress'];
  
    return {
      series: series,
      chart: {
        type: 'donut',
        height: height,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          blur: 4,
          color: '#000',
          opacity: 0.24,
        },
      },
      labels: labels,
      colors: baseColors,
      legend: {
        position: 'bottom',
        labels: {
          colors: labelColor,
          useSeriesColors: false,
        },
        fontSize: '14px',
        fontWeight: 500,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                color: labelColor,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        style: {
          colors: ['#000'],
          fontSize: '15px',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + '';
          },
        },
      },
      stroke: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  };

  return (
    <div className={`card ${className}`}>
      {/* Card Header */}
      <div className='card-header border-0 pt-5'>
        {/* Card Title */}
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Total Visa Applied</span>
          <span className='text-muted fw-semibold fs-7'>Total - {getTotalVisasCount()} Visas</span>
        </h3>
        {/* End Card Title */}

        {/* Card Toolbar */}
        <div className='card-toolbar'>
          {/* Dropdown Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
          {/* End Dropdown Menu */}
        </div>
        {/* End Card Toolbar */}
      </div>
      {/* End Card Header */}

      {/* Card Body */}
      <div className='card-body'>
        {/* Chart */}
        <div ref={chartRef} id='kt_charts_widget_2_chart' style={{ height: '350px' }}></div>
        {/* End Chart */}
      </div>
      {/* End Card Body */}
    </div>
  );
};

export { ChartsWidget9 };
