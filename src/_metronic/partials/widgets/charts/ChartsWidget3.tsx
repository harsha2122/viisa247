import React, { useEffect, useRef, useState } from 'react';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils';
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider';
import axiosInstance from '../../../../app/helpers/axiosInstance';

type RevenueItem = {
  transaction_time: string; // adjust type as per your API response
  revenue: number; // adjust type as per your API response
};

type Props = {
  className: string;
};

const ChartsWidget3: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [revenueData, setRevenueData] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/super_admin/revenue');
        const sortedData = response.data.data.sort((a: RevenueItem, b: RevenueItem) =>
          new Date(a.transaction_time).getMonth() - new Date(b.transaction_time).getMonth()
        );
        setRevenueData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshMode = () => {
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

  useEffect(() => {
    const chart = refreshMode();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, revenueData]);

  const getChartOptions = (height: number): ApexOptions => {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const baseColor = getCSSVariableValue('--bs-success');
    const lightColor = getCSSVariableValue('--bs-success-light');

    // Ensure all months are included, even if data is not available for some
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date();
      monthDate.setMonth(i);
      return monthDate.toLocaleString('default', { month: 'short' });
    });

    // Map revenue data to corresponding months
    const monthlyRevenue = allMonths.map((month) => {
      const matchingData = revenueData.find((item) => {
        const itemMonth = new Date(item.transaction_time).toLocaleString('default', { month: 'short' });
        return itemMonth === month;
      });
      return matchingData ? matchingData.revenue : 0;
    });

    return {
      series: [
        {
          name: 'Net Profit',
          data: monthlyRevenue,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
        opacity: 1,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        categories: allMonths,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          offsetY: 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val: number) {
            return '₹' + val;
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColors: baseColor,
        strokeWidth: 3,
      },
    };
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Revenue Overview</span>
          <span className="text-muted fw-semibold fs-7">Monthly Revenue Data</span>
        </h3>
        {/* begin::Toolbar */}
        <div className="card-toolbar" data-kt-buttons="true">
          <a className="btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1" id="kt_charts_widget_3_year_btn">
            Year
          </a>
          <a className="btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1" id="kt_charts_widget_3_month_btn">
            Month
          </a>
          <a className="btn btn-sm btn-color-muted btn-active btn-active-primary px-4" id="kt_charts_widget_3_week_btn">
            Week
          </a>
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body">
        {/* begin::Chart */}
        <div ref={chartRef} id="kt_charts_widget_3_chart" style={{ height: '350px' }}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { ChartsWidget3 };
