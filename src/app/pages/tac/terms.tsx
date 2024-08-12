import React from 'react';
import '../landing/home.css'
import tac from '../../../_metronic/assets/card/tac.png'
import { FaFacebook } from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";

const Terms: React.FC = () => {
    const toggleMenu = () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
          mobileMenu.classList.toggle('hamburger-open');
        }
      };
    
      const search = () => {;
      };

  return (
    <>
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

        <div className='tac-conti1' >
            <div className="box">
                <div className="box1">
                    <img className='taci' src={tac} alt='tac'  />
                </div>
                <div className="box2">
                    <h1 style={{fontSize:"2.5vw"}}>Welcome to Visa 247. Before using our services, we kindly ask you to review our terms and conditions outlined below:</h1>
                </div>
            </div>
            
        </div>

        <div className="tac-conti1">
            <div className='box' >
                <div className="box1">
                    <h2>Application Process:</h2>
                    <p>Visa applications are subject to the rules and regulations of the respective embassies, consulates, or visa issuing authorities. Visa 247 acts as an intermediary between the applicant and the relevant authorities, facilitating the application process. The final decision on visa issuance rests with the respective authorities.</p>
                </div>

                <div className="box2">
                    <h2>Accuracy of Information:</h2>
                    <p>It is the responsibility of the applicant to provide accurate and truthful information during the application process. Visa 247 is not liable for any consequences arising from inaccuracies or omissions in the information provided by the applicant.</p>
                </div>
            </div>

            <div className='box' >
                <div className="box1">
                    <h2>Privacy and Security:</h2>
                    <p>Visa 247 is committed to protecting the privacy and security of your personal information. We employ industry-standard security measures to safeguard your data. By using our services, you consent to the collection and processing of your information in accordance with our privacy policy.</p>
                </div>

                <div className="box2">
                    <h2>Service Fees:</h2>
                    <p>Our service fees cover the assistance and support provided throughout the visa application process. These fees are separate from any visa fees imposed by the relevant authorities. Visa 247 reserves the right to modify service fees, and any changes will be communicated in advance.</p>
                </div>
            </div>

            <div className='box' >
                <div className="box1">
                    <h2>Payment Terms:</h2>
                    <p>Payment for our services must be made in full at the time of application. Visa 247 accepts various payment methods, and details will be provided during the application process. Failure to complete payment may result in the delay or cancellation of the application.</p>
                </div>
                <div className="box2">
                    <h2>Refund Policy:</h2>
                    <p>Refunds are subject to the terms and conditions set by the relevant embassies, consulates, or visa issuing authorities. Visa 247 will process refunds in accordance with these policies. Service fees are non-refundable once the application process has been initiated.</p>
                </div>
            </div>

            <div className='box' >
                <div className="box1">
                    <h2>Communication:</h2>
                    <p>Visa 247 will communicate with applicants primarily through the contact information provided during the application process. It is the applicant's responsibility to ensure that the provided contact details are accurate and regularly monitored.</p>
                </div>
                <div className="box2">
                    <h2>Changes to Terms and Conditions:</h2>
                    <p>Visa 247 reserves the right to update or modify these terms and conditions at any time. Any changes will be effective immediately upon posting on our website. We recommend reviewing the terms periodically to stay informed.</p>
                </div>
            </div>

            <div className='box' >
                <div className="box1">
                    <h2>Governing Law:</h2>
                    <p>These terms and conditions are governed by the laws of the jurisdiction where Visa 247 is registered. Any disputes arising from the use of our services will be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
                </div>
            </div>

            <p style={{display:"flex", width:"55%", justifyContent:"center", alignItems:"center", margin:"0 auto"}}>By using Visa 247's services, you agree to comply with these terms and conditions. If you have any questions or concerns, please contact our customer support team for assistance. Thank you for choosing Visa 247 for your visa needs.</p>
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
    </>
  );
};

export default Terms;
