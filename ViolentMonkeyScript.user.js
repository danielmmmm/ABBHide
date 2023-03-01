// ==UserScript==
// @name           Hide releases (categories/users) on ABB
// @description    Hide releases in specific categories or by specific users on ABB
// @version        0.40
// @author         mseitz
// @namespace      https://greasyfork.org/en/scripts/443140-hide-releases-on-abb
// @license        MIT
// @require        https://code.jquery.com/jquery-3.6.1.slim.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @match          *://audiobookbay.*/*
// @icon           https://audiobookbay.li/favicon.ico
// @run-at         document-idle
// ==/UserScript==


//Explanation of user values
//
//--blocklistCategory/blocklistUser/blocklistUserComment--
// Contains ABB categories/usernames to block. The categories/usernames are case sensitive, must be comma seperated, and must not have leading or trailing withe-space.
// The whole string must be in double quotation marks.
// Example: "user1,User2,USER3" or "Some Category, Category2,Some other category"
//
//--placeholderUser/placeholderCategory/placeholderUserComment--
// Determines if postings are removed completely, or if a placeholder is shown instead.
// Possible values for show are:
//  0  removes postings completely
//  1  shows a placeholder "(Posting removed by "Hide releases on ABB")"
//  2  shows a placeholder "(Posting by user XYZ removed)" or (Posting of category "Category" removed; only first matched category shown)




//Check for GM_set/get API
var isGMapi;
try {
  if (typeof(GM_setValue)!="undefined") {
    GM_setValue("test",1);
    if (GM_getValue("test")==1) {
      isGMapi=1;
    } else {
      isGMapi=0;
    }
  } else {
    isGMapi=0;
  }
}
catch (e) {
  unsafeWindow.console.error(e);
  isGMapi=0;
}


//Check if user settings were set, and either set default values or read settings
var blockedUserArr;
var showRemovalUser;
var blockedCategoryArr;
var showRemovalCategory;
var blockedUserCommentArr;
var showRemovalUserComment;


if (GM_getValue("blocklistUser") == null ) {
  GM_setValue("blocklistUser","Replace this text with usernames you want to block, separated by a comma");
} else {
  try{
    blockedUserArr = GM_getValue("blocklistUser").split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistUser\" must be of format \"user1,user2,user3\".");
  }
}

if (GM_getValue("placeholderUser") == null ) {
  GM_setValue("placeholderUser",2);
} else {
  try{
    showRemovalUser = GM_getValue("placeholderUser");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderUser\" must be 0, 1, or 2.");
  }
}

if (GM_getValue("blocklistCategory") == null ) {
  GM_setValue("blocklistCategory","Replace this text with a category you want to block, separated by a comma");
} else {
  try{
    blockedCategoryArr = GM_getValue("blocklistCategory").split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistCategory\" must be of format \"some category, category 2,some other category\".");
  }
}

if (GM_getValue("placeholderCategory") == null ) {
  GM_setValue("placeholderCategory",2);
} else {
  try{
    showRemovalCategory = GM_getValue("placeholderCategory");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderCategory\" must be 0, 1, or 2.");
  }
}

if (GM_getValue("blocklistUserComment") == null ) {
  GM_setValue("blocklistUserComment","Replace this text with usernames whose comments you want to block, separated by a comma");
} else {
  try{
    blockedUserCommentArr = GM_getValue("blocklistUserComment").split(",");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"blocklistUserComment\" must be of format \"user1,user2,user3\".");
  }
}


if (GM_getValue("placeholderUserComment") == null ) {
  GM_setValue("placeholderUserComment",2);
} else {
  try{
    showRemovalUserComment = GM_getValue("placeholderUserComment");
  }
  catch(e){
    unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderUserComment\" must be 0, 1, or 2.");
  }
}


if (window.location.href.includes("audio-books")) {

  //Block user comment - read blocklist into array and remove or modify respective li
  for (var i = 0; i < blockedUserCommentArr.length; i++) {
    if (showRemovalUserComment == 0) {
      $("span.commentAuthor:contains(" + blockedUserCommentArr[i] + ")").closest("li").remove();
    } else if (showRemovalUserComment == 1) {
      $("span.commentAuthor:contains(" + blockedUserCommentArr[i] + ")").closest("li").replaceWith("<li class='alt'><div class='reviewBody'><div itemprop='reviewBody'><p>(Comment removed by 'Hide releases on ABB')</p></div></div></li>");
    } else if (showRemovalUserComment == 2) {
      $("span.commentAuthor:contains(" + blockedUserCommentArr[i] + ")").closest("li").replaceWith("<li class='alt'><div class='reviewBody'><div itemprop='reviewBody'><p>(Comment by user " + blockedUserCommentArr[i] + " removed)</p></div></div></li>");
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalUserComment\" must be null, 0, 1, or 3.");
    }
  }

} else {

  //Block category - read blocklist into array and remove or modify respective div
  for (var j = 0; j < blockedCategoryArr.length; j++) {
    if (showRemovalCategory == 0) {
      $('div.postInfo:contains(' + blockedCategoryArr[j] + ')').parent("div").remove();
    } else if (showRemovalCategory == 1) {
      $('div.postInfo:contains(' + blockedCategoryArr[j] + ')').parent("div").replaceWith("<div class='postInfo'>(Posting removed by 'Hide releases on ABB')<br><br></div>");
    } else if (showRemovalCategory == 2) {
      $("div.postInfo:contains(" + blockedCategoryArr[j] + ")").parent().find("h2").find("a").clone().appendTo("div#content").before("<br>").append(" <span style='color:#0000FF'>(Release of category </span><span style='color:#FF0000'>" + blockedCategoryArr[j] + "</span><span style='color:#0000FF'> removed)</span><br>").wrap("<div class='blocked' style='font-size: 10px'></div>");
      $("div.postInfo:contains(" + blockedCategoryArr[j] + ")").parent('div').remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"placeholderCategory\" must be null, 0, 1, or 3.");
    }
  }

  //Block user - read blocklist into array and remove or modify respective div
  for (var k = 0; k < blockedUserArr.length; k++) {
    if (showRemovalUser == 0) {
      $("div.postContent:contains(" + blockedUserArr[k] + ")").parent("div").remove();
    } else if (showRemovalUser == 1) {
      $("div.postContent:contains(" + blockedUserArr[k] + ")").parent("div").replaceWith("<div class='postInfo'>(Posting removed by 'Hide releases on ABB')<br><br></div>");
    } else if (showRemovalUser == 2) {
      $("div.postContent:contains(" + blockedUserArr[k] + ")").parent().find("h2").find("a").clone().appendTo("div#content").before("<br>").append(" <span style='color:#0000FF'>(Release by user </span><span style='color:#FF0000'>" + blockedUserArr[k] + "</span><span style='color:#0000FF'> removed)</span><br>").wrap("<div class='blocked' style='font-size: 10px'></div>");
      $("div.postContent:contains(" + blockedUserArr[k] + ")").parent("div").remove();
    } else {
      unsafeWindow.console.error("UserScript \"Hide releases on ABB\" value \"showRemovalUser\" must be null, 0, 1, or 3.");
    }
  }

}


//The end
