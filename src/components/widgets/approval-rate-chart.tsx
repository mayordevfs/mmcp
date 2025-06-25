import React from 'react';
import { CheckMark } from '@/components/icons/checkmark';
import { CloseIcon } from '@/components/icons/close-icon';
import Chart from '@/components/ui/chart';
import { useAnalyticsQuery } from '@/data/dashboard';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Loader from '@/components/ui/loader/loader';

const ApprovalRateChart = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useAnalyticsQuery();

    const approvalRateValue = data?.approvalRate?.replace('%', '') || '0';
    const rate = parseFloat(approvalRateValue) || 0;
    const remainingRate = 100 - rate;

    if (isLoading) {
        return (
            <div className="h-full w-full rounded bg-light shadow-sm flex items-center justify-center">
                <Loader className="h-8 w-8 text-blue-500" />
            </div>
        );
    }
  
    const options = {
      options: {
        colors: ['#10B981', '#EF4444'],
        dataLabels: {
          enabled: false,
        },
        labels: ['Approved', 'Rejected'],
        legend: {
          show: false,
        },
        stroke: {
          show: false,
        },
        states: {
          hover: {
            filter: {
              type: 'darken',
              value: 0.8,
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: '85%',
              labels: {
                show: true,
                total: {
                    show: true,
                    label: t('Approval Rate'),
                    color: '#333',
                    formatter: () => `${approvalRateValue}%`
                },
                name: {
                  show: true,
                  fontSize: '20px',
                  fontFamily: 'Arial',
                  fontWeight: 600,
                  color: '#333',
                  offsetY: -10
                },
                value: {
                  show: true,
                  fontSize: '36px',
                  fontFamily: 'Arial',
                  fontWeight: 700,
                  color: '#333',
                  offsetY: 10,
                  formatter: function (val: string) {
                    return val + '%';
                  }
                },
                // total: {
                //   show: true,
                //   label: 'Approval Rate',
                //   color: '#333',
                //   formatter: function (w: any) {
                //     return `${approvalRate}%`;
                //   }
                // }
              }
            },
            expandOnClick: false,
          },
        },
      },
      series: [rate, remainingRate],
    };

  return (
    <div className="h-full w-full rounded bg-light shadow-sm">
      <div className="flex items-start justify-between p-8">
        <div className="flex w-full items-center justify-start">
          <span className="me-4 flex h-14 w-14">
            <CheckMark className="h-full w-full" />
          </span>

          <div className="flex flex-col">
            <span className="text-lg font-semibold text-heading" style={{ color: '#10B981' }}>
              {approvalRateValue}%
            </span>
            <span className="mt-1 text-xs text-body">Approved</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Chart
          options={options.options}
          series={options.series}
          width="100%"
          type="donut"
        />
      </div>

      <div className="flex items-start justify-between p-8">
        <div className="flex w-full flex-row-reverse items-center justify-start">
          <span className="ms-4 flex h-14 w-14">
            <CloseIcon className="h-full w-full" />
          </span>

          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-heading" style={{ color: '#EF4444' }}>
              {remainingRate}%
            </span>
            <span className="mt-1 text-xs text-body">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRateChart;