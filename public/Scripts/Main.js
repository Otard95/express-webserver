var settings = {
  logo_scroll_mult: 0.5,
  semi_back_scroll_mult: 0.8,
  fore_ground_scroll_mult: -0.3,
  product_item_land_start: 0.6, // % from top
  product_item_land_interval: 100,
  product_item_land_intMult: 1.4,
  big_win_start: 0.5, // % from top
  big_win_end: 0.15, // % from top
}

var header = new Object();
header.logo = new Object();
header.semi_back = new Object();
header.fore_ground = new Object();

var view_port;
var product = new Object();
    product.grid = new Object();
    product.items;

var big_win;

var nav;

$(document).ready(function(){
  // Get data from DOM
  header.dom = $("header");
  header.height = header.dom.height();
  header.logo.dom = $(".logo");
  header.logo.top = header.logo.dom.offset().top;
  header.semi_back.dom = $(".semi-background");
  header.semi_back.top = header.semi_back.dom.offset().top;
  header.fore_ground.dom = $(".fore-ground");
  header.fore_ground.top = header.fore_ground.dom.offset().top;

  view_port = {height: $(window).height(), width: $(window).width()}

  product.grid = {dom: $(".product-grid"), top: $(".product-grid").offset().top}
  product.items = $(".product-grid .product-item");

  big_win = {dom: $(".large-window"),
             top: $(".large-window").offset().top,
             cover: $(".large-window span")
            }

  nav = {dom: $("nav.home-nav"),
         top: $("nav.home-nav").offset().top,
         open_state: 0, // 0 = closed; 1 = open
         is_fixed: false,
         body_wrap: $(".body-wrap"),
         ul: $("nav.home-nav").find('ul'),
         burger: {dom: $(".menu-button"),
                  height:[]
                 }
        }

  nav.burger.height[0] = nav.dom.height();
  nav.burger.height[1] = nav.dom.find('li').length * nav.dom.height();

  // Run functions waiting for DOM

  // Perspective fix
  // The css "Perspective" proporty har a bug in that is causes the "position"
  // proporty to stop functioning
  // Therefore we remove it when we need the fixed proporty

  if($(window).scrollTop() > nav.top) {
    $(".container").css({"perspective": "none"});
  } else {
    setTimeout(function(){
      $(".container").css({"perspective": "none"});
    }, 1800);
  }

  //###############
  // -=# Events #=-
  //###############

  nav.burger.dom.on('click', function(){
    $(this).toggleClass('menu-open'); // transforms menu button
    // switch to correct open state and set height ov menu
    if(nav.open_state == 0) nav.open_state = 1; else nav.open_state = 0;
    nav.dom.height(nav.burger.height[nav.open_state]);
  });

}) // End on window load

//#######################
// -=# Windown resize #=-
//#######################

$(window).resize(function(){
  // -=# Reset all values of distance and sizes #=-
  view_port.height = $(this).height();
  view_port.width = $(this).width();
  product.grid.top = product.grid.dom.offset().top;
  big_win.top = big_win.dom.offset().top;

  // -=# Resize elements if needed #=-
  // Check header height
  header_resize();

});

//################
// -=# Paralax #=-
//################

$(window).scroll(function(){
  var wScroll = $(this).scrollTop();

  paralax_header(wScroll);
  nav_paralax(wScroll);
  product_grid_land(wScroll);
  window_paralax(wScroll);
});

//##################
// -=# Functions #=-
//##################

// -=# Paralax #=-

function paralax_header(x) {
  if(x <= header.height) {
    header.logo.dom.css({"transform": "translateY(" + (x * settings.logo_scroll_mult) + "px)"});
    header.semi_back.dom.css({"transform": "translateY(" + (x * settings.semi_back_scroll_mult) + "px)"});
    header.fore_ground.dom.css({"transform": "translateY(" + (x * settings.fore_ground_scroll_mult) + "px)"});
  }
}

function product_grid_land(x) {
  if(x > (product.grid.top - (view_port.height * settings.product_item_land_start))) {
    product.items.each(function(i) {
      setTimeout(function(){
        product.items.eq(i).addClass("is-showing");
      }, settings.product_item_land_interval*(Math.pow(i,settings.product_item_land_intMult)));
    });
  }
}

function window_paralax(x) {
  if(x > big_win.top - (view_port.height * settings.big_win_start) &&
     x < big_win.top - (view_port.height * settings.big_win_end)) {
        var dist = view_port.height * settings.big_win_start - view_port.height * settings.big_win_end;
        var relative_x = -1 * (big_win.top - (view_port.height * settings.big_win_start) - x);
        var o = map_range(relative_x, 0, dist, 0, 1);

        big_win.cover.css({"opacity": o});
  }
  else if (x < big_win.top - (view_port.height * settings.big_win_start)) {
    big_win.cover.css({"opacity": 0});
  }
  else {
    big_win.cover.css({"opacity": 1});
  }
}

function nav_paralax(x) {
  if(x > nav.top && !nav.is_fixed) {
    nav.dom.addClass("fixed");
    nav.body_wrap.addClass("extra-padding");
    nav.is_fixed = true;
  } else if(x < nav.top && nav.is_fixed) {
    nav.dom.removeClass("fixed");
    nav.body_wrap.removeClass("extra-padding");
    nav.is_fixed = false;
  }
}

// -=# General #=-

function map_range(x, l1, h1, l2, h2) {
    return l2 + (h2 - l2) * (x - l1) / (h1 - l1);
}
