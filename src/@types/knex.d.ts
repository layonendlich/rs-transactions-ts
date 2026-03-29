// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: number
      uuid: string
      tittle: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
