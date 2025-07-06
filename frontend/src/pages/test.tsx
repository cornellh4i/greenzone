import LeftRightSection from "../components/molecules/HomeInfo";
import { Typography, Box } from "@mui/material";

const Tester: React.FC = () => {
  return (
    <div>
      <LeftRightSection
        bgColor="#F0F5F0" /* light-green background */
        paddingY={8}
        maxWidth="md"
        left={
          <Box
            component="img"
            src="/horse.png"
            alt="…"
            sx={{ width: "100%" }}
          />
        }
        right={
          <>
            <Typography variant="h4" fontWeight="bold">
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
              eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit sed do eiusmod tempor.
            </Typography>
          </>
        }
        buttonText="Learn more"
        buttonVariant="outlined"
        buttonColor="success"
        buttonSx={{
          width: 150,
          borderRadius: 2,
        }}
        buttonSide="right"
        containerSx={{
          borderRadius: 2,
          boxShadow: 1,
        }}
      />
    </div>
  );
};

export default Tester;
