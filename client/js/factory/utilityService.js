'use strict';

app.factory('utilityService', [function($http, $q){

    var utilityService = {
        getFormattedDate: function(date){
            var hours = date.getHours();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            var formattedDate = date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;

            return formattedDate;
        }
    }

    return utilityService;
}]);
