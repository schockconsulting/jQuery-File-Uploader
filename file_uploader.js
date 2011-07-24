/************************************************************************** 
*************************************************************************** 
*  Program Name: Schock File Uploader
*  Program Author:  Michael T. Schock
*  Creation Date: 01-20-2011
*  Copyright (c) 2011
*
*************************************************************************** 
***************************************************************************
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*************************************************************************** 
*************************************************************************** 
*  Program Summary:
*  Jquery File Uploader extension
*
*************************************************************************** 
**************************************************************************/


//  Uploader Jquery Plugin
(function( $ ){

	$.fn.fileUploader = function(settings) {
		//  Store the refence
		var containerRef = this;
		var ajaxUpload = false;
		var onSend = function () {};
		var onComplete = function () {};
		var fileBlock;
		
		//  Initial settings of the class
		var options = {
			//  Default Class Vars
			extensions: [],
			sizeLimit: 0,
			file: '',
			name: '',
			text: 'Upload File',
			fileSize: 0,
			getParams: {},
			action: 'image_uploader.php',
			parentCss: { },
			buttonCss: { },
			jqueryUi: false,
			progressBar: true,
			progressBytes: true,
			loadingBar: 'Graphics/loading_bar.gif',
			responseText: '',
			xhrStatus: 0,
			messageBlock: '',
			displayMessage: true,
				
			//  Default Functions
			onSuccess: function () {},
			onError: function () {},
			onSubmit: function () {}
		};
			
		//  Store the reference
		return this.each(function() {        
			// If options exist, lets merge them with our default settings
			if (settings) 
				$.extend( options, settings );
			
			//  Set parent attributes
			_Set_Parent_Attr();
			
			//  Create the input
			_Create_Button();
			
			//  Set upload type
			_Set_Upload_Type();
		});
		
		function _XML_Send()
		{
			//  Variables
			var file;
			var name;
			var xhr;
			
			//  Add the required blocks for progress display
			if(options.progressBar)
				_Create_Progress_Bar();
				
			if(options.progressBytes)
				_Create_Bytes_Display();
				
			if(!options.progressBytes && !options.progressBar)
				_Create_Loading_Bar();
			
			//  Delete the upload button
			containerRef.find('.upload_button').hide();
			
			//  Get the file data 
			file = (containerRef.find('input:file').attr("files"))[0];
			name = file.fileName != null ? file.fileName : file.name;
			size = file.fileSize != null ? file.fileSize : file.size;
			options.fileSize = size;
			
			//  Check for the file size limit
			if(size > options.sizeLimit && options.sizeLimit != '0')
			{
				Set_Error('File is too big.  Please choose another file.');
				return(1);
			}
			
			//  Create the new request
			xhr = new XMLHttpRequest();
			
			//  Set the progress functions
			xhr.upload.onprogress = function(e){
				if(e.lengthComputable)
				{
					_Update_Progress(e.loaded, e.total);
					_Update_Total(e.loaded, e.total);
				}
			};
			
			xhr.addEventListener("progress", function(e) {
				if(e.lengthComputable)
				{
					_Update_Progress(e.loaded, e.total);
					_Update_Total(e.loaded, e.total);
				}
			}, false);
			
			//  Set the complete function
			xhr.onreadystatechange = function () {
				if(xhr.readyState == 4)
				{
					//  Set the total and 100%
					_Update_Progress(options.fileSize, options.fileSize);
					_Update_Total(options.fileSize, options.fileSize);
					
					//  Set vars
					options.responseText = xhr.responseText;
					options.xhrStatus = xhr.status;
					
					//  Remove the meter and bytes
					containerRef.find('.file_progress').remove();
					containerRef.find('.byte_holder').remove();
					
					//  Call complete function
					onComplete();
				}
			};
			
			//  Perform request
			$.extend(options.getParams, {elfile: name});
			var queryString = Encode_Query('image_uploader.php');
			xhr.open("POST", queryString, true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader("X-File_Name", encodeURIComponent(name));
			xhr.setRequestHeader("Content-Type", "application/octet-stream");
			
			//  Perform onSubmit
			options.onSubmit();
			
			xhr.send(file);
		}
		
		function Encode_Query(page)
		{
			//  Variables
			var queryString = page + '?';
			
			//  Parse the GET parameters for the query string
			$.each( options.getParams, function (i, e) {
				queryString = queryString + '&' + encodeURIComponent(i) + '=' + encodeURIComponent(e);
			});
			
			//  Return the string
			return(queryString);
		}
		
		function _XML_Complete()
		{
			//  Variables
			var result;
			var buttonText;
			var button;
			var rand = _Random(0,10000);
			
			//  Check the Ajax status
			if(options.xhrStatus != '200')
			{
				buttonText = 'Ajax send failed.';
			}
			else
			{
				//  Get the results and parse the data
				result = jQuery.parseJSON(options.responseText);
				if(result.result == 'error')
				{
					buttonText = 'Error';
				}
				else
				{
					buttonText = 'Success';
				}
			}
			
			//  Create the button
			if(options.displayMessage)
			{
				button = document.createElement("div");
				button.setAttribute("class", rand + '_message_block');
				containerRef.append(button);
				
				//  Set the CSS for the button
				containerRef.find('.' + rand + '_message_block').css(options.buttonCss);
					
				//  Set the text
				containerRef.find('.' + rand + '_message_block').text(buttonText);
				
				//  Set the rounded corners and button options
				containerRef.find('.' + rand + '_message_block').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
					
				//  Set the class of the message block
				options.messageBlock = rand + '_message_block';
			}
			
			//  Perform additional processing
			if(options.xhrStatus != '200')
			{
				options.onError();
			}
			else
			{
				//  Get the results and parse the data
				result = jQuery.parseJSON(options.responseText);
				if(result.result == 'error')
				{
					options.onError();
				}
				else
				{
					options.onSuccess();
				}
			}
		
		}
		
		function _Iframe_Send()
		{
			//  Variables
			var input;
			var file;
			var name;
			var form;
			var iframe;
			var iframeName = _Random(0,10000);
			var queryString;
			
			//  Pad the iframe name
			iframeName = _String_Pad(iframeName, 0, 10, 'right');
			
			//  Add the required blocks for progress display
			_Create_Loading_Bar();
			
			//  Delete the upload button
			containerRef.find('.upload_button').hide();
			
			//  Get the file object
			file = containerRef.find('input:file')[0];
			file.setAttribute('name', 'elfile');
			
			//  Create holder block
			block = document.createElement('div');
			block.setAttribute('id', 'Block_' + iframeName);
			fileBlock = 'Block_' + iframeName;
			containerRef.append(block);
			
			//  Create the Iframe to handle the upload
			iframe = document.createElement('<iframe src="javascript:false;" name="' + iframeName + '" />');
			iframe.setAttribute('id', iframeName);
			iframe.style.display = 'none';
			$('#' + fileBlock).append(iframe);
			
			//  Create a new form to handle the upload
			form = document.createElement('<form method="post" enctype="multipart/form-data"></form>');
			queryString = Encode_Query('image_uploader.php');
			form.setAttribute('action', queryString);
			form.setAttribute('target', iframe.name);
			form.style.display = 'none';
			$('#' + fileBlock).append(form);
			
			//  Append the input to the form
			containerRef.find('form').append(file);
			
			// Set the load function
			$('#' + iframeName).load( function () { 
				//  Get the result
				options.responseText = iframe.contentDocument ? iframe.contentDocument.body.innerHTML : iframe.contentWindow.document.body.innerHTML;
				
				//  Remove the form block
				$('#' + fileBlock).remove();
				
				//  Hide the loading bar
				containerRef.find('.loader_box').remove();
				
				//  Call complete function
				onComplete();
			});
			
			//  Perform onSubmit
			options.onSubmit();
			
			//  Send the file
			form.submit();
		}
		
		function _Iframe_Complete()
		{
			//  Variables
			var result;
			var buttonText;
			var button;
			var rand = _Random(0,10000);
			
			//  Get the results and parse the data
			result = jQuery.parseJSON(options.responseText);
			if(result.result == 'error')
			{
				buttonText = 'Error';
			}
			else
			{
				buttonText = 'Success';
			}
			
			if(options.displayMessage)
			{
				//  Create the button
				button = document.createElement("div");
				button.setAttribute("class", rand + '_message_block');
				containerRef.append(button);
				
				//  Set the CSS for the button
				containerRef.find('.' + rand + '_message_block').css(options.buttonCss);
					
				//  Set the text
				containerRef.find('.' + rand + '_message_block').text(buttonText);
				
				//  Set the rounded corners and button options
				containerRef.find('.' + rand + '_message_block').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
				
				//  Set the class of the message block
				options.messageBlock = rand + '_message_block';
			}
			
			//  Perform post processing
			result = jQuery.parseJSON(options.responseText);
			if(result.result == 'error')
			{
				options.onError();
			}
			else
			{
				options.onSuccess();
			}
		}
	
		//  Determine the upload type
		function _Set_Upload_Type()
		{
			//  Check for existance of the XMLHttpRequest.upload object
			if(typeof (new XMLHttpRequest()).upload != "undefined")
			{
				//  Set the function for the send action
				onSend = _XML_Send;
				onComplete = _XML_Complete;
			}
			else
			{
				//  Set the function for the send action
				onSend = _Iframe_Send;
				onComplete = _Iframe_Complete;
			}
			
			return(0);
		}
		
		//  Class Functions
		function _Set_Parent_Attr()
		{
			//  Set the specified css from the options.
			containerRef.css(options.parentCss);
		}
		
		//  Create the file input
		function _Create_Button()
		{
			//  Variables
			var input;
			var button;
			
			//  Create the button
			button = document.createElement("div");
			button.setAttribute("class", "upload_button");
			containerRef.append(button);
			
			//  Set the CSS for the button
			containerRef.find('.upload_button').css({
					position: 'relative',
					overflow: 'hidden',
					direction: 'ltr',
					width: '100%',
					textAlign: 'center' }).css(options.buttonCss);
				
			//  Set the text
			containerRef.find('.upload_button').text(options.text);
			
			//  Check for the jQuery UI options
			if(options.jqueryUi && jQuery.ui)
			{
				//  Set the rounded corners and button options
				containerRef.find('.upload_button').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
				
				//  Set the mouse over and out
				containerRef.find('.upload_button').mouseover( function () { $(this).addClass('ui-state-hover');});
				containerRef.find('.upload_button').mouseout( function () { $(this).removeClass('ui-state-hover ui-state-focus ui-state-active');});
				containerRef.find('.upload_button').mousedown( function () { $(this).addClass('ui-state-focus ui-state-active');});
				containerRef.find('.upload_button').mouseup( function () { $(this).removeClass('ui-state-focus ui-state-active');});
			}
			
			//  Create the input
			input = document.createElement("input");
			input.setAttribute("type", "file");
			input.setAttribute("name", "file_uploader");
			
			//  Append the input to the container element
			containerRef.find('.upload_button').append(input);
			
			//  Set the CSS of the file input
			containerRef.find('input:file').css({
				position:'absolute',
				right:0,
				top:0,
				fontFamily:'Arial',
				fontSize:'118px',
				margin:0,
				padding:0,
				cursor:'pointer',
				opacity:0});
				
			//  Set the on change event
			containerRef.find('input:file').change(function() { onSend();});
			
		}
		
		//  Create loading bar
		function _Create_Loading_Bar()
		{
			//  Variables
			var buttonWidth;
			var boxWidth;
			var loaderBox;
			var loaderImg;
			
			//  Get the button width
			buttonWidth = containerRef.find('.upload_button').attr('offsetWidth');
			
			//  Create a new div and image
			loaderImg = document.createElement("img");
			loaderImg.setAttribute("src", options.loadingBar);
			loaderImg.setAttribute("width", buttonWidth);
			loaderImg.setAttribute("height", buttonWidth*0.25);
			
			loaderBox = document.createElement("div");
			loaderBox.setAttribute("class", "loader_box");
			containerRef.append(loaderBox);
			
			//  Add the loader image
			containerRef.find('.loader_box').append(loaderImg);
			
			
		}
		
		//  Create progress bar
		function _Create_Progress_Bar()
		{
			//  Variables
			var progress;
			var inner;
			
			//  Create the block
			progress = document.createElement("div");
			progress.setAttribute("class", "file_progress");
			containerRef.append(progress);
			
			//  Check for jquery UI
			if(options.jqueryUi && jQuery.ui)
			{
				//  Create the progess bar
				containerRef.find('.file_progress').progressbar({value:0}).css('width', containerRef.find('.upload_button').css('width')).css('height', '10px');
			}
			else
			{
				//  Create the progress box
				containerRef.find('.file_progress').css('width', containerRef.find('.upload_button').css('width')).css('height', '10px');
				
				//  Create the inner box
				inner = document.createElement("div");
				inner.setAttribute("class", "file_progress_inner");
				containerRef.find('.file_progress').append(inner);
				containerRef.find('.file_progress_inner').css('margin', '5px 0 5px 0').css('height', '10px').css('width', '0%').css('background-color', 'blue');
			}
		}
		
		//  Create bytes and percent holder
		function _Create_Bytes_Display()
		{
			//  Vars
			var holder;
			var bytes;
			var percent;
			
			
			//  Create the new display block
			holder = document.createElement("div");
			holder.setAttribute("class", "byte_holder");
			holder.setAttribute("style", "font-size:.5em;");
			
			//  Add to the parent element
			containerRef.append(holder);
			
			//  Create the bytes titles
			bytes = document.createElement("div");
			bytes.setAttribute("style", "width:70%; float:left; text-align:center;");
			bytes.innerHTML = "Percent";
			containerRef.find('.byte_holder').append(bytes);
			percent = document.createElement("div");
			percent.setAttribute("style", "margin-left:5%; width:20%; float:left; text-align:center;");
			percent.innerHTML = "%";
			containerRef.find('.byte_holder').append(percent);
			containerRef.find('.byte_holder').append("<br style=\"bclear\" />");
			
			//  Create the bytes display items
			bytes = document.createElement("div");
			bytes.setAttribute("style", "width:70%; float:left; text-align:right;");
			bytes.setAttribute("class", "bytes_counter ui-widget-content");
			bytes.innerHTML = "0";
			containerRef.find('.byte_holder').append(bytes);
			percent = document.createElement("div");
			percent.setAttribute("style", "margin-left:5%; width:20%; float:left; text-align:right;");
			percent.setAttribute("class", "bytes_percent ui-widget-content");
			percent.innerHTML = "0";
			containerRef.find('.byte_holder').append(percent);
			containerRef.find('.byte_holder').append("<br style=\"bclear\" />");
			
		}
		
		//  Progress Bar Update
		function _Update_Progress(loaded, total)
		{
			//  Variables
			var percentProg;
			
			//  Set the percent progress
			percentProg = Math.round(loaded / total * 100);
			if(options.jqueryUi && jQuery.ui)
			{
				containerRef.find('.file_progress').progressbar({value:percentProg});
			}
			else
			{
				containerRef.find('.file_progress_inner').css('width', percentProg + '%');
			}
		}
		
		function _Update_Total(loaded, total)
		{
			//  Variables
			var percentProg;
			
			//  Set the percent progress
			percentProg = Math.round(loaded / total * 100);
			containerRef.find('.bytes_counter').text(loaded);
			containerRef.find('.bytes_percent').text(percentProg);
		}
		
		//  Random number
		/*  Function to return a random number within a range.
			
			Input:
				min: Minimum integer value (positive values only)
				max:  Maximum integer value  (positive values only)
				precision:  Number of digits (optional).  Default:0
			Return:
				rand:  Random value.
		*/
		function _Random(min, max, precision)
		{	
			//  Variables
			var rand = 0;
			
			//  Ensure positive
			min = Math.abs(min);
			max = Math.abs(max);
			precision = Math.abs(precision);
			
			//  Set the random value
			rand = min+(Math.random()*(max-min));
			rand = (typeof floatVal=='undefined') ? Math.round(rand) : rand.toFixed(precision);
			
			//  Return value
			return (rand);
		}

		//  String Pad
		/*  This function will pad a variable.   
			
			Input:  
				dataString:  String to pad.
				pad:  String to use as a pad value.
				size:  The length of the final string.
				orientation:  Right or left padding.  (Values:  right, left).
			Return:
				dataString:  Final string after the pad.
		*/
		function _String_Pad(dataString, pad, size, orientation)
		{
			//  Variables
			var loop;
			var padData = '';
		
			//  Negative check
			if(size < 0)
				size = 0;
		
			//  Size check
			if(String(dataString).length >= size)
				return(dataString);
		
			//  Loop through and create the pad
			for(loop = (String(dataString).length); loop < size; loop++)
			{
				if(padData == '')
					padData = String(pad);
				else
					padData = String(padData) + String(pad);
			}
		
			//  Append the string to the pad
			if(orientation == 'right')
				dataString = String(padData) + String(dataString);
			else
				dataString = String(dataString) + String(padData);
		
			//  Return the data
			return(dataString);
		}

	};
	
})( jQuery );