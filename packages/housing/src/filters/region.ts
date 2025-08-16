import type { FilterOption } from './option';

interface RegionCategory {
    name: string,
    child: RegionFilter[]
}

interface RegionFilter {
    id: number,
    name: string,
    lat: string,
    lng: string
}

const REGION: RegionCategory[] = [{
    name: "北部",
    child: [{
        id: 1,
        name: "台北市",
        lat: "25.0329694",
        lng: "121.5654177"
    }, {
        id: 3,
        name: "新北市",
        lat: "25.0169826",
        lng: "121.4627868"
    }, {
        id: 6,
        name: "桃園市",
        lat: "24.9936281",
        lng: "121.3009798"
    }, {
        id: 4,
        name: "新竹市",
        lat: "24.8138287",
        lng: "120.9674798"
    }, {
        id: 5,
        name: "新竹縣",
        lat: "24.8387226",
        lng: "121.0177246"
    }, {
        id: 21,
        name: "宜蘭縣",
        lat: "24.7021073",
        lng: "121.7377502"
    }, {
        id: 2,
        name: "基隆市",
        lat: "25.1276033",
        lng: "121.7391833"
    }]
}, {
    name: "中部",
    child: [{
        id: 8,
        name: "台中市",
        lat: "24.1477358",
        lng: "120.6736482"
    }, {
        id: 10,
        name: "彰化縣",
        lat: "24.0517963",
        lng: "120.5161352"
    }, {
        id: 14,
        name: "雲林縣",
        lat: "23.7092033",
        lng: "120.4313373"
    }, {
        id: 7,
        name: "苗栗縣",
        lat: "24.5601590",
        lng: "120.8214265"
    }, {
        id: 11,
        name: "南投縣",
        lat: "23.9609981",
        lng: "120.9718638"
    }]
}, {
    name: "南部",
    child: [{
        id: 17,
        name: "高雄市",
        lat: "22.6272784",
        lng: "120.3014353"
    }, {
        id: 15,
        name: "台南市",
        lat: "22.9997281",
        lng: "120.2270277"
    }, {
        id: 12,
        name: "嘉義市",
        lat: "23.4800751",
        lng: "120.4491113"
    }, {
        id: 13,
        name: "嘉義縣",
        lat: "23.4518428",
        lng: "120.2554615"
    }, {
        id: 19,
        name: "屏東縣",
        lat: "22.5519759",
        lng: "120.5487597"
    }]
}, {
    name: "東部",
    child: [{
        id: 22,
        name: "台東縣",
        lat: "22.7972447",
        lng: "121.0713702"
    }, {
        id: 23,
        name: "花蓮縣",
        lat: "23.9871589",
        lng: "121.6015714"
    }, {
        id: 24,
        name: "澎湖縣",
        lat: "23.5711899",
        lng: "119.5793157"
    }, {
        id: 25,
        name: "金門縣",
        lat: "24.3487792",
        lng: "118.3285644"
    }, {
        id: 26,
        name: "連江縣",
        lat: "26.1602430",
        lng: "119.9516652"
    }]
}];

export function getRegionList(): FilterOption[] {
    return REGION.map(e => {
        return {
            id: "",
            key: "",
            name: e.name,
            child: e.child.map(ee => {
                return {
                    ...ee,
                    id: ee.id.toString(),
                    key: 'region'
                }
            })
        };
    });;
}