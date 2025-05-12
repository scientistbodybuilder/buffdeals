import React from 'react'

const Card = (props) => {
    return(
        <div className='shadow-md rounded-lg h-24 w-full px-6 py-2 border border-gray-300 cursor-pointer flex items-center justify-between hover:bg-gray-100'>
            <a href={props.url} target='_blank' className='w-full flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>{props.supplement_name}</h1>
                {props.sizes.length==1 && (<div className='flex flex-col items-center justify-evenly gap-2'>
                    <p className='text-base'>{props.brand}</p>
                    <p className='text-base'>{props.sizes[0]['price']}</p>
                    <p className='text-base'>{props.sizes[0]['size']}</p>
                </div>)}
                {props.sizes.length > 1 && (<div className='flex flex-col items-center justify-evenly gap-2'>
                    <p className='text-base'>{props.brand}</p>
                    <p className='text-base'>{props.sizes[0]['price']}</p>
                    <p className='text-sm'>{props.sizes[0]['size']} (More sizes)</p>
                </div>)}
            </a>
            

        </div>
    )
}

export default Card