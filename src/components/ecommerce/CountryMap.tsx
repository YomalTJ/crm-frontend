import React from "react";
import dynamic from "next/dynamic";
import { worldMill } from "@react-jvectormap/world";

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: {
          fill: "#1E3A8A", // darker blue or government green can be used
        },
      }}
      markers={[
        {
          latLng: [6.9271, 79.8612], // Colombo
          name: "Colombo District",
          style: { fill: "#1E40AF", borderWidth: 2, borderColor: "white" },
        },
        {
          latLng: [7.2906, 80.6337], // Kandy
          name: "Kandy District",
          style: { fill: "#2563EB", borderWidth: 2, borderColor: "white" },
        },
        {
          latLng: [6.7054, 81.1120], // Galle
          name: "Galle District",
          style: { fill: "#3B82F6", borderWidth: 2, borderColor: "white" },
        },
        // Add more Sri Lankan districts as needed
      ]}
      zoomOnScroll={false}
      zoomMax={10}
      zoomMin={4}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#CBD5E1",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#2563EB",
          stroke: "none",
        },
        selected: {
          fill: "#2563EB",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#334155",
          fontWeight: 600,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
