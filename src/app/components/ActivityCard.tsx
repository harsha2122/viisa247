type Props = {
    className: string
    description: string
    color: string
    icon: string
    textColor: string
    count: number | string
}

const ActivityCard = ({ className, description, color, icon, textColor, count }: Props) => (
    <div
        className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
        style={{
            backgroundColor: color,
            height: '150px',
        }}
    >
        <div className="d-flex flex-row">
            <img src={icon} style={{ width: 50, position: 'absolute', left: 20, top: 20 }} />
            <span className=' opacity-75 pt-1 fw-semibold fs-6' style={{ color: textColor,position:'absolute',top:'30px',left:'85px'}}>
                {description}{' '}
            </span>
        </div>

        <div className='card-header pt-5' style={{ position: 'absolute', bottom: 10 }}>
            <div className='card-title d-flex flex-column align-items-baseline'>
                <span className='fw-bold  me-2 lh-1 ls-n2' style={{ fontSize: '35px', color: textColor }}>
                    {' '}
                    {description === ('Payments Processed' || 'Visa 247 Wallet Balance') ? <>₹{' '}</> : null}
                    {count}
                </span>

            </div>
        </div>
    </div>
)
export { ActivityCard }
