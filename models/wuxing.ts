import { EWuXing } from './enums';


// 五行相生的顺序为：木生火，火生土，土生金，金生水，水生木；五行相克的顺序为：木克土、土克水、水克火、火克金、金克木。
export interface WuXingBase {
    type: EWuXing;
    value: number;
    ke: EWuXing;
    sheng: EWuXing;
}

export class WuXingBase implements WuXingBase {
    constructor(public type: EWuXing, public value = 0) {
        if(!this.type){
            throw new Error('type is required');
        }
    }
}

export class Jin extends WuXingBase {
    ke: EWuXing;
    sheng: EWuXing;
    constructor(public value = 0){
        super(EWuXing.jin, value);
        this.ke = EWuXing.mu;
        this.sheng = EWuXing.shui;
    }
}

export class Mu extends WuXingBase {
    constructor(public value = 0){
        super(EWuXing.mu, value);
        this.ke = EWuXing.shui;
        this.sheng = EWuXing.jin;
    }

}

export class Shui extends WuXingBase {
    constructor(
        public ke = EWuXing.huo, 
        public sheng = EWuXing.mu,
        public value = 0){
        super(EWuXing.shui, value);
    }
}

export class Huo extends WuXingBase {
    constructor(
        public ke = EWuXing.jin, 
        public sheng = EWuXing.tu,
        public value = 0){
        super(EWuXing.huo, value);
    }
}

export class Tu extends WuXingBase {
    constructor(
        public ke = EWuXing.shui, 
        public sheng = EWuXing.jin,
        public value = 0){
        super(EWuXing.tu, value);
    }
}