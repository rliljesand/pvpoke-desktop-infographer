// ==UserScript==
// @name         PvPoke Infographer
// @namespace    https://github.com/rliljesand/pvpoke-desktop-infographer
// @version      1.0.2
// @description  a quick jQuery hack for tampermonkey to make an infographic overview of the top ranked pvpoke pokemon for leagues. jQuery was already present on pvpoke.com.
// @author       thePppnRppp
// @updateURL    https://github.com/rliljesand/pvpoke-desktop-infographer/blob/main/pvpoke-infographer.js
// @downloadURL  https://github.com/rliljesand/pvpoke-desktop-infographer/blob/main/pvpoke-infographer.js
// @supportURL   https://github.com/rliljesand/pvpoke-desktop-infographer/issues
// @match        https://pvpoke.com/rankings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pvpoke.com
// @resource     FA_CSS https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js

// ==/UserScript==

(function() {
    'use strict'
    const my_css = GM_getResourceText("FA_CSS");
    GM_addStyle(my_css);

    $(document).ready(function(){
        const mutationCallback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (
                    mutation.type !== "attributes" ||
                    mutation.attributeName !== "style"
                ) {
                    return
                }
                if($(".loading").is(":visible")){
                    $("#infographer").hide()
                }else{
                    $("#infographer").show()
                }
            }
        }
        const observer = new MutationObserver(mutationCallback)
        const regions = {
            'hisuian':'hisui',
            'alolan':'alola',
            'galarian':'galar'
        };
        const types = {
            'normal': {'icon': 'circle'},
            'fighting': {'icon': 'user-ninja'},
            'flying': {'icon': 'wind'},
            'poison': {'icon': 'skull-crossbones'},
            'ground': {'icon': 'mountain-sun'},
            'rock': {'icon': 'hill-rockslide'},
            'bug': {'icon': 'bug'},
            'ghost': {'icon': 'ghost'},
            'steel': {'icon': 'wrench'},
            'fire': {'icon': 'fire'},
            'water': {'icon': 'water'},
            'grass': {'icon': 'seedling'},
            'electric': {'icon': 'bolt'},
            'psychic': {'icon': 'brain'},
            'ice': {'icon': 'icicles'},
            'dragon': {'icon': 'dragon'},
            'fairy': {'icon': 'wand-magic-sparkles'},
            'dark': {'icon': 'moon'},
        }
        const cssRatingContainer = {
            'position':'absolute',
            'right':'2px',
            'top':'2px'
        };
        const cssRankingsContainer = {
            'margin-top':'0',
        };
        const cssRating = {
            'width':'45px',
        };
        const cssMoveCount = {
            'display':'block',
            'float':'left',
            'font-size':'20px',
            'border-radius':'5px',
            'padding': '5px',
            'margin-right':'5px'
        };
        const cssMoves = {
            'display':'inherit',
            'font-size':'16px'
        };
        const cssShadowWrapper = {
            'border': 'solid #301934 2px'
        };
        const cssRankBlock = {
            'display':'inline-block',
            'margin':'5px',
            'width':'320px',
            'height':'175px',
            'border': 'solid white 2px',
            'z-index': 5,
            'overflow': 'hidden'
        };
        const cssMonImage = {
            'position': 'absolute',
            'width': 'auto',
            'height': '150px',
            'bottom': '0',
            'right': '0'
        };
        const cssMonImageShadow = {
            'background': 'radial-gradient(circle at center center, black, transparent 70%)'
        }
        const cssType2Div = {
            'position': 'absolute',
            'top': '110px',
            'right': '-60px',
            'height': '100%',
            'width':  '100%',
            'z-index': '-2',
            'transform': 'rotate(-25deg)',
        }
        const cssThrobber = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,0.7)',
            'z-index': '1000',
            'text-align': 'center',
            'vertical-align': 'middle',
            'color': '#FFF',
            'padding': '100px 0 0 0',
            'font-size': '40px',
            'display': 'none',
        };
        const cssShadowIcon = {
            'color': 'purple',
            'position': 'absolute',
            'bottom':'0',
            'right': '23px',
            'font-size': '143px',
            'z-index': '-1',
        }
        const htmlMoveDiv = "<div style='padding:15px 0 15px 0;'>";

        const infographer = $('<a href="#" display:none;" id="infographer"><i class="fa-solid fa-microchip"></i> InfoGraph this!</a>');
        const infothrobber = $('<div id="infothrobber"><i class="fa-solid fa-spinner" id="infographer-throbber"></i> Hold on! fixing stuff....</div>').css(cssThrobber);
        $( ".header-wrap .menu" ).prepend(infographer);
        $("body").prepend(infothrobber);

        const loading = $(".loading");
        observer.observe(loading.get(0), { attributes: true })

        $(document).on('mousedown', '#infographer', function() {
            $("#infothrobber").fadeIn(function(){
                $('#infographer').hide();
                $('#infographer').trigger('click');
            });

        }).on('click', '#infographer', function() {
            $("#main").css('max-width','100%');
            $("#main h1, #main .section p, .expand-label, #main .section .poke-search-container, .details, .ranking-header").hide();
            $(".rankings-container").css(cssRankingsContainer);
            $(".rating-container").css(cssRatingContainer);
            $(".rating-container > .rating").css(cssRating);
            $(".moves .count").css(cssMoveCount)
            $(".moves").css(cssMoves).each(function(index){
              $(this).html(htmlMoveDiv+$(this).html().replaceAll(",","</div> "+htmlMoveDiv)+"</div>"); // hack XD
            });
            $(".rankings-container > .rank")
                .css(cssRankBlock)
                .each(function(index){
                let wrapper = $(this);
                wrapper.trigger('click');
                wrapper.find(".rating-container .rating").append('<br/><i class="fa-solid fa-'+types[wrapper.attr('type-1')].icon+'"></i>')
                if(wrapper.attr('type-2') !== 'none'){
                    let t2 = $('<div></div>').addClass(wrapper.attr('type-2')).css(cssType2Div);
                    wrapper.prepend(t2);
                    wrapper.find(".rating-container .rating").append(' <i class="fa-solid fa-'+types[wrapper.attr('type-2')].icon+'"></i>')
                }
                let shadow = false;
                let region, name, slug = "";
                let identifier = wrapper.attr("data").split("_");
                  var lastEl = identifier[identifier.length-1];
                if (lastEl === 'shadow' ){
                    shadow = true;
                    identifier.pop();
                    wrapper.css(cssShadowWrapper);
                    let shadowIcon = $('<div><i class="fa-solid fa-fire-flame-curved"></i></div>').css(cssShadowIcon);
                    wrapper.prepend(shadowIcon);
                }
                lastEl = identifier[identifier.length-1];
                if ($.inArray( lastEl, Object.keys(regions) ) !== -1){
                    region = regions[lastEl];
                    identifier.pop();
                }
                name, slug = identifier.join("-");
                slug += (region ? "-"+region : "");
                if(index < 35){
                    $.get( "https://pokeapi.co/api/v2/pokemon/"+slug, function( data ) {
                        let monImg = $("<img alt='"+name+"' src='"+data.sprites.other['official-artwork'].front_default+"' />");
                        monImg.css(cssMonImage);
                        if(shadow === true){
                            monImg.css(cssMonImageShadow)
                        }
                        wrapper.prepend(monImg);
                    });
                }else{
                    return false;
                }
            });
            $(".rankings-container").scrollTop(0);
            $("#infothrobber").hide();

        });
    });
})();
