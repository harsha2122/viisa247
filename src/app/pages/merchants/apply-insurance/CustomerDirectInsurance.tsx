import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../../../components/Loader';
import { useLocation } from 'react-router-dom';
import CustomerDirectApply from '../../../components/CustomerDirectApply';
import { InsuranceTablee } from '../../../components/InsuranceTablee';
import { DirectVerticaliii } from '../../../modules/wizards/components/DirectVerticaliii';

interface CombinedDataType {
  issue_date: string;
  expiry_date: string;
  insuranceData: InsuranceData[];
}

interface InsuranceData {
  id: string;
  amount: number;
}

function CustomerDirectInsurance() {
  const location = useLocation();
  const [visaForm, showVisaForm] = useState(false);
  const [visaList, setVisaList] = useState(false);
  const [manualValue, setManualValue] = useState(false); // Initialize as false
  const [apiData, setApiData] = useState<any>(null); // Initialize as null
  const [selectedEntry, setSelectedEntry] = useState<any>(null); // Initialize as null
  const [visaListLoader, setVisalistLoader] = useState(false);
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false);

  const { combinedData }: any = location.state || {};

  useEffect(() => {
    if (combinedData) {
      // Optionally handle combinedData here if needed
      console.log('Combined Data:', combinedData);
    }
  }, [combinedData]);

  const handleApiDataReceived = (data: any) => {
    setApiData(data);

    // Extract visaList from the API response and set it
    if (data && data.visaList) {
      setVisaList(data.visaList);
    }

    setVisaList(true); // Show the VisaTable component
    setVisalistLoader(false);
  };

  const handleManualReceived = (data: any) => {
    setManualValue(data);
  };

  const handleSelectClick = (selectedEntryData: any) => {
    setSelectedEntry(selectedEntryData);
    showVisaForm(true);
  };

  return (
    <div>
      {visaForm ? (
        <>
          {finalSubmitLoader ? (
            <Loader loading={finalSubmitLoader} />
          ) : (
            <DirectVerticaliii
              visaListLoader={setVisalistLoader}
              show={(value: any) => setVisaList(value)}
              visaList={visaList}
              selectedEntry={selectedEntry}
              showfinalSubmitLoader={setFinalSubmitLoader}
              combinedData={combinedData}
            />
          )}
        </>
      ) : (
        <>
          {visaList ? (
            <InsuranceTablee
              className=''
              title={'VISA'}
              visaListLoader={setVisalistLoader}
              show={(value: any) => setVisaList(value)}
              visaList={visaList}
              apiData={apiData}
              manualValue={manualValue}
              onSelectClick={handleSelectClick}
              combinedData={combinedData}
            />
          ) : (
            <>
              <CustomerDirectApply
                show={(value: any) => setVisaList(value)}
                visaList={visaList}
                visaListLoader={setVisalistLoader}
                onApiDataReceived={handleApiDataReceived}
                combinedData={combinedData}
              />
              {visaListLoader && (
                <Loader loading={visaListLoader} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerDirectInsurance;
