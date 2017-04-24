export default (function(){


    var vueTap = {};
    vueTap.install = function(Vue){

        var isMove = false;
        var startTime = 0;
        var timeStamp = 0;
        var tapInfo = {};

        function isPc (){
            var uaInfo = navigator.userAgent;
            var agents = [ "Android", "iPhone", "Windows Phone", "iPad", "iPod" ];
            var flag = true;
            for ( var i = 0; i < agents.length; i++ ) {
                if ( uaInfo.indexOf (agents[ i ]) > 0 ) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }

        function doModifiers (e, modifiers){
            if ( !modifiers )  return

            if ( modifiers.prevent ) {
                e.preventDefault ();
            }
            if ( modifiers.stop ) {
                e.stopPropagation ();
            }

        }

        function clickHandle (e){
            doModifiers (e, this.modifiers)
            this.callback && this.callback.apply (this, e.target.params);
        }

        function touchstart (e){
            doModifiers (e, this.modifiers)
            timeStamp = e.timeStamp;
            startTime = Date.now ();
            var touch = e.touches[ 0 ];
            tapInfo.x1 = touch.pageX;
            tapInfo.y1 = touch.pageY;
        }

        function touchmove (e){
            doModifiers (e, this.modifiers)

            if ( !e.touches )return;

            var touch = e.touches[ 0 ];
            tapInfo.x2 = touch.pageX;
            tapInfo.y2 = touch.pageY;
            if ( (tapInfo.x2 && Math.abs (tapInfo.x1 - tapInfo.x2) > 25) ||
                (tapInfo.y2 && Math.abs (tapInfo.y1 - tapInfo.y2) > 25) ) {
                isMove = true;
            } else {
                isMove = false;
            }
        }

        function touchend (e){

            doModifiers (e, this.modifiers)
            if ( !e.changedTouches ) return;
            if ( !isMove && (Date.now () - startTime) < 300 ) {
                /*调用 callback*/
                setTimeout(()=>{
                    this.callback && this.callback.apply (this, this.params);
                }, 0)

            }
            /*重置 参数*/
            isMove = false;
            startTime = 0;
        }


        Vue.directive ('tap', {
                bind: function(dom, binding){

                    var callback = function(){
                    };
                    var value = binding.value;

                    if ( typeof  value == 'function' ) {
                        callback = value;
                    }
                    else if ( typeof value.handler == 'function' ) {
                        callback = value.handler;
                    }
                    var modifiers = binding.modifiers;
                    var params = binding.value.params;
                    if ( isPc () ) {
                        dom.addEventListener ('click', clickHandle.bind ({
                            value: value,
                            callback: callback,
                            modifiers: modifiers,
                            params:params
                        }), false);
                    }
                    else {
                        dom.addEventListener ('touchstart', touchstart.bind ({
                            value: value,
                            callback: callback,
                            modifiers: modifiers,
                            params:params
                        }), false);
                        dom.addEventListener ('touchmove', touchmove.bind ({
                            value: value,
                            callback: callback,
                            modifiers: modifiers,
                            params:params
                        }), false);
                        dom.addEventListener ('touchend', touchend.bind ({
                            value: value,
                            callback: callback,
                            modifiers: modifiers,
                            params:params
                        }), false);
                    }

                },
                inserted: function(){
                },
                update: function(el, binding){
                    el.params = binding.value.params;

                },
                unbind: function(el){

                    el.removeEventListener ('touchstart', touchstart);
                    el.removeEventListener ('touchmove', touchmove);
                    el.removeEventListener ('touchend', touchend);
                    el.removeEventListener ('click', clickHandle);
                }
            }
        );

    }
    return vueTap;
}) ();
