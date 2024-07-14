import React, { useState } from 'react';
import { Vertical } from '../../modules/wizards/components/Vertical';
import 'react-datepicker/dist/react-datepicker.css';
import SelectCountry from '../../components/VisaCountrySelect';
import { VisaTable } from '../../components/VisaTable';
import ApplyVisa from '../../components/ApplyVisa';
import Loader from '../../components/Loader';

function NewVisaWrapper() {
  const [visaForm, showVisaForm] = useState(false);
  const [visaList, setVisaList] = useState(false); // Initialize as false
  const [apiData, setApiData] = useState(null);
  const [manualValue, setManualValue] = useState(false); // Initialize as false
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [visaListLoader, setVisalistLoader] = useState(false);
  const [finalSubmitLoader, setFinalSubmitLoader] = useState(false);

  const handleApiDataReceived = (data) => {
    // Handle the API data as needed
    setApiData(data);

    // Extract visaList from the API response and set it
    if (data && data.visaList) {
      setVisaList(data.visaList);
    }

    setVisaList(true); // Show the VisaTable component
    setVisalistLoader(false);
  };

  const handleSelectClick = (selectedEntryData) => {
    setSelectedEntry(selectedEntryData);

    showVisaForm(true); // Set VisaForm visibility to true when the "Select" field is clicked
  };

  const handleManualReceived = (data) => {
    setManualValue(data);
  };
  return (
    <div>
      {visaForm ? (
        <>
          {finalSubmitLoader ?
            <Loader loading={finalSubmitLoader} />
            :
            <Vertical 
            visaListLoader={setVisalistLoader}
            show={(value) => setVisaList(value)}
            visaList={visaList}
             selectedEntry={selectedEntry} showfinalSubmitLoader={setFinalSubmitLoader} />
          }
        </>
      ) : (
        <>
          {visaList ? (
            <VisaTable
              className=''
              title={'VISA'}
              visaListLoader={setVisalistLoader}
              show={(value) => setVisaList(value)}
              visaList={visaList}
              apiData={apiData} // Pass the API data to VisaTable
              manualValue={manualValue}
              onSelectClick={handleSelectClick}
            />
          ) : (
            <>
              {visaListLoader ?
                <Loader loading={visaListLoader} />
                :
                <ApplyVisa
                  show={(value) => setVisaList(value)}
                  visaList={visaList}
                  visaListLoader={setVisalistLoader}
                  onApiDataReceived={handleApiDataReceived}
                />
              }
            </>
          )}
        </>
      )}
    </div>
  );
}

export default NewVisaWrapper;
