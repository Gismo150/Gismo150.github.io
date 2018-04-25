//
//	jQuery Validate example script
//
//	Prepared by David Cochran
//
//	Free for your use -- No warranties, no guarantees!
//

$(document).ready(function () {

    // Validate
    // http://bassistance.de/jquery-plugins/jquery-plugin-validation/
    // http://docs.jquery.com/Plugins/Validation/
    // http://docs.jquery.com/Plugins/Validation/validate#toptions

    $('#contact-form').validate({
        rules: {
            name: {
                minlength: 2,
                required: true
            },
            email: {
                required: true,
                email: true
            },
            subject: {
                minlength: 2,
                required: true
            },
            message: {
                minlength: 2,
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').removeClass('success').addClass('error');
        },
        success: function (element) {
            element
                .text('OK!').addClass('valid')
                .closest('.form-group').removeClass('error').addClass('success');
        }
    });

}); // end document.ready
//TODO: type should be array
function addGalleryItem(types, data_target, src, title, alignment, modalId) {
    //Create and append Image
    let li = document.createElement('li');

    types.forEach(function(type){
        li.classList.add("col-md-4", "col-sm-4", "col-xs-12", "mix", type);
    });

    li.setAttribute('data-cat', "graphics");

    let a = document.createElement('a');
    a.setAttribute("data-toggle", "modal");
    a.setAttribute("data-target", data_target);
    a.classList.add("mix-cover");
    li.appendChild(a);

    let img = document.createElement('img');
    img.classList.add(alignment);
    img.setAttribute("src", src);
    img.setAttribute("alt", "placeholder");
    a.appendChild(img);

    let span = document.createElement('span');
    span.classList.add("overlay");

    let innerSpan = document.createElement('span');
    innerSpan.classList.add("valign");
    span.appendChild(innerSpan);

    let innerSpan2 = document.createElement('span');
    innerSpan2.classList.add("title");
    innerSpan2.innerText = title;
    span.appendChild(innerSpan2);


    a.appendChild(span);

    document.getElementById('Grid').appendChild(li);


    //Create and append Modal for Image
    let div1 = document.createElement('div');
    div1.classList.add("modal", "fade");
    div1.setAttribute("id", modalId);
    div1.setAttribute("tabindex", "-1");
    div1.setAttribute("role", "dialog");
    div1.setAttribute("aria-hidden", "true");

    let div2 = document.createElement('div');
    div2.classList.add("modal-dialog");
    div1.appendChild(div2);

    let div3 = document.createElement('div');
    div3.classList.add("modal-content");
    div2.appendChild(div3);

    let div4 = document.createElement('div');
    div4.classList.add("modal-header");
    div3.appendChild(div4);
    let button = document.createElement('button');
    button.classList.add("close");
    button.setAttribute("type", "button");
    button.setAttribute("data-dismiss", "modal");
    button.setAttribute("aria-hidden", "true");

    div4.appendChild(button);

    let h4 = document.createElement('h4');
    h4.classList.add("modal-title", "text-center");
    h4.innerText = title;
    div4.appendChild(h4);

    let div5 = document.createElement('div');
    div5.classList.add("modal-body");
    div3.appendChild(div5);
    let img2 = document.createElement('img');
    img2.classList.add("thumbnail");
    img2.setAttribute("alt", modalId);
    img2.setAttribute("src", src);
    div5.appendChild(img2);


    document.getElementById('modal').appendChild(div1);
}

/**
 * Shuffles array in place.  Modern version of the Fisher–Yates shuffle algorithm:
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}