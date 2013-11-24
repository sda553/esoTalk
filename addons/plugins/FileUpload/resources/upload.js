$(function() {

	function createUUID() {
		// http://www.ietf.org/rfc/rfc4122.txt
		var s = new Array(36);
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}
	
	$("#reply .upload input").tooltip({alignment: "center"});
	
	$('#fileupload').fileupload({
		url: ET.webPath+'/fileupload/upload',
		dataType: 'json',
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		start: function (e, data) {
			for (var msg in ETMessages.messages) {
				if (msg.indexOf('fileUploadFail-') == 0) ETMessages.hideMessage(msg);
			}
			$(this).siblings('.fileupload-process').addClass('fileupload-process-active');
		},
		stop: function (e, data) {
			$(this).siblings('.fileupload-process').removeClass('fileupload-process-active');
			$(this).prop('title', T('plugin.FileUpload.uploadTitle'));
		},
		done: function (e, data) {
			var insertText = '';
			var errorText = '';

			$.each(data.result.files, function (index, file) {
				if (typeof(file.error) != 'undefined') {
					var errDesc = T("plugin.FileUpload.message.uploadError");
					errDesc = errDesc.replace('%1', file.name).replace('%2', file.error);
					errorText = (errorText != '' ? '<br>' : '') + errorText + errDesc + '';
				} else if (typeof(file.url) != 'undefined') {
					insertText = insertText + '[img]' + file.url + '[/img]\n'
				}
			});
			
			var id = 'reply';
			var textarea = $("#"+id+" textarea");
			if (insertText != '') {
				ETConversation.replaceText($("#"+id+" textarea"), insertText);
				textarea.trigger('input');
			}
			if (errorText != '') {
				ETMessages.showMessage(errorText, {className: "warning dismissable", id: "fileUploadFail-" + createUUID()});
			}
		},
		fail: function (e, data) {
			ETMessages.showMessage(T("plugin.FileUpload.message.serverDisconnected"), {className: "warning dismissable", id: "fileUploadFail"});
		},
		progressall: function (e, data) {
			//var progress = parseInt(data.loaded / data.total * 100, 10);
		}

	});

});