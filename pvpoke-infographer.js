// ==UserScript==
// @name         PvPoke Infographer
// @namespace    https://github.com/rliljesand/pvpoke-desktop-infographer
// @version      1.0.1
// @description  a quick jQuery hack for tampermonkey to make an infographic overview of the top ranked pvpoke pokemon for leagues. jQuery was already present on pvpoke.com.
// @author       thePppnRppp
// @updateURL    https://github.com/rliljesand/pvpoke-desktop-infographer/blob/main/pvpoke-infographer.js
// @downloadURL  https://github.com/rliljesand/pvpoke-desktop-infographer/blob/main/pvpoke-infographer.js
// @supportURL   https://github.com/rliljesand/pvpoke-desktop-infographer/issues
// @match        https://pvpoke.com/rankings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pvpoke.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js

// ==/UserScript==

(function() {
    'use strict'
    $(document).ready(function(){
        const regions = {
            'hisuian':'hisui',
            'alolan':'alola',
            'galarian':'galar'
        };
        const cssRatingContainer = {
            'position':'absolute',
            'right':'2px',
            'top':'2px'
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
                  'border': 'solid white 2px'
                };
        const cssMonImage = {
            'position': 'absolute',
            'width': 'auto',
            'height': '150px',
            'bottom': '0',
            'right': '0'
        };
        const cssMonImageShadow = {
            'background': 'radial-gradient(at bottom center, #301934, transparent 70%)'
        }
        const htmlMoveDiv = "<div style='padding:15px 0 15px 0;'>";

        const infographer = $('<a href="#" class="fa-solid fa-microchip" style="cursor:pointer;" id="infographer"></a>');
        $( ".header-wrap .menu" ).prepend(infographer);
        $(document).on('change', '.category-select, .format-select', function() {$("#infographer").show()});

        $(document).on('click', '#infographer', function() {
            $(this).hide();
            $("#main").css('max-width','100%');
            $("#main h1, #main .section p, .expand-label, #main .section .poke-search-container, .details").hide();
            $(".rating-container").css(cssRatingContainer);
            $(".moves .count").css(cssMoveCount)
            $(".moves").css(cssMoves).each(function(index){
              $(this).html(htmlMoveDiv+$(this).html().replaceAll(",","</div> "+htmlMoveDiv)+"</div>"); // hack XD
            });
            $(".rankings-container > .rank")
                .css(cssRankBlock)
                .each(function(index){
                let wrapper = $(this);
                let shadow = false;
                let region, name, slug = "";
                let identifier = wrapper.attr("data").split("_");
                  var lastEl = identifier[identifier.length-1];
                if (lastEl === 'shadow' ){
                    shadow = true;
                    identifier.pop();
                    wrapper.css(cssShadowWrapper)
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
                }
            });
        });
    });
})();
