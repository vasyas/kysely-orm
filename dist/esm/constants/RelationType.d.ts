declare enum RelationType {
    BelongsToOneRelation = 0,
    HasOneRelation = 1,
    HasManyRelation = 2,
    BelongsToManyRelation = 3,
    HasOneThroughRelation = 4,
    HasManyThroughRelation = 5
}
export default RelationType;
