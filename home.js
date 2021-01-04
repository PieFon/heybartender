$('.modal').modal();

function toggleModal() {
    var instance = M.Modal.getInstance($("#modal3"));
    instance.open();
};

var visitor = localStorage.getItem("hasVisited");
if (!visitor){
    console.log("visitor value: " + visitor);
    toggleModal();
}


$("#enter").on("click", function(event) {
    //is this necesarry?
    event.preventDefault();
    console.log("I don't know?");
    localStorage.setItem("hasVisited",1)
})

$("#leave").on("click", function(event){
    return;
})