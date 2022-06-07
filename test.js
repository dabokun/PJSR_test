#include <pjsr/NumericControl.jsh>
#feature-id Utilities > test_dialog2
#feature-info test2
#define DEFAULT_OUTPUT_EXTENSION ".xisf"

#define VERSION "0.0.0"
#define TITLE "test"

function applyCC(){

}

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
   
   this.files_TreeBox2 = new TreeBox(this);
   this.files_TreeBox2.multipleSelection = true;
   this.files_TreeBox2.rootDecoration = false;
   this.files_TreeBox2.alternateRowColor = true;
   this.files_TreeBox2.setScaledMinSize(100, 50);
   this.files_TreeBox2.numberOfColumns = 1;
   this.files_TreeBox2.setHeaderText(0, "directory found");
   this.files_TreeBox2.headerVisible = true;

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
         /*let i = 0;
         L.files.forEach( filePath =>
            {
            Console.writeln(filePath, i);
            node.setText(i, filePath);
            i++;   
            } );
         */

         /*this.dialog.files_TreeBox.canUpdate = false;
            var node = new TreeBoxNode (this.dialog.files_TreeBox);
            node.setText(0, gdd.directory)*/
            
         }   
      };

   this.execButton = new PushButton(this);
   this.execButton.text = "Execute";
   this.execButton.width = 40;
   this.execButton.onClick = () => {
      this.ok();
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
   this.sizer.add(this.files_TreeBox2);
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
      Console.writeln("test dialog closed")
  } else {
      Console.writeln("Cancelled")
  }
}

main();
