
function dowork() {
    var dd = new Date("2023-08-11T01:07:10")
    console.log("dd", dd.toISOString())
    var today = new Date()
    console.log("to", today.toISOString())
    var isOpenForEdit = dd > today
    console.log("isOpenForEdit", isOpenForEdit)
}

dowork()