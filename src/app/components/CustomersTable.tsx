/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {KTIcon, toAbsoluteUrl} from '../../_metronic/helpers'

type Props = {
  className: string,
  title: String
}

const data = [
  {
    name: 'Ana Simmons',
    avatarUrl: '/media/avatars/300-14.jpg',
    date: '01/09/2023',
    location1: 'India',
    location2: 'UAE',
    status: 'In-process',
  },
  {
    name: 'Ana Simmons',
    avatarUrl: '/media/avatars/300-14.jpg',
    date: '01/09/2023',
    location1: 'India',
    location2: 'UAE',
    status: 'In-process',
  },
  {
    name: 'Ana Simmons',
    avatarUrl: '/media/avatars/300-14.jpg',
    date: '01/09/2023',
    location1: 'India',
    location2: 'UAE',
    status: 'In-process',
  },
  {
    name: 'Ana Simmons',
    avatarUrl: '/media/avatars/300-14.jpg',
    date: '01/09/2023',
    location1: 'India',
    location2: 'UAE',
    status: 'In-process',
  },
  {
    name: 'Ana Simmons',
    avatarUrl: '/media/avatars/300-14.jpg',
    date: '01/09/2023',
    location1: 'India',
    location2: 'UAE',
    status: 'In-process',
  },
]

const CustomersTable: React.FC<Props> = ({className,title}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-center flex-row'>
          <span className='card-label fw-bold fs-3 mb-1'>{title}</span>
          <span className='fs-6 text-gray-400 fw-bold'>{title=="VISA" && '30 days'}</span>
        </h3>
        {title=='VISA' &&
        
        <div className='d-flex flex-wrap my-2'>
          <div className='me-4'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-sm form-select-white w-125px'
              defaultValue='30 Days'
            >
              <option value='30 Days'>30 Days</option>
              <option value='Approved'>In Progress</option>
              <option value='Declined'>To Do</option>
              <option value='In Progress'>Completed</option>
            </select>
          </div>
        </div>}
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                
                <th className='min-w-150px'>Customers</th>
                <th className='min-w-140px'>Date</th>
                <th className='min-w-120px'>From</th>
                <th className='min-w-100px'>To</th>
                <th className='min-w-100px'>Status</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>

                  <td>
                    {/* Avatar and Name */}
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px me-5'>
                        <img src={toAbsoluteUrl('/media/avatars/300-14.jpg')} alt='' />
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                          {row.name}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    {/* Date */}
                    <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                      {row.date}
                    </a>
                  </td>
                  <td>
                    {/* Location 1 */}
                    <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                      {row.location1}
                    </a>
                  </td>
                  <td>
                    {/* Location 2 */}
                    <a href='#' className='text-dark fw-bold text-hover-primary d-block fs-6'>
                      {row.location2}
                    </a>
                  </td>
                  <td>
                    {/* Status */}
                    <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {/* Action Buttons */}
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='switch' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {CustomersTable}
