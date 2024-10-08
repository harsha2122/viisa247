
type Props = {
  className: string
  description: string
  color: string
  icon: string
  textColor: string
  count: number
}

const CardsWidget20 = ({className, description, color,icon,textColor, count}: Props) => (
  <div
    className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
    style={{
      backgroundColor: color,
      height: '150px',
      borderRadius:"30px",
    }}
  >
    <img src={icon} style={{width:40,position:"absolute",right:20,top:20}}/>
    <div className='card-header pt-5' style={{position:'absolute',bottom:10}}>
      <div className='card-title d-flex flex-column align-items-baseline'>
        <span className='fw-bold  me-2 lh-1 ls-n2' style={{fontSize:'35px',color:textColor}}>{count}</span>
        <span className=' opacity-75 pt-1 fw-semibold fs-6' style={{color:textColor}}>{description} </span>
      </div>
    </div>
  </div>
)
export {CardsWidget20}
