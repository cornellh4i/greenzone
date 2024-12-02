import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Dropdown from "../atoms/DropDown";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface TopPanelProps {
  onProvinceSelect: (provinceName: { value: string }) => void;
  isPanelOpen: boolean | null;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  carryingCapacity: boolean | null;
  showBelowCells: boolean | null;
  showAtCapCells: boolean | null;
  showAboveCells: boolean | null;
  setCarryingCapacity: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBelowCells: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAtCapCells: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAboveCells: React.Dispatch<React.SetStateAction<boolean>>;
  ndviSelect: boolean | null;
  showPositiveCells: boolean | null;
  showZeroCells: boolean | null;
  showNegativeCells: boolean | null;
  setNdviSelect: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPositiveCells: React.Dispatch<React.SetStateAction<boolean>>;
  setShowZeroCells: React.Dispatch<React.SetStateAction<boolean>>;
  setShowNegativeCells: React.Dispatch<React.SetStateAction<boolean>>;
  selectedYear: number | 2014;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  grazingRange: boolean | null;
  setGrazingRange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: string | "carryingCapacity";
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  yearOptions: string[];
}

const TopPanel: React.FC<TopPanelProps> = ({
  onProvinceSelect,
  isPanelOpen,
  setPanelOpen,
  carryingCapacity,
  showBelowCells, 
  showAtCapCells,
  showAboveCells,
  setCarryingCapacity,
  setShowBelowCells,
  setShowAtCapCells, 
  setShowAboveCells,
  ndviSelect,
  showPositiveCells,
  showZeroCells,
  showNegativeCells,
  setNdviSelect,
  setShowPositiveCells,
  setShowZeroCells,
  setShowNegativeCells,
  selectedYear,
  setSelectedYear,
  grazingRange,
  setGrazingRange,
  selectedOption,
  setSelectedOption,
  yearOptions }) => {
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

  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const toggleCellState = (cellType: string) => {
    switch (cellType) {
      case "below":
        setShowBelowCells((prev) => !prev);
        break;
      case "atCap":
        setShowAtCapCells((prev) => !prev);
        break;
      case "above":
        setShowAboveCells((prev) => !prev);
        break;
      case "positive":
        setShowPositiveCells((prev) => !prev);
        break;
      case "zero":
        setShowZeroCells((prev) => !prev);
        break;
      case "negative":
        setShowNegativeCells((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const getButtonColor = (cellType: string) => {
    // Disable if neither carryingCapacity nor ndviSelect is true
    if (!carryingCapacity && !ndviSelect) {
      return { backgroundColor: "gray" }; // Disable if neither are selected
    }
  
    // If carryingCapacity is true, handle colors for "below", "atCap", "above" cells
    if (carryingCapacity) {
      switch (cellType) {
        case "below":
          return { backgroundColor: showBelowCells ? "green" : "grey" }; // Green for "below" cells if active
        case "atCap":
          return { backgroundColor: showAtCapCells ? "#C6BF31" : "grey" }; // Yellow for "atCap" cells if active
        case "above":
          return { backgroundColor: showAboveCells ? "red" : "grey" }; // Red for "above" cells if active
        default:
          return {};
      }
    }
  
    // If ndviSelect is true, handle colors for "positive", "zero", "negative" cells
    if (ndviSelect) {
      switch (cellType) {
        case "positive":
          return { backgroundColor: showPositiveCells ? "teal" : "grey" }; // Teal for "positive" cells if active
        case "zero":
          return { backgroundColor: showZeroCells ? "darkblue" : "grey" }; // Dark Blue for "zero" cells if active
        case "negative":
          return { backgroundColor: showNegativeCells ? "purple" : "grey" }; // Purple for "negative" cells if active
        default:
          return {};
      }
    }
  
    return {}; // Default case (should never be reached if above logic is correct)
  };

  
  const handleValueSelect = (provinceData: { value: string }) => {
    onProvinceSelect(provinceData); // Pass the value up to MPP
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>
          <SearchBar
            uniqueData={uniqueData}
            onValueSelect={handleValueSelect}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
          {!isPanelOpen && (
          <Dropdown
            label="Select Year"
            options={yearOptions}
            value={selectedYear.toString()}
            onChange={(val) => setSelectedYear(val)}
            sx={{ width: "160px" }}/>

          )}
          {!isPanelOpen && (
            <Button
              onClick={() => setGrazingRange((prev) => !prev)}
              label="Grazing Range"
              sx={{
                backgroundColor: grazingRange ? 'green' : 'grey'}}/>)}
          {
          !isPanelOpen && carryingCapacity && (
            <><Button
                onClick={() => toggleCellState("below")}
                label="Below Cells"
                sx={getButtonColor("below")}
                disabled={!carryingCapacity} // Disable if carryingCapacity is false
              /><Button
                  onClick={() => toggleCellState("atCap")}
                  label="At Capacity"
                  sx={getButtonColor("atCap")}
                  disabled={!carryingCapacity} // Disable if carryingCapacity is false
                /><Button
                  onClick={() => toggleCellState("above")}
                  label="Above Cells"
                  sx={getButtonColor("above")}
                  disabled={!carryingCapacity} // Disable if carryingCapacity is false
                /></>
          )
          }
          {
          !isPanelOpen && ndviSelect && (
            <><Button
                onClick={() => toggleCellState("positive")}
                label="Positive"
                sx={getButtonColor("positive")}
                disabled={!ndviSelect} // Disable if carryingCapacity is false
              /><Button
                  onClick={() => toggleCellState("zero")}
                  label="Zero"
                  sx={getButtonColor("zero")}
                  disabled={!ndviSelect} // Disable if carryingCapacity is false
                /><Button
                  onClick={() => toggleCellState("negative")}
                  label="Negative"
                  sx={getButtonColor("negative")}
                  disabled={!ndviSelect} // Disable if carryingCapacity is false
                /></>
          )
          }
          {/* Toggle carrying capacity */}
          {!isPanelOpen && (<Button
            onClick={() => {    if (carryingCapacity) {
              // If we're currently on Carrying Capacity, switch to NDVI
              setCarryingCapacity(false);
              setNdviSelect(true);
              setSelectedOption("zScore");
              // Reset NDVI-related states
              setShowAboveCells(false);
              setShowAtCapCells(false);
              setShowBelowCells(false);
              setShowNegativeCells(false);
              setShowPositiveCells(false);
              setShowZeroCells(false);
            } else {
              setCarryingCapacity(true);
              setNdviSelect(false);
              setSelectedOption("carryingCapacity");
              setShowBelowCells(false);
              setShowAtCapCells(false);
              setShowAboveCells(false);
              setShowNegativeCells(false);
              setShowPositiveCells(false);
              setShowZeroCells(false);
            }
          }}
            label={carryingCapacity ? "Switch to NDVI" : "Switch to Carrying Capacity"}
            sx={{ marginBottom: 2 }}
          />)
            }
        </div>
        <Button
          onClick={() => navigateTo("/landing")}
          sx={{
            backgroundColor: 'grey' }}
          startIcon={<HomeIcon/>}/>
        <Button
          onClick={() => {}} // Placeholder for future routing
          sx={{
            backgroundColor: "transparent" }}
          startIcon={<Avatar><PersonIcon/></Avatar>}/>
      </div>
    </div>
  );
};

export default TopPanel;
