"use client";
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const CounterItem = ({ end, suffix = '', label }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,  
    threshold: 0.3,
       
  });

  return (
    <div className='flex flex-col items-center gap-3 w-full' ref={ref}>
      <h3 className='text-6xl font-black tracking-wide'>
        {inView ? <CountUp start={0} end={end} duration={2} /> : 0}{suffix}
      </h3>
      <p className='capitalize text-lg font-medium text-center'>{label}</p>
    </div>
  );
};

const Counter = ({counterData}) => {
  const data = counterData?.contents?.sort((a,b)=>a.order - b.order)
  return (
    <div
      style={{ backgroundImage: "url('/images/bg_08.jpg')" }}
      className='w-full py-20 pb-18 flex items-center bg-cover bg-center'
    >
      <div className="max-w-7xl mx-auto flex gap-12 items-start w-full">
       {data?.map((item, i)=>(
          <CounterItem end={item.contents.find(item=>item.label === "Number").text}  suffix={item.contents.find(item=>item.label === "Number").suffix} label={item.contents.find(item=>item.label === "Text").text} key={i}/>

        ))}
      </div>
    </div>
  );
};

export default Counter;
