"use client"
import {createContext, useContext} from "react"


const SiteContext = createContext();

const useSite = ()=>useContext(SiteContext)

export {SiteContext, useSite}