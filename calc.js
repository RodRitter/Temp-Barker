
const FEES = {
    VAT: 0.15,
    TRANSFER_DUTIES: [
        {FROM: 0, TO: 900000, AMOUNT: 0, PERC: 0},
        {FROM: 900001, TO: 1250000, AMOUNT: 0, PERC: 0.03},
        {FROM: 1250001, TO: 1750000, AMOUNT: 10500, PERC: 0.06},
        {FROM: 1750001, TO: 2250000, AMOUNT: 40500, PERC: 0.08},
        {FROM: 2250001, TO: 10000000, AMOUNT: 80500, PERC: 0.11},
        {FROM: 10000001, TO: 999999999, AMOUNT: 933000, PERC: 0.13}
    ],
    DEEDS_OFFICE_TRANSFER: [
        {FROM: 0, TO: 100000, AMOUNT: 36},
        {FROM: 100001, TO: 200000, AMOUNT: 78},
        {FROM: 200001, TO: 300000, AMOUNT: 486},
        {FROM: 300001, TO: 600000, AMOUNT: 606},
        {FROM: 600001, TO: 800000, AMOUNT: 852},
        {FROM: 800001, TO: 1000000, AMOUNT: 978},
        {FROM: 1000001, TO: 2000000, AMOUNT: 1098},
        {FROM: 2000001, TO: 4000000, AMOUNT: 1522},
        {FROM: 4000001, TO: 6000000, AMOUNT: 1846},
        {FROM: 6000001, TO: 8000000, AMOUNT: 2197},
        {FROM: 8000001, TO: 10000000, AMOUNT: 2568},
        {FROM: 10000001, TO: 15000000, AMOUNT: 3057},
        {FROM: 15000001, TO: 20000000, AMOUNT: 3671},
        {FROM: 20000001, TO: 999999999, AMOUNT: 4890}
    ],
    DEEDS_OFFICE_BOND: [
        {FROM: 0, TO: 150000, AMOUNT: 376},
        {FROM: 150001, TO: 300000, AMOUNT: 486},
        {FROM: 300001, TO: 600000, AMOUNT: 606},
        {FROM: 600001, TO: 800000, AMOUNT: 852},
        {FROM: 800001, TO: 1000000, AMOUNT: 978},
        {FROM: 1000001, TO: 2000000, AMOUNT: 1098},
        {FROM: 2000001, TO: 4000000, AMOUNT: 1522},
        {FROM: 4000001, TO: 6000000, AMOUNT: 1846},
        {FROM: 6000001, TO: 8000000, AMOUNT: 2197},
        {FROM: 8000001, TO: 10000000, AMOUNT: 2568},
        {FROM: 10000001, TO: 15000000, AMOUNT: 3057},
        {FROM: 15000001, TO: 20000000, AMOUNT: 3671},
        {FROM: 20000001, TO: 30000000, AMOUNT: 4278},
        {FROM: 30000001, TO: 999999999, AMOUNT: 6113}
    ],
    CONVEYANCING: [
        {FROM: 0, TO: 100000, AMOUNT: 4800, AMT_PER: 0, PER_RANGE: 0},
        {FROM: 100001, TO: 500000, AMOUNT: 4800, AMT_PER: 735, PER_RANGE: 50000},
        {FROM: 500001, TO: 1000000, AMOUNT: 10680, AMT_PER: 1470, PER_RANGE: 100000},
        {FROM: 1000001, TO: 5000000, AMOUNT: 18030, AMT_PER: 735, PER_RANGE: 100000},
        {FROM: 5000001, TO: 999999999, AMOUNT: 47430, AMT_PER: 370, PER_RANGE: 100000},
    ]
}

$(document).ready(function() {
    var bondVal = $("#calc-bond-input").val();
    var bondParsed = decodeCurrency(bondVal);
    var bondFormatted = formatInputCurrency(bondVal);

    var ppVal = $("#calc-pp-input").val();
    var ppParsed = decodeCurrency(ppVal);
    var ppFormatted = formatInputCurrency(ppVal);

    var rateString = decodePercentInput($("#calc-interest-input").val());
    var rateFormatted = formatPercentInput(rateString);

    $("#calc-interest-input").val(rateFormatted);
    
    updateTransferValues(ppParsed);
    $("#calc-pp-input").val(ppFormatted);

    updateBondValues(bondParsed);
    updatePayments(bondParsed);
    $("#calc-bond-input").val(bondFormatted);
    
    $("#calc-pp-input").on('keypress keyup change' , function(e) {
        var inputVal = $(this).val();
        var parsedVal = decodeCurrency(inputVal);
        var formattedVal = formatInputCurrency(parsedVal);

        // console.log(inputVal, parsedVal, formattedVal);
        
        if(e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
        
        updateTransferValues(parsedVal);
        $("#calc-pp-input").val(formattedVal);
    });

    $("#calc-bond-input").on('keypress keyup change', function(e) {
        var inputVal = $(this).val();
        var parsedVal = decodeCurrency(inputVal);
        var formattedVal = formatInputCurrency(parsedVal);

        if(e.which < 48 || e.which > 57) {
            e.preventDefault();
        }

        updateBondValues(parsedVal);
        updatePayments(parsedVal);
        $("#calc-bond-input").val(formattedVal);
    });

    $("#calc-interest-input").on('keypress keyup change', function(e) {
        var inputVal = $("#calc-bond-input").val();
        var parsedVal = decodeCurrency(inputVal);

        var percentString = decodePercentInput($("#calc-interest-input").val());
        var formattedVal = formatPercentInput(percentString);

        if(e.which < 48 || e.which > 57) {
            e.preventDefault();
        }

        updatePayments(parsedVal);
        $("#calc-interest-input").val(formattedVal);
    });

    $("#calc-interest-input").on('focus', function(e) {
        
        var beforePerc = $(this).val().length-1;

        window.setTimeout(function() {
            setCaretPosition(e.target, 0, beforePerc);
        }, 50);
        
    });

    $("#calc-years-input").on('keypress keyup change', function(e) {
        var inputVal = $("#calc-bond-input").val();
        var parsedVal = decodeCurrency(inputVal);
        updatePayments(parsedVal);
    });

    $('.calc-print').on('click', function() {
        window.print();
    });

    $('.reset-calc').on('click', function() {
        $("#calc-pp-input").val(0).change();
        $("#calc-bond-input").val(0).change();
        $("#calc-interest-input").val(10).change();
        $("#calc-years-input").val(20).change();
    });

    $("#calc-container").removeClass("hidden");
});

function updateTransferValues(pp) {
    if(pp > 0) {
        var deedsTransferFee = getDeedsFeeTransfer(pp);
        var deedsBondFee = getDeedsFeeBond(pp);
        var transferDuty = getTransferDuty(pp);
        var conveyancyFee = getConveyancyFee(pp);
        var vat = getVat(conveyancyFee);
    
        $(".deeds-transfer-fee").html(formatCurrency(deedsTransferFee));
        $(".transfer-duty").html(formatCurrency(transferDuty));
        $(".conveyancing-tariff").html(formatCurrency(conveyancyFee));
        $(".vat").html(formatCurrency(vat));
    
        $(".transfer-fees-total").html(formatCurrency(deedsTransferFee + transferDuty + conveyancyFee + vat));
    } else {
        $(".deeds-transfer-fee").html(formatCurrency(0));
        $(".transfer-duty").html(formatCurrency(0));
        $(".conveyancing-tariff").html(formatCurrency(0));
        $(".vat").html(formatCurrency(0));
        $(".transfer-fees-total").html(0);
    }
}

function updateBondValues(pp) {
    if(pp > 0) {
        var deedsBondFee = getDeedsFeeBond(pp);
        var conveyancyFee = getConveyancyFee(pp);
        var vat = getVat(conveyancyFee);
    
        $(".deeds-bond-fee").html(formatCurrency(deedsBondFee));
        $(".conveyancing-tariff-bond").html(formatCurrency(conveyancyFee));
        $(".vat-bond").html(formatCurrency(vat));
    
        $(".bond-fees-total").html(formatCurrency(deedsBondFee + conveyancyFee + vat));
    } else {
        $(".deeds-bond-fee").html(formatCurrency(0));
        $(".conveyancing-tariff-bond").html(formatCurrency(0));
        $(".vat-bond").html(formatCurrency(0));
        $(".bond-fees-total").html(0);
    }
}

function updatePayments(pp) {

    if(pp > 0) {
        var perc = decodePercentInput($("#calc-interest-input").val());
        var rate = perc / 100;
        var years = Number( $("#calc-years-input").val() );

        var monthly = calculatePayment(rate, years, Number(pp));

        if(monthly) {
            $(".monthly-total").html(formatCurrency(monthly));

            var interest = monthly * (years * 12);
            $(".instalment-total-bond").html(formatCurrency( interest ));
        }
    } else {
        $(".monthly-total").html(0);
        $(".instalment-total-bond").html(0);
    }
    
}

function formatCurrency(number) {
    return number.toLocaleString('en-ZA');
}

function formatInputCurrency(value) {
    return "R " + formatCurrency(value);
}

function decodeCurrency(currencyString) {
    var result = currencyString.replace(/[R]/, "");
    result = result.replace(/\s/gi, "");
    return Number(result);
}

function formatPercentInput(percent) {
    var raw = decodePercentInput(String(percent));
    return raw+"%";
}

function decodePercentInput(percentString) {
    var result = percentString.replace(/\%/g, "");
    return Number(result);
}

function setCaretPosition(input, start, end) {
    input.setSelectionRange(start,end);
}

function getTransferDuty(pp) {
    for(var i=0; i < FEES.TRANSFER_DUTIES.length; i++) {
        var tier = FEES.TRANSFER_DUTIES[i];
        if(Number(pp) >= tier.FROM && Number(pp) <= tier.TO) {
            return Math.ceil(tier.AMOUNT + (tier.PERC * (Number(pp) - tier.FROM)));
            break;
        }
    }
}

function getDeedsFeeTransfer(pp) {
    for(var i=0; i < FEES.DEEDS_OFFICE_TRANSFER.length; i++) {
        var tier = FEES.DEEDS_OFFICE_TRANSFER[i];
        if(Number(pp) >= tier.FROM && Number(pp) <= tier.TO) {
            return tier.AMOUNT;
            break;
        }
    }
}

function getDeedsFeeBond(pp) {
    for(var i=0; i < FEES.DEEDS_OFFICE_BOND.length; i++) {
        var tier = FEES.DEEDS_OFFICE_BOND[i];
        if(Number(pp) >= tier.FROM && Number(pp) <= tier.TO) {
            return tier.AMOUNT;
            break;
        }
    }
}

function getConveyancyFee(pp) {
    for(var i=0; i < FEES.CONVEYANCING.length; i++) {
        var tier = FEES.CONVEYANCING[i];
        if(Number(pp) >= tier.FROM && Number(pp) <= tier.TO) {
            var fee = FEES.CONVEYANCING[0].AMOUNT;

            if(tier.AMT_PER > 0) {
                var diff = Number(pp) - tier.FROM;
                fee = tier.AMOUNT + ((Math.floor(diff / tier.PER_RANGE)+1) * tier.AMT_PER);
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

function calculatePayment(rate,years,principle) {
    var pvif, pmt;

    pvif = Math.pow( 1 + (rate/12), years*12);
    pmt = (rate/12) / (pvif - 1) * principle * pvif;

    return Math.ceil(pmt);
};