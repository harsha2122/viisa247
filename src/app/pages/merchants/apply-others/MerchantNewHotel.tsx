import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../../../components/Loader';
import MerchantApplyHotel from '../../../components/MerchantApplyHotel';
import { HotelTable } from '../../../components/HotelTable';
import { FormHotel2 } from '../../../modules/wizards/components/FormHotel2';

function MerchantNewHotel() {
  const [visaForm, showVisaForm] = useState(false);
  const [visaList, setVisaList] = useState(false);
  const [manualValue, setManualValue] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [visaListLoader, setVisalistLoader] = useState(false);
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false);  

  const handleApiDataReceived = (data: any) => {
    setApiData(data);

    if (data && data.visaList) {
      setVisaList(data.visaList);
    }

    setVisaList(true);
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
              <FormHotel2
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
            <HotelTable
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
              <MerchantApplyHotel
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

export default MerchantNewHotel;
