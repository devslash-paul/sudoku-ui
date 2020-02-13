import { CellState } from './state/model'

const huff: Record<string, number> = {
    '000': 0,
    '1111': 1,
    '001': 2,
    '010': 3,
    '011': 4,
    '100': 5,
    '101': 6,
    '1100': 7,
    '1101': 8,
    '1110': 9,
}

const reverse: Record<string, string> = {
    '0': '000',
    '1': '1111',
    '2': '001',
    '3': '010',
    '4': '011',
    '5': '100',
    '6': '101',
    '7': '1100',
    '8': '1101',
    '9': '1110',
}

const sparseMap: Record<number, string> = {
    0: '000',
    1: '001',
    2: '010',
    3: '011',
    4: '100',
    5: '101',
    6: '110',
    7: '111',
}

export function encodeFull(cells: CellState[]) {
    // algo 2 start
    const cellsFilled = cells.map(x => x.mainNum == null ? 0 : 1)
    let runThrough = "";
    let i = 0;
    while (i < cellsFilled.length) {
        // if this is a one, add it
        if (cellsFilled[i] === 1) {
            runThrough += sparseMap[0]
            i++;
        } else {
            // how many zeros in a row
            if (cellsFilled.indexOf(1, i) === -1) {
                // there are no more cells filled. Pick the largest possible
                let nextOne = Math.min(7, cellsFilled.length - i)
                runThrough += sparseMap[nextOne]
                i += nextOne
            } else {
                let nextOne = Math.min(cellsFilled.indexOf(1, i), 7)
                runThrough += sparseMap[nextOne]
                i += nextOne
            }
        }
        // something went wrong
        if (i > 90) {
            break;
        }
    }
    const filledVals = cells.filter(x => x.mainNum != null)
        .map(x => x.mainNum)
        .map(x => reverse["" + x])
        .reduce((p, n) => p + n, "")
    const val2 = BigInt("0b" + runThrough + filledVals)
    // algo 2 end
    return bnToB64(val2)
};

function bnToB64(bn: BigInt) {
    let hex = bn.toString(2);
    let arr = []
    if (hex.length % 8 > 0) {
        hex = hex.padEnd(hex.length + (8 - (hex.length % 8)), "0")
    }
    for (var i = 0; i < hex.length / 8; i++) {
        arr.push(hex.substring(i * 8, i * 8 + 8))
    }
    var b64encoded = btoa(String.fromCharCode.apply(null, arr.map(x => parseInt(x, 2))));

    return b64encoded.replace(/\//g, "-").replace(/\+/g, "_").replace(/=/g, "")
}

export function importFull(board: string): CellState[] {
    const res = (BigInt("0x" + board).toString(2))
    const arr = new Array(81);
    let idx = 0;
    let s = ''
    let boardidx = 0;
    while (idx < 81) {
        s = s + res.charAt(boardidx)
        boardidx++;
        if (huff[s] !== undefined) {
            arr[idx++] = {
                mainNum: huff[s],
                small: []
            }
            s = ''
        }
    }
    return arr;
}