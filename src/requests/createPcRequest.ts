import type { PcData } from "../models/pcData.js"

export interface CreatePcRequest extends Express.Request {
  body: {
    pcData: PcData
  }
}