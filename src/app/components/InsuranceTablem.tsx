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
    platinum: { 
      plan_name: string; 
      age_groups: Plan[];
      base_price: string;  // Is property ko yahan add karein
      actual_price: string; // Is property ko yahan add karein
    },
    gold: { 
      plan_name: string; 
      age_groups: Plan[];
      base_price: string;  // Is property ko yahan add karein
      actual_price: string; // Is property ko yahan add karein
    },
    silver: { 
      plan_name: string; 
      age_groups: Plan[];
      base_price: string;  // Is property ko yahan add karein
      actual_price: string; // Is property ko yahan add karein
    }
  },
  _id: string;
  country_code: string[];
  nationality_code: string;
};

type OnSelectClickData = {
  id: string;
  issueDate: string;
  expiryDate: string;
  country_code: string;
  nationality_code: string;
  age_groups: {
    id: string;
    issueDate: string;
    expiryDate: string;
    country_code: string;
    nationality_code: string;
    benefits: string[];
    description: string;
    age_group: string;
  }[];
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
  onSelectClick: (entryData: OnSelectClickData) => void;  // Updated type
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
    const selectedInsurance = apiData.insuranceData.find(insurance =>
      insurance.plans[activeTab as keyof typeof insurance.plans]?.age_groups
    );
  
    if (selectedInsurance) {
      const selectedPlanData = selectedInsurance.plans[activeTab as keyof typeof selectedInsurance.plans].age_groups.map(plan => {
        const basePrice = parseFloat(plan.customer.base_price);
        const pricePerDay = parseFloat(plan.customer.price_per_day);
        const { totalPrice } = calculatePrice(basePrice, pricePerDay, apiData.issue_date, apiData.expiry_date);
        const basePrices = parseFloat(selectedInsurance.plans[activeTab as keyof typeof selectedInsurance.plans].base_price); // Use selectedInsurance instead of selectedPlan
        const actualPrice = parseFloat(selectedInsurance.plans[activeTab as keyof typeof selectedInsurance.plans].actual_price); // Use selectedInsurance instead of selectedPlan
        const { totalPrice1: insuranceOriginalAmount } = calculatePrice1(basePrices, actualPrice, apiData.issue_date, apiData.expiry_date);
        const merchantOriginalAmount = totalPrice;
  
        return {
          id: plan.customer._id,
          issueDate: apiData.issue_date,
          expiryDate: apiData.expiry_date,
          country_code: selectedInsurance.country_code.join(', '),
          nationality_code: selectedInsurance.nationality_code,
          benefits: plan.benefits,
          description: plan.description,
          age_group: plan.age_group,
          insurance_amount: totalPrice,
          merchant_insurance_amount: merchantOriginalAmount,
          insurance_original_amount: insuranceOriginalAmount
        };
      });
  
      onSelectClick({
        id: selectedInsurance._id,
        issueDate: apiData.issue_date,
        expiryDate: apiData.expiry_date,
        country_code: selectedInsurance.country_code.join(', '),
        nationality_code: selectedInsurance.nationality_code,
        age_groups: selectedPlanData,
      });
    } else {
      console.warn("No insurance plan selected!");
    }
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

  console.log("asd", apiData)

  return (
    <div className="pb-8">
    <div className="container">
      {apiData.insuranceData.map((insurance: InsuranceData, index) => (
        <div key={index}>
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
          <div className="row my-20">
            {(insurance.plans[activeTab as keyof typeof insurance.plans]?.age_groups || []).map((plan: Plan, index: number) => (
              <div key={`${insurance._id}-${activeTab}-${index}`} className="col-md-4">
                <div
                  style={{
                    borderRadius: '40px',
                    padding: '20px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    border: selectedPlanId === plan.customer._id ? '3px solid #327113' : '1px solid #dadada',
                    backgroundColor: '#fff',
                    position: 'relative',
                  }}
                  className={`mb-xl-8 pricing-table ${activeTab} ${selectedPlanId === plan.customer._id ? 'selected' : ''}`}
                >
                  <div className='yop' style={{
                    position: 'absolute',
                    top: '-18px',
                    right: '20px',
                    backgroundColor: '#F1F1F1',
                    padding: '10px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    {plan.description}
                  </div>
                  <div className="pricing-details" style={{ marginTop: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                      {plan.age_group}
                    </h2>
                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000', margin: '30px 0' }}>
                      ₹{Cookies.get('user_type') === 'merchant'
                        ? Math.round((
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
                    </h2>
                    <div className="feature" style={{ fontSize: '16px', marginBottom: '5px' }}>
                      <h3>
                        Total Price:
                      </h3> 
                      <span>₹{Cookies.get('user_type') === 'merchant'
                        ? Math.round((
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
                    <hr 
                      style={{width:"100%", margin:"10px 0px"}}
                    />
                    <div className="feature" style={{ fontSize: '16px', marginBottom: '15px' }}>
                      <h3>Days:</h3> 
                      <span>{calculatePrice(
                        parseFloat(plan.customer.base_price),
                        parseFloat(plan.customer.price_per_day),
                        apiData.issue_date,
                        apiData.expiry_date
                        ).days}
                      </span>
                    </div>
                    <hr 
                      style={{width:"100%", margin:"10px 0px"}}
                    />
                    <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '20px 0px' }}>
                      Benefits:
                    </div>
                    <ul style={{ padding: '0', listStyle: 'none' }}>
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} style={{ fontSize: '14px', marginBottom: '5px' }}>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="btn btn-success btn-block"
              style={{
                backgroundColor: '#3B873E',
                color: '#fff',
                borderRadius: '8px',
                padding: '10px',
                marginTop: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              onClick={handleProceed}
            >
              Proceed
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>


  );
};

export { InsuranceTablem };
