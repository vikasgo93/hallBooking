const start = datepicker(document.querySelector('#startDate'),{
    onSelect: (instance, date) => {
        //console.log(date.toLocaleDateString())
        document.getElementById('startDateInput').value=date.toLocaleDateString();
    }
})
const end = datepicker(document.querySelector('#endDate'), {
    onSelect: (instance, date) => {
        //console.log(date.toLocaleDateString())
        document.getElementById('endDateInput').value=date.toLocaleDateString();
    }
})

//console.log(startDate, endDate);
