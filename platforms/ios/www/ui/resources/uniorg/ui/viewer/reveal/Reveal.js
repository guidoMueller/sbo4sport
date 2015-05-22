sap.ui.define( [
        "sap/ui/core/Control",
        "jquery.sap.global"
    ],
    function ( Control, jQuery ) {

        var Reveal = Control.extend( "uniorg.ui.viewer.reveal.Reveal", {
            /** @lends uniorg.ui.viewer.reveal.Reveal **/
            renderer: {
                render: function ( oRm, oControl ) {
                    oRm.write( "<iframe " );
                    oRm.writeControlData( oControl );
                    oRm.addClass( "uoRevealFrame" );
                    oRm.writeClasses();
                    oRm.writeAttribute( "allowfullscreen", "true" );
                    oRm.write( " />" );
                }
            },
            metadata: {
                properties: {
                    slideSource:     {type: "sap.ui.core.URI", defaultValue: null},
                    controls:        {type: "boolean", defaultValue: true},
                    progress:        {type: "boolean", defaultValue: true},
                    slideNumber:     {type: "boolean", defaultValue: false},
                    overview:        {type: "boolean", defaultValue: true},
                    center:          {type: "boolean", defaultValue: true},
                    loop:            {type: "boolean", defaultValue: false},
                    rtl:             {type: "boolean", defaultValue: false},
                    fragments:       {type: "boolean", defaultValue: true},
                    transition:      {type: "string", defaultValue: "default"},
                    transitionSpeed: {type: "string", defaultValue: "default"},
                    theme:           {type: "string", defaultValue: "default"}
                }
            }
        } );

        Reveal.prototype.getRevealConfig = function () {
            return {
                controls:        this.getControls(),
                progress:        this.getProgress(),
                slideNumber:     this.getSlideNumber(),
                overview:        this.getOverview(),
                center:          this.getCenter(),
                loop:            this.getLoop(),
                rtl:             this.getRtl(),
                fragments:       this.getFragments(),
                embedded:        true,
                theme:           this.getTheme(),
                transition:      this.getTransition(),
                transitionSpeed: this.getTransitionSpeed()
            };
        };

        Reveal.prototype.onAfterRendering = function () {
            var sBasePath = jQuery.sap.getModulePath( "uniorg.ui.viewer.reveal" );
            var oConfig = this.getRevealConfig();
            var oFrame = this.getDomRef();
            var sSourceUrl = this.getSlideSource();
            oFrame.onload = function () {
                jQuery.get( sSourceUrl, function ( oData ) {
                    oFrame.contentWindow.setRevealContent( oData, oConfig );
                } );
            };
            oFrame.src = sBasePath + "/assets/index.html";
        };

        Reveal.prototype.getReveal = function () {
            return this.getDomRef().contentWindow.Reveal;
        };

        Reveal.prototype.previous = function () {
            this.getReveal().prev();
        };

        Reveal.prototype.next = function () {
            this.getReveal().next();
        };

        Reveal.prototype.first = function () {
            while ( !this.getReveal().isFirstSlide() ) {
                this.previous();
            }
        };

        Reveal.prototype.last = function () {
            while ( !this.getReveal().isLastSlide() ) {
                this.next();
            }
        };

        return Reveal;

    }, true );