var getData = function () {$.getJSON("http://localhost:3000/tracks/",
function (data) {
    let items = [];
    $.each(data, function (indexInArray, valueOfElement) { 
         items.push("<li id='"+indexInArray+"'>"+valueOfElement+"</li")
    });

    $("<ul>",{
        "class": "my-new-list",
        html: items.join("")
    }).appendTo("body");
}
);
}
getData();