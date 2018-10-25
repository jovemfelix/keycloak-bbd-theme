if(window.location.pathname.endsWith("first-broker-login")){
    setTimeout(function () {

        var container = document.getElementById('kc-content-wrapper');
        var form = document.getElementById('kc-form');
        if(form!=null){
            container.insertBefore(document.createElement("div"), container.firstChild);

            var firstBrokerLoginAlert = container.firstChild;
            firstBrokerLoginAlert.setAttribute("id", "firstBrokerLoginAlert");

            var messageAlert='<div class="alert alert-warning">';
            messageAlert+='<span class="pficon pficon-cloud-security"></span>';
            messageAlert+='<span class="kc-feedback-text">Please login to verify and link your account.</span>';
            messageAlert+='</div>';

            firstBrokerLoginAlert.innerHTML=messageAlert;
        }

    }, 100);
}
