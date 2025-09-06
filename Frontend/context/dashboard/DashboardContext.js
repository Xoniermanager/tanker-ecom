"use client"
import {createContext, useContext} from 'react'


const DashboardContext = createContext()


const useDashboard = ()=>  useContext(DashboardContext);

export {useDashboard, DashboardContext}