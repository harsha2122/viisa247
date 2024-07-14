import React, { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../_metronic/helpers';
import Cookies from 'js-cookie';

type Plan = {
  age_group: string;
  description: string;
  benefits: { key: string; value: string }[];
  retailer: {
    _id: string;
    base_price: string;
    price_per_day: string;
  };
};

type Insurance = {
  _id: string;
  insurance_description: string;
  insurance_base_price: string;
  insurance_per_day_price: string;
  nationality_code: string;
  country_code: string;
  plans: {
    platinum: Plan[];
    gold: Plan[];
    silver: Plan[];
  };
  issue_date: string;
  expiry_date: string;
};

type Props = {
  className: string;
  title: string;
  show: (value: boolean) => void;
  visaList: boolean;
  visaListLoader: (value: boolean) => void;
  apiData: {
    issue_date: string;
    expiry_date: string;
    insuranceData: Insurance[];
  };
  manualValue: any;
  onSelectClick: (entryData: {
    id: string;
    totalAmount: number;
    issueDate: string;
    expiryDate: string;
    country_code: string;
    nationality_code: string;
    insurance_original_amount: number;
    age_group: string;
    benefits: { key: string; value: string }[];
    description: string;
    merchant_insurance_amount: number; // new property for amount with markup
  }) => void;
};

const InsuranceTablec: React.FC<Props> = ({
  className,
  title,
  show,
  visaList,
  visaListLoader,
  apiData,
  manualValue,
  onSelectClick,
}) => {
  const [activeTab, setActiveTab] = useState<string>('platinum');
  const [insurancePlans, setInsurancePlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [proceedClicked, setProceedClicked] = useState<boolean>(false);

  const backgroundImages = [
    '/media/svg/shapes/abstract-1.svg',
    '/media/svg/shapes/abstract-2.svg',
    '/media/svg/shapes/abstract-3.svg',
    '/media/svg/shapes/abstract-4.svg',
  ];

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSelectInsurance = (planId: string) => {
    if (!proceedClicked) {
      setSelectedPlanId(planId);
    }
  };

  const handleProceed = () => {
    if (selectedPlanId) {
      setProceedClicked(true);

      const selectedPlan = insurancePlans.find(plan => plan.retailer._id === selectedPlanId);
      if (selectedPlan) {
        const selectedInsurance = apiData.insuranceData.find(insurance =>
          insurance.plans[activeTab as keyof typeof insurance.plans]?.some(plan => plan.retailer._id === selectedPlanId)
        );

        if (selectedInsurance) {
          const { totalPrice } = calculatePrice(
            parseFloat(selectedPlan.retailer.base_price),
            parseFloat(selectedPlan.retailer.price_per_day),
            apiData.issue_date,
            apiData.expiry_date
          );

          const { totalInsurancePrice } = calculateInsurancePrice(
            parseFloat(selectedInsurance.insurance_base_price),
            parseFloat(selectedInsurance.insurance_per_day_price),
            apiData.issue_date,
            apiData.expiry_date
          );

          const totalPriceWithMarkup = calculateretailerPrice(totalPrice);

          onSelectClick({
            id: selectedPlanId,
            totalAmount: totalPrice,
            merchant_insurance_amount: totalPriceWithMarkup,
            issueDate: apiData.issue_date,
            expiryDate: apiData.expiry_date,
            country_code: selectedInsurance.country_code,
            nationality_code: selectedInsurance.nationality_code,
            benefits: selectedPlan.benefits,
            description: selectedPlan.description,
            insurance_original_amount: totalInsurancePrice,
            age_group: selectedPlan.age_group,
          });
        }
      }
    } else {
      console.warn("No insurance plan selected!");
    }
  };

  const getRandomBackgroundImage = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  };

  useEffect(() => {
    if (apiData.insuranceData.length > 0) {
      const plans = apiData.insuranceData.flatMap(insurance => insurance.plans[activeTab as keyof typeof insurance.plans]);
      setInsurancePlans(plans);
    }
  }, [apiData, activeTab]);

  const calculatePrice = (basePrice: number, pricePerDay: number, issueDate: string, expiryDate: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const issueDateObj = new Date(issueDate);
    const expiryDateObj = new Date(expiryDate);

    if (isNaN(issueDateObj.getTime()) || isNaN(expiryDateObj.getTime())) {
      return { totalPrice: basePrice, days: 0 };
    }

    const diffDays = Math.round(Math.abs((expiryDateObj.getTime() - issueDateObj.getTime()) / oneDay)) + 1;

    const baseDays = 7;
    const additionalPricePerDay = pricePerDay;

    if (diffDays <= baseDays) {
      return { totalPrice: basePrice, days: diffDays };
    } else {
      const extraDays = diffDays - baseDays;
      const additionalCost = extraDays * additionalPricePerDay;
      const totalPrice = basePrice + additionalCost;
      return { totalPrice, days: diffDays };
    }
  };

  const calculateInsurancePrice = (basePrice: number, pricePerDay: number, issueDate: string, expiryDate: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const issueDateObj = new Date(issueDate);
    const expiryDateObj = new Date(expiryDate);

    if (isNaN(issueDateObj.getTime()) || isNaN(expiryDateObj.getTime())) {
      return { totalInsurancePrice: basePrice, days: 0 };
    }

    const diffDays = Math.round(Math.abs((expiryDateObj.getTime() - issueDateObj.getTime()) / oneDay)) + 1;

    const baseDays = 7;
    const additionalPricePerDay = pricePerDay;

    let totalInsurancePrice = basePrice;

    if (diffDays > baseDays) {
      const extraDays = diffDays - baseDays;
      const additionalCost = extraDays * additionalPricePerDay;
      totalInsurancePrice += additionalCost;
    }

    return { totalInsurancePrice, days: diffDays };
  };

  const calculateretailerPrice = (price: number) => {
    const markupPercentageString = localStorage.getItem('markup_percentage') ?? '1';
    const markupPercentage = parseFloat(markupPercentageString);
    return Math.round(price * (1 + markupPercentage / 100));
  };

  return (
    <div className='pb-8'>
      <div className="container">
        {apiData.insuranceData.map((insurance: Insurance) => (
          <div key={insurance._id}>
            <div className="age-group-tabs">
              <h1>
                {insurance.insurance_description} from {insurance.nationality_code} to {insurance.country_code}
              </h1>
            </div>
            <div className="d-flex best-tab justify-content-center my-8 gap-4">
              {Object.keys(insurance.plans).map((planType: string) =>
                ['platinum', 'gold', 'silver'].includes(planType) ? (
                  <button
                    key={planType}
                    className={`age-group-tab capitalize ${activeTab === planType ? 'active' : ''}`}
                    onClick={() => handleTabChange(planType)}
                  >
                    {planType}
                  </button>
                ) : null
              )}
            </div>
            <div className="row">
              {(insurance.plans[activeTab as keyof typeof insurance.plans] || []).map((plan: Plan, index: number) => (
                <div
                  key={`${insurance._id}-${plan.retailer._id}`}
                  className={`col-md-4`}
                  onClick={() => handleSelectInsurance(plan.retailer._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    style={{
                      backgroundPosition: 'right top',
                      backgroundSize: '30% auto',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                      border: selectedPlanId === plan.retailer._id ? '3px solid #327113' : '0.5px solid #dadada',
                    }}
                    className={`mb-xl-8 pricing-table purple ${activeTab} ${selectedPlanId === plan.retailer._id ? 'selected' : ''}`}
                  >
                    <div className="pricing-label">{plan.description}</div>
                    <div className="pricing-details">
                      <h2>{plan.age_group}</h2>
                      <div className="pricing-features">
                        {plan.retailer && (
                          <>
                            <div className="feature">
                              Total Price: <span>₹{Cookies.get('user_type') === 'retailer'
                            ? Math.round(calculateretailerPrice(
                              calculatePrice(
                                parseFloat(plan.retailer.base_price),
                                parseFloat(plan.retailer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice
                            ))
                            : calculatePrice(
                                parseFloat(plan.retailer.base_price),
                                parseFloat(plan.retailer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice}</span>
                            </div>
                            <div className="feature">
                              Days: <span>{calculatePrice(
                                parseFloat(plan.retailer.base_price),
                                parseFloat(plan.retailer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).days}</span>
                            </div>
                            <hr className='aahr' />
                            <div className="feature">
                              <h4>Benefits :</h4>
                              <ul className='d-flex flex-column gap-2'>
                                {plan.benefits.map((benefit, index) => (
                                  <li key={index}>
                                    <strong>{benefit.key}:</strong> <span>{benefit.value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="price-tag">
                        <span className="symbol">₹</span>
                        <span className="amount">
                        {Cookies.get('user_type') === 'merchant'
                            ? Math.round(calculateretailerPrice(
                              calculatePrice(
                                parseFloat(plan.retailer.base_price),
                                parseFloat(plan.retailer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice
                            ))
                            : calculatePrice(
                                parseFloat(plan.retailer.base_price),
                                parseFloat(plan.retailer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {selectedPlanId && !proceedClicked && (
          <div className="proceed-button">
            <button onClick={handleProceed}
              style={{
                borderRadius: 5,
                backgroundColor: '#327113',
                border: "none",
                color: "white",
                height: "40px",
                width: "100px",
                fontSize: "16px",
              }}>
              Proceed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { InsuranceTablec };
