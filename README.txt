File Uploader Documentation
Reasons for the uploader

I developed this plugin because a customer wanted a nice progress bar when uploading a picture to their website.  I looked around the web to see if there was anything out there and I found a few plugins that kind of did what I wanted.  What I found is they were either too kludgey or were a hassle to modifiy.  Since I couldn't find what I wanted, I developed this plugin.  This has been influenced by the upload plugin at http://valums.com/ajax-upload/.  I looked at his an decided to make a more streamlined version for my own purposes. 

 

Requirements

This library requires the use of the jQuery library.  It has been tested on version 1.4.2.  If it does not work for your version, feel free to contact me and I can take a look at it.

 

Install

Copy the 'file_uploader.js' to your specified directory.

Include the following in the head of the page:

<script type="text/javascript" src="file_uploader.js"></script>

Note:  It is recommended to use also jQueryUI as this will make the buttons look better and it is a little easier to integrate into the page.

 

Options

The following options can be specified when the object is created:

Variables:
extensions:  ex:  { "jpg", "gif" } - The extensions that are allowed to be transferred to the server.
sizeLimit:  The size limit in bytes for the maximum size for transferring.
text:  The text that will be displayed on the button.
getParams:  ex:  { userId: "IT001", userIndex: "123" } - The parameters that will be passed to the server during the file transfer (This uses a GET command).
action: ex: "image_uploader.php" - The script that will be run when transferred.
parentCss:  ex: { fontSize: '8pt', padding: '5px' } - The CSS that will be applied to the parent element (if necessary).
buttonCss:  ex: { fontSize: '8pt', padding: '5px' } - The CSS that will be applied to the button (if necessary).
jqueryUi:  (true or false) - Whether or not you want to utilize the jQuery UI for the available CSS styles and controls.
progressBar:  (true or false) - Whether or not to display the progress bar.
progressBytes:  (true of false) - Whether or not to dispaly the progress bytes display.
loadingBar:  ex: "images/loading_bar.gif" - The path to the loading bar (Used for IE transfers or browsers that do not support XMLHttpRequest).
displayMessage:  (true or false) - Whether or not to dislay a message on completion of the transfer.

Functions:
onSuccess:  Function to perform on successful completion of the file transfer. 
onError:  Function to perform if an error occurs during the file transfer.
onSubmit:  Function to perform when the file transfer is initiated.
 

Create the element

This jQuery plugin will extend jQuery and allow for the creation of the file uploader using standard jQuery notation.  The plugin is fully chainable.

All you have to do is create a div on the page and call the fileUploader function supplying any options that you may need.

 

Examples

Included with the download is a index.php file that contains an example that can be viewed to see how the uploader works.  View the test.js file to see the jquery for the function.

Example:

$('#File_Add').fileUploader({
        sizeLimit:(8 * 1024 * 1024),
        jqueryUi: true,
        displayMessage: true,
        parentCss: { marginTop: '50px' },
        text: 'Upload New File',
        buttonCss: { fontSize: '8pt', padding: '5px'},
        getParams: {
            Session_Id: $('#Session_Id').val(),
            Session_Ip: $('#Session_Ip').val()
        },
        onSuccess: function () {
            var self = this;
            var res = jQuery.parseJSON(self.responseText);
            // do something here


        },
        onError: function () {
            var self = this;
            var res = jQuery.parseJSON(self.responseText);
            // do something here


        }
    });
