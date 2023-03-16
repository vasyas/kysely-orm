"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isolate(models) {
    if (Array.isArray(models)) {
        return models.map((model) => {
            class IsolatedModel extends model {
            }
            ;
            IsolatedModel.isolated = true;
            return IsolatedModel;
        });
    }
    const isolatedModels = {};
    Object.keys(models).forEach((key) => {
        const model = models[key];
        class IsolatedModel extends model {
        }
        ;
        IsolatedModel.isolated = true;
        isolatedModels[key] = IsolatedModel;
    });
    return isolatedModels;
}
exports.default = isolate;
