
export function comparePrice(a, b) {
    const pricea = a['sizes'][0]['price']
    const priceb = b['sizes'][0]['price']
    if (pricea < priceb) {
        return -1;
    } else if (pricea > priceb) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

export function compareSize(a, b) {
    const pricea = a['sizes'][0]['size']
    const priceb = b['sizes'][0]['size']
    if (pricea < priceb) {
        return -1;
    } else if (pricea > priceb) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

export function compareValue(a, b) {
    const pricea = a['sizes'][0]['value']
    const priceb = b['sizes'][0]['value']
    if (pricea < priceb) {
        return -1;
    } else if (pricea > priceb) {
        return 1;
    }
    // a must be equal to b
    return 0;
}