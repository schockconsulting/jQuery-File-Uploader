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
*  Test Page
*
*************************************************************************** 
**************************************************************************/


$(document).ready(
function () 
{
	New_Image();
});


function New_Image()
{
	//  Variables
	var rand;
	
	//  Create the new container div
	rand = Math.floor(Math.random()*1001);
	container = document.createElement('div');
	container.setAttribute('id', 'Thumb_Add_' + rand);
	container.setAttribute('style', 'width:120px; margin:5px; float:left; text-align:center;');
	
	//  Append the div to the Gallery container
	$('#Image_Holder br').before(container);
	
	//  Another test
	$('#Thumb_Add_' + rand).fileUploader({
		sizeLimit:(8 * 1024 * 1024),
		jqueryUi: true,
		displayMessage: true,
		parentCss: { marginTop: '50px' },
		text: 'Upload New File',
		buttonCss: { fontSize: '8pt', padding: '5px', border: 'solid black 1px' },
		getParams: {
			Session_Id: $('#Session_Id').val(),
			Session_Ip: $('#Session_Ip').val()
		},
		onSuccess: function () {
			var self = this;
			var res = jQuery.parseJSON(self.responseText);
			
			//  Create a new image uploader
			New_Image();
		},
		onError: function () {
			var self = this;
			var res = jQuery.parseJSON(self.responseText);
			
			//  Create a new image uploader
			New_Image();
		}
	});
}