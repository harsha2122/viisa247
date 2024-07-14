import React, { useState, useEffect } from 'react';
import { Vertical } from '../../../modules/wizards/components/Vertical';
import { Vertical1 } from '../../../modules/wizards/components/Vertical1';
import 'react-datepicker/dist/react-datepicker.css';
import SelectCountry from '../../../components/VisaCountrySelect';
import { VisaTable } from '../../../components/VisaTable';
import ApplyVisa from '../../../components/ApplyVisa';
import Loader from '../../../components/Loader';
import MerchantApplyVisa from '../../../components/MerchantApplyVisa';
import HomeApply from '../../../components/HomeApply';
import MerchantApplyInsurance from '../../../components/MerchantApplyInsurance';
import { InsuranceTablec } from '../../../components/InsuranceTablec';
import CustomerApplyInsurance from '../../../components/CustomerApplyInsurance';
import { Verticali } from '../../../modules/wizards/components/Verticali';
import { Verticalii } from '../../../modules/wizards/components/Verticalii';

function MerchantNewInsurance() {
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
              <Verticalii 
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
            <InsuranceTablec
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
              <MerchantApplyInsurance
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

export default MerchantNewInsurance;
