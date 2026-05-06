import { Request } from "express";

export interface IExtendedRequest extends Request {
    user?: {
        id?: string;
        currentInstituteNumber?: string;
        role?: string;
    },
    instituteNumber?: string | number | null
}