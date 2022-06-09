#include <pjsr/NumericControl.jsh>
#feature-id Utilities > test_dialog2
#feature-info test2
#define DEFAULT_OUTPUT_EXTENSION ".xisf"

#define VERSION "0.0.0"
#define TITLE "test"

function FileList( dirPath, extensions, verbose )
{
   /*
    * Regenerate this file list for the specified base directory and file
    * extensions.
    */
   this.regenerate = function( dirPath, extensions, verbose )
   {
      // Security check: Do not allow climbing up a directory tree.
      if ( dirPath.indexOf( ".." ) >= 0 )
         throw new Error( "FileList: Attempt to redirect outside the base directory: " + dirPath );

      // The base directory is the root of our search tree.
      this.baseDirectory = File.fullPath( dirPath );
      if ( this.baseDirectory.length == 0 )
         throw new Error( "FileList: No base directory has been specified." );

      // The specified directory can optionally end with a separator.
      if ( this.baseDirectory[ this.baseDirectory.length - 1 ] == '/' )
         this.baseDirectory.slice( this.baseDirectory.length - 1, -1 );

      // Security check: Do not try to search on a nonexisting directory.
      if ( !File.directoryExists( this.baseDirectory ) )
         throw new Error( "FileList: Attempt to search a nonexistent directory: " + this.baseDirectory );

      // If no extensions have been specified we'll look for all existing files.
      if ( extensions == undefined || extensions == null || extensions.length == 0 )
         extensions = [ '' ];

      if ( verbose )
      {
         console.writeln( "<end><cbr><br>==> Finding files from base directory:" );
         console.writeln( this.baseDirectory );
      }

      // Find all files with the required extensions in our base tree recursively.
      this.files = [];
      for ( let i = 0; i < extensions.length; ++i )
         this.files = this.files.concat( searchDirectory( this.baseDirectory + "/*" + extensions[ i ], true /*recursive*/ ) );

      // // Delete baseDirectory + separator from the beginning of all file paths.
      // var d = this.baseDirectory + '/';
      // for ( let i = 0; i < this.files.length; ++i )
      // {
      //    if ( this.files[ i ].indexOf( d ) != 0 )
      //       throw new Error( "<* Panic *> Inconsistent directory search: " + this.files[ i ] );
      //    this.files[ i ] = this.files[ i ].slice( d.length, this.files[ i ].length );
      // }
   };

   this.baseDirectory = "";
   this.files = [];
   this.index = [];

   if ( dirPath != undefined )
      this.regenerate( dirPath, extensions, verbose );

   if ( verbose )
   {
      console.writeln( "<end><cbr>" + this.files.length + " file(s) found:" );
      for ( let i = 0; i < this.files.length; ++i )
         console.writeln( this.files[ i ] );
   }
}

FileList.prototype = new Object;

function ccEngine() {
   this.inputFiles = new Array;
   this.outputDirectory = "";
   this.outputPrefix = "";
   this.outputPostfixCC = "_cc";
   this.outputPostfix = "_cf";
   this.usingPostfix = "";
   this.stackedName = "stacked";
   this.outputExtension = DEFAULT_OUTPUT_EXTENSION;
   this.overwriteExisting = false;
   this.outputFormat = null;
   Console.writeln(this.inputFiles.toString());
   
   /*var cc_process = new CosmeticCorrection;
   with (cc_process) {
         targetFrames = [[true,inputFiles.toString()]];
         masterDarkPath = "";
         outputDir = "";
         outputExtension = ".xisf";
         prefix = "";
         postfix = "_cc";
         overwrite = false;
         cfa = false;
         useMasterDark = false;
         hotDarkCheck = false;
         hotDarkLevel = 1.0000000;
         coldDarkCheck = false;
         coldDarkLevel = 0.0000000;
         useAutoDetect = true;
         hotAutoCheck = false;
         hotAutoValue = 15.0;
         coldAutoCheck = false;
         coldAutoValue = 15.0;
         amount = 1.00;
         useDefectList = false;
         defects = [];
         executeGlobal();
      } */
}

var engine = new ccEngine;

function ccDialog(){
    this.__base__ = Dialog;
   this.__base__();

   this.minWidth = 340;

   this.title = new TextBox(this);
   this.title.readOnly = true;
   this.title.text = "directory test";
   this.title.minHeight = 1;

   this.files_TreeBox = new TreeBox(this);
   this.files_TreeBox.multipleSelection = true;
   this.files_TreeBox.rootDecoration = false;
   this.files_TreeBox.alternateRowColor = true;
   this.files_TreeBox.setScaledMinSize(200, 100);
   this.files_TreeBox.numberOfColumns = 1;
   this.files_TreeBox.setHeaderText(0, "selected directory");
   this.files_TreeBox.headerVisible = true;
   
   this.filesAdd_Button = new PushButton(this);
    this.filesAdd_Button.text = "Add files";
    this.filesAdd_Button.icon = this.scaledResource(":/icons/add.png");
    this.filesAdd_Button.toolTip = "Test tooltip";
    this.filesAdd_Button.onClick = function () {
        var gdd = new GetDirectoryDialog;
        if (gdd.execute()) {
         // get the list of compatible file extensions
         let openFileSupport = new OpenFileDialog;
         openFileSupport.loadImageFilters();
         let filters = openFileSupport.filters[ 0 ]; // all known format
         filters.shift();
         filters = filters.concat( filters.map( f => ( f.toUpperCase() ) ) );
         let L = new FileList(gdd.directory, filters, false);
         this.dialog.files_TreeBox.canUpdate = false;
         var node = new TreeBoxNode (this.dialog.files_TreeBox);
         
         for (var i = 0; i < L.files.length; ++i) {
            Console.writeln(L.files[i]);
            node.setText(0, L.files[i]);
         }
         this.dialog.files_TreeBox.canUpdate = true;
         let fileC_list = []
         for (let i = 0; i < L.files.length; ++i) {
            if (L.files[i].endsWith('_c.fit')) {
               fileC_list.push(L.files[i]);
               engine.inputFiles.push(L.files[i]);
            }
         }
         Console.writeln(fileC_list);
         }
      };

   this.execButton = new PushButton(this);
   this.execButton.text = "Execute";
   this.execButton.width = 40;
   this.execButton.onClick = () => {
      if (engine.inputFiles.length == 0) {
         Console.writeln("Specify input files.");
      } else {
         ccEngine();
         this.ok();
      }
   }

   this.buttomSizer = new HorizontalSizer;
   this.buttomSizer.margin = 8;
   this.buttomSizer.addStretch();
   this.buttomSizer.add(this.execButton);
   this.buttomSizer.addSpacing(20);
   this.buttomSizer.add(this.filesAdd_Button);

   this.sizer = new VerticalSizer;
   this.sizer.add(this.title);
   this.sizer.addSpacing(20);
   this.sizer.add(this.files_TreeBox);
   this.sizer.addSpacing(20);
   this.sizer.add(this.buttomSizer);
   this.sizer.addStretch();
   this.sizer.margin = 5;

   }
ccDialog.prototype = new Dialog;

function showDialog(){
   let dialog = new ccDialog;
   return dialog.execute();
}

function main(){
   let retVal = showDialog();

   if(retVal == 1){
      Console.writeln("Script closed")
  } else {
      Console.writeln("Cancelled")
  }
}

main();
