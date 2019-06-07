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
        $(_parent + ' .rating').append(
          "<span class=\"shopify-product-reviews-badge\" data-id=\"" +
          product.id + "\"></span>");
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
        var shopifyimgurl = variant.featured_image ? variant.featured_image
          .src : product.featured_image;
        var imgurl = "<img class=\"full-width\" alt=\"\" src = \"" +
          shopifyimgurl + "\" >";
        jQuery(_parent + ' .product-main-image__item .img_box_1').empty();
        jQuery(_parent + ' .product-main-image__item .img_box_1').append(
          imgurl);
        jQuery(_parent + ' .product-main-image__item .img_box_2').empty();
        jQuery(_parent + ' .product-main-image__item .img_box_2').append(
          imgurl);
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
          var variants_margin = product.options.length == 2 ?
            'variants_margin' : '';
          var select = '<select id="product-select-qv" name="id">';
          var selected = 'selected';
          for (i = 0; i < product.variants.length; i++) {
            var _var = product.variants[i];
            if (_var.available) {
              select += '<option value="' + _var.id + '"' + selected +
                '>' + _var.title + ' - ' + Shopify.formatMoney(_var.price,
                  "<span class=money>${{amount}}</span>") + '</option>'
              selected = '';
            }
          }
          select += '</select>';
          var variant_select = '<div class="variants_selects ' +
            variants_margin + '">';
          variant_select += select;
          variant_select +=
            '</div><div class="divider divider--sm"></div>';
          select = variant_select;
        } else {
          var select = '<input type="hidden" name="id" value="' + product
            .variants[0].id + '" />';
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
            $(_parent + ' .product-availability').text(inv_qua +
              " In Stock");
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
          if ($('#quickViewModal .variants_selects .selector-wrapper').length >
            0) {
            $.each(jQuery(
                '#quickViewModal .variants_selects .selector-wrapper'),
              function(index) {
                $(this).find('label').text(product.options[index].name);
              });
          }
        } else {
          jQuery('.currency .active').trigger('click');
        }
        if ($(".spr-badge").length > 0) {
          $.getScript(window.location.protocol +
            "//productreviews.shopifycdn.com/assets/v4/spr.js");
        }
        if ($(".selector-wrapper label").length) {
          $(".selector-wrapper label").each(function(index) {
            $(this).text(jQuery(this).text() + ":");
          });
        }
        $(_parent).modal('show');
        if (!('ontouchstart' in window) && !navigator.msMaxTouchPoints &&
          !navigator.userAgent.toLowerCase().match(/windows phone os 7/i)
        ) return false;
        $j('body').css("top", -$j('body').scrollTop());
        $j('body').addClass("no-scroll");
        $j('.close').click(function() {
          var top = parseInt($j('body').css("top").replace("px", "")) *
            -1;
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
        $(cell).html(Shopify.formatMoney(value,
          "<span class=money>${{amount}}</span>"));
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
          jQuery(_parent + " .product-availability").text(variant.inventory_quantity +
            " in stock");
        }
      } else {
        jQuery(_parent + " .product-availability").text("Out of stock");
      }
      var shopifyimgurl = variant.featured_image ? variant.featured_image.src :
        mainImage;
      var imgurl = "<img class=\"full-width\" alt=\"\" src = \"" +
        shopifyimgurl + "\" >";
      if (jQuery(_parent + ' .product-main-image__item .img_box_1').children()
        .length > 0) {
        var detach = jQuery(_parent +
          ' .product-main-image__item .img_box_1 img').detach();
        jQuery(_parent + ' .product-main-image__item .img_box_2').empty();
        jQuery(_parent + ' .product-main-image__item .img_box_2').append(
          detach);
      }
      jQuery(_parent + ' .product-main-image__item .img_box_1').empty();
      jQuery(_parent + ' .product-main-image__item .img_box_1').append(imgurl);
      if (variant && variant.available) {
        jQuery(_parent + ' .addtocartqv').removeAttr('disabled');
        jQuery(_parent + ' .addtocartqv').html(
          '<span class="icon icon-shopping_basket"></span> Add to Cart');
        jQuery(_parent + " .control-console").show();
      } else {
        jQuery(_parent + ' .addtocartqv').attr('disabled', 'disabled');
        jQuery(_parent + ' .addtocartqv').text('Unavailable');
        jQuery(_parent + " .control-console").hide();
      }
      jQuery('.currency .active').trigger('click');
    };

    function changePriceValue(cell, value) {
      jQuery(cell).html(Shopify.formatMoney(value,
        "<span class=money>${{amount}}</span>"));
    };

    function newVariantTextDataQv(obj, value) {
      if (value != '') {
        jQuery(obj).parent().show();
        jQuery(obj).text(value);
      } else {
        jQuery(obj).parent().hide();
      }
    };
