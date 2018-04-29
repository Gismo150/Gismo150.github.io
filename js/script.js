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

//TODO: maybe add author
function addImageToGallery(galleryId, srcThumbnail, src, data_size, description){

    let id = document.getElementById(galleryId);

    let fig = document.createElement("figure");
    //fig.classList.add("effect-julia");

    let a  = document.createElement("a");

    a.setAttribute("href", src);
    a.setAttribute("data-size", data_size);
    //TODO: maybe add author to "a".
    fig.appendChild(a);

    let img = document.createElement("img");
    img.classList.add("imgPortfolio");
    img.setAttribute("src", srcThumbnail);
    img.setAttribute("itemprop", "thumbnail");
    img.setAttribute("alt", "Image description");
    a.appendChild(img);

    let figCaption = document.createElement("figcaption");
    figCaption.setAttribute("itemprop", "caption description");
    figCaption.innerText = description;
    fig.appendChild(figCaption);
    document.getElementById(galleryId).appendChild(fig);
}


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

var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};
