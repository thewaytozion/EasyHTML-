const fm = FileManager.local()
if (!fm.bookmarkExists("EasyHTML")) {
  let A = new Alert()
  A.title = "No path saved for EasyHTML"
  A.message = `\nCreate a bookmarked path called "EasyHTML"\n\nThis is where your scripts will be saved... \n\nFor example in a "Working Copy" folder named "ScriptableData."`
  A.addAction("Okay")
  A.presentAlert()
  Script.complete()
}
const easyHTMLPath = fm.bookmarkedPath("EasyHTML")
String.prototype.insert = function(index, string) {
  if (index > 0) {
    return this.substring(0, index) + string + this.substr(index);
  }
  return string + this;
};
function insertScript(html, js) {
    let sub = "</head>"
    let insertAt = html.indexOf(sub)
    if (!insertAt || insertAt < 0) return null
    else return html.insert(insertAt, ("<script>\n" + js + "\n</script>\n"))
}
function insertStyle(html, css) {
    let sub = "</head>"
    let insertAt = html.indexOf(sub)
    if (!insertAt || insertAt < 0) return null
    else return html.insert(insertAt, ("<style>\n" + css + "\n</style>\n"))
}
class EasyHTML {
    constructor(scriptName) {
        if (scriptName) {            
            this.directoryPath = fm.joinPath(easyHTMLPath, scriptName)        
            if (!fm.fileExists(this.directoryPath)) {
                this.directory = fm.createDirectory(this.directoryPath, true)
            }            
            this.cssPath = fm.joinPath(this.directoryPath, "style.css")            
            this.jsPath = fm.joinPath(this.directoryPath, "jsFile.js")    
            this.htmlPath = fm.joinPath(this.directoryPath, "htmlFile.html")        
            if (!fm.fileExists(this.cssPath)) {
                fm.writeString(this.cssPath, `
body {
    background-color: #636363;
    font-size: 3vh;
    text-align: center;
}
                `)
            }           
            if (!fm.fileExists(this.jsPath)) {
                fm.writeString(this.jsPath, `
function onWebViewLoaded() {
    console.log("WebView Loaded!")
}
`)
            }            
            if (!fm.fileExists(this.htmlPath)) {
                fm.writeString(this.htmlPath, 
`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${scriptName}</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/trontastic/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
</head>
<body>
<div class="ui-state-highlight">EasyHTML Starter Template!</div>
</body>
</html>
`)
            }
     } else console.log("Must call with 'Script.name()' or enter a custom name to save the files under.")            
}
l    
    HTML = () => {
        if (!this.htmlPath) return
        return fm.readString(this.htmlPath)
    }
    JS = () => {  
        if (!this.htmlPath) return
        return fm.readString(this.jsPath)
    }
    CSS = () => {
        if (!this.htmlPath) return
        return fm.readString(this.cssPath)
    }   
    full = async () => {
        if (!this.htmlPath) return
        let html = this.HTML();
        let js = this.JS();
        let css = this.CSS()
        let styled = insertStyle(html, css)
        return insertScript(styled, js)
    }
}
module.exports = EasyHTML
