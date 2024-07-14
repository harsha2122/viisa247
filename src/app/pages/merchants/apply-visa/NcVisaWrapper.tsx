import React, { useState } from 'react';
import Loader from '../../../components/Loader';
import Inner from '../../inner/inner';
import { Vertical5 } from '../../../modules/wizards/components/Vertical5';

const NcVisaWrapper: React.FC = () => {
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
        if (selectedEntryData) {
            setSelectedEntry(selectedEntryData);
            showVisaForm(true);
        } else {
            console.error("Selected Entry Data is undefined");
        }
    };

    return (
        <div>
            {visaForm ? (
                <>
                    {finalSubmitLoader ? (
                        <Loader loading={finalSubmitLoader} />
                    ) : (
                        <Vertical5
                            visaListLoader={setVisalistLoader}
                            show={(value: any) => setVisaList(value)}
                            visaList={visaList}
                            selectedEntry={selectedEntry}
                            showfinalSubmitLoader={setFinalSubmitLoader}
                        />
                    )}
                </>
            ) : (
                <>
                    {visaList ? (
                        <Inner
                            className=''
                            title={'VISA'}
                            visaListLoader={setVisalistLoader}
                            show={(value: any) => setVisaList(value)}
                            visaList={visaList}
                            apiData={apiData}
                            manualValue={manualValue}
                            onSelectClick={handleSelectClick}
                            onApiDataReceived={handleApiDataReceived}
                        />
                    ) : (
                        <>
                            {visaListLoader && <Loader loading={visaListLoader} />}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default NcVisaWrapper;
