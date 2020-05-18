$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  // $("#navbarToggle").click(function (event) {
  //   $(event.target).focus();
  // });
});

(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
var categoriesTitleHtml = "snippets/category-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";

var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippets/menu-item-title.html";
var menuItemHtml = "snippets/menu-item.html";



// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};


var insertProperty = function (string, propName, propValue){
  var proToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(proToReplace, "g"), propValue);
  return string;
};


// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxutlis.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});


dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxutlis.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
};

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxutlis.sendGetRequest(menuItemsUrl + categoryShort, buildAndShowCategoriesHTML);
};




function buildAndShowCategoriesHTML (categories) {

  $ajaxutlis.sendGetRequest(categoriesTitleHtml, function(categoriesTitleHtml){

    $ajaxutlis.sendGetRequest(categoryHtml, function(categoryHtml){
      var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
      insertHtml("#main-content", categoriesViewHtml);
    },
    false);
  },
  false);
};

function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
  var finalHtml = categoriesTitleHtml;  
 finalHtml += "<section class = row>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;   
  }

  finalHtml += "</section>";
  return finalHtml;
}


function buildAndShowMenuItemsHTML (categoryMenuItems) {

  $ajaxutlis.sendGetRequest(menuItemsTitleHtml, function(menuItemsTitleHtml){

    $ajaxutlis.sendGetRequest(menuItemHtml, function(menuItemHtml){
      var menuItemsViewHtml = buildmenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml);
      insertHtml("#main-content", menuItemsViewHtml);
    },
    false);
  },
  false);
};

function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) {

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.category.name);
  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertItemPrice(html,
                      "price_small",
                      menuItems[i].price_small);
    html =
      insertItemPortionName(html,
                            "small_portion_name",
                            menuItems[i].small_portion_name);
    html =
      insertItemPrice(html,
                      "price_large",
                      menuItems[i].price_large);
    html =
      insertItemPortionName(html,
                            "large_portion_name",
                            menuItems[i].large_portion_name);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
    html =
      insertProperty(html,
                     "description",
                     menuItems[i].description);

    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}


// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}




global.$dc = dc;

})(window);