import express from "express";
import connectToServer from "./db/conn";
import hexagonRoutes from "./routes";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/api", hexagonRoutes);

app.listen(port, () => {
    connectToServer((err) => {
        if (err) console.error(err);
    });
    console.log(`Server running on port ${port}!`);
});
