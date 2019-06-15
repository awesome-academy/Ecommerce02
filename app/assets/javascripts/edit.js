
$(function() {
  $(".parent").select2({
    "allowClear": true,
    "placeholder": {
      "id": "",
      "text": "Parent category"
    }
  });
  $("input.image").fileinput({
    "overwriteInitial": true,
    "initialPreviewAsData": true,
    "browseLabel": "Browse",
    "showRemove": false,
    "showUpload": false,
    "deleteExtraData": {
      "image": "_file_del_",
      "_file_del_": "",
      "_token": "YkDCfkRWPRyZTW2zQVo3IfKy3x6paUJmuFe7BBwx",
      "_method": "PUT"
    },
    "deleteUrl": "https:\/\/demo.s-cart.org\/system_admin\/",
    "allowedFileTypes": ["image"]
  });
  $('.sort:not(.initialized)').addClass('initialized').bootstrapNumber({
    upClass: 'success',
    downClass: 'primary',
    center: true
  });
  $('.status.la_checkbox').bootstrapSwitch({
    size: 'small',
    onText: 'ON',
    offText: 'OFF',
    onColor: 'primary',
    offColor: 'default',
    onSwitchChange: function(event, state) {
      $(event.target).closest('.bootstrap-switch').next().val(state ? 'on' : 'off').change();
    }
  });
  $('.after-submit').iCheck({
    checkboxClass: 'icheckbox_minimal-blue'
  }).on('ifChecked', function() {
    $('.after-submit').not(this).iCheck('uncheck');
  });
});
