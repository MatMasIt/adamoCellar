function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
$(".addP").click(function addItem() {
    $("[name=vino]").val("");
    $("[name=cantina]").val("");
    $("[name=annata]").val("");
    $("[name=volume]").val("");
    $("[name=quantita]").val("");
    $("[name=note]").val("");
    $("#tableview").hide();
    $("#saveedit").show();
    formAction = "new";
});
$(".closeForm").click(function addItem() {
    $("#tableview").show();
    $("#saveedit").hide();
    $("#view").hide();
    $("#chpass").hide();
    $("#find").hide();
});
$("#saveedit").hide();
var pageSize = 20, lastPage = 0, formAction = "new", lastId = 0;
function updateTable(pageNum) {
    lastPage = pageNum;
    $.getJSON("api.php?intent=list&pageSize=" + pageSize + "&pageNum=" + pageNum + ("&" + $("#find").serialize()).replaceAll("&S", "&") + "&orderBy=" + $("[name=orderBy]").val() + "&orderHow=" + $("[name=orderHow]").val(), function (data) {
        $("#pageIndicator").text("Pagina " + (parseInt(pageNum) + 1) + " di " + data["pagTot"]);
        $("#tabnav").html("");
        for (let i = 0; i < data["pagTot"]; i++) {
            var act = "";
            if (i == pageNum) act = "active";
            $("#tabnav").append('<li class="page-item ' + act + '"><a class="page-link" href="#" data-pageNum="' + i + '">' + (i + 1) + '</a></li>')
        }
        $("#tabbody").html("");
        data["rows"].forEach(function iterate(value) {
            $("#tabbody").append(`<tr>
                <th scope="row">`+ htmlEntities(value["id"]) + `</th>
                <td>`+ htmlEntities(value["vino"]) + `</td>
                <td>`+ htmlEntities(value["cantina"]) + `</td>
                <td>`+ htmlEntities(value["annata"]) + `</td>
                <td>`+ htmlEntities(value["volume"]) + ` ℓ</td>
                <td>`+ htmlEntities(value["quantita"]) + `</td>
                <td>`+ htmlEntities(value["note"]) + `</td>
                <td class="actionsCell">
                    <a href="#" data-action="view" data-id="`+ htmlEntities(value["id"]) + `">
                        <img class="actionIcon" src="img/view.png">
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a href="#" data-action="edit" data-id="`+ htmlEntities(value["id"]) + `">
                        <img class="actionIcon" src="img/edit.png">
                    </a>
                    &nbsp;&nbsp;&nbsp;
                    <a href="#" data-action="delete" data-id="`+ htmlEntities(value["id"]) + `">
                        <img class="actionIcon" src="img/bin.png">
                    </a>
                </td>
            </tr>`);
        });
    });
}
updateTable(0);
$(document).delegate(".page-link", "click", function pageChange() {
    updateTable($(this).attr("data-pageNum"));
});
$(document).delegate("[data-action=delete]", "click", function delElEvent() {
    if (confirm("Eliminare? (questa azione è irreversibile)")) {
        $.getJSON("api.php?intent=delete&id=" + $(this).attr("data-id"), function delSend() {
            updateTable(lastPage);
            $("#tableview").show();
            $("#saveedit").hide();
            $("#view").hide();
        });
    }
});
$(document).delegate("[data-action=edit]", "click", function editElEvent() {
    lastId = $(this).attr("data-id");
    $.getJSON("api.php?intent=get&id=" + $(this).attr("data-id"), function editEvent(data) {
        formAction = "edit";
        $("[name=vino]").val(data["vino"]);
        $("[name=cantina]").val(data["cantina"]);
        $("[name=annata]").val(data["annata"]);
        $("[name=volume]").val(data["volume"]);
        $("[name=quantita]").val(data["quantita"]);
        $("[name=note]").val(data["note"]);
        $("#tableview").hide();
        $("#saveedit").show();
    });
})
$(document).delegate("[data-action=view]", "click", function editElEvent() {
    var idTemp = $(this).attr("data-id");
    $.getJSON("api.php?intent=get&id=" + idTemp, function editEvent(data) {
        $("#Vid").html(idTemp);
        $("#Vvino").html(data["vino"]);
        $("#Vcantina").html(data["cantina"]);
        $("#Vannata").html(data["annata"]);
        $("#Vvolume").html(data["volume"] + " ℓ");
        $("#Vquantita").html(data["quantita"]);
        $("#Vnote").html(data["note"]);
        $("#Vdelete").attr("data-id", idTemp);
        $("#view").show();
        $("#tableview").hide();
    });
})
$("#saveedit").submit(function (e) {
    e.preventDefault();
    switch (formAction) {
        case "edit":
            $.getJSON("api.php?intent=update&id=" + lastId + "&" + $(this).serialize(), function editEvent(data) {
                $("#tableview").show();
                $("#saveedit").hide();
                updateTable(lastPage);
            });
            break;

        case "new":
            $.getJSON("api.php?intent=add&" + $(this).serialize(), function editEvent(data) {
                $("#tableview").show();
                $("#saveedit").hide();
                updateTable(lastPage);
            });
            break;
    }
    return false;
});
$('[name=vino]').autoComplete({
    resolver: 'custom',
    events: {
        search: function (qry, callback) {
            // let's do a custom ajax call
            $.ajax(
                'api.php',
                {
                    data: { "intent": "complete", 'query': qry, "type": "vino" }
                }
            ).done(function (res) {
                callback(res)
            });
        }
    }
});
$('[name=cantina]').autoComplete({
    resolver: 'custom',
    events: {
        search: function (qry, callback) {
            // let's do a custom ajax call
            $.ajax(
                'api.php',
                {
                    data: { "intent": "complete", 'query': qry, "type": "cantina" }
                }
            ).done(function (res) {
                callback(res)
            });
        }
    }
});
$('[name=annata]').autoComplete({
    resolver: 'custom',
    events: {
        search: function (qry, callback) {
            // let's do a custom ajax call
            $.ajax(
                'api.php',
                {
                    data: { "intent": "complete", 'query': qry, "type": "annata" }
                }
            ).done(function (res) {
                callback(res)
            });
        }
    }
});
$('[name=note]').autoComplete({
    resolver: 'custom',
    events: {
        search: function (qry, callback) {
            // let's do a custom ajax call
            $.ajax(
                'api.php',
                {
                    data: { "intent": "complete", 'query': qry, "type": "note" }
                }
            ).done(function (res) {
                callback(res)
            });
        }
    }
});
$("#passwAccess").submit(function access(e) {
    e.preventDefault();
    $.getJSON("api.php?intent=access&password=" + $("[name=password]").val(), function editEvent(data) {
        if (data["ok"]) {
            $("#passwAccess").hide();
            $("#tableview").show();
            $(".loggedInMenu").show();
        }
        else {
            alert("Credenziali errate");
        }
    });
    return false;
});
$("#chpass").submit(function access(e) {
    e.preventDefault();
    $.getJSON("api.php?intent=updatePassword&password=" + $("[name=Upassword]").val(), function editEvent(data) {
        $("#chpass").hide();
        $("#tableview").show();
    });
    return false;
});
$(".logout").click(function () {
    location.reload();
})
$(".chpassBtn").click(function () {
    $("#find").hide();
    $("#tableview").hide();
    $("#chpass").show();
});
$(".search").click(function () {
    $("#find").show();
    $("#tableview").show();
    $("#chpass").hide();
});
$("#find").submit(function access(e) {
    e.preventDefault();
    updateTable(lastPage);
    return false;
});
$(".resetR").click(function () {
    $("#find")[0].reset();
    $("#tableview").show();
    $("#saveedit").hide();
    $("#view").hide();
    $("#chpass").hide();
    $("#find").hide();
    updateTable(lastPage);
});
$('[name=orderBy],[name=orderHow]').on('change', function () {
    updateTable(lastPage);
});