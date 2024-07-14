import { ProcessedTable } from '../../components/ProcessedTable'
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { ReportTable } from '../../components/ReportTable';

function ReportWrapper() {
  const [reportData, setReportData] = useState([]);
  const [loading,setLoading] = useState(false);
  

  return (
    <div style={{marginTop:"-50px"}}>
      <ReportTable className='' title={'Transactions'} data={reportData} loading={loading}/>
    </div>
  )
}

export default ReportWrapper;
