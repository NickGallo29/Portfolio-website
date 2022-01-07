module.exports.textCompiler=(text)=>{
    const JSONBody= JSON.parse(text);
    var test=JSONBody.ops;
    //test=JSON.stringify(text);
    console.log(test)
    var finalText='';
    const length=test.length;
    console.log(test.length)
    for(var i=0;i<length;i++){
        var iText=test[i].insert;
        if(test[i].attributes){
            if (test[i].attributes.bold){
                iText=`<b>${iText}</b>`;
            }
            if (test[i].attributes.italic){
                iText=`<i>${iText}</i>`;
            }
            if(test[i].attributes.underline){
                iText=`<u>${iText}</u>`;
            }
            if(test[i].attributes.header===1){
                var last= i-1;
                var fullLength=finalText.length;
                var headerLength = test[last].insert.length;
                var slice=fullLength-headerLength;
                finalText=finalText.slice(0,slice);
                finalText=`${finalText}<h1>${test[last].insert}</h1>\n`
                iText='';
            }
            if(test[i].attributes.header===2){
                var last= i-1;
                var fullLength=finalText.length;
                var headerLength = test[last].insert.length;
                var slice=fullLength-headerLength;
                finalText=finalText.slice(0,slice);
                finalText=`${finalText}<h2>${test[last].insert}</h2>\n`
                iText='';
            }
            if(test[i].attributes.header===3){
                var last= i-1;
                var fullLength=finalText.length;
                var headerLength = test[last].insert.length;
                var slice=fullLength-headerLength;
                finalText=finalText.slice(0,slice);
                finalText=`${finalText}<h3>${test[last].insert}</h3>\n`
                iText='';
            }
        }
        finalText=`${finalText}${iText}`;
    }
    finalText = finalText.replace(/\n/g, '<br />');
    return finalText;
}
