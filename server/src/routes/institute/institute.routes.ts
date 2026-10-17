import express from 'express';
import { createInstitute } from '../../controllers/institute/institute.controller';
const router = express.Router();

router.route("/").post(createInstitute)



export default router;