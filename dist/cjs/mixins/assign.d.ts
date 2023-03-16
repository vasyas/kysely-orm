import { type Selectable } from 'kysely';
export default function assign<Table>(): new (data: Selectable<Table>) => Selectable<Table>;
export type Assign<Table> = ReturnType<typeof assign<Table>>;
