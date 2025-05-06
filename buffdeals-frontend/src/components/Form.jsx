import React from 'react'

const Form = () => {

    
    return(
        <section className='flex flex-col items-center justify-center w-full px-10 mt-24'>
            <div className='flex items-center justify-evenly h-auto mt-16'>
                <form className='mx-auto w-100 flex flex-col justify-center items-center border border-gray-300 py-15 px-4 rounded-md'>
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='supplement'> Supplement</label>
                        <input className='border border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='supplement' name='supplement' type='text' required placeholder='whey protein'/>
                    </div>
                
                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='weight'>Weight (lbs)</label>
                        <input className='border border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='weight' name='weight' type='number' min={0}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='min-price'>Min Price</label>
                        <input className='border border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='min-price' name='min-price' type='number' min={0}/>
                    </div>

                    <div className='mb-5 w-10/12'>
                        <label className='block text-xl mb-2' for='max-price'>Max Price</label>
                        <input className='border border-gray-300 bg-gray-100 rounded-lg p-2 w-full text-black' id='max-price' name='max-price' type='number' min={0}/>
                    </div>
                    
                    <div className='mb-5 flex justify-between items-center w-10/12'>
                        <label className='text-xl' for='vegan'>Vegan</label>
                        <input className='w-5 h-5' id='vegan' type="checkbox" name='vegan' value='Vegan'/>
                    </div>

                    <div className='mb-5 flex justify-between items-center w-10/12'>
                        <label className='text-xl' for='isolate'>Isolate</label>
                        <input className='w-5 h-5' id='isolate' type="checkbox" name='isolate' value='Isolate'/>
                    </div>
                    

                    <input className='border border-gray-300 bg-[#49FCFC] text-center text-2xl text-black font-bold py-2 px-7 rounded-xl cursor-default shadow-sm transition hover:opacity-80' type='submit' value='Search'/>
                </form>

                <div>
                <img>
                </img>
                </div>
                
            </div>
        </section>
    )
}

export default Form