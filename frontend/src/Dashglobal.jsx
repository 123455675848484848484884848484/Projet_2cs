import React, { useEffect, useState } from 'react';

const Dashglobal = () => {
    const data = [
        { name: "Site A", value: 10, color: "#3CB371" },
        { name: "Site B", value: 40, color: "#C0392B" },
        { name: "Site C", value: 60, color: "#3CB371" },
      ];
    
      return (
        <div className="p-12 font-[Inter] bg-white min-h-screen">
          {/* Vue globale */}
          <h1 className="text-[64px] font-bold text-[#D45F00]">Vue globale</h1>
          <p className="text-black text-lg mt-2 max-w-2xl">
            For marketplace sellers looking to grow their business, metaverse offers the best platform.
          </p>
    
          {/* Coût & Alertes */}
          <div className="grid grid-cols-2 gap-16 mt-16">
            {/* Coût */}
            <div>
              <h2 className="text-[48px] font-bold text-[#D45F00]">Coût</h2>
              <p className="mt-4 text-[20px]">
                <span className="text-[#D45F00] font-semibold"> % Pourcentage </span>
                <span className="text-[#D45F00]">par rapport au coût total prévisionel</span>
              </p>
            </div>
    
            {/* Alertes */}
            <div>
              <h2 className="text-[32px] font-bold text-[#2E7D32]">Alertes</h2>
              <div className="mt-6 space-y-4">
                <div className="h-[12px] w-[80%] bg-[#C0392B] rounded"></div>
                <div className="h-[12px] w-[60%] bg-[#F39C12] rounded"></div>
              </div>
            </div>
          </div>
    
          {/* Graphique */}
          <div className="mt-16">
            <h3 className="text-[20px] font-bold text-[#D45F00] mb-4">
              Pourcentage par rapport au coût total prévisionel
            </h3>
    
            <div className="border-l-4 border-t-4 border-[#D45F00] h-[300px] pl-4 pt-4 flex items-end space-x-12">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-[40px]"
                    style={{
                      height: `${item.value * 3}px`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                  <span className="mt-2 text-sm">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-right mt-2 text-lg text-[#D45F00] font-bold">Puit</p>
          </div>
        </div>
      );
};

export default Dashglobal;