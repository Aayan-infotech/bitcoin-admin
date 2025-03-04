import React from 'react'

const Header = ({title}) => {
  return (
    <div className='mb-2'>
        <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
        </div>
    </div>
  )
}

export default Header
