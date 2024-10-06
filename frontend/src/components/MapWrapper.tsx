import dynamic from "next/dynamic";

// Dynamically import the LeafletMap component with SSR disabled
const SimpleMap = dynamic(() => import("./Map"), {
  ssr: false, // Disable server-side rendering for Leaflet map
});

export default SimpleMap;