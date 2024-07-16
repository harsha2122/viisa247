import Accordion from 'react-bootstrap/Accordion';
import { KTIcon } from '../../_metronic/helpers';
import { Link } from 'react-router-dom';

type Props = {
  data: any[];
}

const parseDuration = (duration) => {
  if (duration.includes('months')) {
    return duration;
  } else {
    return `${duration} days`;
  }
};

const parseTime = (time) => {
  if (time.includes('months' && 'week')) {
    return time;
  } else {
    return `${time} days`;
  }
};

function VisasTable({ data }: Props) {
  return (
    <>
    <section style={{ border: "1px solid #adc6a0" }} className='w-100 card my-5 '>
      <div style={{ borderBottom: "1.5px solid #327113" }} className='card-header'>
        <h3 className='card-title align-content-start flex-row'>
          <span className='card-label text-gray-600 fw-bold fs-3'>Recent Visas</span>
        </h3>
        <Link
          to='/superadmin/add-country'
          title='Add Visa'
          className='btn btn-bg-light pt-4 d-flex btn-active-color-primary btn-sm my-auto'>
          <KTIcon iconName='pencil' className='fs-3' /> <h5 className='mx-2'>Add Visa</h5>
        </Link>
      </div>
    </section>

      <Accordion>
        {data.map((country, index) => (
          <Accordion.Item key={index} eventKey={index.toString()}>
            <Accordion.Header>{country.country_code}</Accordion.Header>
            <Accordion.Body>
              <table className='table table-row-bordered table-row-gray-300 align-middle gs-0 gy-3'>
                <thead>
                  <tr className='fw-bold '>
                    <th className='min-w-100px'>For Country</th>
                    <th className='min-w-80px'>Description</th>
                    <th className='min-w-80px text-center'>Price</th>
                    <th className='min-w-80px text-center'>B2C Price</th>
                    <th className='min-w-80px text-center'>Retailer Price</th>
                    <th className='min-w-80px text-center'>Partner Price</th>
                    <th className='min-w-80px text-center'>Processing Time</th>
                    <th className='min-w-80px text-center'>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {country.visas.map((visa, visaIndex) => (
                    <tr key={visaIndex}>
                      <td>
                        <a href='#' className='text-center text-gray-600 fw-bold text-hover-primary fs-7'>
                          {country.country_code}
                        </a>
                      </td>
                      <td>
                        <a href='#' className='text-muted text-hover-primary d-block mb-1 fs-7'>
                          {visa.visa_description}
                        </a>
                      </td>
                      <td className='text-center'>
                        ₹ {visa.visa_actual_price ? new Intl.NumberFormat('en-IN').format(Number(visa.visa_actual_price)) : '0'}
                      </td>
                      <td className='text-center'>
                        ₹ {visa.visa_price_b2c ? new Intl.NumberFormat('en-IN').format(Number(visa.visa_price_b2c)) : '0'}
                      </td>
                      <td className='text-center'>
                        ₹ {visa.visa_price_retailer ? new Intl.NumberFormat('en-IN').format(Number(visa.visa_price_retailer)) : '0'}
                      </td>
                      <td className='text-center'>
                        ₹ {visa.visa_price_partner ? new Intl.NumberFormat('en-IN').format(Number(visa.visa_price_partner)) : '0'}
                      </td>
                      <td className='text-center'>
                        {parseTime(visa.visa_processing_time)}
                      </td>
                      <td className='text-center'>
                        {parseDuration(visa.visa_duration)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}

export default VisasTable;
