"use client"
import React, { useState, useEffect } from 'react';
import { IoChevronDown, IoChevronUp, IoDocumentText, IoShield, IoTime, IoWarning } from 'react-icons/io5';
import PageBanner from '../../../../components/user/common/PageBanner';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
    setExpandedSection(index);
    
    // Next.js compatible smooth scroll
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const element = document.getElementById(`section-${index}`);
        if (element) {
          const headerOffset = 100; // Account for any fixed headers
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const sections = [
    {
      title: "Definitions",
      icon: <IoDocumentText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <div className="border-l-4 border-blue-200 pl-4">
            <p className="font-medium text-gray-900">"Company"</p>
            <p className="text-gray-700">means Tanker Solutions Ltd (NZ).</p>
          </div>
          <div className="border-l-4 border-blue-200 pl-4">
            <p className="font-medium text-gray-900">"Client"</p>
            <p className="text-gray-700">refers to the individual or entity placing an order for design, manufacture, maintenance, or related services.</p>
          </div>
          <div className="border-l-4 border-blue-200 pl-4">
            <p className="font-medium text-gray-900">"Services"</p>
            <p className="text-gray-700">refers to all services provided by the Company, including design, manufacture, repair, maintenance, testing, calibration, and associated consultancy.</p>
          </div>
          <div className="border-l-4 border-blue-200 pl-4">
            <p className="font-medium text-gray-900">"Deliverables"</p>
            <p className="text-gray-700">means any items, reports, tankers, trailers, parts, or documentation delivered to the Client under the Service Agreement.</p>
          </div>
        </div>
      )
    },
    {
      title: "Scope of Agreement",
      icon: <IoShield className="w-5 h-5" />,
      content: (
        <p className="text-gray-700 leading-relaxed">
          These Terms & Conditions govern all Contracts between the Company and the Client. They apply to all quotations, orders, and provision of Services and Deliverables unless otherwise agreed in writing.
        </p>
      )
    },
    {
      title: "Quotations and Orders",
      icon: <IoDocumentText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">Quotations are valid for <span className="font-medium text-gray-900">30 days</span> unless otherwise specified.</p>
          <p className="text-gray-700">A contract comes into existence once the Company issues an order confirmation in writing following receipt of the Client's order.</p>
        </div>
      )
    },
    {
      title: "Price and Payment Terms",
      icon: <IoTime className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <IoWarning className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Payment Requirements</p>
                <ul className="mt-2 text-yellow-700 space-y-1">
                  <li>• All prices are in NZD and are exclusive of GST unless stated</li>
                  <li>• Invoices are payable within 30 days of issue</li>
                  <li>• Late payments incur interest at statutory rate plus 2% per annum, compounded monthly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Delivery and Performance",
      icon: <IoTime className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">Delivery dates are estimates only; the Company is not liable for delays beyond its control.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900">Title Transfer</h4>
              <p className="text-blue-800 text-sm mt-1">Title to Deliverables remains with the Company until full payment is received.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900">Risk Transfer</h4>
              <p className="text-green-800 text-sm mt-1">Risk transfers to the Client upon delivery to the transport carrier.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Client Obligations",
      icon: <IoShield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">The Client must provide accurate specifications, site access, and necessary information in a timely manner.</p>
          <p className="text-gray-700">The Client must comply with all applicable laws, regulations, and standards relevant to the Services.</p>
        </div>
      )
    },
    {
      title: "Warranty",
      icon: <IoShield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">12-Month Warranty</h4>
            <p className="text-green-800">The Company warrants that Deliverables will conform to specifications and be free of defects in materials and workmanship for 12 months from delivery.</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Warranty Exclusions</h4>
            <p className="text-red-800 text-sm">This warranty does not apply to wear-and-tear parts, misuse, damage, or unauthorized modifications.</p>
            <p className="text-red-800 text-sm mt-2">The Company's liability is limited to repair or replacement, at its discretion.</p>
          </div>
        </div>
      )
    },
    // {
    //   title: "Limitation of Liability",
    //   icon: <IoWarning className="w-5 h-5" />,
    //   content: (
    //     <div className="space-y-3">
    //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    //         <h4 className="font-medium text-red-900 mb-2">Liability Limits</h4>
    //         <p className="text-red-800 text-sm">To the maximum extent permitted by law, the Company's liability in contract, tort, or otherwise is limited to the contract price.</p>
    //         <p className="text-red-800 text-sm mt-2">The Company is not liable for indirect, incidental, consequential, or special damages (including loss of profits, revenue, or use).</p>
    //       </div>
    //     </div>
    //   )
    // },
    // {
    //   title: "Force Majeure",
    //   icon: <IoWarning className="w-5 h-5" />,
    //   content: (
    //     <div className="space-y-3">
    //       <p className="text-gray-700">Neither party is liable for failure to perform due to events beyond reasonable control, including natural disasters, transport disruptions, strikes, or regulatory changes.</p>
    //       <p className="text-gray-700">Performance time is extended by the duration of any such event.</p>
    //     </div>
    //   )
    // },
    {
      title: "Intellectual Property",
      icon: <IoShield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">All intellectual property rights in specifications, designs, reports, and documentation remain with the Company, unless agreed otherwise in writing.</p>
          <p className="text-gray-700">The Client may not reproduce, distribute, or use such IP beyond the contract's scope without written consent.</p>
        </div>
      )
    },
    {
      title: "Confidentiality",
      icon: <IoShield className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">Each party must maintain the confidentiality of the other's proprietary or sensitive information obtained during the contract.</p>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-800 text-sm">This obligation survives termination for <span className="font-medium">3 years</span>.</p>
          </div>
        </div>
      )
    },
    {
      title: "Termination",
      icon: <IoWarning className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">Either party may terminate if the other materially breaches the contract and fails to remedy it within 14 days of written notice.</p>
          <p className="text-gray-700">Upon termination, the Client pays for all Services rendered to date and returns any Company property.</p>
        </div>
      )
    },
    {
      title: "Governing Law & Dispute Resolution",
      icon: <IoDocumentText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">This Agreement is governed by <span className="font-medium text-gray-900">New Zealand law</span>.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Dispute Resolution Process</h4>
            <ol className="text-gray-700 text-sm space-y-1">
              <li>1. Disputes should first be referred to negotiation</li>
              <li>2. If unresolved within 30 days, disputes will be submitted to arbitration in Wellington under Arbitration Act 1996 rules</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "General Provisions",
      icon: <IoDocumentText className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-700">No waiver of any term is effective unless in writing.</p>
          <p className="text-gray-700">If any provision is invalid or unenforceable, the remainder shall continue in full force.</p>
          <p className="text-gray-700">These Terms supersede any prior terms and may only be amended in writing, signed by both parties.</p>
        </div>
      )
    }
  ];

  return (
    <>
      <PageBanner heading={'Terms & Conditions'}/>
      <div className="max-w-7xl mx-auto py-24 px-6">
        
        {/* Enhanced Quick Navigation */}
        <div className="bg-purple-50/60 rounded-2xl p-8 mb-10 shadow-[0_0_10px_#00000010] border border-purple-100">
          {/* <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <IoDocumentText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent mb-2">
              Quick Navigation
            </h2>
            <p className="text-purple-600 text-lg">Jump to any section instantly</p>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`group relative overflow-hidden text-left px-5 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
                  activeTab === index
                    ? 'bg-purple-950 text-white '
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white  border border-purple-100'
                }`}
              >
                {/* Background Pattern */}
                <div className={`absolute inset-0 opacity-10 ${
                  activeTab === index ? 'bg-white' : 'bg-purple-900'
                }`}>
                  <div className="absolute inset-0 bg-purple-50"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-4 ">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeTab === index
                        ? 'bg-white/20 backdrop-blur-sm border border-white/30'
                        : 'bg-purple-100'
                    }`}>
                      <div className={`transition-all duration-300 ${
                        activeTab === index ? 'text-white scale-110' : 'text-purple-800 group-hover:text-purple-900 group-hover:scale-105'
                      }`}>
                        {section.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold tracking-wider uppercase mb-1 ${
                        activeTab === index ? 'text-purple-100' : 'text-purple-700'
                      }`}>
                        Section {index + 1}
                      </div>
                      <h3 className={`font-semibold text-base leading-tight transition-colors ${
                        activeTab === index ? 'text-white' : 'text-purple-900 group-hover:text-purple-950'
                      }`}>
                        {section.title}
                      </h3>
                    </div>
                  </div>

                  {/* Click to expand indicator */}
                  {/* <div className={`flex items-center space-x-2 text-xs ${
                    activeTab === index ? 'text-purple-100' : 'text-purple-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activeTab === index ? 'bg-purple-200' : 'bg-purple-300'
                    }`}></div>
                    <span>Click to view details</span>
                  </div> */}
                </div>
                
                {/* Active indicator */}
                {activeTab === index && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full border-3 border-white shadow-lg">
                    <div className="w-full h-full bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  activeTab === index 
                    ? 'opacity-100 bg-gradient-to-r from-purple-600/10 to-blue-500/10' 
                    : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/5 to-blue-500/5'
                }`}></div>
              </button>
            ))}
          </div>
          
          {/* Enhanced progress indicator */}
          {activeTab !== null && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              {/* <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-purple-200">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  {sections[activeTab]?.icon && (
                    <div className="text-white text-sm">
                      {sections[activeTab].icon}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                    Currently Viewing
                  </div>
                  <div className="text-sm font-bold text-purple-900">
                    {sections[activeTab]?.title}
                  </div>
                </div>
              </div> */}

              {/* Progress bar */}
              <div className="w-64 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((activeTab + 1) / sections.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-purple-600 font-medium">
                Section {activeTab + 1} of {sections.length}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Terms Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div 
              key={index} 
              id={`section-${index}`}
              className={`bg-white border-2 rounded-xl shadow-sm overflow-hidden transition-all duration-300 relative ${
                activeTab === index 
                  ? 'border-purple-300 shadow-lg ring-2 ring-purple-100' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              {/* Active section indicator */}
              {/* {activeTab === index && (
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
              )} */}

              <button
                onClick={() => toggleSection(index)}
                className={`w-full px-6 py-5 text-left flex items-center justify-between transition-all duration-200 ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                      : 'bg-blue-100 hover:bg-purple-100'
                  }`}>
                    <div className={`transition-colors ${
                      activeTab === index ? 'text-white' : 'text-purple-900'
                    }`}>
                      {section.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors ${
                      activeTab === index ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {index + 1}. {section.title}
                    </h3>
                    {/* <p className={`text-sm mt-1 ${
                      activeTab === index ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      Click to {expandedSection === index ? 'collapse' : 'expand'} section
                    </p> */}
                  </div>
                </div>
                <div className={`transition-all duration-200 ${
                  activeTab === index ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {expandedSection === index ? 
                    <IoChevronUp className="w-6 h-6" /> : 
                    <IoChevronDown className="w-6 h-6" />
                  }
                </div>
              </button>
              
              {expandedSection === index && (
                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                  <div className={`border-t pt-6 ${
                    activeTab === index ? 'border-purple-200' : 'border-gray-100'
                  }`}>
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;