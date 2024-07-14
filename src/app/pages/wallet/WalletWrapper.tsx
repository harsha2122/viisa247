import { ProcessedTable } from '../../components/ProcessedTable';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../helpers/axiosInstance';
import { WalletTable } from '../../components/WalletTable';

function WalletWrapper() {
  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Define a function to make the POST request
    const fetchData = async () => {
      setLoading(true);
      try {
        // Make a POST request to your API endpoint
        axiosInstance.get('/backend/fetch_wallet_transaction')
          .then((response) => {
            // Sort the data based on the 'created_at' field
            const sortedData = response.data.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            
            // Set the sorted data and update loading state
            setWalletData(sortedData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching wallet data:', error);
            setLoading(false);
          });

      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: "-50px" }}>
      <WalletTable className='' title={'Wallet'} data={walletData} loading={loading} />
    </div>
  );
}

export default WalletWrapper;
