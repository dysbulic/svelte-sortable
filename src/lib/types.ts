export type Datum = {
  id: number
} & unknown

export type Data = Array<Datum>

export class DatumChangedEvent extends Event {
  constructor(public revision: { old: Datum; new: Datum }) {
    super('datum-changed')
  }
}

export type Status = 'todo' | 'in-progress' | 'done'