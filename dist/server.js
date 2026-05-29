"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./src/router"));
const errorHandler_middleware_1 = __importDefault(require("./src/middleware/errorHandler.middleware"));
require("./src/config/passportLocal");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_UrL,
    credentials: true,
};
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_session_1.default)({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/api/v1', router_1.default);
app.use(errorHandler_middleware_1.default);
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
