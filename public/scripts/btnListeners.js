const hiddenForm = document.getElementById('commentForm')

const allComments = document.querySelectorAll('.commentDiv');

//Function to handle edit/delete request for comments
allComments.forEach(comment=>{
    console.log(comment)
    var editComment = comment.querySelector('.commentBtn .commentEdit');
    var deleteComment= comment.querySelector('.commentBtn form');
    var commentNode = comment.querySelector('.commentBody');
    var cancelText = commentNode.innerHTML
    var formInput = comment.querySelector('.commentUpdate')
    console.log(editComment,commentNode,cancelText,formInput);
    if(editComment){editComment.addEventListener('click',()=>{
        commentNode.innerHTML=formInput.innerHTML;
        editComment.style.display="none";
        deleteComment.style.display="none";
        var cancelButton =commentNode.querySelector('.cancelCommentChange')
        cancelButton.addEventListener('click',()=>{
            commentNode.innerHTML=cancelText;
            editComment.style.display="block";
            deleteComment.style.display="block";
        })
        var deleteButton = commentNode.querySelector('.submitCommentChange')
        deleteButton.addEventListener('click',()=>{
            commentNode.querySelector('form').submit();
        })
    
    });}
})


