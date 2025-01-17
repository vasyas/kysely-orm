import Constructor from '../@types/Constructor';
type IsolatedConstructor = Constructor<any> & {
    isolated: boolean;
};
export default function isolate<Models extends IsolatedConstructor[] | Record<string, IsolatedConstructor>>(models: Models): Models;
export {};
