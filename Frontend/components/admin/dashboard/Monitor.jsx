import Image from 'next/image'
import React from 'react'

const Monitor = () => {
  return (
    <>
      <div className='w-full flex-col flex gap-4'>
        <h2 className='text-2xl font-semibold'>Activity Overview</h2>
        <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015]">
                <Image src={'/images/truck-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Delivered</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>15 new packages</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div className={`absolute left-0 bg-purple-700 w-[25%] z-10 h-1`}></div>
                </div>
                </div>

            </div>
            <div className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015]">
                <Image src={'/images/order-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Ordered</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>72 new packages</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div className={`absolute left-0 bg-orange-400 w-[75%] z-10 h-1`}></div>
                </div>
                </div>

            </div>
            <div className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015]">
                <Image src={'/images/report-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Reported</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>50 Support New Cases</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div className={`absolute left-0 bg-cyan-400 w-[55%] z-10 h-1`}></div>
                </div>
                </div>

            </div>
            <div className="bg-white rounded-2xl p-6 px-8 w-full flex flex-col items-center justify-center shadow-[0_0_8px_#00000015]">
                <Image src={'/images/arrived-gif.gif'} height={85} width={85} alt='truck'/>
                <div className='flex flex-col gap-3 items-center w-full'>

                <h3 className='text-lg font-semibold'> Arrived</h3>
                <span className='text-sm text-gray-500 capitalize font-medium pb-1'>34 Upgraded Boxed</span>

                <div className="h-1 bg-gray-300 w-full rounded-full relative overflow-hidden">
                    <div className={`absolute left-0 bg-purple-700 w-[25%] z-10 h-1`}></div>
                </div>
                </div>

            </div>

        </div>

      </div>
    </>
  )
}

export default Monitor
