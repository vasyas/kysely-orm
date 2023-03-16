export default function assign() {
    return class TableClass {
        constructor(data) {
            Object.assign(this, data);
        }
    };
}
