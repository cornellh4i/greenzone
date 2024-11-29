import SearchBar from "@/components/molecules/SearchBar";

interface TopPanelProps {
  onProvinceSelect: (provinceName: { value: string }) => void;
}
const TopPanel: React.FC<TopPanelProps> = ({ onProvinceSelect }) => {
  const uniqueData = [
    "Dornod",
    "Bayan-Ölgiy",
    "Hovd",
    "Sühbaatar",
    "Dornogovi",
    "Govi-Altay",
    "Bayanhongor",
    "Ömnögovi",
    "Hövsgöl",
    "Bulgan",
    "Uvs",
    "Selenge",
    "Dzavhan",
    "Hentiy",
    "Darhan-Uul",
    "Töv",
    "Arhangay",
    "Orhon",
    "Dundgovi",
    "Övörhangay",
    "Govĭ-Sümber",
    "Ulaanbaatar", // Capital city (not a province but included for reference)
  ];

  const handleValueSelect = (provinceData: { value: string }) => {
    onProvinceSelect(provinceData); // Pass the value up to MPP
  };
  return (
    <div>
      <h1>Monitoring Platform</h1>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ marginTop: "60px" }}>
          <SearchBar
            uniqueData={uniqueData}
            onValueSelect={handleValueSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default TopPanel;
