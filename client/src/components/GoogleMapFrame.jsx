import React from "react";

const GoogleMapFrame = ({ lat, lng }) => {
  if (!lat || !lng) return <div>Invalid coordinates</div>;

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div className="w-full h-64">
      <iframe
        title="Google Map"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapSrc}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default GoogleMapFrame;
