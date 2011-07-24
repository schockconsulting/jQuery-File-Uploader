<?php
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
	//  Start the session
	session_start();
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>File Uploader Test</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
	<meta name="copyright" content="Copyright (c) Schock Consulting LLC , All Rights Reserved.">	
	<link type="text/css" href="jquery-ui-1.8.6.custom.css" rel="stylesheet" />
	<script type="text/javascript" src="jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="jquery-ui-1.8.6.custom.min.js"></script>
	<script type="text/javascript" src="file_uploader.js"></script>
	<script type="text/javascript" src="test.js"></script>
</head>

<body style="text-align:center;">
	<?php
		//  Create some hidden varibles
		print "<input type=\"hidden\" id=\"Session_Id\" name=\"Session_Id\" value=\"".session_id()."\"></input>\n";
		print "<input type=\"hidden\" id=\"Session_Ip\" name=\"Session_Ip\" value=\"".$_SERVER["REMOTE_ADDR"]."\"></input>\n";
	?>
	<div id="Image_Holder" style="width:60%; margin:auto; height:700px; border:solid black 1px; color:black">
	
	<br style="clear:both;"/>
	</div>
</body>
</html>