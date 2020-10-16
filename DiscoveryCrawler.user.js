// ==UserScript==
// @name            Discovery Crawler
// @namespace       BudiRahmawan
// @author          BudiRahmawan
// @version         0.1.0
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
        var path = window.location.pathname.split('/')[1];
        switch(path) {
            case 'explore':
                $J.post( 'http://store.steampowered.com/explore/generatenewdiscoveryqueue', {
                 sessionid: g_sessionID,
                 queuetype: this.m_eQueueType,
                }).done( function ( data ) {
                window.location = 'http://store.steampowered.com/explore/next';
                $J('#refresh_queue_btn').html("<span>Starting another queue.</span>");
                }).fail( function() {
                ShowAlertDialog( 'Start another queue >>', 'There was a problem saving your preferences.  Please try again later.' );
                $J('#refresh_queue_btn').html("<span>Start another queue >></span>");
                } );
                break;
            case 'agecheck':
               $("span:contains('Enter')");
               jQuery('#ageYear').val (1915).trigger ('change');
               DoAgeGateSubmit();
               break;
            case 'app':
            default:
               $J('.queue_sub_text').text("Loading next in queue");
               $J('#next_in_queue_form').submit();
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
