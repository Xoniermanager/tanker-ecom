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

const Counter = () => {
  return (
    <div
      style={{ backgroundImage: "url('/images/counter-bg.jpg')" }}
      className='w-full py-22 pb-18 flex items-center bg-cover bg-center'
    >
      <div className="max-w-7xl mx-auto flex gap-12 items-start w-full">
        <CounterItem end={99}  suffix="%+" label="Delivery on time" />
        <CounterItem end={500} suffix="+" label="Custom Tankers Delivered" />
        <CounterItem end={100} suffix="+" label="Years of Combined Industry Experience" />
        <CounterItem end={2} suffix="+ " label="Fully Equipped Facilities" />
      </div>
    </div>
  );
};

export default Counter;
