import React, { useState, useEffect } from 'react';
import { toAbsoluteUrl } from '../../_metronic/helpers';
import Cookies from 'js-cookie';

type Plan = {
  age_group: string;
  description: string;
  benefits: string[];
  customer: {
    _id: string;
    base_price: string;
    price_per_day: string;
  };
};

type InsuranceData = {
  plans: {
    platinum: { plan_name: string, age_groups: Plan[] },
    gold: { plan_name: string, age_groups: Plan[] },
    silver: { plan_name: string, age_groups: Plan[] }
  },
  _id: string;
  country_code: string[];
  nationality_code: string;
  insurance_base_price: string;
  insurance_per_day_price: string;
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
    insuranceData: InsuranceData[];
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
    benefits: string[];
    description: string;
    merchant_insurance_amount: number; // new property for amount with markup
  }) => void;
};

const InsuranceTablem: React.FC<Props> = ({
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
    setSelectedPlanId(planId);
  };

  const handleProceed = () => {
    if (selectedPlanId) {
      const selectedPlan = insurancePlans.find(plan => plan.customer._id === selectedPlanId);
      if (selectedPlan) {
        const selectedInsurance = apiData.insuranceData.find(insurance =>
          insurance.plans[activeTab as keyof typeof insurance.plans]?.age_groups.some(plan => plan.customer._id === selectedPlanId)
        );

        if (selectedInsurance) {
          const { totalPrice } = calculatePrice(
            parseFloat(selectedPlan.customer.base_price),
            parseFloat(selectedPlan.customer.price_per_day),
            apiData.issue_date,
            apiData.expiry_date
          );

          const { totalPrice1 } = calculatePrice1(
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
            country_code: selectedInsurance.country_code.join(', '),
            nationality_code: selectedInsurance.nationality_code,
            benefits: selectedPlan.benefits,
            description: selectedPlan.description,
            insurance_original_amount: totalPrice1, // Modify if needed
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
      const plans = apiData.insuranceData.flatMap(insurance => insurance.plans[activeTab as keyof typeof insurance.plans]?.age_groups);
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

  const calculatePrice1 = (basePrice: number, pricePerDay: number, issueDate: string, expiryDate: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const issueDateObj = new Date(issueDate);
    const expiryDateObj = new Date(expiryDate);

    if (isNaN(issueDateObj.getTime()) || isNaN(expiryDateObj.getTime())) {
      return { totalPrice1: basePrice, days: 0 };
    }

    const diffDays = Math.round(Math.abs((expiryDateObj.getTime() - issueDateObj.getTime()) / oneDay)) + 1;

    const baseDays = 7;
    const additionalPricePerDay = pricePerDay;

    if (diffDays <= baseDays) {
      return { totalPrice1: basePrice, days: diffDays };
    } else {
      const extraDays = diffDays - baseDays;
      const additionalCost = extraDays * additionalPricePerDay;
      const totalPrice1 = basePrice + additionalCost;
      return { totalPrice1, days: diffDays };
    }
  };

  const calculateretailerPrice = (price: number) => {
    const markupPercentageString = localStorage.getItem('markup_percentage') ?? '1';
    const markupPercentage = parseFloat(markupPercentageString);
    return Math.round(price * (1 + markupPercentage / 100));
  };

  return (
    <div className='pb-8'>
      <div className="container">
        {apiData.insuranceData.map((insurance: InsuranceData, index) => (
          <div key={index}>
            <div className="age-group-tabs">
              <h1>
                {`Insurance Plan: ${index + 1}`}
              </h1>
            </div>
            <div className="d-flex best-tab justify-content-center my-8 gap-4">
              {Object.keys(insurance.plans).map((planType: string) => {
                  if (['platinum', 'gold', 'silver'].includes(planType)) {
                    return (
                      <button
                        key={planType}
                        className={`age-group-tab capitalize ${activeTab === planType ? 'active' : ''}`}
                        onClick={() => handleTabChange(planType)}
                      >
                        {insurance.plans[planType as keyof typeof insurance.plans].plan_name}
                      </button>
                    );
                  }
                  return null;
                })}
            </div>
            <div className="row">
              {(insurance.plans[activeTab as keyof typeof insurance.plans]?.age_groups || []).map((plan: Plan, index: number) => (
                <div key={`${insurance._id}-${activeTab}-${index}`} className="col-md-4">
                  <div
                    style={{
                      backgroundPosition: 'right top',
                      backgroundSize: '30% auto',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: `url(${toAbsoluteUrl(getRandomBackgroundImage())})`,
                      border: selectedPlanId === plan.customer._id ? '3px solid #327113' : '0.5px solid #dadada',
                    }}
                    className={`mb-xl-8 pricing-table purple ${activeTab} ${selectedPlanId === plan.customer._id ? 'selected' : ''}`}
                  >
                    <div className="pricing-label">{plan.description}</div>
                    <div className="pricing-details">
                      <h2>{plan.age_group}</h2>
                      <div className="pricing-features">
                        {plan.customer && (
                          <>
                            <div className="feature">
                              Total Price: <span>₹{Cookies.get('user_type') === 'merchant'
                            ? Math.round(calculateretailerPrice(
                              calculatePrice(
                                parseFloat(plan.customer.base_price),
                                parseFloat(plan.customer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice
                            ))
                            : calculatePrice(
                                parseFloat(plan.customer.base_price),
                                parseFloat(plan.customer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice}</span>
                            </div>
                            <div className="feature">
                              Days: <span>{calculatePrice(
                                parseFloat(plan.customer.base_price),
                                parseFloat(plan.customer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).days}</span>
                            </div>
                            <hr className='aahr' />
                            <div className="feature">
                              <h4>Benefits:</h4>
                              <ul className='d-flex flex-column'>
                                {plan.benefits.map((benefit, index) => (
                                  <li key={index}>
                                    <h6>{benefit}</h6>
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
                                  parseFloat(plan.customer.base_price),
                                  parseFloat(plan.customer.price_per_day),
                                  apiData.issue_date,
                                  apiData.expiry_date
                                ).totalPrice
                              ))
                            : calculatePrice(
                                parseFloat(plan.customer.base_price),
                                parseFloat(plan.customer.price_per_day),
                                apiData.issue_date,
                                apiData.expiry_date
                              ).totalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-center mt-4">
                      <button
                        className={`btn btn-primary btn-block`}
                        onClick={() => {
                          handleSelectInsurance(plan.customer._id); // Set selected plan ID
                          handleProceed(); // Proceed to select the plan
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { InsuranceTablem };
