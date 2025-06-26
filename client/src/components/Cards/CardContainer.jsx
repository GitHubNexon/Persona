import React from 'react';

const CardContainer = ({ children }) => {
  return (
    <div className="grid gap-4 p-6 bg-white shadow-md rounded-2xl md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};

export default CardContainer;
