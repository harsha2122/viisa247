import React, { useEffect, useState } from 'react';
import PasswordResetForm from './PasswordResetForm';
import { useLocation, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

const PasswordPage: React.FC = () => {
  const {  userId, userEmail } = useParams();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);  
  const [email, setEmail] = useState<string | null>(null);  

  // useEffect(() => {
  //   // Parse the search string to extract query parameters
  //   const searchParams = new URLSearchParams(location.search);

  //   // Access the values using get method
  //   const token = searchParams.get('token');
  //   const userId = searchParams.get('userId');
  //   const userEmail = searchParams.get('userEmail');

  //   // You can now use the token, userId, and userEmail values

  //   // Add logic for handling password reset here

  // }, [location.search]);
  useEffect(() => {
    // Parse the search string to extract query parameters
    const searchParams = new URLSearchParams(location.search);
    const userEmail = searchParams.get('userEmail');
    setEmail(userEmail)
    // Access the values using get method
    const token = searchParams.get('token');

    setToken(token);

    // Add logic for handling password reset here

  }, [location.search]);
  const handlePasswordReset = (newPassword: string) => {
    // API call
    // setLoading(true);

    try {
      const requestBody = {
        token:token,
        new_password: newPassword,
        user_email_id: email, // Replace with your logic to get user_email_id
      };

      axiosInstance.post('/backend/super_admin/password_reset', requestBody)
        .then((response) => {

          if (response.status === 200) {
            // setLoading(false);
            toast.success(response.data.msg, {
              position: "top-center",
            });

            setTimeout(() => {
              window.location.href = '/merchant/login';
            }, 400);
          } else {
            // setLoading(false);
            toast.error(response.data.msg, {
              position: 'top-center',
            });
          }
        })
        .catch((error) => {
          // setLoading(false);
          console.error('Error:', error);
        });
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Toaster />
      <PasswordResetForm onSubmit={handlePasswordReset} />
    </div>
  );
};

export default PasswordPage;

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
