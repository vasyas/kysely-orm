import { type Selectable } from 'kysely';
export default function assign<Table>(): new (data: Selectable<Table>) => Selectable<Table>;
export declare type Assign<Table> = ReturnType<typeof assign<Table>>;
