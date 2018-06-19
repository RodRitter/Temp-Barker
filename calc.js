
const FEES = {
    VAT: 0.15,
    TRANSFER_DUTIES: [
        {FROM: 0, TO: 900000, AMOUNT: 0, PERC: 0},
        {FROM: 900001, TO: 1250000, AMOUNT: 0, PERC: 0.03},
        {FROM: 1250001, TO: 1750000, AMOUNT: 10500, PERC: 0.06},
        {FROM: 1750001, TO: 2250000, AMOUNT: 40500, PERC: 0.08},
        {FROM: 2250001, TO: 10000000, AMOUNT: 80500, PERC: 0.11},
        {FROM: 10000000, TO: 999999999, AMOUNT: 933000, PERC: 0.13}
    ],
    DEEDS_OFFICE_TRANSFER: [
        {FROM: 0, TO: 100000, AMOUNT: 35},
        {FROM: 100001, TO: 200000, AMOUNT: 75},
        {FROM: 200001, TO: 300000, AMOUNT: 465},
        {FROM: 300001, TO: 600000, AMOUNT: 580},
        {FROM: 600001, TO: 800000, AMOUNT: 815},
        {FROM: 800001, TO: 1000000, AMOUNT: 930},
        {FROM: 1000001, TO: 2000000, AMOUNT: 1050},
        {FROM: 2000001, TO: 4000000, AMOUNT: 1275},
        {FROM: 4000001, TO: 6000000, AMOUNT: 1750},
        {FROM: 6000001, TO: 8000000, AMOUNT: 2100},
        {FROM: 8000001, TO: 10000000, AMOUNT: 2455},
        {FROM: 10000001, TO: 15000000, AMOUNT: 2920},
        {FROM: 15000001, TO: 20000000, AMOUNT: 3505},
        {FROM: 20000001, TO: 999999999, AMOUNT: 4675}
    ],
    DEEDS_OFFICE_BOND: [
        {FROM: 0, TO: 150000, AMOUNT: 360},
        {FROM: 150001, TO: 300000, AMOUNT: 400},
        {FROM: 300001, TO: 600000, AMOUNT: 580},
        {FROM: 600001, TO: 800000, AMOUNT: 810},
        {FROM: 800001, TO: 1000000, AMOUNT: 935},
        {FROM: 1000001, TO: 2000000, AMOUNT: 1050},
        {FROM: 2000001, TO: 4000000, AMOUNT: 1456},
        {FROM: 4000001, TO: 6000000, AMOUNT: 1765},
        {FROM: 6000001, TO: 8000000, AMOUNT: 2100},
        {FROM: 8000001, TO: 10000000, AMOUNT: 2455},
        {FROM: 10000001, TO: 15000000, AMOUNT: 2923},
        {FROM: 15000001, TO: 20000000, AMOUNT: 3510},
        {FROM: 20000001, TO: 30000000, AMOUNT: 4090},
        {FROM: 30000001, TO: 999999999, AMOUNT: 5845}
    ],
    // 2017 - http://www.ghostdigest.com/articles/conveyancing-fees-may-2017/55272
    CONVEYANCING: [
        {FROM: 0, TO: 100000, AMOUNT: 4600, AMT_PER: 0, PER_RANGE: 0},
        {FROM: 100001, TO: 500000, AMOUNT: 4600, AMT_PER: 700, PER_RANGE: 50000},
        {FROM: 500001, TO: 1000000, AMOUNT: 10200, AMT_PER: 1400, PER_RANGE: 100000},
        {FROM: 1000001, TO: 5000000, AMOUNT: 17200, AMT_PER: 700, PER_RANGE: 100000},
        {FROM: 5000001, TO: 999999999, AMOUNT: 45200, AMT_PER: 350, PER_RANGE: 100000},
    ],
    DEFAULT_INTEREST: 0.09,
    DEFAULT_PERIOD: 20
}



$(document).ready(function() {
    updateValues($("#calc-bond-input").val());
    
    $("#calc-bond-input").keyup(function(e) {
        updateValues($(this).val());
    });

    $("#calc-bond-input").change(function(e) {
        updateValues($(this).val());
    });

    $("#calc-container").removeClass("hidden");

});

function updateValues(pp) {
    var deedsTransferFee = getDeedsFeeTransfer(pp);
    var deedsBondFee = getDeedsFeeBond(pp);
    var transferDuty = getTransferDuty(pp);
    var conveyancyFee = getConveyancyFee(pp);
    var vat = getVat(conveyancyFee);

    console.log(deedsTransferFee, deedsBondFee, transferDuty, conveyancyFee)

    $(".deeds-transfer-fee").html(formatCurrency(deedsTransferFee));
    $(".deeds-bond-fee").html(formatCurrency(deedsBondFee));
    $(".transfer-duty").html(formatCurrency(transferDuty));
    $(".conveyancing-tariff").html(formatCurrency(conveyancyFee));
    $(".vat").html(formatCurrency(vat));

    $(".transfer-fees-total").html(formatCurrency(deedsTransferFee + transferDuty + conveyancyFee + vat));
    $(".bond-fees-total").html(formatCurrency(deedsTransferFee + conveyancyFee + vat));
}

function formatCurrency(number) {
    var numstring = number.toString();

    if(numstring.length > 3){
        var thpos = -3;
        var strgnum = numstring.slice(0, numstring.length+thpos);
        var strgspace = (" " + numstring.slice(thpos));
        numstring = strgnum + strgspace;
    }

    return numstring;
}

function getTransferDuty(pp) {
    for(var i=0; i < FEES.TRANSFER_DUTIES.length; i++) {
        var tier = FEES.TRANSFER_DUTIES[i];
        if(pp >= tier.FROM && pp <= tier.TO) {
            console.log(tier.AMOUNT, tier.PERC, Number(pp), tier.FROM)
            return Math.ceil(tier.AMOUNT + (tier.PERC * (pp - tier.FROM)));
            break;
        }
    }
}

function getDeedsFeeTransfer(pp) {
    for(var i=0; i < FEES.DEEDS_OFFICE_TRANSFER.length; i++) {
        var tier = FEES.DEEDS_OFFICE_TRANSFER[i];
        if(pp >= tier.FROM && pp <= tier.TO) {
            return tier.AMOUNT;
            break;
        }
    }
}

function getDeedsFeeBond(pp) {
    for(var i=0; i < FEES.DEEDS_OFFICE_BOND.length; i++) {
        var tier = FEES.DEEDS_OFFICE_BOND[i];
        if(pp >= tier.FROM && pp <= tier.TO) {
            return tier.AMOUNT;
            break;
        }
    }
}

function getConveyancyFee(pp) {
    for(var i=0; i < FEES.CONVEYANCING.length; i++) {
        var tier = FEES.CONVEYANCING[i];
        if(pp >= tier.FROM && pp <= tier.TO) {
            var fee = FEES.CONVEYANCING[0].AMOUNT;

            if(tier.AMT_PER > 0) {
                var diff = pp - tier.FROM;
                fee = tier.AMOUNT + ((diff / tier.PER_RANGE) * tier.AMT_PER);
            }
            
            return Math.ceil(fee);
            break;
        }
    }
}

function getVat(amount) {
    return Math.ceil(amount * FEES.VAT);
}

function getTotalTransferFees(pp) {
    var deeds = getDeedsFeeTransfer(pp);
    var duty = getTransferDuty(pp);
    var convey = getConveyancyFee(pp);
    return deeds + duty + convey;
}

function getTotalBondFees(pp) {
    var deeds = getDeedsFeeBond(pp);
    var convey = getConveyancyFee(pp);
    return deeds + convey;
}

