import * as filters from 'housing';
import getSign from './encrypt.js';
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

export interface Option {
    id: string,
    type: string
}

const OPTION_CONVERTOR = [{
    from: "region",
    to: "regionid"
}, {
    from: "section",
    to: "sectionid"
}, {
    from: "metro",
    to: "mrtline",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        o[d] = p,
            o.searchtype = "4"
    }
}, {
    from: "station",
    to: "mrtcoods",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        o[d] = p,
            o.searchtype = "4"
    }
}, {
    from: "school",
    to: "school",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        o[d] = p,
            o.searchtype = "3"
    }
}, {
    from: "shopping",
    to: "?",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        o[d] = p,
            o.searchtype = "2";
    },
    keyPicker: (o: Record<string, string[]>) => {
        if (o["region"] && o["kind"] && o["region"].includes("1"))
            return "business_circle_id";
        return "busness";
    }
}, {
    from: "price",
    to: "multiPrice",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        if (p.includes("$")) {
            const v = p.replace("$", "").replace("_", ",");
            o.rentprice = v
        } else
            o[d] = p
    }
}, {
    from: "acreage",
    to: "multiArea",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        if (p.includes("$")) {
            const v = p.replace("$", "").replace("_", ",");
            o.area = v
        } else
            o[d] = p
    }
}, {
    from: "source",
    to: "role"
}, {
    from: "layout",
    to: "multiRoom"
}, {
    from: "floor",
    to: "multiFloor"
}, {
    from: "bathroom",
    to: "multiToilet"
}, {
    from: "notice",
    to: "multiNotice"
}, {
    from: "page",
    to: "firstRow",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => o[d] = String((+p - 1) * 30)
}, {
    from: "sort",
    to: "order",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        const l = p.split("_");
        o[d] = l[0] || "",
            o.orderType = l[1] || ""
    }
}, {
    from: "other",
    to: "shType",
    convert: (o: Record<string, string>, { value: p, key: d }: { value: string, key: string }) => {
        const l = p.split(",")
            , v = ["best_house", "video", "host", "18"];
        v == null || v.forEach(i => {
            l.includes(i) && (o[d] = [o[d], i].filter(m => m).join(","),
                l.splice(l.indexOf(i), 1))
        }
        ),
            o.other = l.join(",")
    }
}];

function joinUrl(options: Option[]) {
    const params: Record<string, string> = {};
    // create option set
    const option_set: Record<string, string[]> = {};
    options.forEach(option => {
        if (!(option.type in option_set))
            option_set[option.type] = [];
        option_set[option.type].push(option.id);
    });
    option_set['timestamp'] = [new Date().getTime().toString()];

    // merge option set
    Object.keys(option_set).forEach(option_name_target => {
        const convertor = OPTION_CONVERTOR.find(v => v.from === option_name_target);
        const option_name = convertor == null ? option_name_target : convertor.keyPicker ? convertor.keyPicker(option_set) : convertor.to;
        const option_val = option_set[option_name_target].toString();
        if (!option_val) return;
        if (convertor != null && convertor.convert)
            convertor.convert(params, {
                key: option_name,
                value: option_val
            })
        else if (option_name_target !== "regionid") {
            params[option_name] = option_val
        }
    });
    return params;
}

async function fetchData(endpoint: string, params: Record<string, string>) {
    // generate url with search params
    const url = endpoint + "?" + new URLSearchParams(params).toString();
    const sign = await getSign(params);
    const headers = {
        device: "pc",
        sign: sign,
        "User-Agent": USER_AGENT
    };

    return {
        url,
        headers
    }
}

export function query(endpoint: string, options: Option[]) {
    return fetchData(endpoint, joinUrl(options));
}