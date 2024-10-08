import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ClearIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../helpers/axiosInstance';
import toast, {Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import qr from '../../../_metronic/assets/card/qr.png';
import PackageApply from '../../modules/wizards/components/PackageApply';
import { FaFacebook } from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";

type Props = {
  packageData: any;
}

const Booking = ({ }: Props) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { packageData }: any = location.state || {};
  useEffect(() => {}, [packageData]);
  const [selectedShare, setSelectedShare] = useState('');
  const passportFrontFileInputRef = useRef<HTMLInputElement | null>(null);
  const recieptFileInputRef = useRef<HTMLInputElement | null>(null);
  const [passportFrontImageURL, setPassportFrontImageURL] = useState('');
  const [reciept, setReciept] = useState('');
  const maxSize = 1024 * 1024;
  const [formDataArray, setFormDataArray] = useState<any[]>([{}]);
  const [formData, setFormData] = useState({
    name: '',
    email:'',
    phone:'' ,
    passFrontPhoto: '',
    passBackPhoto: '',
    travelerPhoto: '',
    reciept:'',
  });

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await axiosInstance.post('/backend/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = response.data.url;
      setLoading(false);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      return '';
    }
  }

  const handleRecieptSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        toast.error('File size exceeds the limit of 1MB.', {
          position: 'top-center',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target) {
          setReciept(e.target.result as string);
          try {
            const imageLink = await handleFileUpload(file);
            setFormData({ ...formData, reciept: imageLink });
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
      }
      reader.readAsDataURL(file);
    }
  };

  const handleRecieptUpload = () => {
    if (recieptFileInputRef.current) {
      recieptFileInputRef.current.click();
    }
  }

  const toggleMenu = () => {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
      mobileMenu.classList.toggle('hamburger-open');
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        package_id: packageData._id,
        package_name: packageData.packageName,
        package_cost: packageData.cost_per_person * formDataArray.length,
        traveller_details: formDataArray,
        package_payment_receipt: formData.reciept,
      };
      const response = await axiosInstance.post('/backend/apply_package', payload);
      toast.success('Applied successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };


  return (
    <div>
      <Toaster />
              <div id="nav1">
        <a href='/' className="part11">
            <img className="logo" src="./media/logos/logo.png" alt="logo" />
        </a>

        <div className="part21">
        </div>

        <i className="ri-menu-3-fill hamburger" onClick={toggleMenu}></i>
        <div id="mobile-menu">
            <a href="#">Home</a>
            <a href="#">Sign up</a>
            <a href="#">Login</a>
        </div>
        </div>
      <div className="d-flex justify-content-start px-10" >
        <Formik
          initialValues={{}}
          onSubmit={() => {}}
        >
          {() => (
            <Form className='py-5 mt-10 px-10 px-auto w-100  d-flex flex-row flex-wrap' noValidate id={`kt_create_account_form`}>
              <>
                <div className='w-100 d-flex'>
                  <div style={{borderRight:"1px solid"}} className='w-100 d-flex flex-column' >
                    <h1 className='my-5'>Traveler</h1>
                    {formDataArray.map((traveler, index) => (
                      <div key={index}>
                        <PackageApply onDataChange={(newData) => {
                          const updatedArray = [...formDataArray];
                          updatedArray[index] = newData;
                          setFormDataArray(updatedArray);
                        }} />
                        {index > 0 && (
                          <div className="d-flex justify-content-end my-4">
                            <button
                              className='btn btn-danger' 
                              style={{ right: '30px', position:"relative", color:"#fff", background:"red" }}
                              onClick={() => {
                                const updatedArray = [...formDataArray];
                                updatedArray.splice(index, 1);
                                setFormDataArray(updatedArray);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <hr
                      style={{
                        width: '90%',
                        borderTop: '2px dashed #327113',
                        borderBottom: '1px solid transparent',
                        margin: '10px',
                      }}
                    />
                    <div className='d-flex justify-content-end my-4 w-100'>
                    <button
                    className='btn' 
                    style={{ background:"transparent", position:"relative", color:"#327113", border:"1px solid #327113", right:"20px"}}
                    onClick={() => setFormDataArray([...formDataArray, {}])}
                  >
                    + Add Traveler
                  </button>

                    </div>
                  </div>
                  <div style={{alignItems:"center"}} className='d-flex flex-column w-50 my-8 justify-content-start'>
                    <div className='d-flex flex-column align-items-center gap-4 w-100 '>
                    <h3 className='mx-2'>Price to Pay - <span style={{color:"#327113"}}>₹ {new Intl.NumberFormat('en-IN').format(Number(packageData.cost_per_person) * formDataArray.length)}</span></h3>
                      <img width="200px" src={qr} alt="qr-code" />
                    </div>
                    <div style={{ width: '60%', marginLeft:"25px", marginTop:"30px"}}>
                      <h6 className='required'>Reciept</h6>
                      {loading ? (
                        <div style={{color:"#000"}}>Loading...</div>
                      ) : (reciept ? (
                        <div
                          style={{
                            border: '4px dotted gray',
                            width:"100%",
                            height: 200,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                        >
                          <div
                            onClick={() => setReciept('')}
                            style={{
                              justifyContent: 'flex-end',
                              position: 'relative',
                              backgroundColor: 'white',
                              padding: 7,
                              borderRadius: 50,
                              left: "10px",
                              width:"35px",
                              zIndex:"1",
                              cursor: 'pointer',
                            }}
                          >
                            <ClearIcon style={{ color: 'red' }} />
                          </div>
                          <img src={reciept} alt='Uploaded Image' style={{ maxWidth: '100%', maxHeight: '100%', position:"relative", marginTop:"-35px" }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            border: '4px dotted gray',
                            width:"100%",
                            height: 200,
                            borderRadius: '10px',
                            justifyContent: 'center',
                            textAlign: 'center',
                            marginTop: 20,
                          }}
                        >
                          <h4 className='mx-10 mt-10'>Reciept Photo</h4>
                          <button
                            type='button'
                            onClick={handleRecieptUpload}
                            className='btn btn-lg btn-success me-3 mt-7'
                            style={{ justifyContent: 'flex-end', backgroundColor: '#327113' }}
                          >
                            <span className='indicator-label'>Select Files</span>
                          </button>
                          <p className='text-bold pt-5 fs-9' style={{ color: '#555555' }}>
                            Supports Image only.
                          </p>
                          <input
                            type='file'
                            ref={recieptFileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleRecieptSelect}
                          />
                        </div>
                      )
                      )}
                    </div>
                  </div>
                </div>
              </>
              <hr
                style={{
                  width: '100%',
                  borderTop: '2px dashed #327113',
                  borderBottom: '1px solid transparent',
                  margin: '10px',
                }}
              />
              <div className='d-flex justify-content-center mt-8 w-100'>
                <button
                  type='submit'
                  className='btn'
                  onClick={handleSubmit}
                  style={{ background:"#327113", marginLeft:"-40px", color:"#fff"}}
                >
                  Submit Application
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>  
      <footer className="footer-seci">
            <img className="footer-bg" src="./media/assets/footer.png" alt=""/>
            <div className="mains">
              <div className="logo rowse">
                  <div className="footer-header">
                    <img src="./media/assets/logo3.png" className="manik" alt=""/>
                  </div>
                  <div className="logo-des">
                    <p>Visa247 facilitates seamless<br/> Visa online instantly..</p>
                    <div className="icons">
                        <a href="#"><i className="social-icon ri-facebook-fill"></i></a>
                        <a href="#"><i className="social-icon ri-instagram-line"></i></a>
                        <a href="#"><i className="social-icon ri-linkedin-fill"></i></a>
                        <a href="#"><i className="social-icon ri-infinity-fill"></i></a>
                    </div>
                  </div>
              </div>
            
              <div className="office rowse">
                  <div className="footer-header">
                      <h3>Company</h3>
                      </div>                   
                      <div className="link-des">
                      <a href="/privacy-policy" className="footer-links">Privacy Policy</a>
                      <a href='/terms-and-conditions' className="footer-links">Terms & Conditions</a>
                  </div>
              </div>
            
            
              <div className="link rowse">
              </div>
            
            
              <div className="newsletter rowse">
                  <div className="footer-header">
                    <h3 >Social Links</h3>
                  </div>
                  <div className="social-icons-btn">
                    <a className="iconss twitter"  href="#">
                        <AiOutlineTwitter name="logo-twitter"/>
                    </a>
                    <a className="iconss facebook"  href="#">
                        <FaFacebook name="logo-facebook"/>
                    </a>
                    <a className="iconss instagram"  href="#">
                        <AiFillInstagram  name="logo-instagram"/>
                    </a>
                </div>
              </div>
            
            </div>
            <div className="copyright">
              <hr/>
              <p>Copyright @ Visa247 2023. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
  );
}

export default Booking;
