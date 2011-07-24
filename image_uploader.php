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
*  Image upload script to be used with the El File Uploader (developed
*  for the Elemental Framework
*
*************************************************************************** 
**************************************************************************/
session_start();

//  Get the class
include_once("Class/image_uploader.php");

//  Get the posted data
$sessionId = isset($_REQUEST['Session_Id']) ? $_REQUEST['Session_Id'] : '';
$sessionIp = isset($_REQUEST['Session_Ip']) ? $_REQUEST['Session_Ip'] : '';

//  Variables
$result = array();
$uploader = new El_File_Uploader;

$uploader->allowedExtensions = array("jpg", "png");
$uploader->sizeLimit = 8 * 1024 * 1024;  //  8 Meg
$retcode = $uploader->Process_Upload('Uploads/');

// to pass data through iframe you will need to encode all html tags
echo htmlspecialchars(json_encode($uploader->result), ENT_NOQUOTES);
