       var $ = jQuery;
        productCarousel($('.megaMenuCarousel_js'), 1, 1, 1, 1, 1);
        mobileOnlyCarousel();

        /* Work with fullscreen_banners.liquid */
        if ($('.banner-carousel-added').length) {
            $('.banner-carousel-added').remove();
            bannerCarousel($('.banner-carousel'));
        }

        Currency.format = 'money_format';

        var shopCurrency = 'USD';

        /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
        Currency.moneyFormats[shopCurrency].money_with_currency_format = "${{amount}} USD";
        Currency.moneyFormats[shopCurrency].money_format = "${{amount}}";

        var cookieCurrency;
        try {
            cookieCurrency = Currency.cookie.read();
        } catch (err) {} // ignore errors reading cookies

        // Fix for customer account pages.
        jQuery('span.money span.money').each(function() {
            jQuery(this).parents('span.money').removeClass('money');
        });

        // Saving the current price.
        jQuery('span.money').each(function() {
            jQuery(this).attr('data-currency-USD', jQuery(this).html());
        });

        // Select all your currencies buttons.
        var buttons = jQuery('.currency li');

        // If there's no cookie or it's the shop currency.
        if (cookieCurrency == null || cookieCurrency === shopCurrency) {
            buttons.removeClass('active');
            jQuery('.currency li[data-currency=' + shopCurrency + ']').addClass('active');
            Currency.currentCurrency = shopCurrency;
            jQuery(".current-currency").text(shopCurrency);
        } else {
            Currency.convertAll(shopCurrency, cookieCurrency);
            buttons.removeClass('active');
            jQuery('.currency li[data-currency=' + cookieCurrency + ']').addClass('active');
            jQuery(".current-currency").text(cookieCurrency);
        }

        // When customer clicks on a currency button.
        buttons.click(function() {
            buttons.removeClass('active');
            var cur = jQuery(this).attr('data-currency');
            jQuery(".currency li[data-currency='" + cur + "']").addClass('active');

            var newCurrency = jQuery(this).attr('data-currency');
            if (newCurrency == Currency.currentCurrency) {
                Currency.convertAll(shopCurrency, newCurrency);
            } else {
                Currency.convertAll(Currency.currentCurrency, newCurrency);
            }

            jQuery(".current-currency").text(cur);
        });

        var main_selectCallback = window.selectCallback;
        var selectCallback = function(variant, selector) {
            main_selectCallback(variant, selector);
            Currency.convertAll(shopCurrency, jQuery(".currency .active").attr('data-currency'));
        };
        var $ = jQuery.noConflict();
        $(function() {
            // Current Ajax request.
            var currentAjaxRequest = null;
            // Grabbing all search forms on the page, and adding a .search-results list to each.
            var searchForms = $('form[action="/search"]').css('position', 'relative').each(function() {
                // Grabbing text input.
                var input = $(this).find('input[name="q"]');
                // Adding a list for showing search results.
                var offSet = input.position().top + input.innerHeight() + 1;
                $('<ul class="search-results"></ul>').css({
                    'position': 'absolute',
                    'left': '0px',
                    'top': offSet
                }).appendTo($(this)).hide();
                // Listening to keyup and change on the text field within these search forms.
                input.attr('autocomplete', 'off').bind('keyup change', function() {
                    // What's the search term?
                    var term = $(this).val();
                    // What's the search form?
                    var form = $(this).closest('form');
                    // What's the search URL?
                    var searchURL = '/search?type=product&q=' + term;
                    // What's the search results list?
                    var resultsList = form.find('.search-results');
                    // If that's a new term and it contains at least 3 characters.
                    if (term.length > 3 && term != $(this).attr('data-old-term')) {
                        // Saving old query.
                        $(this).attr('data-old-term', term);
                        // Killing any Ajax request that's currently being processed.
                        if (currentAjaxRequest != null) currentAjaxRequest.abort();
                        // Pulling results.
                        currentAjaxRequest = $.getJSON(searchURL + '&view=json', function(data) {
                            // Reset results.
                            resultsList.empty();
                            // If we have no results.
                            if (data.results_count == 0) {
                                // resultsList.html('<li><span class="title">No results.</span></li>');
                                // resultsList.fadeIn(200);
                                resultsList.hide();
                            } else {
                                // If we have results.
                                $.each(data.results, function(index, item) {
                                    var link = $('<a></a>').attr('href', item.url);
                                    link.append('<span class="thumbnail"><img src="' + item.thumbnail + '" /></span>');
                                    link.append('<span class="title">' + item.title + '</span>');
                                    link.wrap('<li></li>');
                                    resultsList.append(link.parent());
                                });
                                // The Ajax request will return at the most 10 results.
                                // If there are more than 10, let's link to the search results page.
                                if (data.results_count > 10) {
                                    resultsList.append('<li><span class="title"><a href="' + searchURL + '">See all results (' + data.results_count + ')</a></span></li>');
                                }
                                resultsList.fadeIn(200);
                            }
                            $('.search-results').css({
                                'width': input.innerWidth() + 2
                            });
                        });
                    }
                });
                //setTimeout(function(){ )}, 5);
            });
            // Clicking outside makes the results disappear.
            $('body').bind('click', function() {
                $('.search-results').hide();
            });
            $(window).resize(function() {
                var input = $('form[action="/search"]').find('input[name="q"]');
                if (input.length == 0) return false;
                var offSet = input.position().top + input.innerHeight() + 1;

                $('.search-results').css({
                    'position': 'absolute',
                    'left': '0px',
                    'top': offSet,
                    'width': input.innerWidth() + 2
                });
            })
        });
var mainImage = '';
        jQuery(function($) {

            quiqview = function(product_handle) {
                Shopify.getProduct(product_handle);
            }
            Shopify.onProduct = function(product) {
                $('.viewfullinfo').attr('href', product.url);

                var _parent = '#quickViewModal';
                $(_parent + ' .product_title').text(product.title);

                $(_parent + ' .rating').empty();
                $(_parent + ' .rating').append("<span class=\"shopify-product-reviews-badge\" data-id=\"" + product.id + "\"></span>");


                //check variants
                var variant = '';

                for (i = 0; i < product.variants.length; i++) {
                    if (product.variants[i].inventory_quantity > 0) {
                        variant = product.variants[i];
                        break;
                    }
                }

                if (variant == '') {
                    for (i = 0; i < product.variants.length; i++) {
                        if (product.variants[i].inventory_policy == "continue") {
                            variant = product.variants[i];
                            break;
                        }
                    }
                    if (variant == '') {
                        variant = product.variants[0];
                    }
                }

                mainImage = product.featured_image;
                var shopifyimgurl = variant.featured_image ? variant.featured_image.src : product.featured_image;
                var imgurl = "<img class=\"full-width\" alt=\"\" src = \"" + shopifyimgurl + "\" >";
                jQuery(_parent + ' .product-main-image__item .img_box_1').empty();
                jQuery(_parent + ' .product-main-image__item .img_box_1').append(imgurl);
                jQuery(_parent + ' .product-main-image__item .img_box_2').empty();
                jQuery(_parent + ' .product-main-image__item .img_box_2').append(imgurl);

                var desc = product.description;
                if (desc.indexOf("[smallDescription]") >= 0) {
                    desc = desc.split("[smallDescription]");
                    desc = desc[1].split("[/smallDescription]");
                    $(_parent + ' .product-desc').show();
                    $(_parent + ' .product-desc').html(desc[0]);
                } else {
                    $(_parent + ' .product-desc-holder').hide();
                }

                //set variants property
                var inv_qua = variant.inventory_quantity;
                //price
                if (variant.price < variant.compare_at_price) {
                    $('.price-part .main').addClass('price-box__old');
                    $('.price-part .price-box__new').show();
                    changePriceValue('.price-part .main', variant.compare_at_price);
                    changePriceValue('.price-part .price-box__new', variant.price);
                } else {
                    $('.price-part .price-box__new').hide();
                    $('.price-part .main').removeClass('price-box__old');
                    changePriceValue('.price-part .main', variant.price);
                }

                // Variants select
                if (product.variants.length > 1) {
                    var variants_margin = product.options.length == 2 ? 'variants_margin' : '';

                    var select = '<select id="product-select-qv" name="id">';
                    var selected = 'selected';
                    for (i = 0; i < product.variants.length; i++) {
                        var _var = product.variants[i];
                        if (_var.available) {
                            select += '<option value="' + _var.id + '"' + selected + '>' + _var.title + ' - ' + Shopify.formatMoney(_var.price, "<span class=money>${{amount}}</span>") + '</option>'
                            selected = '';
                        }
                    }
                    select += '</select>';

                    var variant_select = '<div class="variants_selects ' + variants_margin + '">';
                    variant_select += select;
                    variant_select += '</div><div class="divider divider--sm"></div>';
                    select = variant_select;
                } else {
                    var select = '<input type="hidden" name="id" value="' + product.variants[0].id + '" />';
                }
                $('.variants').empty();
                $('.variants').html(select);

                //parametres
                setParametresText(_parent + ' .product-sku', variant.sku);
                if (jQuery(_parent + ' .product-sku').length) {
                    var $ava = jQuery(_parent + " .product-info__availabilitu");
                    if (variant.sku != "") {
                        if ($ava.hasClass('pull-left')) {
                            $ava.removeClass('pull-left')
                        }
                    } else {
                        if (!$ava.hasClass('pull-left')) {
                            $ava.addClass('pull-left')
                        }
                    }
                }

                //quantity
                var out_of_stock = false;
                if (variant.inventory_management) {
                    if (inv_qua > 0) {
                        $(_parent + ' .product-availability').text(inv_qua + " In Stock");
                    } else {
                        out_of_stock = true;
                        $(_parent + ' .product-availability').text("Out of stock");
                    }
                } else {
                    $(_parent + ' .product-availability').text("Many in stock");
                }

                // button
                if (!out_of_stock || variant.inventory_policy == "continue") {
                    $('.product-available').show();
                    $('.product-disable').hide();
                    $('.addtocartqv').attr('id', product.id);
                } else {
                    $('.product-available').hide();
                    $('.product-disable').show();
                }

                if (product.available && product.variants.length > 1) {
                    new Shopify.OptionSelectors("product-select-qv", {
                        product: product,
                        onVariantSelected: selectCallbackQv,
                        enableHistoryState: true
                    });

                    if ($('#quickViewModal .variants_selects .selector-wrapper').length > 0) {
                        $.each(jQuery('#quickViewModal .variants_selects .selector-wrapper'), function(index) {
                            $(this).find('label').text(product.options[index].name);
                        });
                    }
                } else {
                    jQuery('.currency .active').trigger('click');
                }

                if ($(".spr-badge").length > 0) {
                    $.getScript(window.location.protocol + "//productreviews.shopifycdn.com/assets/v4/spr.js");
                }

                if ($(".selector-wrapper label").length) {
                    $(".selector-wrapper label").each(function(index) {
                        $(this).text(jQuery(this).text() + ":");
                    });
                }

                $(_parent).modal('show');

                if (!('ontouchstart' in window) &&
                    !navigator.msMaxTouchPoints &&
                    !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)) return false;

                $j('body').css("top", -$j('body').scrollTop());
                $j('body').addClass("no-scroll");
                $j('.close').click(function() {
                    var top = parseInt($j('body').css("top").replace("px", "")) * -1;
                    $j('body').removeAttr("style");
                    $j('body').removeClass("no-scroll");
                    $j('body').scrollTop(top);
                });
            }

            function setParametresText(obj, value) {
                if (value != '') {
                    $(obj).parent().show();
                    $(obj).text(value);
                } else {
                    $(obj).parent().hide();
                }
            }

            function changePriceValue(cell, value) {
                $(cell).html(Shopify.formatMoney(value, "<span class=money>${{amount}}</span>"));
            };

        });



        var selectCallbackQv = function(variant, selector) {

            var _parent = '#quickViewModal';
            var _parentprice = _parent + ' .price-part';
            if (!variant) {
                jQuery(_parent + " .price-box").hide();
                jQuery(_parent + " .qwt").hide();
                jQuery(_parent + " .control-console").hide();
                jQuery(_parent + ' .addtocartqv').attr('disabled', 'disabled');
                jQuery(_parent + ' .addtocartqv').text('Unavailable');
                return false;
            }

            jQuery(_parent + " .price-box").show();
            jQuery(_parent + " .qwt").show();
            jQuery(_parent + " .control-console").show();

            if (variant.price < variant.compare_at_price) {
                jQuery(_parentprice + ' .main').addClass('price-box__old');
                jQuery(_parentprice + ' .price-box__new').show();
                changePriceValue(_parentprice + ' .main', variant.compare_at_price);
                changePriceValue(_parentprice + ' .price-box__new', variant.price);
            } else {
                jQuery(_parentprice + ' .price-box__new').hide();
                jQuery(_parentprice + ' .main').removeClass('price-box__old');
                changePriceValue(_parentprice + ' .main', variant.price);
            }

            newVariantTextDataQv(_parent + ' .product-sku', variant.sku);

            if (jQuery(_parent + ' .product-sku').length) {
                var $ava = jQuery(_parent + " .product-info__availabilitu");
                if (variant.sku != "") {
                    if ($ava.hasClass('pull-left')) {
                        $ava.removeClass('pull-left')
                    }
                } else {
                    if (!$ava.hasClass('pull-left')) {
                        $ava.addClass('pull-left')
                    }
                }
            }

            if (variant.available) {
                if (variant.inventory_management == null) {
                    jQuery(_parent + " .product-availability").text("Many in stock");
                } else {
                    jQuery(_parent + " .product-availability").text(variant.inventory_quantity + " in stock");
                }
            } else {
                jQuery(_parent + " .product-availability").text("Out of stock");
            }

            var shopifyimgurl = variant.featured_image ? variant.featured_image.src : mainImage;
            var imgurl = "<img class=\"full-width\" alt=\"\" src = \"" + shopifyimgurl + "\" >";
            if (jQuery(_parent + ' .product-main-image__item .img_box_1').children().length > 0) {
                var detach = jQuery(_parent + ' .product-main-image__item .img_box_1 img').detach();
                jQuery(_parent + ' .product-main-image__item .img_box_2').empty();
                jQuery(_parent + ' .product-main-image__item .img_box_2').append(detach);
            }
            jQuery(_parent + ' .product-main-image__item .img_box_1').empty();
            jQuery(_parent + ' .product-main-image__item .img_box_1').append(imgurl);

            if (variant && variant.available) {
                jQuery(_parent + ' .addtocartqv').removeAttr('disabled');
                jQuery(_parent + ' .addtocartqv').html('<span class="icon icon-shopping_basket"></span> Add to Cart');
                jQuery(_parent + " .control-console").show();
            } else {
                jQuery(_parent + ' .addtocartqv').attr('disabled', 'disabled');
                jQuery(_parent + ' .addtocartqv').text('Unavailable');
                jQuery(_parent + " .control-console").hide();
            }

            jQuery('.currency .active').trigger('click');
        };

        function changePriceValue(cell, value) {
            jQuery(cell).html(Shopify.formatMoney(value, "<span class=money>${{amount}}</span>"));
        };

        function newVariantTextDataQv(obj, value) {
            if (value != '') {
                jQuery(obj).parent().show();
                jQuery(obj).text(value);
            } else {
                jQuery(obj).parent().hide();
            }
        };
var Shopify = Shopify || {};
    Shopify.shop = "fashop-default.myshopify.com";
    Shopify.currency = {
      "active": "USD",
      "rate": "1.0"
    };
    Shopify.theme = {
      "name": "Copy of Fashop Demo",
      "id": 163731404,
      "theme_store_id": null,
      "role": "main"
    };
    Shopify.theme.handle = "null";
    Shopify.theme.style = {
      "id": null,
      "handle": null
    };
    (function() {
      function asyncLoad() {
        var urls = [
          "\/\/productreviews.shopifycdn.com\/assets\/v4\/spr.js?shop=fashop-default.myshopify.com"
        ];
        for (var i = 0; i < urls.length; i++) {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = urls[i];
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
        }
      };
      if (window.attachEvent) {
        window.attachEvent('onload', asyncLoad);
      } else {
        window.addEventListener('load', asyncLoad, false);
      }
    })();
    var __st = {
      "a": 16375229,
      "offset": -14400,
      "reqid": "fd6bc944-a0b0-45b9-b257-29d7f1d47f1e",
      "pageurl": "fashop-default.myshopify.com\/?fbclid=IwAR3lM3-ZI0iHoNwGY7AhVCxBn7mM5Mc6b7iwa1gphxuw-3iQbVzXdn5zouE",
      "u": "f552d6395a42",
      "p": "home"
    };
    window.ShopifyPaypalV4VisibilityTracking = true;
    window.Shopify = window.Shopify || {};
    window.Shopify.Checkout = window.Shopify.Checkout || {};
    window.Shopify.Checkout.apiHost = "fashop-default.myshopify.com";
    window.ShopifyAnalytics = window.ShopifyAnalytics || {};
    window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
    window.ShopifyAnalytics.meta.currency = 'USD';
    var meta = {
      "page": {
        "pageType": "home"
      }
    };
    for (var attr in meta) {
      window.ShopifyAnalytics.meta[attr] = meta[attr];
    }
    window.ShopifyAnalytics.merchantGoogleAnalytics = function() {};
    (function() {
      var customDocumentWrite = function(content) {
        var jquery = null;
        if (window.jQuery) {
          jquery = window.jQuery;
        } else if (window.Checkout && window.Checkout.$) {
          jquery = window.Checkout.$;
        }
        if (jquery) {
          jquery('body').append(content);
        }
      };
      var isDuplicatedThankYouPageView = function() {
        return document.cookie.indexOf('loggedConversion=' + window.location
          .pathname) !== -1;
      }
      var setCookieIfThankYouPage = function() {
        if (window.location.pathname.indexOf('/checkouts') !== -1 && window
          .location.pathname.indexOf('/thank_you') !== -1) {
          var twoMonthsFromNow = new Date(Date.now());
          twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
          document.cookie = 'loggedConversion=' + window.location.pathname +
            '; expires=' + twoMonthsFromNow;
        }
      }
      var trekkie = window.ShopifyAnalytics.lib = window.trekkie = window.trekkie || [];
      if (trekkie.integrations) {
        return;
      }
      trekkie.methods = ['identify', 'page', 'ready', 'track', 'trackForm',
        'trackLink'
      ];
      trekkie.factory = function(method) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          trekkie.push(args);
          return trekkie;
        };
      };
      for (var i = 0; i < trekkie.methods.length; i++) {
        var key = trekkie.methods[i];
        trekkie[key] = trekkie.factory(key);
      }
      trekkie.load = function(config) {
        trekkie.config = config;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onerror = function(e) {
          (new Image()).src =
            '//v.shopify.com/internal_errors/track?error=trekkie_load';
        };
        script.async = true;
        script.src =
          'https://cdn.shopify.com/s/javascripts/tricorder/trekkie.storefront.min.js?v=2017.09.05.1';
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
      };
      trekkie.load({
        "Trekkie": {
          "appName": "storefront",
          "development": false,
          "defaultAttributes": {
            "shopId": 16375229,
            "isMerchantRequest": null,
            "themeId": 163731404,
            "themeCityHash": 5374935577771714611,
            "contentLanguage": "en"
          }
        },
        "Performance": {
          "navigationTimingApiMeasurementsEnabled": true,
          "navigationTimingApiMeasurementsSampleRate": 0.01
        },
        "StorefrontPerformance": {
          "navigationTimingApiMeasurementsEnabled": true,
          "navigationTimingApiMeasurementsSampleRate": 0.01
        },
        "Session Attribution": {}
      });
      var loaded = false;
      trekkie.ready(function() {
        if (loaded) return;
        loaded = true;
        window.ShopifyAnalytics.lib = window.trekkie;
        var originalDocumentWrite = document.write;
        document.write = customDocumentWrite;
        try {
          window.ShopifyAnalytics.merchantGoogleAnalytics.call(this);
        } catch (error) {};
        document.write = originalDocumentWrite;
        if (!isDuplicatedThankYouPageView()) {
          setCookieIfThankYouPage();
          window.ShopifyAnalytics.lib.page(null, {
            "pageType": "home"
          });
        }
      });
      var eventsListenerScript = document.createElement('script');
      eventsListenerScript.async = true;
      eventsListenerScript.src =
        "//cdn.shopify.com/s/assets/shop_events_listener-acf771159f9849ef6e5265782c99efe8b99406214c96a4373224ecafe285d7bb.js";
      document.getElementsByTagName('head')[0].appendChild(
        eventsListenerScript);
    })();
    (function(e) {
      var msg = 'Use Demo with';
      var msg2 = 'Disable';
      var str =
        '<link href="//cdn.shopify.com/s/files/1/1637/5229/t/4/assets/style-rtl.css?0" rel="stylesheet" type="text/css" media="all" />';
      str = str.replace('<link', '<link rtlstyle');
      var obj = {
        init: function() {
          if (e('.rtlbutton').length == 0) return false;
          e('.rtlbutton').click(function() {
            obj.handle();
          });
          if (e.cookie('rtlmode') == 'creatertl') {
            $('.rtlbutton').addClass('inwork').find('span').first().text(
              msg2).parent().find('span').last().addClass('rtlused');
            $('head').append(str);
          }
        },
        handle: function() {
          try {
            if (e.cookie('rtlmode') != 'creatertl') {
              e.cookie('rtlmode', 'creatertl', {
                expires: 1,
                path: '/'
              });
              $('.rtlbutton').addClass('inwork').find('span').first().text(
                msg2).parent().find('span').last().addClass('rtlused');
              $('head').append(str);
            } else {
              e.cookie("rtlmode", null, {
                path: '/'
              });
              $('.rtlbutton').removeClass('inwork').find('span').first().text(
                msg).parent().find('span').last().removeClass('rtlused');
              $('[rtlstyle=""]').remove();
            }
          } catch (err) {} // ignore errors reading cookies
        }
      }
      e(document).ready(function() {
        obj.init();
      });
    })(jQuery)

    function showRecoverPasswordForm() {
      document.getElementById('recover-password').style.display =
        'block';
      document.getElementById('login').style.display = 'none';
    }

    function hideRecoverPasswordForm() {
      document.getElementById('recover-password').style.display =
        'none';
      document.getElementById('login').style.display = 'block';
    }

    if (window.location.hash == '#recover') {
      showRecoverPasswordForm()
    }
// Pick your format here:
    // money_format or money_with_currency_format
    Currency.format = 'money_format';
    var shopCurrency = 'USD';
    /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
    Currency.moneyFormats[shopCurrency].money_with_currency_format =
      "${{amount}} USD";
    Currency.moneyFormats[shopCurrency].money_format = "${{amount}}";
    var cookieCurrency;
    try {
      cookieCurrency = Currency.cookie.read();
    } catch (err) {} // ignore errors reading cookies
    // Fix for customer account pages.
    jQuery('span.money span.money').each(function() {
      jQuery(this).parents('span.money').removeClass('money');
    });
    // Saving the current price.
    jQuery('span.money').each(function() {
      jQuery(this).attr('data-currency-USD', jQuery(this).html());
    });
    // Select all your currencies buttons.
    var buttons = jQuery('.currency li');
    // If there's no cookie or it's the shop currency.
    if (cookieCurrency == null || cookieCurrency === shopCurrency) {
      buttons.removeClass('active');
      jQuery('.currency li[data-currency=' + shopCurrency + ']').addClass(
        'active');
      Currency.currentCurrency = shopCurrency;
      jQuery(".current-currency").text(shopCurrency);
    } else {
      Currency.convertAll(shopCurrency, cookieCurrency);
      buttons.removeClass('active');
      jQuery('.currency li[data-currency=' + cookieCurrency + ']').addClass(
        'active');
      jQuery(".current-currency").text(cookieCurrency);
    }
    // When customer clicks on a currency button.
    buttons.click(function() {
      buttons.removeClass('active');
      var cur = jQuery(this).attr('data-currency');
      jQuery(".currency li[data-currency='" + cur + "']").addClass('active');
      var newCurrency = jQuery(this).attr('data-currency');
      if (newCurrency == Currency.currentCurrency) {
        Currency.convertAll(shopCurrency, newCurrency);
      } else {
        Currency.convertAll(Currency.currentCurrency, newCurrency);
      }
      jQuery(".current-currency").text(cur);
    });
    // For product options.
    var main_selectCallback = window.selectCallback;
    var selectCallback = function(variant, selector) {
      main_selectCallback(variant, selector);
      Currency.convertAll(shopCurrency, jQuery(".currency .active").attr(
        'data-currency'));
    };
var $ = jQuery.noConflict();
    $(function() {
      // Current Ajax request.
      var currentAjaxRequest = null;
      // Grabbing all search forms on the page, and adding a .search-results list to each.
      var searchForms = $('form[action="/search"]').css('position',
        'relative').each(function() {
        // Grabbing text input.
        var input = $(this).find('input[name="q"]');
        // Adding a list for showing search results.
        var offSet = input.position().top + input.innerHeight() + 1;
        $('<ul class="search-results"></ul>').css({
          'position': 'absolute',
          'left': '0px',
          'top': offSet
        }).appendTo($(this)).hide();
        // Listening to keyup and change on the text field within these search forms.
        input.attr('autocomplete', 'off').bind('keyup change', function() {
          // What's the search term?
          var term = $(this).val();
          // What's the search form?
          var form = $(this).closest('form');
          // What's the search URL?
          var searchURL = '/search?type=product&q=' + term;
          // What's the search results list?
          var resultsList = form.find('.search-results');
          // If that's a new term and it contains at least 3 characters.
          if (term.length > 3 && term != $(this).attr(
              'data-old-term')) {
            // Saving old query.
            $(this).attr('data-old-term', term);
            // Killing any Ajax request that's currently being processed.
            if (currentAjaxRequest != null) currentAjaxRequest.abort();
            // Pulling results.
            currentAjaxRequest = $.getJSON(searchURL + '&view=json',
              function(data) {
                // Reset results.
                resultsList.empty();
                // If we have no results.
                if (data.results_count == 0) {
                  // resultsList.html('<li><span class="title">No results.</span></li>');
                  // resultsList.fadeIn(200);
                  resultsList.hide();
                } else {
                  // If we have results.
                  $.each(data.results, function(index, item) {
                    var link = $('<a></a>').attr('href', item
                      .url);
                    link.append(
                      '<span class="thumbnail"><img src="' +
                      item.thumbnail + '" /></span>');
                    link.append('<span class="title">' + item
                      .title + '</span>');
                    link.wrap('<li></li>');
                    resultsList.append(link.parent());
                  });
                  // The Ajax request will return at the most 10 results.
                  // If there are more than 10, let's link to the search results page.
                  if (data.results_count > 10) {
                    resultsList.append(
                      '<li><span class="title"><a href="' +
                      searchURL + '">See all results (' + data.results_count +
                      ')</a></span></li>');
                  }
                  resultsList.fadeIn(200);
                }
                $('.search-results').css({
                  'width': input.innerWidth() + 2
                });
              });
          }
        });
        //setTimeout(function(){ )}, 5);
      });
      // Clicking outside makes the results disappear.
      $('body').bind('click', function() {
        $('.search-results').hide();
      });
      $(window).resize(function() {
        var input = $('form[action="/search"]').find('input[name="q"]');
        if (input.length == 0) return false;
        var offSet = input.position().top + input.innerHeight() + 1;
        $('.search-results').css({
          'position': 'absolute',
          'left': '0px',
          'top': offSet,
          'width': input.innerWidth() + 2
        });
      })
    });
var $ = jQuery;
    productCarousel($('.megaMenuCarousel_js'), 1, 1, 1, 1, 1);
    mobileOnlyCarousel();
    /* Work with fullscreen_banners.liquid */
    if ($('.banner-carousel-added').length) {
      $('.banner-carousel-added').remove();
      bannerCarousel($('.banner-carousel'));
    }
