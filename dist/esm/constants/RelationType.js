var RelationType;
(function (RelationType) {
    RelationType[RelationType["BelongsToOneRelation"] = 0] = "BelongsToOneRelation";
    RelationType[RelationType["HasOneRelation"] = 1] = "HasOneRelation";
    RelationType[RelationType["HasManyRelation"] = 2] = "HasManyRelation";
    RelationType[RelationType["BelongsToManyRelation"] = 3] = "BelongsToManyRelation";
    RelationType[RelationType["HasOneThroughRelation"] = 4] = "HasOneThroughRelation";
    RelationType[RelationType["HasManyThroughRelation"] = 5] = "HasManyThroughRelation";
})(RelationType || (RelationType = {}));
;
export default RelationType;
