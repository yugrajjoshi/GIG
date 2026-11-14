"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const router = (0, express_1.Router)();
router.post("/send-otp", auth_controller_js_1.sendOtp);
router.post("/verify-otp", auth_controller_js_1.verifyOtp);
exports.default = router;
