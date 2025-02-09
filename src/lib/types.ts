export type Datum = {
  id: number
} & unknown

export type Data = Array<Datum>

export type Status = 'todo' | 'in-progress' | 'done'