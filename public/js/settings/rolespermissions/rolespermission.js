var languagedata
/**This if for Language json file */
$(document).ready(async function () {

    var languagepath = $('.language-group>button').attr('data-path')
  
    await $.getJSON(languagepath, function (data) {
        
        languagedata = data
    })
});

/**Save & Update Btn*/
$(document).on('click', '.saverolperm', function () {
    setTimeout(function () {
        $('.input-group-error')[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
    $("#roleform").validate({
        rules: {
            name: {
                required: true,
                space: true,
                maxlength: 100,
                // duplicatename: true
            },
            description: {
                required: true,
                space: true,
                maxlength: 250,
            }
        },
        messages: {
            name: {
                required: "* " + languagedata.Roless.rolenamevalid,
                space: "* " + languagedata.spacergx,
                maxlength: "* "+languagedata.Permission.rolechat,
                // duplicatename: "* Role already exits",
            },
            description: {
                required: "* " + languagedata.Roless.roledescvalid,
                maxlength: "* "+languagedata.Permission.descriptionchat

            }
        }
    });

    var formcheck = $("#roleform").valid();
    if (formcheck == true) {
        var id = $("#rolid").val()
        var value = $("#rolename").val()
        var url = window.location.search;
        const urlpar = new URLSearchParams(url);
        pageno = urlpar.get('page');

    if (pageno == null) {
        pageno = "1";
    }
        $.ajax({
            url: "/settings/roles/checkrole",
            type: "POST",
            async: false,
            data: { "name": value, "id": id, csrf: $("input[name='csrf']").val() },
            datatype: "json",
            caches: false,
            success: function (data) {
                if (data.role == true) {

                    $('#rolename-error').text("* "+languagedata.Permission.roleexist).show();
                    $('#rolen').addClass('input-group-error');
                }
                if (data.role == false) {
                    $('#roleform')[0].submit();
                    console.log("submit")
                    var url = $("#url").val()

                    var rolename = $("#rolename").val();

                    var roledesc = $('#roledesc').val();

                    var roleid = $('#rolid').val();

                    var permissionid = []

                    $(".roleperm").each(function () {
                        if ($(this).prop("checked")) {
                            permissionid.push($(this).attr('data-id'))
                        }
                    })
                    $.ajax({
                        url: url,
                        type: "POST",
                        async: false,
                        data: { "rolename": rolename, "roledesc": roledesc, "permissionid": permissionid, csrf: $("input[name='csrf']").val(), "roleid": roleid },
                        datatype: "json",
                        caches: false,
                        success: function (data) {
                            if(data.role == "added"){
                            setCookie('get-toast','Role Created Successfully',1)
                            setCookie('Alert-msg','success',1)
                            window.location.href = "/settings/roles?page="+pageno
                        }
                        if(data.role == "updated"){
                            setCookie('get-toast','Role Updated Successfully',1)
                            setCookie('Alert-msg','success',1)
                            window.location.href = "/settings/roles?page="+pageno
                        }
                        }
                    })
                }
            }
        })



    }
    else {
        Validationcheck()
        $(document).on('keyup', ".field", function () {
            Validationcheck()
        })

    }




})

/**Edit Get Data from backend */
$(document).on('click', '.roledit', function () {
    var id = $(this).attr('data-id');
    $('#rolid').val(id);
    Editrole(id,languagedata)

    var url = window.location.search;
    const urlpar = new URLSearchParams(url);
    pageno = urlpar.get('page');

    $("#pageno").val(pageno)

})

$(document).on('click', '.add-new', function () {

    $('.saverolperm').text('Save');

    $('.roleperm').attr('checked', false);

    $('#rolename').val("")

    $('#roledesc').text("")

    $('.modal-header').children('h3').text(languagedata.Rolecontent.addnewrole +' & '+languagedata.Rolecontent.setpermisson)

    $('#url').val('/settings/roles/createrole')
})

/** Delete Role & Permission */
$(document).on('click', '.roldel', function () {

    var id = $(this).attr('data-id')

    var name = $(this).parents('tr').children('td:first').text();

    $('.deltitle').text(languagedata.Roless.deleterole)

    $('.deldesc').text(languagedata.Roless.delrole)

    $('.delname').text(name)

    var url = window.location.search;
     const urlpar = new URLSearchParams(url);
     pageno = urlpar.get('page');


    $('#delete').attr('href', '/settings/roles/deleterole?id=' + id +"&page=" +pageno)

})

/**Search clear */
$(document).on('keyup', '#searchroles', function () {

    if ($('.search').val() === "") {
        window.location.href = "/settings/roles/"

    }

})

/*search */
$(document).on("click", "#filterformsubmit1", function () {
    var key = $(this).siblings().children(".search").val();
    if (key == "") {
        window.location.href = "/settings/roles/"
    } else {
        $('.filterform').submit();
    }
})

/**Role isactive status */
function RoleStatus(id) {
    $('#cb' + id).on('change', function () {
        this.value = this.checked ? 1 : 0;
    }).change();
    var isactive = $('#cb' + id).val();
    $.ajax({
        url: '/settings/roles/roleisactive',
        type: 'POST',
        async: false,
        data: {
            id: id,
            isactive: isactive,
            csrf: $("input[name='csrf']").val()
        },
        dataType: 'json',
        cache: false,
        success: function (result) {
            notify_content = '<div class="toast-msg sucs-green"> <a id="cancel-notify"> <img src="/public/img/x-black.svg" alt="" class="rgt-img" /></a> <img src="/public/img/group-12.svg" alt="" class="left-img" /> <span>'+languagedata.Toast.rolestatupdnotify+'</span></div>';
            $(notify_content).insertBefore(".header-rht");
            setTimeout(function () {
                $('.toast-msg').fadeOut('slow', function () {
                    $(this).remove();
                });
            }, 5000); // 5000 milliseconds = 5 seconds
        }
    });
}

function Validationcheck() {

    if ($('#rolename').hasClass('error')) {
        $('#rolen').addClass('input-group-error');
    } else {
        $('#rolen').removeClass('input-group-error');
    }

    if ($('#roledesc').hasClass('error')) {
        $('#roledes').addClass('input-group-error');
    } else {
        $('#roledes').removeClass('input-group-error');
    }
}

//**close button function */
$(document).on('click', '.close', function () {
    $('#roleform')[0].reset();
    $('label.error').remove()
    $('.input-group').removeClass('input-group-error')

})

//**description focus function */
const Desc = document.getElementById('roledesc');
const inputGroup = document.querySelectorAll('.input-group');

Desc.addEventListener('focus', () => {

    Desc.closest('.input-group').classList.add('input-group-focused');
});
Desc.addEventListener('blur', () => {
    Desc.closest('.input-group').classList.remove('input-group-focused');
});

$(document).on('click', '#configure', function () {
    var id = $(this).attr('data-id');
    $('#rolid').val(id);
    Editrole(id,languagedata)
    setTimeout(function () {
        $('.permissionsection')[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
});

$(document).on('click', '#manage', function () {
    var id = $(this).attr('data-id');
    $('#rolid').val(id);
    Editrole(id,languagedata)
    setTimeout(function () {
        $('.permissionsection')[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
});

function Editrole(id,languagedata) {
    $.ajax({
        url: "/settings/roles/getroledetail",
        type: "POST",
        async: false,
        data: { "id": id, csrf: $("input[name='csrf']").val() },
        datatype: "json",
        caches: false,
        success: function (result) {
            let jsonrole = $.parseJSON(result);
            console.log("ss", result, jsonrole);
            $('#rolename').val(jsonrole.role.Name)
            $('#roledesc').text(jsonrole.role.Description)
            if (jsonrole.permissionid != null) {
                for (let x of jsonrole.permissionid) {
                    $("#Check" + x).attr('checked', true)
                }
            }
            $('.modal-header').children('h3').text(languagedata.updaterole+' / '+languagedata.Setting.managepermissions)
        }
    })

    $('#url').val('/settings/roles/updaterole');

    $('.saverolperm').text('Update');

}