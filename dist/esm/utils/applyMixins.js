import model from '../mixins/model';
export default function applyMixins(db, table, id, error) {
    const BaseClass = model(db, table, id, error);
    function process(mixin1, mixin2, mixin3, mixin4, mixin5, mixin6, mixin7, mixin8, mixin9, mixin10, mixin11, mixin12, mixin13) {
        if (!mixin1) {
            return BaseClass;
        }
        if (!mixin2) {
            return mixin1(BaseClass);
        }
        if (!mixin3) {
            return mixin2(mixin1(BaseClass));
        }
        if (!mixin4) {
            return mixin3(mixin2(mixin1(BaseClass)));
        }
        if (!mixin5) {
            return mixin4(mixin3(mixin2(mixin1(BaseClass))));
        }
        if (!mixin6) {
            return mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass)))));
        }
        if (!mixin7) {
            return mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass))))));
        }
        if (!mixin8) {
            return mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass)))))));
        }
        if (!mixin9) {
            return mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass))))))));
        }
        if (!mixin10) {
            return mixin9(mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass)))))))));
        }
        if (!mixin11) {
            return mixin10(mixin9(mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass))))))))));
        }
        if (!mixin12) {
            return mixin11(mixin10(mixin9(mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass)))))))))));
        }
        if (!mixin13) {
            return mixin12(mixin11(mixin10(mixin9(mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass))))))))))));
        }
        return mixin13(mixin12(mixin11(mixin10(mixin9(mixin8(mixin7(mixin6(mixin5(mixin4(mixin3(mixin2(mixin1(BaseClass)))))))))))));
    }
    return process;
}
