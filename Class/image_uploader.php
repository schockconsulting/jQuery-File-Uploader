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
*  File upload class.
*
*************************************************************************** 
**************************************************************************/

//  Elemental File Uploader
/*  This class will be used for uploading of images from the File Uploader jquery plugin  */
class El_File_Uploader 
{
	//  Public Class Variables
	/*
		$allowedExtensions ->  File extensions that are allowed.
		$sizeLimit ->  Maximum file size allowed.
		$filename ->  Final file name for the image.
		$result ->  String for return.
	*/
	public $allowedExtensions = array();
	public $sizeLimit = 0;
	public $filename = '';
	public $result;
	
	//  Private Class Variables
	/*
		$file ->  This will point to a class that handles the upload
		$ext ->  Extension for the file.
		$postSize ->  Limit for the size of the post.
		$uploadSize ->  Limit for the size of the total upload.
	*/
	private $file;
	private $ext;
	private $postSize;
	private $uploadSize;

	//  Constructor
	/*  This function will set the allowed extensions, check the server and set up the upload type.
		
		Input:
			none
			
		Return:
			0:  Success
			or Die
	*/
	function __construct()
	{
		//  Variables
		$retcode = 0;
		
		//  Set all extensions to lower case
		$this->allowedExtensions = array_map("strtolower", $this->allowedExtensions);
		
		//  Verify server settings
		$retcode = $this->Check_Server_Settings();
		if($retcode)
			die(json_encode($this->result, ENT_NOQUOTES));
		
		//  Determine type of upload
		if (isset($_GET['elfile']))	//  Uploaded from ajax
		{
			$this->file = new El_Uploaded_File_Xhr();
		} 
		elseif (isset($_FILES['elfile']))	//  Uploaded from Iframe
		{
			$this->file = new El_Uploaded_File_Form();
		} 
		else 	//  No upload
		{
			$this->file = false; 
		}
		
		//  Success
		return(0);
	}

	//  Check Server Settings
	/*  This function will check to see if the server file size limits are acceptable.
		
		Input:
			none
			
		Return:
			0:  Success
			1:  Failed
	*/
	private function Check_Server_Settings()
	{
		//  Check individual post and total upload size
		$this->postSize = $this->To_Bytes(ini_get('post_max_size'));
		$this->uploadSize = $this->To_Bytes(ini_get('upload_max_filesize'));
		
		//  Check for 0
		if($this->postSize == 0 || $this->uploadSize == 0)
		{
			$this->result = array ( 'result' => 'error', 'error' => "Failed to retrieve sizes from the server.");
			return(1);
		}
		
		//  Success
		return(0);
	}
	
	//  Convert String Size to Bytes
	/*  This function will take a string representation of a number (2M, 4G, 5K, etc...) and 
		convert it to the number of bytes.  If a number is passed, a number is returned.
		
		Input:
			$str:  String for conversion.
			
		Return:
			$val:  Value of the string.
	*/
	private function To_Bytes($str)
	{
		//  Variables
		$val = '';
		$last = '';
		
		//  Remove any blank leading spaces
		$val = trim($str);
		
		//  Check for blank
		if(strlen($val) == 0)
			return(0);
			
		//  Get the multiplier (M, G, K);
		$last = strtolower($str[strlen($str)-1]);
		
		//  Perform the multiplication
		switch($last) 
		{
			case 'g': $val *= 1024;
			case 'm': $val *= 1024;
			case 'k': $val *= 1024;
				break;
			default:
				break;
		}
		
		//  Success
		return $val;
	}
	
	//  Process Upload
	/*  This function will process the uploaded data.  The function will perform an error
		check then see if the file needs to be overwritten or not.
		
		Input:
			$uploadDir:  Directory to upload files to.
			$replace:  (TRUE or FALSE).  Whether or not to replace the file.
			
		Return:
			0:  Success
			1:  Failed
	*/
	function Process_Upload($uploadDir = UPLOAD_DIR, $replace = FALSE)
	{
		//  Variables
		$file = '';
		$retcode = array();
		
		//  Perform error checking
		$retcode = $this->Upload_Error_Check($uploadDir);
		if($retcode)
			return(1);
		
		
		//  Determine if we are replacing the file
		if(!$replace)
		{
			//  Check for existance and if so, append a random number
			while (file_exists($uploadDir.$this->filename.'.'.$this->ext)) 
			{
				$this->filename .= rand(10, 99);
			}
		}
		
		//  append the extension to the filename
		$this->filename = $this->filename.'.'.$this->ext;
		
		//  Perform the save
		if ($this->file->Save($uploadDir.$this->filename))
		{
			$this->result = array('result' => 'error', 'error'=> "Could not save uploaded file.  ".$this->file->result);
			return(1);
		}
		
		//  Success 
		$this->result = array('result' => 'success', 'filename'=>$this->filename, 'dir'=>$uploadDir, 'size'=>$this->file->Get_Size());
		return(0);
	} 

	//  Upload Error Check
	/*  This function will check appropriate data to see if there are any errors.
		
		Input:
			$uploadDir:  Directory to upload files to.
			
		Return:
			0:  Success
			1:  Failed
	*/
	private function Upload_Error_Check($uploadDir)
	{
		//  Variables
		$size = 0;
		$pathInfo = '';
		$fileInfo = '';
		
		//  Verify directory is writeable
		if (!is_writable($uploadDir))
		{
			$this->result = array('result' => 'error', 'error' => "Server error. Upload directory isn't writable.");
			return(1);
		}
		
		//  Verify class is selected for file operations
		if (!$this->file)
		{
			$this->result = array('result' => 'error', 'error' => 'No files were uploaded.');
			return(1);
		}
		
		//  Get the file size
		$size = $this->file->Get_Size();
		
		//  Check for empty file
		if ($size == 0) 
		{
			$this->result = array('result' => 'error', 'error' => 'File is empty');
			return(1);
		}
		
		//  Check for too large file (Probably will error php before getting this).
		if ($size > $this->sizeLimit) 
		{
			$this->result = array('result' => 'error', 'error' => 'File is too large');
			return(1);
		}
		
		//  Verify size limits
		if ($this->postSize < $this->sizeLimit || $this->uploadSize < $this->sizeLimit)
		{
			$size = max(1, $this->sizeLimit / 1024 / 1024) . 'M';
			$this->result = array ('result' => 'error', 'error' => "Increase post_max_size and upload_max_filesize to ".$size);
			return(1);
		}
		
		//  Get the file info
		$fileInfo = $this->file->Get_Name();
		if($fileInfo == '')
		{
			$this->result = array('result' => 'error', 'error' => 'File name is not set.');
			return(1);
		}
			
		//  Parse the info and set variables
		$pathinfo = pathinfo($fileInfo);
		$this->filename = $pathinfo['filename'];
		$this->ext = $pathinfo['extension'];
		
		if($this->allowedExtensions && !in_array(strtolower($this->ext), $this->allowedExtensions))
		{
			$these = implode(', ', $this->allowedExtensions);
			$this->result = array('result' => 'error', 'error' => "File has an invalid extension, it should be one of ".$these.".");
			return(1);
		}
		
		//  Success
		return(0);
	}
}


//  El Ajax Uploader
/*  This class will parse the input from a GET Ajax stream and save it to the appropriate location.  */
class El_Uploaded_File_Xhr 
{
	//  Public Class Variables
	/*
		$result ->  String for return.
	*/
	public $result;
	
	//  Save
	/*  This function will process the uploaded data.
		
		Input:
			$path:  Full path to the file.
			
		Return:
			0:  Success
			1:  Failed
	*/
	function Save($path) 
	{
		//  Variables
		$input = '';
		$temp = '';
		$realsize = 0;
		$target = '';
		
		//  Set the input
		$input = fopen("php://input", "r");
		
		//  Create a new temp file for storage
		$temp = tmpfile();
		
		//  Copy the file stream to the new temp file.
		$realSize = stream_copy_to_stream($input, $temp);
		
		//  Close the file stream
		fclose($input);
		
		//  Check for file size mismatch
		if ($realSize != $this->Get_Size())
		{
			$this->result = array('result' => 'error', 'error' => 'File size mismatch.');
			return(1);
		}
		
		//  Open the path to the file
		$target = fopen($path, "w");
		
		//  Reset the file pointer for the temp file (This is necessary).
		fseek($temp, 0, SEEK_SET);
		
		//  Copy the temp file stream to the final file stream
		stream_copy_to_stream($temp, $target);
		
		//  Close the final file stream
		fclose($target);
		
		//  Success
		return(0);
	}
	
	//  Get Name
	/*  This function will get the name of the file from the REQUEST
		
		Input:
			none
			
		Return:
			File Name:  Success
			'':  Failed
	*/
	function Get_Name() 
	{
		//  Verify existance
		if(!isset($_REQUEST['elfile']))
			return('');
			
		//  Get the filename from the data
		return $_REQUEST['elfile'];
	}
	
	//  Get Size
	/*  This function will get the file size.
		
		Input:
			none
			
		Return:
			Size of the file:  Success
			0:  Empty File
	*/
	function Get_Size() 
	{
		//  Get the content length
		if (isset($_SERVER["CONTENT_LENGTH"]))
		{
			return (int)$_SERVER["CONTENT_LENGTH"];            
		} 
		else 
		{
			return(0);
		}
	}
}

//  El Ajax Uploader
/*  This class will parse the input from a Iframe and save it to the appropriate location.  */
class EL_Uploaded_File_Form 
{  
	//  Public Class Variables
	/*
		$result ->  String for return.
	*/
	public $result;
	
	//  Save
	/*  This function will process the uploaded data.
		
		Input:
			$path:  Full path to the file.
			
		Return:
			0:  Success
			1:  Failed
	*/
	function Save($path) 
	{
		//  Move file to the new location from the temp location
		if(!move_uploaded_file($_FILES['elfile']['tmp_name'], $path))
		{
			$this->result = array('result' => 'error', 'error' => 'File movement server error.');
			return(1);
		}
		
		//  Success
		return(0);
	}
	
	//  Get Name
	/*  This function will get the name of the file from the FILES array
		
		Input:
			none
			
		Return:
			File Name:  Success
			'':  Failed
	*/
	function Get_Name() 
	{
		if(!isset($_FILES['elfile']['name']))
			return('');
		
		//  Success
		return $_FILES['elfile']['name'];
	}
	
	//  Get Size
	/*  This function will get the size of the file from the FILES array
		
		Input:
			none
			
		Return:
			Size of the file:  Success
			0:  Failed
	*/
	function Get_Size() 
	{
		if(!isset($_FILES['elfile']['size']))
			return(0);
		
		//  Success
		return $_FILES['elfile']['size'];
	}
}










?>