import express from "express";
import cors from "cors";
import path from "path";

import routes from "./routes";

const app = express();

routes(app);

app.use(cors());    
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")));

app.listen(3333, () => console.log("Server running"));
