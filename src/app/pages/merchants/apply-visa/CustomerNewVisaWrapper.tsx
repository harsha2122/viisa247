import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../../../components/Loader';
import CustomerApplyVisa from '../../../components/CustomerApplyVisa';
import { CustomerVisaTable } from '../../../components/CustomerVisaTable';
import { Vertical3 } from '../../../modules/wizards/components/Vertical3';

function CustomerNewVisaWrapper() {
  const [visaForm, showVisaForm] = useState(false);
  const [visaList, setVisaList] = useState(false);
  const [manualValue, setManualValue] = useState(false); // Initialize as false
  const [apiData, setApiData] = useState<any>(null); // Initialize as null
  const [selectedEntry, setSelectedEntry] = useState<any>(null); // Initialize as null
  const [visaListLoader, setVisalistLoader] = useState(false);
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false);  

  const handleApiDataReceived = (data: any) => {
    // Handle the API data as needed
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
    showVisaForm(true); // Set VisaForm visibility to true when the "Select" field is clicked
  };

  return (
    <div>
      {visaForm ? (
        <>
          {finalSubmitLoader ? (
            <Loader loading={finalSubmitLoader} />
          ) : (
              <Vertical3 
                visaListLoader={setVisalistLoader}
                show={(value: any) => setVisaList(value)}
                visaList={visaList} 
                selectedEntry={selectedEntry} 
                showfinalSubmitLoader={setFinalSubmitLoader} 
              />
            )
          }
        </>
      ) : (
        <>
          {visaList ? (
            <CustomerVisaTable
              className=''
              title={'VISA'}
              visaListLoader={setVisalistLoader}
              show={(value: any) => setVisaList(value)}
              visaList={visaList}
              apiData={apiData} 
              manualValue={manualValue}
              onSelectClick={handleSelectClick}
            />
          ) : (
            <>
              <CustomerApplyVisa
                show={(value: any) => setVisaList(value)}
                visaList={visaList}
                visaListLoader={setVisalistLoader}
                onApiDataReceived={handleApiDataReceived}
                manualValue={handleManualReceived}
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

export default CustomerNewVisaWrapper;
