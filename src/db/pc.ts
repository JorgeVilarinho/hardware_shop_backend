import type { QueryConfig } from "pg";
import { pool } from "../db.js";
import type { PcData } from "../models/pcData.js";
import type { PcRepository } from "../models/PcRepository.js";
import type { Pc } from "../models/pc.js";

export const insertPcRepository = async (pcData: PcData) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN')

    let query: QueryConfig = {
      name: 'insert-pc-to-db',
      text: `INSERT INTO pc(montaje) VALUES($1) RETURNING *`,
      values: [ pcData.assembly ]
    }
  
    let res = await dbClient.query<PcRepository>(query)

    const pcRepository = res.rows[0]

    query = {
      name: 'insert-pc-product-to-db',
      text: `INSERT INTO pc_producto(id_pc, id_producto) VALUES($1, $2)`
    }

    for(let i = 0; i < pcData.components.length; i++) {
      const component = pcData.components[i]

      query.values = [ pcRepository?.id, component?.id ]
      await dbClient.query(query)
    }

    await dbClient.query('COMMIT')
    
    let pc: Pc = {
      id: pcRepository!.id,
      components: pcData.components,
      assembly: pcData.assembly
    }

    return pc
  } catch (error) {
    await dbClient.query('ROLLBACK')
    throw error
  } finally {
    dbClient.release()
  }
}