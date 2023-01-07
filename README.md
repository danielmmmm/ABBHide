This userscript removes releases by specific users or of a specific category from the ABB main page.

The script has to run once, by visiting ABB, to initialise the block list and settings.

Then, categories/usernames can be entered by editing the script values blocklistCategory/blocklistUser in Violentmonkey.
Categories/usernames are case sensitive, have to be comma separated, without leading or trailing white-space, and the whole list has to be in double quotation marks (e.g. "user1,User2,USER3" or "Some Category, Category2,Some other category").

Postings can be removed completely, or a placeholder can be shown, by setting the value placeholderUser/placeholderCategory to 0, 1, or 2:
0 removes postings completely
1 shows a placeholder "(Posting removed by "Hide releases on ABB")"
2 shows a placeholder "(Posting by user XYZ removed)" or (Posting of category "Category" removed; only first matched category shown)
