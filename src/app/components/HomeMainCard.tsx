import { SlGraph } from "react-icons/sl";
import analytics from '../../_metronic/assets/card/stats.svg'
import { RxDotsHorizontal } from "react-icons/rx";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

type Props = {
  className: string
  description: string
  color: string
  too?: string | undefined 
  icon?: string
  textColor: string
  count: number | string
}
const user_type = Cookies.get('user_type');
const HomeMainCard = ({className, description, color, icon, too, textColor, count}: Props) => (
  
  <div
    className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end d-flex flex-row ${className}`}
    style={{
      backgroundColor: "#F4FFEE",
      height: '140px',
      width:"90%",
      border:"1px solid #E4E6E8",
      borderRadius:"30px"
    }}
  >
    <img src={icon} style={{ width: 30, position: 'relative', left: "7%", top: "0%" }} />
    <div className='card-header pt-5 d-flex align-items-center justify-content-center' style={{position: 'relative', bottom: 5, left: 10}}>
      <div className='card-title d-flex flex-column align-items-baseline'>
        <span className=' opacity-75 pt-1 fw-semibold fs-6' style={{color: textColor, justifyContent:"center", alignItems:"center !important", marginTop:"0px"}}>
          {description}{' '}
        </span>
        <span className='fw-bold  me-2 lh-1' style={{fontSize: '22px', color: textColor, marginTop:"10px"}}>
          {' '}
          {description === 'Total transactions' || description === 'Revenue generated' ? <>₹{' '}</> : null}
          {count}
        </span>
      </div>
    </div>
  </div>
)
export {HomeMainCard}
