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
    className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
    style={{
      backgroundColor: "#e7fddd",
      height: '140px',
      width:"100%",
      marginTop:"-10px"
    }}
  >
    <Link to={too ? too : '/dashboard'} title="See More" >
      <RxDotsHorizontal style={{
        position:'absolute',
        top:0,
        right:10,
        fontSize:30,
        color:"#327113"
      }}/>
    </Link>
    <img src={icon} style={{ width: 50, position: 'relative', left: "7%", top: "6%", filter: "contrast(130%) drop-shadow(5px 5px 5px #c1d4b8)" }} />
    <div className='card-header pt-5 d-flex align-items-center justify-content-center' style={{position: 'relative', bottom: 5}}>
      <div className='card-title d-flex flex-column align-items-baseline'>
        
        <span className='fw-bold  me-2 lh-1' style={{fontSize: '22px', color: textColor, marginTop:"0px"}}>
          {' '}
          <img style={{ width: 30, marginLeft:-25, marginRight:5}} src={analytics}/>{description === 'Total transactions' || description === 'Revenue generated' ? <>₹{' '}</> : null}
          {count}
        </span>
        <span className=' opacity-75 pt-1 fw-semibold fs-6' style={{color: textColor, justifyContent:"center", alignItems:"center !important", marginTop:"0px"}}>
          {description}{' '}
        </span>
      </div>
    </div>
  </div>
)
export {HomeMainCard}
