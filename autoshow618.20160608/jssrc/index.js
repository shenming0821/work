require([
    "http://cdn01.51autoimg.com/51auto/js/lib/jquery.min.js"
], function () {
    var page = function () {
        // 初始化
        this.init();
        // 点击事件
        this.eleClick();
        // 提交
        this.present();
        // 统计代码
        this.statisticsFun();
    };

    // 初始化
    page.prototype.init = function () {
        // 显示第一个列表
        $('.main .list').eq(0).show();
    };

    // 点击事件
    page.prototype.eleClick = function () {

        // 报名专区意向车价
        var signUpClick = (function () {
            var slideFlag;
            $('.signUp-price').on('click', function () {
                if (!slideFlag) {
                    $('.signUp .select').stop(true, true).animate({
                        height: '160px',
                        top: -159
                    }, 300);
                    slideFlag = true;
                } else {
                    $('.signUp .select').stop(true, true).animate({
                        height: 0,
                        top: 0
                    }, 300);
                    slideFlag = false;
                }
            });
            $('body').on('click', function (e) {
                var ele = e.target;
                if (!$(ele).hasClass("signUp-price")) {
                    if (slideFlag) {
                        slideFlag = false;
                        $('.signUp .select').stop(true, true).animate({
                            height: 0,
                            top: 0
                        }, 300);
                    }
                }
            });
            $('.signUp .select li').on('click', function () {
                $('#price').html($(this).html());
                $('#price').addClass('active');
            });
        })();

        // 展示窗口title价格区间
        var showBoxTitleClick = (function () {
            var $classIndex = 1;
            var $lastClassStr,
                $thisClassStr;
            $('.btns').on('click', function () {
                // 价格区间切换
                $lastClassStr = "tab" + $classIndex;
                $('#show-box .title').removeClass($lastClassStr);
                $classIndex = $(this).index() + 1;
                $thisClassStr = "tab" + $classIndex;
                $('#show-box .title').addClass($thisClassStr);
                // 价格区间对应内容切换
                var $btnIndex = $(this).index();
                $('.main .list').eq($btnIndex).show().siblings('.list').hide();
                $(this).addClass('active').siblings('.btns').removeClass('active');
            });
        })();

        // 查看更多按钮
        var seeMoreClick = (function () {
            $('.seeMore-btn').on('click', function () {
                $('#modal-box').show();
                // 模态窗title获取
                var $index = $('#show-box').find('.active').index() + 1;
                var $lastClassStr = 'd' + $index;
                $('.modal .title').find('span').removeClass().addClass($lastClassStr);
                // 初始化点击默认排序
                $('.choose-btns span').eq(0).addClass('active').siblings('span').removeClass('active');
                // 自定义滚动条
                require([
                    "http://cdn01.51autoimg.com/apps/zhuanti.51auto.com/autoshow618.20160608/js/easyscroll.min.js",
                    "http://cdn01.51autoimg.com/apps/zhuanti.51auto.com/autoshow618.20160608/js/mousewheel.min.js"
                ], function () {
                    $('.modal .list').scroll_absolute({
                        arrows: false
                    })
                })
            });
        })();

        // 摸态框排序按钮
        var chooseBtnsClick = (function () {
            $('.choose-btns span').on('click', function () {
                $(this).addClass('active').siblings('span').removeClass('active');
            });
        })();

        //关闭模态窗
        var closeModalClick = (function () {
            $('.modal-back').on('click', function () {
                $('#modal-box').hide();
            });
        })();

    };

    //将FORM提交格式化为JSON对象
    page.prototype.getFormJson = function (formName) {
        var json = {},
            key = "";
        $.each($("#" + formName).serializeArray(), function (i, m) {
            key = m.name;
            json[key] = m.value;
        });
        return json;
    };
    // 提交
    page.prototype.present = function () {

        //表单提交检查
        var checkForm = function () {
            //是否提交
            var isSubmit = true;
            //验证正则表达式
            var regularExp = function (name, expression) {
                var value = $("#" + name).val();
                return expression.test(value);
            };
            //表单验证方法
            var formValidationFun = function (option) {
                if (!option.length) {
                    isSubmit = false;
                    return false;
                }
                $.each(option, function (i, m) {
                    if (m.name == 'price') {
                        var value = $('#' + m.name).html();
                        if (value == '意向车价') {
                            isSubmit = false;
                            alert(m.msg);
                            return false;
                        }
                    } else {
                        if (!m.fun(m.name, m.value)) {
                            isSubmit = false;
                            alert(m.msg);
                            return false;
                        }
                    }
                });
            };
            //验证对象
            var addArray = [
                {
                    //姓名
                    name: "name",
                    fun: regularExp,
                    value: /^[a-zA-Z\u4e00-\u9fa5]{2,25}$/,
                    msg: '请输入正确的英文或中文姓名！'
                }, {
                    //手机号码
                    name: "tel",
                    fun: regularExp,
                    value: /(^1[3|4|5|7|8][0-9]\d{8}$)/,
                    msg: '请输入正确的11位手机号码！'
                }, {
                    //车型
                    name: "price",
                    msg: '请选择您的意向车价！'
                }
            ];

            //提交验证
            formValidationFun(addArray);
            return isSubmit;
        };

        // 确认按钮
        $('body').on('click', '#confirm-btn', function () {
            var note = '意向车价：' + $('#price').html();
            formSubmit("signUpForm", note, "note");
        });

        var formSubmit = function (formId, infoText, nodeId) {
            if (!checkForm()) return false;
            var noteVal = infoText;
            $("#" + nodeId).val(noteVal);
            var json = this.getFormJson(formId);

            // $.ajax({
            //     url: 'http://admin2.51auto.com:8080/cms/signupapi/',
            //     type: 'GET',
            //     dataType: 'jsonp',
            //     crossDomain: true,
            //     jsonp: "callbackparam",
            //     jsonpCallback: "success",
            //     timeout: 30000,
            //     headers: {
            //         "Accept": "application/json; charset=utf-8",
            //         "Content-Type": "application/json; charset=utf-8"
            //     },
            //     data: json,
            //     error: function (e) {
            //         // console.log("error");
            //     },
            //     success: function (result) {
            //         document.getElementById(formId).reset();
            //         alert("报名成功!");
            //     }
            // });
        }.bind(this);
    };

    //统计代码
    page.prototype.statisticsFun = function () {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         获取页面参数，进行参数处理
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var location = window.location.toString();
        var locationSection = location.split("?");
        if (locationSection.length > 1) {
            var params = locationSection[1].split("&");
            var output = "";
            for (var p = 0; p < params.length; p++) {
                var keyValue = params[p].split("=");
                if (output != "") output += " ";
                if (keyValue[0] == "utm_source" || keyValue[0] == "utm_medium" || keyValue[0] == "utm_term" || keyValue[0] == "utm_content" || keyValue[0] == "utm_campaign") output += decodeURIComponent(keyValue[1]);
            }
            $("#resource").val(output);
        }

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         统计监测代码
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?954c42feaba402a134e4d89ae31cc766";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();

        // GA
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-254381-1', 'auto');
        ga('send', 'pageview');
    };

    $(function () {
        new page;
    });
});

// 手机号码输入限制
var telCheckFun = function (event) {
    var keyCode = event.keyCode;
    if (!((keyCode <= 57 && keyCode >= 48) || (keyCode <= 105 && keyCode >= 96) || (keyCode == 8))) {
        event.returnValue = false;
    }
};