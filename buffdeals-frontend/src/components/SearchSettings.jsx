import React from 'react'

const SearchSettings = (props) => {
    if (!props.open) {
        return null
    } else {
        return( 
            <>
                <div className='fixed top-0 right-0 left-0 bottom-0 bg-black opacity-30 z-1000' onClick={props.onClose}></div>
                <div className='w-80 h-105 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-1100 flex flex-col items-center justify-center'>
                    <div className='absolute top-3 right-3 cursor-pointer text-base' onClick={props.onClose}>✖</div>
                    <h2 className='text-lg font-semibold mb-4 mt-6'>Search Settings</h2>
                    <div className='flex flex-col w-10/12'>
                        <label className='mb-2'>Min Price</label>
                        <input id='min_price' type='number' step="0.01" min={0} max={1000} defaultValue={props.minPrice} className='border border-gray-300 p-2 rounded-md mb-4 focus:outline-none' />
                        <label className='mb-2'>Max Price</label>
                        <input id='max_price' type='number' step="0.01" min={0} max={1000} defaultValue={props.maxPrice || ''} className='border border-gray-300 p-2 rounded-md mb-4 focus:outline-none' />
                        <div className='flex items-center justify-between gap-0.5 mb-6'>
                            <label className=''>Vegan Only</label>
                            <input className='p-15 h-5 w-5' id='vegan_only' type='checkbox' defaultChecked={props.veganOnly} />
                        </div>
                        
                    </div>
                    <button onClick={() => props.submit(document.getElementById('min_price').value, document.getElementById('max_price').value, document.getElementById('vegan_only').checked)} className='bg-[#40A9EA] text-white px-3 py-1 rounded-md cursor-pointer'>Apply</button>
                </div>
            </>
        )
    }
}

export default SearchSettings