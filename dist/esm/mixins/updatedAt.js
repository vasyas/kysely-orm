import { sql } from 'kysely';
export default function updatedAt(Base, field) {
    return class UpdatedAt extends Base {
        static async beforeUpdate(data) {
            return {
                ...await Base.beforeUpdate(data),
                [field]: sql `NOW()`,
            };
        }
    };
}
