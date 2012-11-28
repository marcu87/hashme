/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/

var Hash = function (file, callback) {
    
    var thisObj = this,
        _binStart = "",
        _binEnd = "",
        PrintFunction = "",
        fileManager1 = new FileReader,
        fileManager2 = new FileReader;
        
    this.setBinAndHash = function (startOrEnd, binData) {
        
        switch (startOrEnd) {
            case 0:
                this._binStart = binData;
                break;
            case 1:
                this._binEnd = binData
        }
        
        this._binStart && this._binEnd && this.md5sum(this._binStart, this._binEnd)
    };
    
    this.md5sum = function (start, end) {
        this._hash = rstr2hex(rstr_md5(start + end));
        PrintFunction(this._hash);
    };
    
    this.getHash = function() {
        return this._hash;
    };
    
    this.calculateHashOfFile = function (file) {
      
        fileManager1.onload = function (f) {
            thisObj.setBinAndHash(0, f.target.result );
        };
        
        fileManager2.onload = function (f) {
            thisObj.setBinAndHash(1, f.target.result );
        };
      
        var start = file.slice(0, 65536);
        var end = file.slice(file.size - 65536, file.size);
        
        fileManager1.readAsBinaryString(start);
        fileManager2.readAsBinaryString(end);
    };
    
    this.calculateHashOfFile(file);
    PrintFunction = callback;

};

(function() {
    
    var fileManager1 = new FileReader;
    var fileManager2 = new FileReader;
    
    var _binStart = "";
    var _binEnd = "";

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	} 


	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}
    
	function OutputHash(eId, msg) {
        $("#"+eId+" .hash").html(msg);
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
		}

	}

	// output file information
	function ParseFile(file) {

		Output(
			"<p id='"+ file.size +"'>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> hash: <strong class='hash'>" +
			"</strong> " +
            "</p>"
		);

        var hash = new Hash(file, function OutputHash(msg) {
                                $("#"+ file.size +" .hash").html(msg);
                          });

	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();