import { useState } from "react";
import axiosInstance from "../../../helpers/axiosInstance";
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

export function ChangePassword() {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setPasswordData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const resetFields = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      const super_admin_id = Cookies.get('user_id');
      const postData = {
        super_admin_email: super_admin_id,
        new_password: passwordData.newPassword,
        old_password: passwordData.oldPassword,
      };

      const response = await axiosInstance.post('/backend/change_password/super_admin', postData);

      if (response.status === 200) {
        toast.success(response.data.msg, {
          position: 'top-center',
        });

        resetFields();
      } else {
        toast.error(response.data.msg, {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='card mb-5 mb-xl-10'>
      <Toaster />
      <div id='kt_account_profile_details' className='collapse show'>
        <form noValidate className='form'>
          <div className='card-body border-top p-9'>
            {/* Old Password */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Old Password</label>
              <div className='col-lg-8'>
                <div className='row'>
                  <div className='col-lg-6 fv-row'>
                    <input
                      type='password'
                      className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                      placeholder='Enter Old Password'
                      style={{
                        border: '2px solid #d3d3d3',
                        borderRadius: '10px',
                        padding: '10px',
                        paddingLeft: '20px',
                        width: 280,
                        boxSizing: 'border-box',
                        backgroundColor: 'white'
                      }}
                      value={passwordData.oldPassword}
                      onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Password */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>New Password</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Enter New Password'
                  style={{
                    border: '2px solid #d3d3d3',
                    borderRadius: '10px',
                    padding: '10px',
                    paddingLeft: '20px',
                    width: 280,
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Confirm New Password</span>
              </label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='password'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Confirm New Password'
                  style={{
                    border: '2px solid #d3d3d3',
                    borderRadius: '10px',
                    padding: '10px',
                    paddingLeft: '20px',
                    width: 280,
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button
              type='button'
              className='btn btn-success'
              style={{ background: "#327113" }}
              onClick={onSubmit}
              disabled={loading}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
