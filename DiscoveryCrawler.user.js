// ==UserScript==
// @name            Discovery Crawler
// @namespace       BudiRahmawan
// @author          BudiRahmawan
// @version         0.2.5
// @description     Automatically explore your steam discoveries.
// @homepage        https://github.com/BudiRahmawan/DiscoveryCrawler/
// @downloadURL     https://github.com/BudiRahmawan/DiscoveryCrawler/raw/main/DiscoveryCrawler.user.js
// @icon            https://raw.githubusercontent.com/BudiRahmawan/DiscoveryCrawler/main/favicon.ico
// @license         https://www.apache.org/licenses/LICENSE-2.0
// @include         http://store.steampowered.com/app/*
// @include         http://store.steampowered.com/explore/*
// @include         http://store.steampowered.com/agecheck/app/*
// @run-at          document-end
// @grant           none
// ==/UserScript==

function GM_main() {
    window.onload = function () {
        var GenerateQueue = function( queueNumber )
        {
            $J('.home_actions_ctn').css( 'visibility', 'visible' );
            $J('.home_actions_ctn').text( 'Queue #' + ++queueNumber );
            $J('#refresh_queue_btn').html("<span>Running queue #" + queueNumber + ". . .</span>");
            jQuery.post( 'http://store.steampowered.com/explore/generatenewdiscoveryqueue', { sessionid: g_sessionID, queuetype: 0 } ).done( function( data )
            {
                var requests = [];
                for( var i = 0; i < data.queue.length; i++ )
                {
                    requests.push( jQuery.post( 'http://store.steampowered.com/app/10', { appid_to_clear_from_queue: data.queue[ i ], sessionid: g_sessionID } ) );
                }
                jQuery.when.apply( jQuery, requests ).done( function()
                {
                    if( queueNumber < 3 )
                    { GenerateQueue( queueNumber );}
                    else
                    {
                        $J('#refresh_queue_btn').html("<span>Queues finished. Reloading.</span>");
                        window.location.reload();
                    }
                } );
            } );
        };
        var path = window.location.pathname.split('/')[1];
        switch(path) {
            case 'explore':
                if ( !$J('.discovery_queue_winter_sale_cards_header:contains("You\'ve completed your queue and have unlocked 3 event trading cards!")') ) {
                    GenerateQueue(0);
                }
                else { $J('.subtext').html( $J('.subtext').html() + '<br />(Script stopped)' ); }
                break;
            case 'agecheck':
                $("span:contains('Enter')");
                jQuery('#ageYear').val (1915).trigger ('change');
                DoAgeGateSubmit();
                break;
            case 'app':
            default:
                if ( $J('.error:contains("This item is currently unavailable in your region")') ) {
                    var unavailable_app = window.location.pathname.split('/')[2];
                    $J.post("/app/7", { sessionid: g_sessionID, appid_to_clear_from_queue: unavailable_app })
                    .done( function ( data ) {
                        window.location = 'http://store.steampowered.com/explore/next';
                        $J('.error').html( $J('.error').html() + '<br />(Removing from queue)' );
                    }).fail( function() {
                        $J('.error').html( $J('.error').html() + '<br />(Could not remove from queue. Reload or try <a href="https://www.reddit.com/r/Steam/comments/3r2k4y/how_do_i_complete_discovery_queue_if_every_queue/cwkrrzf">removing manually.</a>)' );
                    } );
                }
                else {
                    $J('.queue_sub_text').text("Loading next in queue");
                    $J('#next_in_queue_form').submit();
                }
                break;
        }
    }
}

addJS_Node(null, null, GM_main);
function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
   var D                                   = document;
   var scriptNode                          = D.createElement ('script');
   if (runOnLoad) {
    scriptNode.addEventListener ("load", runOnLoad, false);
   }
   scriptNode.type                         = "text/javascript";
   if (text)       scriptNode.textContent  = text;
   if (s_URL)      scriptNode.src          = s_URL;
   if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

   var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
   targ.appendChild (scriptNode);
 }
